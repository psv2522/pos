import React from "react";
import { ArrowLeft, ArrowRight, ChevronLeft } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-white p-4 ml-10 flex justify-between">
      <div>
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <ChevronLeft size={16} className="mr-1 text-[#707070]" />
          <span>Back to My Jobs</span>
        </div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Posk_UXdesigner_sr001
        </h1>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600">23 Candidates</span>
        <button className="p-1 border border-gray-300 rounded hover:bg-gray-100">
          <ArrowLeft size={18} className="text-gray-600" />
        </button>
        <button className="p-1 border border-gray-300 rounded hover:bg-gray-100">
          <ArrowRight size={18} className="text-gray-600" />
        </button>
      </div>
    </header>
  );
};

export default Header;
