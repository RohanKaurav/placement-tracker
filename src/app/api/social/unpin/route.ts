import { NextRequest, NextResponse } from "next/server";
import { unPinUser } from "@/src/backend/services/userService";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, targetUserId } = body;

    if (!userId || !targetUserId) {
      return NextResponse.json(
        { error: "User ID and Target User ID are required." },
        { status: 400 }
      );
    }

    await unPinUser(userId, targetUserId);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("POST Unpin User API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to unpin user." },
      { status: 500 }
    );
  }
}
