import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { validateShareholderForm } from "@/utils/validators";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || null;
    const limit = parseInt(searchParams.get("limit")) || 10;

    const search = searchParams.get("search");
    const country = searchParams.get("country");

    const result = db.shareholders.getAll(page, limit, { search, country });

    if (page) {
      return NextResponse.json(
        {
          shareholders: result.data,
          pagination: result.pagination,
        },
        { status: 200 }
      );
    }

    return NextResponse.json({ shareholders: result }, { status: 200 });
  } catch (error) {
    console.error("Error fetching shareholders:", error);
    return NextResponse.json(
      { error: "Failed to fetch shareholders" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    const validation = validateShareholderForm(body);
    if (!validation.valid) {
      return NextResponse.json(
        { error: "Validation failed", errors: validation.errors },
        { status: 400 }
      );
    }

    const existing = db.shareholders.getByEmail(body.email);
    if (existing.length > 0) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 }
      );
    }

    const shareholder = db.shareholders.create(body);

    return NextResponse.json({ shareholder }, { status: 201 });
  } catch (error) {
    console.error("Error creating shareholder:", error);
    return NextResponse.json(
      { error: "Failed to create shareholder" },
      { status: 500 }
    );
  }
}
