import { NextRequest, NextResponse } from "next/server";
import { authenticateUser, DeleteUser } from "../../../backend/services/userService";

export async function POST(req:NextRequest){
    try{
        const body = await req.json();
        const { username, college, password } = body;

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
        if(!password || !password.trim()){
            return NextResponse.json(
                {error: "Password is required bro"},
                {status: 400}
            )
        }
        const user = await authenticateUser(username, college, password);
        return NextResponse.json(user, {status:200});

    }catch(e:any){
        console.log("Authentication APi Error: ",e)
        return NextResponse.json(
            {error:e.message || "INternal Server error"},
            {status: 500}
        )
    }
}

export async function DELETE(req:NextRequest){
    try{
        const body = await req.json();
        const { userId } = body;
        if(!userId || !userId.trim()){
            return NextResponse.json(
                {error: "User ID is required."},
                {status: 400}
            )
        }   
        await DeleteUser(userId);
        return NextResponse.json({message: "User deleted successfully"}, {status: 200});

    }catch(e:any){
        console.log("Delete User API Error: ",e);
        return NextResponse.json(
            {error: e.message || "Internal Server Error"},
            {status: 500}
        )
    }
}