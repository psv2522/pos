"use client";
import { useState } from "react";

// Placeholder Data
const criteria = [
  { name: "Creating Wireframes", type: "score" },
  { name: "Creating Basic Prototypes", type: "score" },
  { name: "Creation of Brands", type: "score" },
  { name: "Applying Color Theory", type: "score" },
  { name: "Using Figma for Design", type: "score" },
  { name: "Application of Typography", type: "score" },
  { name: "Creating Effective Icons", type: "score" },
  { name: "Optimizing Touch Points", type: "score" },
  { name: "Addressing User Pain Points", type: "score" },
  { name: "Conducting User Research", type: "score" },
  { name: "Applying Questioning Skills", type: "score" },
  { name: "Conducting Heuristic Evaluation", type: "score" },
  { name: "Gathering User Feedback", type: "score" },
  { name: "Conducting Usability Tests", type: "score" },
  { name: "Creating User Personas", type: "score" },
  { name: "Conducting Market Research", type: "score" },
  { name: "Crafting Effective Questions", type: "score" },
  { name: "Creating Effective Surveys", type: "score" },
  { name: "Creating Sitemaps", type: "score" },
  { name: "Designing User Flows", type: "score" },
];

// Generate more realistic placeholder data based on the image ranges
const generateCandidates = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `AB${i + 1}`,
    avatar: "/avatar-placeholder.png",
    data: {
      "Creating Wireframes": Math.floor(Math.random() * 5),
      "Creating Basic Prototypes": Math.floor(Math.random() * 5),
      "Creation of Brands": Math.floor(Math.random() * 5),
      "Applying Color Theory": Math.floor(Math.random() * 5),
      "Using Figma for Design": Math.floor(Math.random() * 5),
      "Application of Typography": Math.floor(Math.random() * 5),
      "Creating Effective Icons": Math.floor(Math.random() * 5),
      "Optimizing Touch Points": Math.floor(Math.random() * 5),
      "Addressing User Pain Points": Math.floor(Math.random() * 5),
      "Conducting User Research": Math.floor(Math.random() * 5),
      "Applying Questioning Skills": Math.floor(Math.random() * 5),
      "Conducting Heuristic Evaluation": Math.floor(Math.random() * 5),
      "Gathering User Feedback": Math.floor(Math.random() * 5),
      "Conducting Usability Tests": Math.floor(Math.random() * 5),
      "Creating User Personas": Math.floor(Math.random() * 5),
      "Conducting Market Research": Math.floor(Math.random() * 5),
      "Crafting Effective Questions": Math.floor(Math.random() * 5),
      "Creating Effective Surveys": Math.floor(Math.random() * 5),
      "Creating Sitemaps": Math.floor(Math.random() * 5),
      "Designing User Flows": Math.floor(Math.random() * 5),
    },
  }));
};

const TOTAL_CANDIDATES = 23;
const candidates = generateCandidates(TOTAL_CANDIDATES);
const CANDIDATES_PER_PAGE = 15;
const totalPages = Math.ceil(TOTAL_CANDIDATES / CANDIDATES_PER_PAGE);

const startIndex = 0;
const endIndex = startIndex + CANDIDATES_PER_PAGE;
const displayedCandidates = candidates.slice(startIndex, endIndex);

// Updated score colors to better match the image
const getScoreColor = (score: number): string => {
  if (score === 0) return "bg-[#ecfff1]";
  if (score === 1) return "bg-[#f8f7ac]";
  if (score === 2) return "bg-[#a5d773]";
  if (score === 3) return "bg-[#249349]";
  if (score === 4) return "bg-[#054118]";
  return "bg-gray-100";
};

const ComparisonMatrix = () => {
  return (
    <div className="bg-white p-4 pl-8 border-t border-black">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="flex">
            <div className="w-60 flex-shrink-0 mr-1 pt-[52px]">
              {criteria.map((criterion) => (
                <div
                  key={criterion.name}
                  className={`h-8 flex items-center text-xs ${
                    criterion.type === "number"
                      ? "font-semibold text-gray-700"
                      : "text-gray-600"
                  } pr-2 whitespace-nowrap`}
                >
                  {criterion.name}
                </div>
              ))}
            </div>

            <div className="flex">
              {displayedCandidates.map((candidate) => (
                <div key={candidate.id} className="w-10 flex-shrink-0 mx-px">
                  <div className="h-4 flex items-center justify-center mb-1 rotate-315">
                    <span className="text-[10px] text-gray-500 whitespace-nowrap">
                      {candidate.id}
                    </span>
                  </div>
                  <div className="h-10 flex items-center justify-center">
                    <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-[10px] font-medium text-gray-500">
                      {candidate.id.substring(0, 2)}
                    </div>
                  </div>

                  {criteria.map((criterion) => (
                    <div
                      key={`${candidate.id}-${criterion.name}`}
                      className="h-8 flex items-center justify-center"
                    >
                      {criterion.type === "number" ? (
                        <span className="text-xs font-semibold text-gray-700">
                          {
                            candidate.data[
                              criterion.name as keyof typeof candidate.data
                            ]
                          }
                        </span>
                      ) : (
                        <div
                          className={`w-9 h-6 ${getScoreColor(
                            candidate.data[
                              criterion.name as keyof typeof candidate.data
                            ]
                          )}`}
                        ></div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonMatrix;
