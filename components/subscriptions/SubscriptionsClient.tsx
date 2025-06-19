"use client";
import { useRouter, useSearchParams } from 'next/navigation';
import Navigation from "@/components/common/Navigation";
import Link from "next/link";

// Updated Subscription type to match API response
export type Subscription = {
    plan: string;
    status: "pending" | "completed" | "failed" | "cancelled";
    amount: number;
    customerId: string;
    endDate?: string; // Only for subscriptions
};

export type ApiResponse = {
    data: Subscription[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
    type: string;
    message: string;
};

export type SubscriptionsClientProps = {
    data: ApiResponse | null;
    status: "authenticated" | "unauthenticated";
};

const formatDate = (date: string) => {
    return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    }).format(new Date(date));
};

export default function SubscriptionsClient({ data, status }: SubscriptionsClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Get current values from URL params
    const currentType = (searchParams?.get('type') as 'all' | 'subscriptions' | 'onetime') || 'all';
    const currentPage = parseInt(searchParams?.get('page') || '1');

    // Update URL and trigger server-side navigation
    const updateURL = (type: string, page: number) => {
        const params = new URLSearchParams();
        if (type !== 'all') params.set('type', type);
        if (page !== 1) params.set('page', page.toString());

        const newURL = params.toString() ? `?${params.toString()}` : '';
        router.push(newURL);
    };

    const handleTypeChange = (type: 'all' | 'subscriptions' | 'onetime') => {
        updateURL(type, 1); // Reset to first page when changing type
    };

    const handlePageChange = (page: number) => {
        updateURL(currentType, page);
    };

    const getStatusColor = (status: Subscription["status"]) => {
        switch (status) {
            case "completed":
                return "bg-green-500/20 text-green-400";
            case "cancelled":
                return "bg-red-500/20 text-red-400";
            case "failed":
                return "bg-red-500/20 text-red-400";
            case "pending":
                return "bg-yellow-500/20 text-yellow-400";
            default:
                return "bg-gray-500/20 text-gray-400";
        }
    };

    const getTypeDisplayName = (type: string) => {
        switch (type) {
            case 'all': return 'All Orders';
            case 'subscriptions': return 'Subscriptions';
            case 'onetime': return 'One-time Orders';
            default: return type;
        }
    };

    if (status === "unauthenticated") {
        return (
            <div className="min-h-screen bg-nft-gradient text-white pt-8">
                <div className="max-w-7xl mx-auto">
                    <Navigation />
                    <main className="p-6">
                        <div className="text-center py-20">
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 bg-clip-text text-transparent mb-4">
                                Please Log In
                            </h1>
                            <p className="text-gray-400 mb-8">
                                You need to be logged in to view your subscriptions
                            </p>
                            <Link
                                href="/api/auth/signin"
                                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg hover:from-purple-700 hover:to-cyan-700 transition-all duration-300"
                            >
                                Log In
                            </Link>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-nft-gradient text-white pt-8">
            <div className="max-w-7xl mx-auto">
                <Navigation />
                <main className="p-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 bg-clip-text text-transparent">
                                Subscriptions & Payments
                            </h1>
                            <p className="text-gray-400 mt-2">
                                View and manage your subscription details and payment history
                            </p>
                        </div>

                        {/* Filter Buttons */}
                        <div className="mb-6">
                            <div className="flex flex-wrap gap-2">
                                {(['all', 'subscriptions', 'onetime'] as const).map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => handleTypeChange(type)}
                                        className={`px-4 py-2 rounded-lg transition-all duration-300 ${currentType === type
                                            ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white'
                                            : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
                                            }`}
                                    >
                                        {getTypeDisplayName(type)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {!data || data.data.length === 0 ? (
                            <div className="text-center py-20">
                                <p className="text-gray-400 mb-4">
                                    {data?.message || 'No orders found'}
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Stats Cards */}
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

                                {/* Data Table */}
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
                                                {data.data.map((item, index) => (
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

                                {/* Pagination */}
                                {data.pagination.totalPages > 1 && (
                                    <div className="mt-6 flex justify-center items-center gap-2">
                                        <button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={!data.pagination.hasPrevPage}
                                            className={`px-3 py-2 rounded-lg transition-all duration-300 ${data.pagination.hasPrevPage
                                                ? 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
                                                : 'bg-gray-900/50 text-gray-600 cursor-not-allowed'
                                                }`}
                                        >
                                            Previous
                                        </button>

                                        <div className="flex gap-1">
                                            {Array.from({ length: Math.min(data.pagination.totalPages, 5) }, (_, i) => {
                                                // Show pages around current page
                                                let pageNum;
                                                if (data.pagination.totalPages <= 5) {
                                                    pageNum = i + 1;
                                                } else {
                                                    const start = Math.max(1, currentPage - 2);
                                                    const end = Math.min(data.pagination.totalPages, start + 4);
                                                    pageNum = start + i;
                                                    if (pageNum > end) return null;
                                                }

                                                return (
                                                    <button
                                                        key={pageNum}
                                                        onClick={() => handlePageChange(pageNum)}
                                                        className={`px-3 py-2 rounded-lg transition-all duration-300 ${pageNum === currentPage
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
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={!data.pagination.hasNextPage}
                                            className={`px-3 py-2 rounded-lg transition-all duration-300 ${data.pagination.hasNextPage
                                                ? 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
                                                : 'bg-gray-900/50 text-gray-600 cursor-not-allowed'
                                                }`}
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}

                                {/* Pagination Info */}
                                <div className="mt-4 text-center text-sm text-gray-400">
                                    Showing {((currentPage - 1) * data.pagination.limit) + 1} to {Math.min(currentPage * data.pagination.limit, data.pagination.total)} of {data.pagination.total} {getTypeDisplayName(data.type).toLowerCase()}
                                </div>
                            </>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}