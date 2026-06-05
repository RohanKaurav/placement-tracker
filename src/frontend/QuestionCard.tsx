"use client";

import { useState } from "react";

export interface QuestionType {
  id: string;
  title: string;
  url: string;
  difficulty: string; 
  points: number;
  isSolved: boolean;
  isStarred: boolean;
  notes: string | null;
  solvedAt: Date | null | string;
}

interface QuestionCardProps {
  question: QuestionType;
  onSolveToggle: (id: string) => Promise<void>;
  onStarToggle: (id: string) => Promise<void>;
  onOpenNotes: (q: QuestionType) => void;
}

export default function QuestionCard({
  question,
  onSolveToggle,
  onStarToggle,
  onOpenNotes,
}: QuestionCardProps) {
  const [isSolving, setIsSolving] = useState(false);
  const [isStarring, setIsStarring] = useState(false);

  const handleSolve = async () => {
    setIsSolving(true);
    try {
      await onSolveToggle(question.id);
    } finally {
      setIsSolving(false);
    }
  };

  const handleStar = async () => {
    setIsStarring(true);
    try {
      await onStarToggle(question.id);
    } finally {
      setIsStarring(false);
    }
  };


  let difficultyBadgeClass = "";
  if (question.difficulty === "EASY") {
    difficultyBadgeClass = "bg-green-500/10 text-green-400 border-green-500/20";
  } else if (question.difficulty === "MEDIUM") {
    difficultyBadgeClass = "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
  } else if (question.difficulty === "HARD") {
    difficultyBadgeClass = "bg-red-500/10 text-red-400 border-red-500/20";
  }

  return (
    <div 
      className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border transition-all duration-200 gap-4 ${
        question.isSolved 
          ? "bg-zinc-900/30 border-zinc-800/60 opacity-80 " 
          : "bg-zinc-900/60 border-zinc-800/80 hover:border-zinc-700/80 hover:bg-zinc-900/80"
      }`}
    >
      
      
      <div className="flex items-center gap-3.5 min-w-0">
       
        <button
          onClick={handleSolve}
          disabled={isSolving}
          className={`flex-shrink-0 h-6 w-6 rounded-lg border-2 flex items-center justify-center transition cursor-pointer disabled:opacity-50 ${
            question.isSolved
              ? "bg-indigo-600 border-indigo-600 text-white"
              : "border-zinc-700 bg-zinc-900 hover:border-indigo-500/50"
          }`}
          title={question.isSolved ? "Mark as Unsolved" : "Mark as Solved"}
        >
          {question.isSolved && (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

      
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            
            <span className={`text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full border ${difficultyBadgeClass}`}>
              {question.difficulty}
            </span>
          
            <span className="text-[10px] font-semibold text-zinc-500 bg-zinc-800/50 px-1.5 py-0.5 rounded border border-zinc-800/40">
              +{question.points} pts
            </span>
          </div>

          <a
            href={question.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-sm font-semibold hover:text-indigo-400 hover:underline transition truncate block max-w-full ${
              question.isSolved ? "text-zinc-400 line-through" : "text-white"
            }`}
            title="Open LeetCode problem in a new tab"
          >
            {question.title}
            <span className="inline-block ml-1 text-zinc-600 font-normal">↗</span>
          </a>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2.5 sm:self-center">
        
       
        <button
          onClick={handleStar}
          disabled={isStarring}
          className={`p-2 rounded-lg border transition cursor-pointer disabled:opacity-50 ${
            question.isStarred
              ? "bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20"
              : "bg-zinc-800/40 border-zinc-800/60 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800"
          }`}
          title={question.isStarred ? "Remove Star" : "Star Problem for Review"}
        >
          <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>

        <button
          onClick={() => onOpenNotes(question)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-semibold transition cursor-pointer ${
            question.notes
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
              : "bg-zinc-800/40 border-zinc-800/60 text-zinc-400 hover:text-white hover:bg-zinc-800"
          }`}
          title="Add or Edit Revision Notes"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span className="hidden sm:inline">{question.notes ? "Edit Note" : "Add Note"}</span>
        </button>

      </div>
    </div>
  );
}
