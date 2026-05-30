"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/src/frontend/Navbar";
import QuestionCard, { QuestionType } from "@/src/frontend/QuestionCard";
import NoteModal from "@/src/frontend/NoteModel";
import { useSession } from "next-auth/react";

interface LeaderboardEntry {
  rank: number;
  id: string;
  username: string;
  college: string;
  totalPoints: number;
  solvedCount: number;
}

interface UserStatsBreakdown {
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  totalPoints: number;
  solvedCount: number;
}

interface ProgressPoint {
  date: string;
  [key: string]: string | number;
}

interface PinnedUser {
  id: string;
  username: string;
  college: string;
  totalPoints: number;
  solvedCount: number;
}

export default function Dashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const currentUser = session?.user;

  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [pinnedUsers, setPinnedUsers] = useState<PinnedUser[]>([]);
  const [userStats, setUserStats] = useState<UserStatsBreakdown | null>(null);
  const [weeklyProgress, setWeeklyProgress] = useState<ProgressPoint[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [peerSearch, setPeerSearch] = useState("");
  const [peerResults, setPeerResults] = useState<PinnedUser[]>([]);
  const [isSearchingPeers, setIsSearchingPeers] = useState(false);

  const [activeNoteQuestion, setActiveNoteQuestion] = useState<QuestionType | null>(null);
  const [isNoteOpen, setIsNoteOpen] = useState(false);

  
  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  const loadDashboardData = useCallback(async (userId: string) => {
    try {
      const questionsRes = await fetch(`/api/questions?userId=${userId}`);
      if (questionsRes.ok) {
        setQuestions(await questionsRes.json());
      }

      const statsRes = await fetch(`/api/leaderboard/stats?userId=${userId}`);
      if (statsRes.ok) {
        const sData = await statsRes.json();
        setUserStats(sData);
      }

      const leaderboardRes = await fetch("/api/leaderboard?limit=10");
      if (leaderboardRes.ok) {
        setLeaderboard(await leaderboardRes.json());
      }

      const pinnedRes = await fetch(`/api/social/pinned?userId=${userId}`);
      if (pinnedRes.ok) {
        setPinnedUsers(await pinnedRes.json());
      }

      const progressRes = await fetch(`/api/leaderboard/progress?userId=${userId}`);
      if (progressRes.ok) {
        setWeeklyProgress(await progressRes.json());
      }
    } catch (e) {
      console.error("Failed to load dashboard data:", e);
    }
  }, []);

 
  useEffect(() => {
    if (currentUser?.id) {
      loadDashboardData(currentUser.id);
    }
  }, [currentUser?.id, loadDashboardData]);

  const handleSolveToggle = async (questionId: string) => {
    if (!currentUser?.id) return;
    try {
      const res = await fetch("/api/questions/solve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser.id, questionId }),
      });
      if (res.ok) {
        loadDashboardData(currentUser.id);
      }
    } catch (e) {
      console.error("Solve toggle error:", e);
    }
  };

  const handleStarToggle = async (questionId: string) => {
    if (!currentUser?.id) return;
    try {
      const res = await fetch("/api/questions/star", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser.id, questionId }),
      });
      if (res.ok) {
        const updatedQ = await res.json();
        setQuestions((prev) => prev.map((q) => (q.id === questionId ? updatedQ : q)));
      }
    } catch (e) {
      console.error("Star toggle error:", e);
    }
  };

  const handleSaveNotes = async (notes: string | null) => {
    if (!currentUser?.id || !activeNoteQuestion) return;
    try {
      const res = await fetch("/api/questions/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id,
          questionId: activeNoteQuestion.id,
          notes,
        }),
      });
      if (res.ok) {
        const updatedQ = await res.json();
        setQuestions((prev) => prev.map((q) => (q.id === activeNoteQuestion.id ? updatedQ : q)));
        setActiveNoteQuestion(updatedQ);
      }
    } catch (e) {
      console.error("Save notes error:", e);
    }
  };

  const handleOpenNotes = (question: QuestionType) => {
    setActiveNoteQuestion(question);
    setIsNoteOpen(true);
  };

  const handlePeerSearchChange = async (val: string) => {
    setPeerSearch(val);
    if (!currentUser?.id || !val.trim()) {
      setPeerResults([]);
      return;
    }
    setIsSearchingPeers(true);
    try {
      const res = await fetch(`/api/social/search?query=${encodeURIComponent(val)}&userId=${currentUser.id}`);
      if (res.ok) {
        setPeerResults(await res.json());
      }
    } catch (e) {
      console.error("Peer search error:", e);
    } finally {
      setIsSearchingPeers(false);
    }
  };

  const handlePinUser = async (targetUserId: string) => {
    if (!currentUser?.id) return;
    try {
      const res = await fetch("/api/social/pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser.id, targetUserId }),
      });
      if (res.ok) {
        setPeerSearch("");
        setPeerResults([]);
        loadDashboardData(currentUser.id);
      }
    } catch (e) {
      console.error("Pin user error:", e);
    }
  };

  const handleUnpinUser = async (targetUserId: string) => {
    if (!currentUser?.id) return;
    try {
      const res = await fetch("/api/social/unpin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser.id, targetUserId }),
      });
      if (res.ok) {
        loadDashboardData(currentUser.id);
      }
    } catch (e) {
      console.error("Unpin user error:", e);
    }
  };

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = difficultyFilter === "ALL" || q.difficulty === difficultyFilter;
    let matchesStatus = true;
    if (statusFilter === "SOLVED") matchesStatus = q.isSolved;
    else if (statusFilter === "UNSOLVED") matchesStatus = !q.isSolved;
    else if (statusFilter === "STARRED") matchesStatus = q.isStarred;
    else if (statusFilter === "NOTED") matchesStatus = !!q.notes;
    return matchesSearch && matchesDifficulty && matchesStatus;
  });

  const totalQuestions = questions.length;
  const solvedCount = questions.filter((q) => q.isSolved).length;
  const solvePercent = totalQuestions > 0 ? Math.round((solvedCount / totalQuestions) * 100) : 0;

  const renderChart = () => {
    if (weeklyProgress.length === 0 || !currentUser) return null;

    const width = 500;
    const height = 180;
    const padding = 35;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    const activeUsers = [currentUser.username, ...pinnedUsers.slice(0, 3).map((u) => u.username)];
    const colors = ["#6366f1", "#06b6d4", "#a855f7", "#22c55e"];

    let maxSolve = 1;
    weeklyProgress.forEach((p) => {
      activeUsers.forEach((user) => {
        const val = Number(p[user as string] || 0);
        if (val > maxSolve) maxSolve = val;
      });
    });
    maxSolve = Math.ceil(maxSolve * 1.2);

    const getX = (index: number) => padding + (index / 6) * chartWidth;
    const getY = (value: number) => height - padding - (value / maxSolve) * chartHeight;

    return (
      <div className="relative">
        <svg className="w-full h-auto overflow-visible" viewBox={`0 0 ${width} ${height}`}>
          {Array.from({ length: 4 }).map((_, i) => {
            const val = Math.round((maxSolve / 3) * i);
            const y = getY(val);
            return (
              <g key={i} className="opacity-10">
                <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="white" strokeWidth={1} strokeDasharray="3 3" />
                <text x={padding - 8} y={y + 4} fill="white" className="text-[10px]" textAnchor="end">{val}</text>
              </g>
            );
          })}

          {weeklyProgress.map((p, idx) => (
            <text key={idx} x={getX(idx)} y={height - 12} fill="rgba(255,255,255,0.4)" className="text-[9px]" textAnchor="middle">
              {p.date}
            </text>
          ))}

          {activeUsers.map((user, uIdx) => {
            const strokeColor = colors[uIdx % colors.length];
            const points = weeklyProgress.map((p, idx) => ({
              x: getX(idx),
              y: getY(Number(p[user as string] || 0)),
            }));
            const pathD = points.reduce(
              (acc, p, idx) => (idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`),
              ""
            );
            return (
              <g key={user}>
                <path d={pathD} fill="none" stroke={strokeColor} strokeWidth={4} className="opacity-15 blur-sm" />
                <path d={pathD} fill="none" stroke={strokeColor} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                {points.map((p, pIdx) => (
                  <circle key={pIdx} cx={p.x} cy={p.y} r={3} className="fill-zinc-950 stroke-2" style={{ stroke: strokeColor }} />
                ))}
              </g>
            );
          })}
        </svg>

        <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 justify-center text-xs">
          {activeUsers.map((user, idx) => (
            <div key={user} className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: colors[idx % colors.length] }} />
              <span className="font-semibold text-zinc-300">{user === currentUser.username ? "You" : user}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950">
      <Navbar userStats={userStats ? { totalPoints: userStats.totalPoints, solvedCount: userStats.solvedCount } : undefined} />

      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

         
          <div className="lg:col-span-2 space-y-8">

         
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl glass-panel border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Score</span>
                  <div className="text-3xl font-extrabold text-white mt-1">
                    {userStats?.totalPoints ?? 0} <span className="text-xs font-medium text-zinc-500">pts</span>
                  </div>
                </div>
                <div className="h-12 w-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-xl font-bold">🏆</div>
              </div>

              <div className="p-5 rounded-2xl glass-panel border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Solve rate</span>
                  <div className="text-3xl font-extrabold text-white mt-1">
                    {solvePercent}% <span className="text-xs font-medium text-zinc-500">({solvedCount}/{totalQuestions})</span>
                  </div>
                </div>
                <div className="h-12 w-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-xl font-bold">⚡</div>
              </div>

              <div className="p-5 rounded-2xl glass-panel border border-white/5 flex flex-col justify-center">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Difficulty Breakdown</span>
                <div className="flex items-center gap-3 text-xs font-bold">
                  <span className="text-green-400">E: {userStats?.easySolved ?? 0}</span>
                  <span className="text-zinc-700">|</span>
                  <span className="text-yellow-400">M: {userStats?.mediumSolved ?? 0}</span>
                  <span className="text-zinc-700">|</span>
                  <span className="text-red-400">H: {userStats?.hardSolved ?? 0}</span>
                </div>
              </div>
            </div>

           
            <div className="p-6 rounded-2xl glass-panel border border-white/5 relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-white">Daily Solve Progress</h2>
                  <p className="text-xs text-zinc-500 mt-0.5">LeetCode questions solved over the last 7 days compared with pinned peers</p>
                </div>
              </div>
              {weeklyProgress.length > 0 ? renderChart() : (
                <div className="h-32 flex items-center justify-center text-sm text-zinc-500">
                  No solve statistics yet. Start solving problems to map charts.
                </div>
              )}
            </div>

           
            <div className="p-6 rounded-2xl glass-panel border border-white/5 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-white">Curated LeetCode Tracks</h2>
                  <p className="text-xs text-zinc-500 mt-0.5">Solve questions, collect points, and review notes.</p>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search questions..."
                    className="w-full md:w-64 rounded-xl border border-zinc-800 bg-zinc-950 p-2.5 pl-9 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
                  />
                  <svg className="absolute left-3 top-3 h-4 w-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-zinc-800/60">
                <div className="flex items-center gap-1.5 bg-zinc-950/60 p-1 rounded-lg border border-zinc-900">
                  {["ALL", "EASY", "MEDIUM", "HARD"].map((diff) => (
                    <button
                      key={diff}
                      onClick={() => setDifficultyFilter(diff)}
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold tracking-wide transition cursor-pointer ${
                        difficultyFilter === diff ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1.5 bg-zinc-950/60 p-1 rounded-lg border border-zinc-900">
                  {["ALL", "SOLVED", "UNSOLVED", "STARRED","NOTED"].map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatusFilter(s)}
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold tracking-wide transition cursor-pointer ${
                        statusFilter === s ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {filteredQuestions.length > 0 ? (
                  filteredQuestions.map((q) => (
                    <QuestionCard
                      key={q.id}
                      question={q}
                      onSolveToggle={handleSolveToggle}
                      onStarToggle={handleStarToggle}
                      onOpenNotes={handleOpenNotes}
                    />
                  ))
                ) : (
                  <div className="py-12 text-center text-sm text-zinc-500 border border-zinc-900 border-dashed rounded-xl">
                    No LeetCode questions match your current filters.
                  </div>
                )}
              </div>
            </div>
          </div>

        
          <div className="space-y-8">

          
            <div className="p-6 rounded-2xl glass-panel border border-white/5 space-y-4">
              <div>
                <h2 className="text-md font-bold text-white">Compare Peer Solves</h2>
                <p className="text-xs text-zinc-500 mt-0.5">Search for student usernames to pin them to your chart</p>
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={peerSearch}
                  onChange={(e) => handlePeerSearchChange(e.target.value)}
                  placeholder="Enter student username..."
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3 pl-10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <svg className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {peerSearch.trim() !== "" && (
                <div className="border border-zinc-800 bg-zinc-950 rounded-xl overflow-hidden divide-y divide-zinc-900 max-h-40 overflow-y-auto">
                  {isSearchingPeers ? (
                    <div className="p-3 text-xs text-zinc-500 text-center">Searching...</div>
                  ) : peerResults.length > 0 ? (
                    peerResults.map((peer) => {
                      const isAlreadyPinned = pinnedUsers.some((u) => u.id === peer.id);
                      return (
                        <div key={peer.id} className="flex items-center justify-between p-2.5 text-xs">
                          <div>
                            <div className="font-semibold text-white">{peer.username}</div>
                            <div className="text-[10px] text-zinc-500 truncate max-w-[120px]">{peer.college}</div>
                          </div>
                          <button
                            onClick={() => isAlreadyPinned ? handleUnpinUser(peer.id) : handlePinUser(peer.id)}
                            className={`px-2.5 py-1 rounded font-bold cursor-pointer transition ${
                              isAlreadyPinned
                                ? "bg-red-500/10 hover:bg-red-500/20 text-red-400"
                                : "bg-indigo-600 hover:bg-indigo-500 text-white"
                            }`}
                          >
                            {isAlreadyPinned ? "Unpin" : "Pin"}
                          </button>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-3 text-xs text-zinc-500 text-center">No matching students found</div>
                  )}
                </div>
              )}

              {pinnedUsers.length > 0 && (
                <div className="pt-2 space-y-2 border-t border-zinc-800">
                  <span className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase">Pinned Students ({pinnedUsers.length})</span>
                  <div className="space-y-2">
                    {pinnedUsers.map((peer) => (
                      <div key={peer.id} className="flex items-center justify-between p-2.5 rounded-xl border border-zinc-900 bg-zinc-950/40 text-xs">
                        <div>
                          <div className="font-semibold text-white">{peer.username}</div>
                          <div className="text-[10px] text-zinc-500 truncate max-w-[120px]">{peer.college}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="font-semibold text-zinc-300">{peer.totalPoints} pts</div>
                            <div className="text-[10px] text-zinc-500">{peer.solvedCount} solved</div>
                          </div>
                          <button
                            onClick={() => handleUnpinUser(peer.id)}
                            className="p-1 rounded text-zinc-500 hover:text-red-400 hover:bg-red-500/10 cursor-pointer"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Leaderboard */}
            <div className="p-6 rounded-2xl glass-panel border border-white/5 space-y-4">
              <div>
                <h2 className="text-md font-bold text-white">Global Leaderboard</h2>
                <p className="text-xs text-zinc-500 mt-0.5">Top performing students ranking</p>
              </div>

              <div className="divide-y divide-zinc-900 max-h-[380px] overflow-y-auto pr-1">
                {leaderboard.length > 0 ? (
                  leaderboard.map((student) => {
                    const isSelf = student.id === currentUser?.id;
                    return (
                      <div key={student.id} className={`flex items-center justify-between py-3 text-xs ${isSelf ? "text-indigo-400 font-bold" : ""}`}>
                        <div className="flex items-center gap-3 min-w-0">
                          <span className={`flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center font-extrabold ${
                            student.rank === 1 ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                            student.rank === 2 ? "bg-zinc-400/10 text-zinc-300 border border-zinc-400/20" :
                            student.rank === 3 ? "bg-amber-700/10 text-amber-600 border border-amber-700/20" :
                            "text-zinc-500"
                          }`}>
                            {student.rank}
                          </span>
                          <div className="min-w-0">
                            <div className="font-semibold text-white truncate max-w-[120px]">{student.username}</div>
                            <div className="text-[10px] text-zinc-500 truncate max-w-[120px]">{student.college}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-zinc-100">{student.totalPoints} pts</div>
                          <div className="text-[9px] text-zinc-500">{student.solvedCount} solved</div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-6 text-center text-xs text-zinc-500">No ranking details registered.</div>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>

      {activeNoteQuestion && (
        <NoteModal
          isOpen={isNoteOpen}
          onClose={() => {
            setIsNoteOpen(false);
            setActiveNoteQuestion(null);
          }}
          questionTitle={activeNoteQuestion.title}
          initialNotes={activeNoteQuestion.notes}
          onSave={handleSaveNotes}
        />
      )}
    </div>
  );
}