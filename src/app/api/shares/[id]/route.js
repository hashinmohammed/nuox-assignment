import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/shares/[id] - Get share with installments
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const share = db.shares.getById(id);

    if (!share) {
      return NextResponse.json({ error: "Share not found" }, { status: 404 });
    }

    // Get installments for this share
    const installments = db.installments.getByShareId(id);

    return NextResponse.json({ share, installments }, { status: 200 });
  } catch (error) {
    console.error("Error fetching share:", error);
    return NextResponse.json(
      { error: "Failed to fetch share" },
      { status: 500 }
    );
  }
}

// PUT /api/shares/[id] - Update share
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    const share = db.shares.update(id, body);

    if (!share) {
      return NextResponse.json({ error: "Share not found" }, { status: 404 });
    }

    return NextResponse.json({ share }, { status: 200 });
  } catch (error) {
    console.error("Error updating share:", error);
    return NextResponse.json(
      { error: "Failed to update share" },
      { status: 500 }
    );
  }
}

// DELETE /api/shares/[id] - Delete share and its installments
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    // Delete installments first
    db.installments.deleteByShareId(id);

    // Delete share
    const success = db.shares.delete(id);

    if (!success) {
      return NextResponse.json({ error: "Share not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting share:", error);
    return NextResponse.json(
      { error: "Failed to delete share" },
      { status: 500 }
    );
  }
}
