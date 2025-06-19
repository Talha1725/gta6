import React from 'react';
import { DataTableProps } from '@/types';

const DataTable: React.FC<DataTableProps> = ({
  data,
  currentType,
  getStatusColor,
  formatDate,
}) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700/50">
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Plan</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Status</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Amount</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Customer ID</th>
              {currentType !== 'onetime' && (
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">End Date</th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={`${item.customerId}-${index}`} className="hover:bg-gray-700/20 transition-colors">
                <td className="px-6 py-4 text-sm text-white">{item.plan}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-white">
                  ${item.amount.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-400 font-mono">
                  {item.customerId.length > 20 ? `${item.customerId.slice(0, 20)}...` : item.customerId}
                </td>
                {currentType !== 'onetime' && (
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {item.endDate ? formatDate(item.endDate) : 'N/A'}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable; 