"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";

interface UserSession {
    id:string;
    username:string;
    college: string;
    totalPoints: number;
    solvedCount:number;
}

interface NavbarProps {
    userStats?:{
        totalPoints: number;
        solvedCount:number;
    }
}

export default function Navbar({ userStats }: NavbarProps) {
    const router = useRouter();
    const [user, setUser] = useState<UserSession | null>(null);

    useEffect(()=>{
        const savedUser = localStorage.getItem("user");
        if(savedUser){
            try{
                setUser(JSON.parse(savedUser));
            }catch(err){
                localStorage.removeItem("user");
                router.push("/");
            }   
        }else{
            router.push("/");
        }
    },[router])

    const handleLogout = () =>{
        localStorage.removeItem("user");
        router.push("/")
    }
    const displayPoints = userStats?.totalPoints ?? user?.totalPoints ?? 0;
    const displaySolved = userStats?.solvedCount ?? user?.solvedCount ?? 0;
    return(
        <header></header>
    )
}

