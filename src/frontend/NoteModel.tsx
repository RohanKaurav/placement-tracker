"use client";

import { useState, useEffect, FormEvent } from "react";

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  questionTitle: string;
  initialNotes: string | null;
  onSave: (notes: string | null) => Promise<void>;
}

export default function NoteModal({
  isOpen,
  onClose,
  questionTitle,
  initialNotes,
  onSave,
}: NoteModalProps) {
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  
  useEffect(() => {
    if (isOpen) {
      setNotes(initialNotes || "");
    }
  }, [isOpen, initialNotes]);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
     
      await onSave(notes.trim() === "" ? null : notes.trim());
      onClose();
    } catch (error) {
      console.error("Failed to save notes:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
     
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      
      <div className="relative w-full max-w-lg rounded-2xl glass-panel border border-white/10 shadow-[0_0_50px_rgba(99,102,241,0.2)] p-6 z-10">
        
       
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Revision Notes</span>
            <h3 className="text-lg font-bold text-white max-w-[360px] truncate">{questionTitle}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white rounded-lg p-1.5 hover:bg-zinc-800/50 transition cursor-pointer"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

  
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-zinc-300 mb-2">
              Write down your approach, tricks, or complexity details here:
            </label>
            <textarea
              id="notes"
              rows={6}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Used the Two-Pointer approach. Key trick is to sort the array first. Time Complexity: O(N log N)."
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 resize-none font-sans"
            />
          </div>

          <div className="text-xs text-zinc-500 bg-zinc-900/40 border border-zinc-800/40 rounded-lg p-3 leading-relaxed">
            💡 **Tip**: Good notes help you review quickly before interviews. Write down edge cases or why you got stuck!
          </div>

      
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white bg-transparent hover:bg-zinc-800 border border-zinc-800 rounded-xl transition duration-200 disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-xl shadow-md transition duration-200 disabled:opacity-50 hover:shadow-[0_0_15px_rgba(99,102,241,0.2)] cursor-pointer"
            >
              {isSaving ? "Saving..." : "Save Note"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
