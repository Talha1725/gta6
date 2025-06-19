import React from 'react';
import { PaginationProps } from '@/types';

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  hasPrevPage,
  hasNextPage,
  onPageChange,
}) => {
  return (
    <div className="mt-6 flex justify-center items-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrevPage}
        className={`px-3 py-2 rounded-lg transition-all duration-300 ${
          hasPrevPage
            ? 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
            : 'bg-gray-900/50 text-gray-600 cursor-not-allowed'
        }`}
      >
        Previous
      </button>

      <div className="flex gap-1">
        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
          // Show pages around current page
          let pageNum;
          if (totalPages <= 5) {
            pageNum = i + 1;
          } else {
            const start = Math.max(1, currentPage - 2);
            const end = Math.min(totalPages, start + 4);
            pageNum = start + i;
            if (pageNum > end) return null;
          }

          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`px-3 py-2 rounded-lg transition-all duration-300 ${
                pageNum === currentPage
                  ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white'
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
              }`}
            >
              {pageNum}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNextPage}
        className={`px-3 py-2 rounded-lg transition-all duration-300 ${
          hasNextPage
            ? 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
            : 'bg-gray-900/50 text-gray-600 cursor-not-allowed'
        }`}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination; 