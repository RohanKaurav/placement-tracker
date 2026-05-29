import { NextRequest, NextResponse } from "next/server";
import { authenticateUser } from "../../../backend/services/userService";

export async function POST(req:NextRequest){
    try{
        const body = await req.json();
        const { username, college } = body;

        if (!username || !username.trim()) {
            return NextResponse.json(
              { error: "Username is required." },
              { status: 400 }
            );
        }
        if (!college || !college.trim()) {
            return NextResponse.json(
              { error: "College name is required." },
              { status: 400 }
            );
        }
        const user = await authenticateUser(username, college);
        return NextResponse.json(user, {status:200});

    }catch(e:any){
        console.log("Authentication APi Error: ",e)
        return NextResponse.json(
            {error:e.message || "INternal Server error"},
            {status: 500}
        )
    }
}