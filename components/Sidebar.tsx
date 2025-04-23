"use client";
import React, { useState, useEffect } from "react";
import { PlusCircle, CheckCircle } from "lucide-react";

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  bio: string;
}

const getInitials = (name: string): string => {
  const names = name.split(" ");
  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase();
  }
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};

const Sidebar = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [addedCandidates, setAddedCandidates] = useState<Set<string>>(
    new Set()
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCandidates = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          "https://forinterview.onrender.com/people/"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Candidate[] = await response.json();
        setCandidates(data);
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("An unexpected error occurred");
        }
        console.error("Failed to fetch candidates:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  const handleToggleCandidate = (id: string) => {
    setAddedCandidates((prev) => {
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });
  };

  const availableCandidates = candidates.filter(
    (c) => !addedCandidates.has(c.id)
  );
  const selectedCandidates = candidates.filter((c) =>
    addedCandidates.has(c.id)
  );

  return (
    <aside className="w-64 bg-white border-b border-black flex flex-col">
      <div className="p-4 border-t border-b border-black">
        <h2 className="font-semibold text-gray-800">Most recommended</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {loading && (
          <div className="p-4 text-center text-gray-500">Loading...</div>
        )}
        {error && (
          <div className="p-4 text-center text-red-500">Error: {error}</div>
        )}
        {!loading && !error && (
          <>
            {/* Selected Candidates Section (Now at the top) */}
            <div className="p-4 space-y-3 opacity-50">
              {selectedCandidates.map((candidate) => (
                <div
                  key={candidate.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 border border-black rounded-full flex items-center justify-center font-semibold text-xs">
                      {getInitials(candidate.name)}
                    </div>
                    <span className="text-sm font-medium text-gray-800">
                      {candidate.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Separator and Text */}
            <div className="px-4 py-2 border-t border-b border-black">
              <p className="text-xs text-gray-600 bg-gray-100 p-2 rounded">
                Recommendations are based on your skill requirements and
                candidate's performance.
              </p>
            </div>

            {/* Available Candidates Section (Now at the bottom) */}
            <div className="p-4 space-y-3">
              {availableCandidates.map((candidate) => (
                <div
                  key={candidate.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-white border border-gray-800 rounded-full flex items-center justify-center font-semibold text-xs text-gray-800">
                      {getInitials(candidate.name)}
                    </div>
                    <span className="text-sm font-medium text-gray-800">
                      {candidate.name}
                    </span>
                  </div>
                  <button
                    className="p-1 rounded text-[#978afa] hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleToggleCandidate(candidate.id)}
                    aria-label={`Add ${candidate.name}`}
                  >
                    <PlusCircle size={18} />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
