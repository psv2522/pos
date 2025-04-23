"use client";
import React, { useState } from "react";
import ComparisonMatrix from "./ComparisonMatrix"; // Will create this next
import Header from "./Header";
import Sidebar from "./Sidebar";

const MainContent = () => {
  // State to hold the IDs of selected candidates
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Function to toggle a candidate's selection status
  const handleToggleCandidate = (id: string) => {
    setSelectedIds((prevIds) => {
      const newIds = new Set(prevIds);
      if (newIds.has(id)) {
        newIds.delete(id);
      } else {
        newIds.add(id);
      }
      return newIds;
    });
  };

  // Convert Set to Array for ComparisonMatrix
  const selectedIdsArray = Array.from(selectedIds);

  return (
    <main className="flex-1 overflow-y-auto py-6 bg-white">
      <Header />
      <div className="flex gap-10">
        <Sidebar
          selectedCandidateIds={selectedIds}
          onToggleCandidate={handleToggleCandidate}
        />
        <div className="flex flex-col w-full">
          <div className="flex justify-between items-center">
            {/* Tabs */}
            <div className="inline-flex border border-black">
              <button className="px-4 py-1 text-sm font-medium text-white bg-[#299458] border-r border-black">
                Compare View
              </button>
              <button className="px-4 py-1 text-sm font-semibold text-black bg-white hover:bg-gray-100 border-r border-black">
                Individual view
              </button>
              <button className="px-4 py-1 text-sm font-semibold text-black bg-white hover:bg-gray-100">
                Shortlisted candidates
              </button>
            </div>
          </div>
          <ComparisonMatrix selectedCandidateIds={selectedIdsArray} />
        </div>
      </div>
    </main>
  );
};

export default MainContent;
