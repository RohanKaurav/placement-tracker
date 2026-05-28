import { prisma } from "../db/prisma";

export interface UserProfile{
    id: string;
    username:string;
    college:string;
    totalPoints:number;
    solvedCount:number;
    createdAt: Date;
}

export async function authenticateUser(username:string, college:string):Promise<UserProfile>{
    const normalizedUsername= username.trim();
    const normalizedCollege = college.trim();

    if(!normalizedUsername || !normalizedCollege){
        throw new Error("Username and college can not be empty ");

    }

    const user = await prisma.user.upsert({
        where:{username:normalizedUsername},
        update:{college:normalizedCollege},
        create:{
            username:normalizedUsername,
            college:normalizedCollege,
        },
    });

    return user;
}

export async function getUserProfile(userId:string):Promise<UserProfile | null>{
    const user = await prisma.user.findUnique({
        where:{id:userId},
    })
    return user;
}

export async function getAllUser(query:string, currentUserId:string):Promise<UserProfile[]>{
    const normalizedQuery = query.trim();
    if(!normalizedQuery){return [];}
    const users = await prisma.user.findMany({
        where:{
            username:{
                contains:normalizedQuery,
                mode:"insensitive",
            },
            id:{
                not:currentUserId,
            }
        },
        take: 10,
    })
    return users
}

export async function pinUser(followerId:string,followedId:string):Promise<void>{
    if (followerId === followedId) {
        throw new Error("You cannot pin yourself.");
      }
    await prisma.pin.upsert({
        where:{
            followerId_followedId:{
                followerId,
                followedId,
        },
    },
        update:{},
        create:{
            followerId,
            followedId,
        },
})

}

export async function unPinUser(followerId:string,followedId:string):Promise<void>{
    await prisma.pin.delete({
        where:{
            followerId_followedId:{
                followerId,
                followedId,
            },
        }
    })
}

export async function getAllPinnedUsers(userId:string):Promise<UserProfile[]>{
    const pinnedUsers = await prisma.pin.findMany({
        where:{followerId:userId},
        include:{
            followed:true,
    },
        orderBy:{
            createdAt:"desc",
        }
    })
    return pinnedUsers.map(pin => pin.followed);
}