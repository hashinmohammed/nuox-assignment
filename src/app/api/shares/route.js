import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { validateShareForm } from "@/utils/validators";
import { generateInstallmentSchedule } from "@/utils/installmentCalculator";

// GET /api/shares?shareholderId=xxx&page=1&limit=10 - Get shares with pagination
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const shareholderId = searchParams.get("shareholderId");
    const page = parseInt(searchParams.get("page")) || null;
    const limit = parseInt(searchParams.get("limit")) || 10;

    if (!shareholderId) {
      // Return all shares with pagination
      const result = db.shares.getAll(page, limit);

      if (page) {
        return NextResponse.json(
          {
            shares: result.data,
            pagination: result.pagination,
          },
          { status: 200 }
        );
      }
      return NextResponse.json({ shares: result }, { status: 200 });
    }

    // Get shares for specific shareholder (no pagination for filtered results)
    const shares = db.shares.getByShareholderId(shareholderId);
    return NextResponse.json({ shares }, { status: 200 });
  } catch (error) {
    console.error("Error fetching shares:", error);
    return NextResponse.json(
      { error: "Failed to fetch shares" },
      { status: 500 }
    );
  }
}

// POST /api/shares - Create new share with installments
export async function POST(request) {
  try {
    const body = await request.json();

    // Validate input
    const validation = validateShareForm(body);
    if (!validation.valid) {
      return NextResponse.json(
        { error: "Validation failed", errors: validation.errors },
        { status: 400 }
      );
    }

    // Verify shareholder exists
    const shareholder = db.shareholders.getById(body.shareholderId);
    if (!shareholder) {
      return NextResponse.json(
        { error: "Shareholder not found" },
        { status: 404 }
      );
    }

    // Create share
    const share = db.shares.create(body);

    // Generate installments
    const installmentSchedule = generateInstallmentSchedule({
      shareId: share.id,
      duration: share.duration,
      annualAmount: share.annualAmount,
      installmentType: share.installmentType,
      startDate: share.startDate,
      customInstallments: share.customInstallments,
    });

    // Save installments
    const installments = db.installments.createBulk(installmentSchedule);

    return NextResponse.json({ share, installments }, { status: 201 });
  } catch (error) {
    console.error("Error creating share:", error);
    return NextResponse.json(
      { error: "Failed to create share" },
      { status: 500 }
    );
  }
}
