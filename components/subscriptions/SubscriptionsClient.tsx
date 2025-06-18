"use client";
import Navigation from "@/components/common/Navigation";
import Link from "next/link";
import AdminOrdersClient from '@/components/admin/AdminOrdersClient';

// Subscription type
export type Subscription = {
  id: string;
  status: "pending" | "completed" | "failed" | "cancelled";
  plan: string;
  amount: number;
  currency: string;
  startDate: string | Date;
  endDate: string | Date;
  paymentId: string;
  lastPaymentDate: string | Date;
  nextBillingDate?: string | Date;
};

const formatDate = (date: string | Date) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
};

export default function SubscriptionsClient({ subscriptions, status }: { subscriptions: Subscription[]; status: "authenticated" | "unauthenticated" }) {
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                <h3 className="text-gray-400 text-sm">Active Subscriptions</h3>
                <p className="text-2xl font-bold text-white mt-2">
                  {subscriptions.filter((sub) => sub.status === "completed").length}
                </p>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                <h3 className="text-gray-400 text-sm">Total Spent</h3>
                <p className="text-2xl font-bold text-white mt-2">
                  ${subscriptions.reduce((sum, sub) => sum + sub.amount, 0).toFixed(2)}
                </p>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                <h3 className="text-gray-400 text-sm">Next Payment</h3>
                <p className="text-2xl font-bold text-white mt-2">
                  {subscriptions.find((sub) => sub.status === "completed")?.nextBillingDate
                    ? formatDate(subscriptions.find((sub) => sub.status === "completed")!.nextBillingDate!)
                    : "No active subscription"}
                </p>
              </div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700/50">
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Plan</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Amount</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Start Date</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Last Payment</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Payment ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscriptions.map((subscription) => (
                      <tr key={subscription.id} className="hover:bg-gray-700/20 transition-colors">
                        <td className="px-6 py-4 text-sm text-white">{subscription.plan}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(subscription.status)}`}>
                            {subscription.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-white">
                          {subscription.amount} {subscription.currency}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-300">
                          {formatDate(subscription.startDate)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-300">
                          {formatDate(subscription.lastPaymentDate)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400 font-mono">
                          {subscription.paymentId ? `${subscription.paymentId.slice(0, 8)}...` : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 