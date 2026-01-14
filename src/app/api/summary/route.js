import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  calculateTotalExpected,
  calculateTotalPaid,
  calculateOutstanding,
} from "@/utils/paymentAllocator";

// GET /api/summary?type=installments&page=1&limit=10 - Get dashboard summary or installments
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // 'dashboard' or 'installments'
    const page = parseInt(searchParams.get("page")) || null;
    const limit = parseInt(searchParams.get("limit")) || 10;

    if (type === "installments") {
      // Get all installments with shareholder info
      const allInstallments = db.installments.getAll();
      const shareholders = db.shareholders.getAll();
      const shares = db.shares.getAll();

      // Get filter parameters
      const country = searchParams.get("country");
      const search = searchParams.get("search");
      const month = searchParams.get("month");
      const year = searchParams.get("year");
      const status = searchParams.get("status");

      // Enrich installments with shareholder data
      let enrichedInstallments = allInstallments.map((inst) => {
        const share = shares.find((s) => s.id === inst.shareId);
        const shareholder = share
          ? shareholders.find((sh) => sh.id === share.shareholderId)
          : null;

        return {
          ...inst,
          shareholderName: shareholder?.name || "Unknown",
          shareholderEmail: shareholder?.email || "Unknown",
          shareholderId: shareholder?.id,
          shareholderCountry: shareholder?.country || "",
        };
      });

      // Apply filters
      if (country) {
        enrichedInstallments = enrichedInstallments.filter(
          (inst) =>
            inst.shareholderCountry.toLowerCase() === country.toLowerCase()
        );
      }

      if (search) {
        const searchLower = search.toLowerCase();
        enrichedInstallments = enrichedInstallments.filter((inst) =>
          inst.shareholderName.toLowerCase().includes(searchLower)
        );
      }

      if (month && year) {
        enrichedInstallments = enrichedInstallments.filter((inst) => {
          const dueDate = new Date(inst.dueDate);
          return (
            dueDate.getMonth() + 1 === parseInt(month) &&
            dueDate.getFullYear() === parseInt(year)
          );
        });
      } else if (month) {
        enrichedInstallments = enrichedInstallments.filter((inst) => {
          const dueDate = new Date(inst.dueDate);
          return dueDate.getMonth() + 1 === parseInt(month);
        });
      }

      if (status) {
        enrichedInstallments = enrichedInstallments.filter(
          (inst) => inst.status.toLowerCase() === status.toLowerCase()
        );
      }

      // Apply pagination if requested
      if (page) {
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedData = enrichedInstallments.slice(startIndex, endIndex);

        return NextResponse.json(
          {
            installments: paginatedData,
            pagination: {
              currentPage: page,
              totalPages: Math.ceil(enrichedInstallments.length / limit),
              totalItems: enrichedInstallments.length,
              itemsPerPage: limit,
              hasNextPage: endIndex < enrichedInstallments.length,
              hasPrevPage: page > 1,
            },
          },
          { status: 200 }
        );
      }

      return NextResponse.json(
        { installments: enrichedInstallments },
        { status: 200 }
      );
    }

    // Default: dashboard summary
    const installments = db.installments.getAll();

    const totalExpected = calculateTotalExpected(installments);
    const totalPaid = calculateTotalPaid(installments);
    const totalDue = calculateOutstanding(installments);

    // Calculate monthly collected (current month)
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthlyCollected = installments
      .filter((inst) => {
        if (!inst.paidDate) return false;
        const paidDate = new Date(inst.paidDate);
        return (
          paidDate.getMonth() === currentMonth &&
          paidDate.getFullYear() === currentYear
        );
      })
      .reduce((sum, inst) => sum + inst.paidAmount, 0);

    return NextResponse.json(
      {
        totalExpected,
        totalPaid,
        totalDue,
        monthlyCollected,
        totalShareholders: db.shareholders.getAll().length,
        totalShares: db.shares.getAll().length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching summary:", error);
    return NextResponse.json(
      { error: "Failed to fetch summary" },
      { status: 500 }
    );
  }
}
