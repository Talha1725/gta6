"use client";

import React from "react";

interface FilterTab {
  id: string;
  label: string;
}

interface FilterTabsProps {
  tabs: FilterTab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const FilterTabs: React.FC<FilterTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="flex space-x-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === tab.id
              ? "bg-purple-600 text-white"
              : "bg-purple-900/30 text-gray-300 hover:bg-purple-800/50 hover:text-white"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default FilterTabs;
