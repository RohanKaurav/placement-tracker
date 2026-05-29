import { NextRequest, NextResponse } from "next/server";
import { updateNotesForQuestion } from "../../../../backend/services/questionService";

export async function POST(req:NextRequest){
    try{
        const body = await req.json();
        const {userId, questionId, notes} = body;
        if(!userId || !questionId || notes === undefined){
            return NextResponse.json({error: "Missing required fields"}, {status: 400});
        }

        const updatedQuestion = await updateNotesForQuestion(userId, questionId, notes);
        return NextResponse.json(updatedQuestion,
            {status:200}
        );
    }
    catch(err:any){
        console.log("Error updating notes:", err);
        return NextResponse.json({error: err.message}, {status: 500});
    }
}