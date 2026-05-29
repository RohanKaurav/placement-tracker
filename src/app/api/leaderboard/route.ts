import { NextRequest, NextResponse } from "next/server";
import {getGlobalLeaders} from "../../../backend/services/leaderboardService";

export async function GET(req:NextRequest){
    try{
        const { searchParams } = new URL(req.url);
        const limitParam = searchParams.get("limit");
        const limit = limitParam ? parseInt(limitParam, 10) : 50;

        if(isNaN(limit) || limit<=0){
            return NextResponse.json(
                {error: "Limit must be a postive integer"},
                {status: 400}
            )
        }
        const leaderboard = await getGlobalLeaders(limit);
        return NextResponse.json(
            leaderboard,{status: 200}
        )
    }catch(er:any){
        console.error("GET Leaderboard API Error:", er);
    return NextResponse.json(
      { error: er.message || "Failed to retrieve leaderboard." },
      { status: 500 }
    );
    }
}