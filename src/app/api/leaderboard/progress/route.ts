import { NextRequest, NextResponse } from "next/server";
import {getComparativeWeeklyProgress} from "../../../../backend/services/leaderboardService";

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
  
      const progressData = await getComparativeWeeklyProgress(userId);
      return NextResponse.json(progressData, { status: 200 });
    } catch (error: any) {
      console.error("GET Weekly Progress API Error:", error);
      return NextResponse.json(
        { error: error.message || "Failed to retrieve comparative weekly progress." },
        { status: 500 }
      );
    }
  }
  