"use client";
import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation"; 
import { useSession, signOut,signIn } from "next-auth/react";
import { sign } from "crypto";
export default function LandingPage(){
  const router = useRouter()
  const [username, setUsername] = useState("");
  const [college, setCollege] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const{data:session, status} = useSession();

  useEffect(()=>{
    const savedUser = session?.user;
    if(status === "loading") return;
    if(status === "authenticated"){
      if(savedUser?.username && savedUser?.college){
        router.push("/dashboard");
      }else{
        router.push("/setup");
      }
    }
   
  },[router,status, session])

const handleSubmit = async(e:FormEvent) =>{
  e.preventDefault();
  setError("");
  if (!username.trim() || !college.trim()|| !password.trim()) {
    setError("Please fill in all fields.");
    return;
  }
  setIsLoading(true);

  try{
   
    const response = await fetch("/api/auth",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({username, college, password})
    })

    const data = await response.json();
    console.log("data comes: ",data);
    if(!response.ok){
      throw new Error(data.message || "Password is wrong or username is already taken");
    }

    localStorage.setItem("user", JSON.stringify(data));
    router.push("/dashboard");

  }catch(er:any){
    console.error("authentication error", er);
    setError(er.message || "something went wrong Please try again");
  }finally{
    setIsLoading(false);
  }
}


  return (
    <div className="flex min-h-screen flex-col lg:flex-row font-sans">
   
    <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-20 lg:py-24 xl:px-32 bg-black/40 border-r border-zinc-900 relative overflow-hidden">
      
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />

      <div className="relative max-w-xl mx-auto lg:mx-0">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-500 flex items-center justify-center font-bold text-white text-xl shadow-[0_0_20px_rgba(99,102,241,0.4)]">
            P
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">
            Placement<span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Prep</span>
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
          Scale Your Placement Readiness With{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
            Gamified Tracking
          </span>
        </h1>
        <p className="mt-6 text-lg text-zinc-400 leading-relaxed">
          The ultimate LeetCode problem-solving tracker designed for college engineering students. Master the Blind 75, earn points, take revision notes, and scale the ranks.
        </p>

       
        <div className="mt-12 space-y-6">
          <div className="flex gap-4 p-4 rounded-2xl glass-panel glass-panel-glow border border-white/5 transition duration-300">
            <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-xl bg-indigo-500/10 text-indigo-400">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Curated LeetCode Tracks</h3>
              <p className="mt-1 text-sm text-zinc-400">Handpicked questions categorized by difficulty. Instantly navigate to LeetCode and tick off completed problems.</p>
            </div>
          </div>

          <div className="flex gap-4 p-4 rounded-2xl glass-panel glass-panel-glow border border-white/5 transition duration-300">
            <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-xl bg-violet-500/10 text-violet-400">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Competitive Leaderboards</h3>
              <p className="mt-1 text-sm text-zinc-400">Earn 10 points for Easy, 20 for Medium, and 30 for Hard. Climb the college-wide leaderboard and showcase your skill.</p>
            </div>
          </div>

          <div className="flex gap-4 p-4 rounded-2xl glass-panel glass-panel-glow border border-white/5 transition duration-300">
            <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-xl bg-cyan-500/10 text-cyan-400">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Pin Peers & Compare Progress</h3>
              <p className="mt-1 text-sm text-zinc-400">Search for fellow classmates, pin their profiles to your dashboard, and compare daily/weekly solved graphs.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    
    <div className="flex-1 flex flex-col justify-center py-12 px-6 sm:px-12 lg:px-20 xl:px-24 relative overflow-hidden">
    
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl" />

      <div className="mx-auto w-full max-w-sm relative">
        <div className="text-center lg:text-left">
          <h2 className="text-3xl font-extrabold text-white tracking-tight text-center" >Get Started</h2>
          <p className="mt-2 text-sm text-zinc-400 text-center mb-4">
            Login With Your Google Account
          </p>
        </div>

        <button
            onClick={() => signIn("google", { callbackUrl: "/setup" })}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white text-black font-semibold cursor-pointer "
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>   

        <div className="mt-12 text-center">
        </div>
      </div>
    </div>
  </div>
  )
}