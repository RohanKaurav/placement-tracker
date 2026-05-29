"use client";
import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation"; 

export default function LandingPage(){
  const router = useRouter()
  const [username, setUsername] = useState("");
  const [college, setCollege] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(()=>{
    const savedUser = localStorage.getItem("user");
    if(savedUser){
      try{
        const user = JSON.parse(savedUser);
        if(user && user.id){
          router.push("/dashboard");
        }
      }catch(err){
        localStorage.removeItem("user");
      }
    }
  },[router])

const handleSubmit = async(e:FormEvent) =>{
  e.preventDefault();
  setError("");
  if (!username.trim() || !college.trim()) {
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
      body:JSON.stringify({username, college})
    })

    const data = await response.json();
    console.log("data comes: ",data);
    if(!response.ok){
      throw new Error(data.message || "Authentication failed");
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
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Get Started</h2>
          <p className="mt-2 text-sm text-zinc-400">
            Enter your username and college to log in or register instantly.
          </p>
        </div>

        <div className="mt-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-zinc-300">
                Username
              </label>
              <div className="mt-2 relative">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. Madhav"
                  className="appearance-none block w-full px-4 py-3 border border-zinc-800 rounded-xl bg-zinc-900/60 placeholder-zinc-500 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="college" className="block text-sm font-semibold text-zinc-300">
                College Name
              </label>
              <div className="mt-2 relative">
                <input
                  id="college"
                  name="college"
                  type="text"
                  required
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  placeholder="e.g. IIT Kharagpur"
                  className="appearance-none block w-full px-4 py-3 border border-zinc-800 rounded-xl bg-zinc-900/60 placeholder-zinc-500 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 text-sm"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] cursor-pointer"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Verifying...
                  </span>
                ) : (
                  "Enter Workspace"
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-12 text-center">
        </div>
      </div>
    </div>
  </div>
  )
}