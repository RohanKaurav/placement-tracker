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
        <header className="sticky top-0 z-40 w-full border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          
         
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-cyan-500 flex items-center justify-center font-bold text-white text-md shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                P
              </div>
              <span className="text-xl font-bold tracking-tight text-white hidden sm:block">
                Placement<span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Prep</span>
              </span>
            </Link>

            
            <nav className="flex items-center gap-6">
              <Link
                href="/dashboard"
                className="text-sm font-medium text-zinc-300 hover:text-white transition duration-200"
              >
                Dashboard
              </Link>
            </nav>
          </div>

        
          {user && (
            <div className="flex items-center gap-4 sm:gap-6">
             
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.05)]">
                  <span>🏆</span>
                  <span>{displayPoints} pts</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.05)]">
                  <span>✅</span>
                  <span>{displaySolved} solved</span>
                </div>
              </div>

             
              <div className="flex items-center gap-3 pl-3 border-l border-zinc-900">
                <div className="text-right hidden md:block">
                  <div className="text-sm font-semibold text-white">{user.username}</div>
                  <div className="text-xs text-zinc-500 max-w-[120px] truncate">{user.college}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="rounded-lg p-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/15 transition duration-200 cursor-pointer"
                  title="Sign Out"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </header>
    )
}

