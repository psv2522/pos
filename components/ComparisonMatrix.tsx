"use client";
import { useState, useEffect } from "react";
import { Filter, X } from "lucide-react"; // Import Filter icon

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

// Extract just the names for the filter
const allSkillNames = criteria.map((c) => c.name);

// Interface for the detailed candidate data expected from the /people/{id} endpoint
interface FetchedSkillData {
  id: string; // candidate id
  name: string; // Candidate name
  email: string;
  phone: string;
  address: string;
  bio: string;
  // The skillset data is nested under data.data
  data?: {
    data?: {
      skillset?: {
        id: string;
        name: string; // Skillset group name like "Typography"
        skills: {
          id: string;
          name: string; // Specific skill name like "Application of Typography"
          pos?: {
            id: string;
            consensus_score?: number; // The score we need
            sVs?: any[]; // Don't need details of validators for this component
          }[];
        }[];
      }[];
    };
  };
  // user_data is part of the response but not directly needed here as id/name are top-level
  user_data?: any;
}

// Interface for the processed data used by the component
interface ProcessedCandidateData {
  id: string; // Use candidate's actual ID
  name: string; // Candidate's name
  scores: { [key: string]: number }; // Map criteria name to consensus score
}

interface ComparisonMatrixProps {
  selectedCandidateIds: string[]; // Expecting an array of candidate IDs
}

const getScoreColor = (score: number | undefined): string => {
  if (score === undefined || score === null) return "bg-gray-100"; // Handle missing scores
  if (score <= 0) return "bg-[#ecfff1]"; // Adjusted range slightly
  if (score === 1) return "bg-[#f8f7ac]";
  if (score === 2) return "bg-[#a5d773]";
  if (score === 3) return "bg-[#249349]";
  if (score >= 4) return "bg-[#054118]"; // Scores 4 and above
  return "bg-gray-100";
};

// Function to get initials (assuming name is available)
const getInitials = (name: string): string => {
  const names = name?.split(" ") ?? ["?"];
  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase();
  }
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};

const ComparisonMatrix = ({ selectedCandidateIds }: ComparisonMatrixProps) => {
  const [processedData, setProcessedData] = useState<ProcessedCandidateData[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  // State for the filter
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]); // Initially show all
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!selectedCandidateIds || selectedCandidateIds.length === 0) {
      setProcessedData([]);
      setLoading(false);
      setError(null);
      return;
    }

    const fetchAllCandidateDetails = async () => {
      setLoading(true);
      setError(null);
      setProcessedData([]); // Clear previous data

      try {
        const promises = selectedCandidateIds.map(async (id) => {
          // --- Fetch data from the correct /people/{id} endpoint ---
          const response = await fetch(
            `https://forinterview.onrender.com/people/${id}` // Correct endpoint
          );
          if (!response.ok) {
            // Handle error fetching details for this ID
            console.error(
              `HTTP error for ID ${id}! status: ${response.status}`
            );
            // Return a minimal object for this candidate on error
            return {
              id: id,
              name: `Cand. ${id.substring(0, 4)}`, // Basic name fallback
              scores: {},
            };
          }
          const detailedData: FetchedSkillData = await response.json();

          // --- Process the fetched data using the correct structure ---
          const scores: { [key: string]: number } = {};
          // Navigate the correct structure: data -> data -> skillset array
          detailedData.data?.data?.skillset?.forEach((skillSet) => {
            skillSet.skills.forEach((skill) => {
              // Check pos array and consensus_score existence
              if (
                skill.pos &&
                skill.pos.length > 0 &&
                skill.pos[0].consensus_score !== undefined &&
                skill.pos[0].consensus_score !== null // Also check for null
              ) {
                // Use the first consensus score found for the skill
                scores[skill.name] = skill.pos[0].consensus_score;
              }
            });
          });

          // Extract ID and Name directly from the top level
          const candidateId = detailedData.id ?? id; // Use fetched ID or fallback
          const candidateName =
            detailedData.name ?? `Candidate ${id.substring(0, 4)}`; // Use fetched name or fallback

          return { id: candidateId, name: candidateName, scores };
        });

        const results = await Promise.all(promises);
        // Filter out any null results from failed fetches if necessary, though the error handling above should prevent nulls
        setProcessedData(
          results.filter((r) => r !== null) as ProcessedCandidateData[]
        );
      } catch (e) {
        console.error("Failed to fetch or process candidate details:", e);
        setError(
          e instanceof Error
            ? `Failed to load details: ${e.message}. Some data might be missing.`
            : "An unexpected error occurred."
        );
        // Attempt to show minimal data for candidates even if processing fails broadly
        // This relies on the individual error handling within the map returning minimal objects
        const minimalData = selectedCandidateIds.map((id) => ({
          id: id,
          name: `Cand. ${id.substring(0, 4)}`,
          scores: {},
        }));
        setProcessedData(minimalData);
      } finally {
        setLoading(false);
      }
    };

    fetchAllCandidateDetails();
  }, [selectedCandidateIds]); // Re-run effect when selected IDs change

  // Filter the criteria based on selectedSkills
  const filteredCriteria =
    selectedSkills.length > 0
      ? criteria.filter((c) => selectedSkills.includes(c.name))
      : criteria; // Show all if no filter is selected

  // Handle toggling skills in the filter
  const handleSkillToggle = (skillName: string) => {
    setSelectedSkills(
      (prev) =>
        prev.includes(skillName)
          ? prev.filter((s) => s !== skillName) // Remove skill
          : [...prev, skillName] // Add skill
    );
  };

  // Handle clearing all filters
  const clearFilters = () => {
    setSelectedSkills([]);
    setIsFilterOpen(false); // Close filter dropdown as well
  };

  return (
    // Adjusted padding and added relative positioning for filter
    <div className="bg-white p-4 border-t border-black relative min-h-[400px]">
      {error && (
        <div className="text-center p-4 text-red-500 mt-12">{error}</div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-20">
          <div className="text-gray-500">Loading candidate data...</div>
        </div>
      )}

      {/* Message when no candidates are selected */}
      {!loading && selectedCandidateIds.length === 0 && !error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block bg-green-600 text-white text-sm font-semibold px-6 py-3 rounded shadow-md">
              Select candidate to compare
            </div>
          </div>
        </div>
      )}

      {/* Message when candidates are selected but data loading failed for all */}
      {!loading &&
        processedData.length === 0 &&
        selectedCandidateIds.length > 0 &&
        !error && (
          <div className="text-center p-4 text-gray-500 mt-12">
            No data loaded for selected candidates. Endpoint might be incorrect
            or data unavailable.
          </div>
        )}

      {/* Matrix Display */}
      {!loading && processedData.length > 0 && (
        // Added top margin to avoid overlap with filter button
        <div className="overflow-x-auto mt-12">
          <div className="inline-block min-w-full align-middle">
            <div className="flex pl-8">
              <div className="absolute top-4 left-4 z-10">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center px-3 py-1.5 border border-gray-300 rounded bg-white text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500"
                  aria-haspopup="true"
                  aria-expanded={isFilterOpen}
                >
                  <Filter size={14} className="mr-1.5" />
                  Filter{" "}
                  {selectedSkills.length > 0
                    ? `(${selectedSkills.length})`
                    : ""}
                </button>
                {isFilterOpen && (
                  <div className="absolute left-0 mt-2 w-72 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none max-h-80 overflow-y-auto">
                    <div
                      className="py-1"
                      role="menu"
                      aria-orientation="vertical"
                    >
                      <div className="flex justify-between items-center px-4 py-2 border-b border-gray-200">
                        <span className="text-sm font-medium text-gray-900">
                          Filter Skills
                        </span>
                        {selectedSkills.length > 0 && (
                          <button
                            onClick={clearFilters}
                            className="text-xs text-indigo-600 hover:text-indigo-800"
                          >
                            Clear All
                          </button>
                        )}
                      </div>
                      {allSkillNames.map((skillName) => (
                        <label
                          key={skillName}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                          role="menuitemcheckbox"
                          aria-checked={selectedSkills.includes(skillName)}
                        >
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 mr-3"
                            checked={selectedSkills.includes(skillName)}
                            onChange={() => handleSkillToggle(skillName)}
                          />
                          {skillName}
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>{" "}
              {/* Added padding-left here */}
              {/* Criteria Column */}
              {/* Adjusted width, removed pt-[52px], added padding-top */}
              <div className="w-60 flex-shrink-0 mr-1 pt-12">
                {filteredCriteria.map((criterion) => (
                  <div
                    key={criterion.name}
                    className="h-8 flex items-center text-xs text-gray-600 pr-2 whitespace-nowrap"
                    title={criterion.name}
                  >
                    {criterion.name}
                  </div>
                ))}
              </div>
              {/* Candidate Columns */}
              <div className="flex">
                {processedData.map((candidate) => (
                  <div key={candidate.id} className="w-10 flex-shrink-0 mx-px">
                    {/* Candidate ID Rotated */}
                    <div className="h-4 flex items-center justify-center mb-1 rotate-315">
                      <span
                        className="text-[10px] text-gray-500 whitespace-nowrap"
                        title={`ID: ${candidate.id}`}
                      >
                        A.B
                      </span>
                    </div>
                    {/* Candidate Initials/Avatar */}
                    <div
                      className="h-10 flex items-center justify-center"
                      title={candidate.name}
                    >
                      <div className="w-4 h-4 bg-gray-200 border border-gray-300 rounded-full flex items-center justify-center text-[10px] font-medium text-gray-600"></div>
                    </div>

                    {/* Score Cells */}
                    {filteredCriteria.map((criterion) => (
                      <div
                        key={`${candidate.id}-${criterion.name}`}
                        className="h-8 flex items-center justify-center"
                      >
                        <div
                          className={`w-9 h-6 ${getScoreColor(
                            candidate.scores[criterion.name] // Get score from processed data
                          )} border border-gray-200`} // Add subtle border
                          title={`${criterion.name}: ${
                            candidate.scores[criterion.name] ?? "N/A"
                          }`} // Add tooltip for score
                        ></div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComparisonMatrix;
