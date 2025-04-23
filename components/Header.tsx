"use client";
import React, { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, ChevronLeft } from "lucide-react";

const Header = () => {
  const [candidateCount, setCandidateCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("https://forinterview.onrender.com/people/")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCandidateCount(data.length);
        } else {
          console.error("API did not return an array:", data);
          setCandidateCount(0); // Or handle error appropriately
        }
      })
      .catch((error) => {
        console.error("Error fetching candidates:", error);
        setCandidateCount(0); // Or handle error appropriately
      });
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <header className="bg-white p-4 ml-10 flex justify-between">
      <div>
        <div className="flex items-center text-sm text-gray-600 mb-4">
          <ChevronLeft size={16} className="mr-1 text-[#707070]" />
          <span>Back to My Jobs</span>
        </div>
        <h1 className="text-3xl font-semibold text-gray-500 ml-4">
          Posk_UXdesigner_sr001
        </h1>
      </div>
      <div className="flex flex-col items-center space-x-2">
        <span className="text-sm text-gray-600">
          {candidateCount !== null
            ? `${candidateCount} Candidates`
            : "Loading..."}
        </span>
        <div className="flex items-center space-x-2">
          <button className="p-2 border border-b-3 border-r-3 border-black  rounded hover:bg-gray-100 flex items-center justify-center">
            <ArrowLeft size={18} className="text-gray-600" />
          </button>
          <button className="p-2 border border-b-3 border-r-3 border-black  rounded hover:bg-gray-100 flex items-center justify-center">
            <ArrowRight size={18} className="text-gray-600" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
