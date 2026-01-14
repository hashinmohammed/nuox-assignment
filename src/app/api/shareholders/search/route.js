import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/shareholders/search?email=xxx - Search shareholders by email
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email parameter is required" },
        { status: 400 }
      );
    }

    const shareholders = db.shareholders.getByEmail(email);

    return NextResponse.json({ shareholders }, { status: 200 });
  } catch (error) {
    console.error("Error searching shareholders:", error);
    return NextResponse.json(
      { error: "Failed to search shareholders" },
      { status: 500 }
    );
  }
}
