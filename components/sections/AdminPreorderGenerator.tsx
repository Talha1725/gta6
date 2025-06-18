'use client';

import { useState, useEffect } from 'react';

interface Email {
  id: number;
  emailAddress: string;
  subscribedAt: string;
  status: string;
}

interface Preorder {
  preorderId: number;
  emailId: number;
  emailAddress: string;
  preorderStatus: string;
  notes: string;
  preorderCreatedAt: string;
}

export default function AdminPreorderGenerator() {
  const [allEmails, setAllEmails] = useState<Email[]>([]);
  const [emailsWithoutPreorders, setEmailsWithoutPreorders] = useState<Email[]>([]);
  const [preorders, setPreorders] = useState<Preorder[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'without-preorders' | 'with-preorders'>('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/admin/data');
      const data = await response.json();
      
      if (data.success) {
        setAllEmails(data.data.emails || []);
        setEmailsWithoutPreorders(data.data.emailsWithoutPreorders || []);
        setPreorders(data.data.preorders || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generatePreorder = async (emailId: number, emailAddress: string) => {
    setGenerating(emailId);
    
    try {
      const notes = `Admin-generated preorder interest for ${emailAddress.split('@')[0]}`;
      
      const response = await fetch('/api/admin/generate-preorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailId,
          notes,
          status: 'interested'
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Refresh the data to update all lists
        await fetchData();
        alert('✅ Preorder generated successfully!');
      } else {
        alert('❌ Error: ' + data.error);
      }
    } catch (error) {
      alert('❌ Failed to generate preorder');
    } finally {
      setGenerating(null);
    }
  };

  const generateAllPreorders = async () => {
    if (!confirm(`Generate preorders for all ${emailsWithoutPreorders.length} emails?`)) {
      return;
    }

    for (const email of emailsWithoutPreorders) {
      await generatePreorder(email.id, email.emailAddress);
      // Small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4 w-1/4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const hasEmailInPreorder = (emailId: number) => {
    return preorders.some(preorder => preorder.emailId === emailId);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header with Stats */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          🎮 GTA 6 Email & Preorder Management
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{allEmails.length}</div>
            <div className="text-sm text-blue-800">Total Emails</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{preorders.length}</div>
            <div className="text-sm text-green-800">With Preorders</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{emailsWithoutPreorders.length}</div>
            <div className="text-sm text-yellow-800">Without Preorders</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {allEmails.filter(e => e.status === 'active').length}
            </div>
            <div className="text-sm text-purple-800">Active Subscribers</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'all', name: 'All Emails', count: allEmails.length },
              { id: 'without-preorders', name: 'Need Preorders', count: emailsWithoutPreorders.length },
              { id: 'with-preorders', name: 'Have Preorders', count: preorders.length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.name} ({tab.count})
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* All Emails Tab */}
      {activeTab === 'all' && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50">
            <h2 className="text-lg font-semibold">All Email Subscribers</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subscribed</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Preorder</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {allEmails.map((email) => (
                  <tr key={email.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{email.emailAddress}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(email.subscribedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        email.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {email.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {hasEmailInPreorder(email.id) ? (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          ✅ Has Preorder
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                          ❌ No Preorder
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {!hasEmailInPreorder(email.id) ? (
                        <button
                          onClick={() => generatePreorder(email.id, email.emailAddress)}
                          disabled={generating === email.id}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 disabled:bg-gray-400"
                        >
                          {generating === email.id ? 'Generating...' : 'Generate Preorder'}
                        </button>
                      ) : (
                        <span className="text-gray-400 text-sm">Already has preorder</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Without Preorders Tab */}
      {activeTab === 'without-preorders' && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Emails Without Preorders</h2>
            {emailsWithoutPreorders.length > 0 && (
              <button
                onClick={generateAllPreorders}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-medium"
              >
                Generate All Pre-Orders
              </button>
            )}
          </div>
          
          {emailsWithoutPreorders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">🎉 All emails have pre-orders generated!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subscribed</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {emailsWithoutPreorders.map((email) => (
                    <tr key={email.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{email.emailAddress}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(email.subscribedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          {email.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => generatePreorder(email.id, email.emailAddress)}
                          disabled={generating === email.id}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 disabled:bg-gray-400"
                        >
                          {generating === email.id ? 'Generating...' : 'Generate Pre-Order'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* With Preorders Tab */}
      {activeTab === 'with-preorders' && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50">
            <h2 className="text-lg font-semibold">Emails With Preorders</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notes</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {preorders.map((preorder) => (
                  <tr key={preorder.preorderId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{preorder.emailAddress}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {preorder.preorderStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {preorder.notes || 'No notes'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(preorder.preorderCreatedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}