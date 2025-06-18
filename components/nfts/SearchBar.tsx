"use client";

import React, { useState, useCallback } from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch?: (term: string, filter: string) => void;
}

interface FilterOption {
  id: string;
  label: string;
}

// Move static data outside component
const FILTERS: FilterOption[] = [
  { id: "all", label: "All" },
  { id: "notable", label: "Notable Collection" },
  { id: "art", label: "Art" },
] as const;

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  // Memoize search callback to prevent unnecessary re-renders
  const triggerSearch = useCallback((term: string, filter: string) => {
    onSearch?.(term, filter);
  }, [onSearch]);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    triggerSearch(searchTerm, activeFilter);
  }, [searchTerm, activeFilter, triggerSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterClick = useCallback((filterId: string) => {
    setActiveFilter(filterId);
    triggerSearch(searchTerm, filterId);
  }, [searchTerm, triggerSearch]);

  return (
    <div className="w-full mb-16">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        {/* Search Input */}
        <div className="relative flex-grow">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search collections, creators, or NFTs..."
                className="block w-full pl-10 pr-3 py-2 bg-[#2A1E35] border border-[#3A2E45] rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-colors"
                value={searchTerm}
                onChange={handleInputChange}
              />
            </div>
          </form>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2">
          {FILTERS.map((filter) => (
            <button
              key={filter.id}
              onClick={() => handleFilterClick(filter.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeFilter === filter.id
                  ? "bg-cyan-400 text-black"
                  : "bg-[#2A1E35] text-gray-300 hover:bg-cyan-400/20 hover:text-cyan-400 border border-transparent hover:border-cyan-400/30"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;