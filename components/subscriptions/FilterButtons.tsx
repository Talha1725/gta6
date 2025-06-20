import React from 'react';
import { FilterButtonsProps } from '@/types';

const FilterButtons: React.FC<FilterButtonsProps> = ({
  currentType,
  onTypeChange,
  getTypeDisplayName,
}) => {
  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2">
        {(['all', 'subscriptions', 'onetime'] as const).map((type) => (
          <button
            key={type}
            onClick={() => onTypeChange(type)}
            className={`px-4 py-2 rounded-lg transition-all duration-300 ${
              currentType === type
                ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white'
                : 'bg-gray-800/50 text-white hover:bg-gray-700/50'
            }`}
          >
            {getTypeDisplayName(type)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterButtons; 