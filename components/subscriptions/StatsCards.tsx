import React from 'react';
import { StatsCardsProps } from '@/types';

const StatsCards: React.FC<StatsCardsProps> = ({ data, getTypeDisplayName }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
        <h3 className="text-gray-400 text-sm">Total {getTypeDisplayName(data.type)}</h3>
        <p className="text-2xl font-bold text-white mt-2">
          {data.pagination.total}
        </p>
      </div>
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
        <h3 className="text-gray-400 text-sm">Total Amount (Current Page)</h3>
        <p className="text-2xl font-bold text-white mt-2">
          ${data.data.reduce((sum, item) => sum + item.amount, 0).toFixed(2)}
        </p>
      </div>
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
        <h3 className="text-gray-400 text-sm">Active Subscriptions (Current Page)</h3>
        <p className="text-2xl font-bold text-white mt-2">
          {data.data.filter((item) => item.endDate && item.status === "completed").length}
        </p>
      </div>
    </div>
  );
};

export default StatsCards; 