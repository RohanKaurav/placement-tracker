import { NextRequest, NextResponse } from "next/server";
import { getAllUser } from "@/src/backend/services/userService";


export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required." },
        { status: 400 }
      );
    }

    if (!query || !query.trim()) {
      return NextResponse.json([], { status: 200 }); // Return empty array if query is blank
    }

    const results = await getAllUser(query, userId);
    return NextResponse.json(results, { status: 200 });
  } catch (error: any) {
    console.error("GET Search Users API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to search users." },
      { status: 500 }
    );
  }
}
