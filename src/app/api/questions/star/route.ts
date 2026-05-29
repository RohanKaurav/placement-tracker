import { toggleQuestionStarredOne} from "../../../../backend/services/questionService"
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
    try {
      const body = await req.json();
      const { userId, questionId } = body;
  
      if (!userId || !questionId) {
        return NextResponse.json(
          { error: "User ID and Question ID are required." },
          { status: 400 }
        );
      }
  
      const updatedQuestion = await toggleQuestionStarredOne(userId, questionId);
      return NextResponse.json(updatedQuestion, { status: 200 });
    } catch (error: any) {
      console.error("POST Star API Error:", error);
      return NextResponse.json(
        { error: error.message || "Failed to update star status." },
        { status: 500 }
      );
    }
  }
  