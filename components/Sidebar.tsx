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

// Props for Sidebar
interface SidebarProps {
  selectedCandidateIds: Set<string>; // Receive selected IDs from parent
  onToggleCandidate: (id: string) => void; // Function to notify parent of selection change
}

const getInitials = (name: string): string => {
  const names = name.split(" ");
  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase();
  }
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};

// Accept props
const Sidebar = ({ selectedCandidateIds, onToggleCandidate }: SidebarProps) => {
  const [allCandidates, setAllCandidates] = useState<Candidate[]>([]);
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
        setAllCandidates(data);
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

  // Filter candidates based on the selectedCandidateIds prop
  const availableCandidates = allCandidates.filter(
    (c) => !selectedCandidateIds.has(c.id)
  );
  const selectedCandidates = allCandidates.filter((c) =>
    selectedCandidateIds.has(c.id)
  );

  return (
    <aside className="w-80 bg-white border-b border-r border-black flex flex-col">
      <div className="p-4 border-t border-b border-black">
        <h2 className="font-semibold text-gray-800">Most Recommended</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {loading && (
          <div className="p-4 text-center text-gray-500">Loading...</div>
        )}
        {error && (
          <div className="p-4 text-center text-red-500">
            Error fetching list: {error}
          </div>
        )}
        {!loading && !error && (
          <>
            {/* Selected Candidates Section */}
            {selectedCandidates.length > 0 && (
              <div className="p-4 space-y-3 border-b border-gray-200">
                {selectedCandidates.map((candidate) => (
                  <div
                    key={candidate.id}
                    className="flex items-center justify-between group"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-indigo-100 text-[#978afa] border border-[#978afa] rounded-full flex items-center justify-center font-semibold text-xs">
                        {getInitials(candidate.name)}
                      </div>
                      <span className="text-sm font-medium text-gray-800">
                        {candidate.name}
                      </span>
                    </div>
                    {/* Add a button to remove from comparison? Optional */}
                    <button
                      className="p-1 rounded text-red-500 hover:bg-red-100 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => onToggleCandidate(candidate.id)} // Use the prop function
                      aria-label={`Remove ${candidate.name} from comparison`}
                    >
                      <CheckCircle size={18} />{" "}
                      {/* Using CheckCircle to indicate "selected", click removes */}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Available Candidates Section */}
            {availableCandidates.length > 0 && (
              <div className="p-4 space-y-3">
                <h3 className="text-xs font-medium text-gray-500 mb-2">
                  Available Candidates
                </h3>
                {availableCandidates.map((candidate) => (
                  <div
                    key={candidate.id}
                    className="flex items-center justify-between group"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-white border border-gray-400 rounded-full flex items-center justify-center font-semibold text-xs text-gray-600">
                        {getInitials(candidate.name)}
                      </div>
                      <span className="text-sm font-medium text-gray-800">
                        {candidate.name}
                      </span>
                    </div>
                    <button
                      className="p-1 rounded text-[#978afa] hover:bg-gray-100 cursor-pointer transition-opacity"
                      onClick={() => onToggleCandidate(candidate.id)} // Use the prop function
                      aria-label={`Add ${candidate.name} to comparison`}
                    >
                      <PlusCircle size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {availableCandidates.length === 0 &&
              selectedCandidates.length === 0 &&
              !loading && (
                <div className="p-4 text-center text-gray-500">
                  No candidates found.
                </div>
              )}
          </>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
