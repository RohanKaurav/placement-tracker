import {prisma} from '../db/prisma';

export interface LeaderboardEntry {
    rank: number;
    id: string;
    username: string;
    college: string;
    totalPoints: number;
    solvedCount: number;
}

export interface ProgressChartPoint{
    date:string;
    [key:string]: number | string;
}

export interface UserStatisticsBreakdown{
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  totalPoints: number;
  solvedCount: number;
}

export async function getGlobalLeaders(limit=50):Promise<LeaderboardEntry[]>{
    const users = await prisma.user.findMany({
        orderBy:[
            {totalPoints:"desc"},
            {solvedCount:"desc"},
            {username:"asc"}
        ],
        take:limit,
    });
    return users.map((user,index)=>({
        rank: index + 1,
        id: user.id,
        username: user.username,
        college: user.college,
        totalPoints: user.totalPoints,
        solvedCount: user.solvedCount,
    }))
}

export async function getUserStatsBreakdown(userId:string):Promise<UserStatisticsBreakdown>{
    const user = await prisma.user.findUnique({
        where:{id:userId},
    });
    
    if(!user){
        throw new Error("User not found");
    }

    const solved = await prisma.userProgress.findMany({
        where:{userId,isSolved:true},
        include:{question:true},
    });

    let easySolved = 0;
    let mediumSolved = 0;
    let hardSolved = 0;

    solved.forEach(solve=>{
        if (solve.question.difficulty === "EASY") easySolved++;
    else if (solve.question.difficulty === "MEDIUM") mediumSolved++;
    else if (solve.question.difficulty === "HARD") hardSolved++;
    });

    return {
        easySolved,
        mediumSolved,
        hardSolved,
        totalPoints: user.totalPoints,
        solvedCount: user.solvedCount,
      }
}

export async function getComparativeWeeklyProgress(userId:string):Promise<ProgressChartPoint[]>{
    const user = await prisma.user.findUnique({
        where:{id:userId}
    })
    if(!user){
        throw new Error("User not found");
    }

    const pins = await prisma.pin.findMany({
        where:{followerId:userId},
        include:{followed:true},
    });
     const pinnedUsers = pins.map(pin=>pin.followed);

     const allUsers = [user,...pinnedUsers]
     const allUserIds = allUsers.map(u=>u.id);

     const dates: Date[]=[];

     for(let i=6;i>=0;i--){
        const date = new Date();
        date.setDate(date.getDate()-i);
        date.setHours(0,0,0,0);
        dates.push(date)
     }

     const formatDate = (date: Date) => {
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      };

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      sevenDaysAgo.setHours(0, 0, 0, 0);

      const solves = await prisma.userProgress.findMany({
        where: {
          userId: { in: allUserIds },
          isSolved: true,
          solvedAt: { gte: sevenDaysAgo },
        },
        include: {
          user: true,
        },
      });

    const dataSet: ProgressChartPoint[] = dates.map(date =>{
        const label = formatDate(date);
        const point: ProgressChartPoint = { date: label };
        allUsers.forEach(u=>{
            point[u.username] = 0;
        })
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);

        solves.forEach(solve=>{
            if(solve.solvedAt){
                const solveTime = new Date(solve.solvedAt).getTime();
                if(solveTime >= date.getTime() && solveTime < nextDay.getTime()){
                    const username = solve.user.username;
                    if (point[username] !== undefined) {
                        (point[username] as number)++;
                      }
            }
        }
           
        })

        return point;
    })  

    return dataSet
}