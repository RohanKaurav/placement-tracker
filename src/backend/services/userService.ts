import { prisma } from "../db/prisma";
import bcrypt from "bcryptjs";
export interface UserProfile{
    id: string;
    username:string;
    college:string;
    password:string;
    totalPoints:number;
    solvedCount:number;
    createdAt: Date;
}
export async function DeleteUser(userId:string):Promise<void>{
    try{
        const checkUser = await prisma.user.findUnique({
            where:{id:userId},
        })
        if(!checkUser){
            throw new Error("User not found");
        }   
        await prisma.user.delete({
            where:{id:userId},
        })
    }catch(e:any){
        console.log("Delete User Error: ",e);
        throw new Error(e.message || "Internal Server Error");
    }
    
}
export async function authenticateUser(username: string, college: string, password: string): Promise<UserProfile> {
    const normalizedUsername = username.trim();
    const normalizedCollege = college.trim();
    const normalizedPassword = password.trim();
  
    if (!normalizedUsername || !normalizedCollege || !normalizedPassword) {
      throw new Error("Username, college or password cannot be empty");
    }
  
   
    const existingUser = await prisma.user.findUnique({
      where: { username: normalizedUsername }
    });
  
    if (existingUser) {
     
      const passwordMatch = await bcrypt.compare(normalizedPassword, existingUser.password);
      if (!passwordMatch) {
        throw new Error("Wrong password");
      }
      return existingUser;
  
    } else {
      const hashedPassword = await bcrypt.hash(normalizedPassword, 10);
      return prisma.user.create({
        data: {
          username: normalizedUsername,
          college: normalizedCollege,
          password: hashedPassword
        }
      });
    }
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