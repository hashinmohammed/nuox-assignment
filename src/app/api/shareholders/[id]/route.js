import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { validateShareholderForm } from "@/utils/validators";

// GET /api/shareholders/[id] - Get shareholder by ID
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const shareholder = db.shareholders.getById(id);

    if (!shareholder) {
      return NextResponse.json(
        { error: "Shareholder not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ shareholder }, { status: 200 });
  } catch (error) {
    console.error("Error fetching shareholder:", error);
    return NextResponse.json(
      { error: "Failed to fetch shareholder" },
      { status: 500 }
    );
  }
}

// PUT /api/shareholders/[id] - Update shareholder
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Validate input
    const validation = validateShareholderForm(body);
    if (!validation.valid) {
      return NextResponse.json(
        { error: "Validation failed", errors: validation.errors },
        { status: 400 }
      );
    }

    // Update shareholder
    const shareholder = db.shareholders.update(id, body);

    if (!shareholder) {
      return NextResponse.json(
        { error: "Shareholder not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ shareholder }, { status: 200 });
  } catch (error) {
    console.error("Error updating shareholder:", error);
    return NextResponse.json(
      { error: "Failed to update shareholder" },
      { status: 500 }
    );
  }
}

// DELETE /api/shareholders/[id] - Delete shareholder
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    // Check if shareholder has shares
    const shares = db.shares.getByShareholderId(id);
    if (shares.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete shareholder with existing shares" },
        { status: 400 }
      );
    }

    const success = db.shareholders.delete(id);

    if (!success) {
      return NextResponse.json(
        { error: "Shareholder not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting shareholder:", error);
    return NextResponse.json(
      { error: "Failed to delete shareholder" },
      { status: 500 }
    );
  }
}
