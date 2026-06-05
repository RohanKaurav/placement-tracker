"use client";
import { useEffect, useCallback } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/src/frontend/Navbar";
import { useSession } from "next-auth/react";

interface LeaderboardEntry {
  rank: number;
  id: string;
  username: string;
  college: string;
  totalPoints: number;
  solvedCount: number;
}

export default function LeaderboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const currentUser = session?.user;

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [pinnedUserIds, setPinnedUserIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [collegeFilter, setCollegeFilter] = useState("ALL");

  const colleges = ["ALL", ...Array.from(new Set(leaderboard.map((student) => student.college)))];

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  const loadLeaderboard = useCallback(async (userId: string) => {
    setIsLoading(true);
    try {
      const leaderBoardResponse = await fetch("/api/leaderboard?limit=100");
      if (leaderBoardResponse.ok) {
        const leaderBoardData = await leaderBoardResponse.json();
        setLeaderboard(leaderBoardData);
      }

      const pinnedResponse = await fetch(`/api/social/pinned?userId=${userId}`);
      if (pinnedResponse.ok) {
        const pinnedData: { id: string }[] = await pinnedResponse.json();
        setPinnedUserIds(new Set(pinnedData.map((u) => u.id)));
      }
    } catch (e) {
      console.error("Failed to load leaderboard data:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

   useEffect(() => {
    if (currentUser?.id) {
      loadLeaderboard(currentUser.id);
    }
  }, [currentUser?.id, loadLeaderboard]);

  const handlePinToggle = async (targetUserId: string, isCurrentlyPinned: boolean) => {
    if (!currentUser?.id) return;
    const endpoint = isCurrentlyPinned ? "/api/social/unpin" : "/api/social/pin";
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id,
          targetUserId
        })
      });

      if (response.ok) {
         setPinnedUserIds((prev) => {
          const newSet = new Set(prev);
          if (isCurrentlyPinned) {
            newSet.delete(targetUserId);
          } else {
            newSet.add(targetUserId);
          }
          return newSet;
        });

         const pinnedRes = await fetch(`/api/social/pinned?userId=${currentUser.id}`);
        if (pinnedRes.ok) {
          const pData: { id: string }[] = await pinnedRes.json();
          setPinnedUserIds(new Set(pData.map((u) => u.id)));
        }
      }
    } catch (e) {
      console.error("Failed to toggle pin:", e);
    }
  };

  const filteredLeaderboard = leaderboard.filter(student => {
    const matchesSearch = student.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCollege = collegeFilter === "ALL" || student.college === collegeFilter;
    return matchesSearch && matchesCollege;
  });

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950">
      <Navbar />

      <main className="flex-1 mx-auto max-w-5xl w-full px-4 sm:px-6 lg:px-8 py-8">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Global Leaderboard</h1>
           
            <p className="text-sm text-zinc-500 mt-1">Compare ranks, scores, and track progress across colleges.</p>
          </div>
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl transition cursor-pointer"
          >
            <span>←</span> Back to Dashboard
          </button>
        </div>

         <div className="p-6 rounded-2xl border border-white/5 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search students by username..."
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3 pl-10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <svg className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-xs font-semibold text-zinc-400 whitespace-nowrap">
              Filter by College:
            </label>
            <select
              value={collegeFilter}
              onChange={(e) => setCollegeFilter(e.target.value)}
              className="rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              {colleges.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

       
        <div className="rounded-2xl border border-white/5 overflow-hidden">
          {isLoading ? (
            <div className="py-24 text-center text-sm text-zinc-500 flex flex-col items-center gap-3">
              <svg className="animate-spin h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Fetching placement rankings...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-900/30 text-xs font-bold text-zinc-400 uppercase tracking-wider">
                    <th className="px-6 py-4 w-20 text-center">Rank</th>
                    <th className="px-6 py-4">Student</th>
                    <th className="px-6 py-4">College</th>
                    <th className="px-6 py-4 text-center">Solved</th>
                    <th className="px-6 py-4 text-right">Score</th>
                    <th className="px-6 py-4 w-32 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {filteredLeaderboard.length > 0 ? (
                    filteredLeaderboard.map((student) => {
                      const isSelf = student.id === currentUser?.id;
                      const isPinned = pinnedUserIds.has(student.id);

                      return (
                        <tr
                          key={student.id}
                          className={`transition duration-150 ${
                            isSelf
                              ? "bg-indigo-500/5 font-semibold text-indigo-300"
                              : "hover:bg-zinc-900/20 text-zinc-300"
                          }`}
                        >
                          <td className="px-6 py-4 text-center">
                            <span className={`inline-flex h-6 w-6 rounded-full items-center justify-center font-extrabold text-xs ${
                              student.rank === 1 ? "bg-amber-500/15 text-amber-400 border border-amber-500/30" :
                              student.rank === 2 ? "bg-zinc-400/15 text-zinc-300 border border-zinc-400/30" :
                              student.rank === 3 ? "bg-amber-700/15 text-amber-600 border border-amber-700/30" :
                              "text-zinc-500"
                            }`}>
                              {student.rank}
                            </span>
                          </td>

                          <td className="px-6 py-4">
                            <div className="font-semibold text-white flex items-center gap-2">
                              {student.username}
                              {isSelf && (
                                <span className="text-[9px] font-bold bg-indigo-500 text-white px-1.5 py-0.5 rounded uppercase">
                                  You
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="px-6 py-4 text-zinc-400 truncate max-w-[200px]" title={student.college}>
                            {student.college}
                          </td>

                          <td className="px-6 py-4 text-center text-zinc-400 font-semibold">
                            {student.solvedCount}
                          </td>

                          <td className="px-6 py-4 text-right font-extrabold text-zinc-100">
                            {student.totalPoints} <span className="text-[10px] text-zinc-500 font-medium">pts</span>
                          </td>

                          <td className="px-6 py-4 text-center">
                            {isSelf ? (
                              <span className="text-xs text-zinc-600">-</span>
                            ) : (
                              <button
                                onClick={() => handlePinToggle(student.id, isPinned)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                                  isPinned
                                    ? "bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20"
                                    : "bg-indigo-600 hover:bg-indigo-500 text-white"
                                }`}
                              >
                                {isPinned ? "Unpin" : "Pin Peer"}
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-sm text-zinc-500">
                        No students match your current filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}