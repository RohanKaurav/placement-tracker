"use client";
import { useState, useEffect, FormEvent } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SetupPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [college, setCollege] = useState("");
  const [collegeSuggestions, setCollegeSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [setupDone, setSetupDone] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    if (setupDone) return;

    if (status === "unauthenticated") {
      router.push("/");
      return;
    }

    if (status === "authenticated") {
      if (session?.user?.username && session?.user?.college) {
        router.push("/dashboard");
      }
    }
  }, [session, status, router, setupDone]);

  const handleCollegeSearch = async (val: string) => {
    setCollege(val);  

    if (val.length < 3) {
      setCollegeSuggestions([]);
      return;
    }
    

    // try {
    //   const res = await fetch(`/api/colleges?name=${encodeURIComponent(val)}`);
    //   const data = await res.json();
    //   console.log("College search results:", data);
    //    setCollegeSuggestions(data.slice(0, 5).map((u: any) => u.name));
    // } catch (e) {
    //   console.error("Error fetching college suggestions:", e);
    //   setCollegeSuggestions([]);
    // }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !college.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session?.user?.id, username, college }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setSetupDone(true);
      await update();
      router.push("/dashboard");

    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

       
        <div className="text-center mb-8">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-500 flex items-center justify-center font-bold text-white text-xl mx-auto mb-4">
            P
          </div>
          <h1 className="text-3xl font-bold text-white">Almost there!</h1>
          <p className="mt-2 text-zinc-400 text-sm">
            Welcome {session?.user?.name}! Just a few more details.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

        
          <div>
            <label className="block text-sm font-semibold text-zinc-300 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. madhav_dev"
              className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>

         
          <div className="relative">
            <label className="block text-sm font-semibold text-zinc-300 mb-2">
              College Name
            </label>
            <input
              type="text"
              value={college}
              onChange={(e) => handleCollegeSearch(e.target.value)}
              onBlur={() => setTimeout(() => setCollegeSuggestions([]), 200)}
              placeholder="e.g. IIT Kharagpur"
              className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />

           
            {collegeSuggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 border border-zinc-800 rounded-xl bg-zinc-900 overflow-hidden shadow-lg">
                {collegeSuggestions.map((name) => (
                  <div
                    key={name}
                    onMouseDown={() => {           
                      setCollege(name);
                      setCollegeSuggestions([]);
                    }}
                    className="px-4 py-3 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white cursor-pointer transition duration-150"
                  >
                    {name}
                  </div>
                ))}
                <div className="px-4 py-2 text-xs text-zinc-600 border-t border-zinc-800">
                  Not in list? Just type your college name and continue.
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? "Saving..." : "Go to Dashboard →"}
          </button>
        </form>

      </div>
    </div>
  );
}