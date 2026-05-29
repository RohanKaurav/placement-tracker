import { NextRequest, NextResponse } from "next/server";
import { getUserStatsBreakdown } from "../../../../backend/services/leaderboardService";

export async function GET(req: NextRequest) {  
    try{
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json(
                { error: "Missing userId parameter" },
                { status: 400 }
            );
        }
        const statistics = await getUserStatsBreakdown(userId);
        return NextResponse.json(
            statistics,
            {status :400}
        )
    }catch(error:any){
        console.error("GET Stats Breakdown API Error:", error);
        return NextResponse.json(
        { error: error.message || "Failed to retrieve stats breakdown." },
        { status: 500 }
        );
    }
    
}