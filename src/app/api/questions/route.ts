import { NextRequest, NextResponse } from "next/server";
import {getAllQuestionsForUser} from "../../../backend/services/questionService";

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
  
      const questions = await getAllQuestionsForUser(userId);
      return NextResponse.json(questions, { status: 200 });
    } catch (error: any) {
      console.error("GET Questions API Error:", error);
      return NextResponse.json(
        { error: error.message || "Failed to retrieve questions." },
        { status: 500 }
      );
    }
  }
  