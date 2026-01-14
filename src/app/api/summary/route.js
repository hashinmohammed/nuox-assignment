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

      // Enrich installments with shareholder data
      const enrichedInstallments = allInstallments.map((inst) => {
        const share = shares.find((s) => s.id === inst.shareId);
        const shareholder = share
          ? shareholders.find((sh) => sh.id === share.shareholderId)
          : null;

        return {
          ...inst,
          shareholderName: shareholder?.name || "Unknown",
          shareholderEmail: shareholder?.email || "Unknown",
          shareholderId: shareholder?.id,
        };
      });

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
