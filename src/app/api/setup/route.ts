import { NextRequest, NextResponse } from "next/server";
import { completeUserSetup, DeleteUser } from "../../../backend/services/userService";


export async function POST(req: NextRequest) {
  try {
    const { userId, username, college } = await req.json();

    if (!username?.trim()) {
      return NextResponse.json({ error: "Username is required." }, { status: 400 });
    }
    if (!college?.trim()) {
      return NextResponse.json({ error: "College name is required." }, { status: 400 });
    }

    const user = await completeUserSetup(userId, username, college);
    return NextResponse.json(user, { status: 200 });

  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await req.json();

    if (!userId?.trim()) {
      return NextResponse.json({ error: "User ID is required." }, { status: 400 });
    }

    await DeleteUser(userId);
    return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });

  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Internal Server Error" }, { status: 500 });
  }
}