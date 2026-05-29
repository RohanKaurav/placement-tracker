import { NextRequest, NextResponse } from "next/server";
import { toggleQuestionSolved } from "../../../../backend/services/questionService";


export async function POST(request: NextRequest) {
    try{
        const body = await request.json();
        const { userId, questionId} = body;
        if (!userId || !questionId) {
            return NextResponse.json(
              { error: "User ID and Question ID are required." },
              { status: 400 }
            );
        }
        const updatedStatus = await toggleQuestionSolved(userId, questionId);
        console.log("Updated solve status:", updatedStatus);
        return NextResponse.json(
            updatedStatus ,
            { status: 200 }
        );
    }catch(error:any){
        console.log("POST Solve API Error:", error);
        return NextResponse.json(
        { error: error.message || "Failed to update solve status." },
        { status: 500 }
        );
    }
}