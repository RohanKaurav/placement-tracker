import { NextRequest, NextResponse } from "next/server";
import { getAllPinnedUsers } from "@/src/backend/services/userService";


export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required." },
        { status: 400 }
      );
    }

    const pinnedUsers = await getAllPinnedUsers(userId);
    return NextResponse.json(pinnedUsers, { status: 200 });
  } catch (error: any) {
    console.error("GET Pinned Users API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to retrieve pinned users." },
      { status: 500 }
    );
  }
}
