'use client';

import { useState, useEffect } from 'react';

interface Preorder {
  preorderId: number;
  emailAddress: string;
  emailStatus: string;
  subscribedAt: string;
  preorderStatus: string;
  notes: string;
  preorderCreatedAt: string;
}

export default function LatestPreorders() {
  const [preorders, setPreorders] = useState<Preorder[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchLatestPreorders();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchLatestPreorders, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchLatestPreorders = async () => {
    try {
      const response = await fetch('/api/preorders/latest');
      const data = await response.json();
      
      if (data.success) {
        setPreorders(data.data);
        setTotal(data.total);
      }
    } catch (error) {
      console.error('Error fetching preorders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'interested': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'converted': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  if (loading) {
    return (
      <div className="bg-black/80 rounded-lg border border-green-500 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded mb-4 w-1/3"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black/80 rounded-lg border border-green-500 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-green-400 flex items-center">
          🎮 Latest GTA 6 Pre-Orders
        </h2>
        <div className="flex items-center space-x-2">
          <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {total} Total
          </span>
          <button
            onClick={fetchLatestPreorders}
            className="text-green-400 hover:text-green-300 text-sm"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {preorders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400">No pre-orders yet. Be the first! 🚀</p>
        </div>
      ) : (
        <div className="space-y-3">
          {preorders.map((preorder, index) => (
            <div 
              key={preorder.preorderId}
              className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 hover:border-green-500 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-green-600 rounded-full text-white font-bold text-sm">
                    #{index + 1}
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {preorder.emailAddress.replace(/(.{3}).*(@.*)/, '$1***$2')}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {preorder.notes || 'Ready for GTA 6!'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(preorder.preorderStatus)}`}>
                    {preorder.preorderStatus.toUpperCase()}
                  </span>
                  <span className="text-gray-400 text-sm">
                    {formatTimeAgo(preorder.preorderCreatedAt)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 text-center">
        <p className="text-gray-400 text-sm">
          🔥 Pre-orders update in real-time • Join {total} other fans waiting for GTA 6!
        </p>
      </div>
    </div>
  );
}