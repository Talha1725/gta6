"use client";
import { useRouter, useSearchParams } from 'next/navigation';
import Navigation from "@/components/common/Navigation";
import Link from "next/link";
import StatsCards from './StatsCards';
import DataTable from './DataTable';
import Pagination from './Pagination';
import FilterButtons from './FilterButtons';
import Container from '@/components/ui/Container';
import { Subscription, SubscriptionsClientProps } from '@/types';

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
                <Container maxWidth="7xl">
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
                </Container>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-nft-gradient text-white pt-8">
            <Container maxWidth="7xl" padding='none'>
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

                        <FilterButtons
                            currentType={currentType}
                            onTypeChange={handleTypeChange}
                            getTypeDisplayName={getTypeDisplayName}
                        />

                        {!data || data.data.length === 0 ? (
                            <div className="text-center py-20">
                                <p className="text-gray-400 mb-4">
                                    {data?.message || 'No orders found'}
                                </p>
                            </div>
                        ) : (
                            <>
                                <StatsCards
                                    data={data}
                                    getTypeDisplayName={getTypeDisplayName}
                                />

                                <DataTable
                                    data={data.data}
                                    currentType={currentType}
                                    getStatusColor={getStatusColor}
                                    formatDate={formatDate}
                                />

                                {data.pagination.totalPages > 1 && (
                                    <>
                                        <Pagination
                                            currentPage={currentPage}
                                            totalPages={data.pagination.totalPages}
                                            hasPrevPage={data.pagination.hasPrevPage}
                                            hasNextPage={data.pagination.hasNextPage}
                                            onPageChange={handlePageChange}
                                        />

                                        <div className="mt-4 text-center text-sm text-gray-400">
                                            Showing {((currentPage - 1) * data.pagination.limit) + 1} to {Math.min(currentPage * data.pagination.limit, data.pagination.total)} of {data.pagination.total} {getTypeDisplayName(data.type).toLowerCase()}
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </main>
            </Container>
        </div>
    );
}