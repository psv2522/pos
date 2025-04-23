import React from "react";
import ComparisonMatrix from "./ComparisonMatrix"; // Will create this next
import { ArrowLeft, ArrowRight } from "lucide-react";
import Header from "./Header";
import Sidebar from "./Sidebar";

const MainContent = () => {
  return (
    <main className="flex-1 overflow-y-auto py-6 bg-white">
      <Header />
      <div className="flex  ">
        <Sidebar />
        <div className="flex flex-col">
          <div className="flex justify-between items-center">
            {/* Tabs */}
            <div className="inline-flex border border-black">
              <button className="px-4 py-1 text-sm font-medium text-white bg-[#299458] border-r border-black">
                Compare View
              </button>
              <button className="px-4 py-1 text-sm font-medium text-gray-600 bg-white hover:bg-gray-100 border-r border-black">
                Individual view
              </button>
              <button className="px-4 py-1 text-sm font-medium text-gray-600 bg-white hover:bg-gray-100">
                Shortlisted candidates
              </button>
            </div>
          </div>
          <ComparisonMatrix />
        </div>
      </div>
    </main>
  );
};

export default MainContent;
