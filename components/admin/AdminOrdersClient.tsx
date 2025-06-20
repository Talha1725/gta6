"use client";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { formattingUtils } from "@/lib/utils/formatting";
import { USER_ROLES, ORDER_STATUS } from "@/lib/constants";
import { Order } from "@/types/payment";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import FilterButtons from "../subscriptions/FilterButtons";
import Pagination from "../subscriptions/Pagination";

export interface OrdersApiResponse {
  data: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  stats: {
    totalRevenue: number;
    completedOrders: number;
    totalOrders: number;
  };
  type?: string;
  message?: string;
}

export default function AdminOrdersClient({ orders }: { orders: OrdersApiResponse }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data = [], pagination = {} as OrdersApiResponse['pagination'], stats, type } = orders;
  const currentType = (searchParams?.get("type") as "all" | "subscriptions" | "onetime") || "all";
  const currentPage = parseInt(searchParams?.get("page") || "1");
  const currentSearch = searchParams?.get("search") || "";
  
  const [searchTerm, setSearchTerm] = useState(currentSearch);

  // Update search term when URL changes
  useEffect(() => {
    setSearchTerm(currentSearch);
  }, [currentSearch]);

  const updateURL = (type: string, page: number, search?: string | null) => {
    const params = new URLSearchParams();
    if (type !== "all") params.set("type", type);
    if (page !== 1) params.set("page", page.toString());
    if (search && search.trim()) params.set("search", search.trim());

    const newURL = params.toString() ? `?${params.toString()}` : "";
    router.push(newURL, { scroll: false });
  };

  const handleTypeChange = (type: "all" | "subscriptions" | "onetime") => {
    updateURL(type, 1, searchTerm); // Reset to first page when changing type
  };

  const handlePageChange = (page: number) => {
    updateURL(currentType, page, searchTerm);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateURL(currentType, 1, searchTerm); // Reset to first page when searching
  };

  const handleSearchClear = () => {
    setSearchTerm("");
    // Get current URL and remove search parameter
    const currentParams = new URLSearchParams(window.location.search);
    currentParams.delete('search'); // Remove search parameter
    currentParams.delete('page'); // Reset to page 1
    
    const newURL = currentParams.toString() ? `?${currentParams.toString()}` : window.location.pathname;
    router.replace(newURL);
  };

  const getTypeDisplayName = (type: string) => {
    switch (type) {
      case "all":
        return "All Orders";
      case "subscriptions":
        return "Subscriptions";
      case "onetime":
        return "One-time Orders";
      default:
        return type;
    }
  };

  if (status === "loading") {
    return (
      <AdminSidebar>
        <div className="p-6">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        </div>
      </AdminSidebar>
    );
  }

  if (!session || session.user.role !== USER_ROLES.ADMIN) {
    return null;
  }

  // Use stats from server action instead of calculating from paginated data
  const totalRevenue = stats?.totalRevenue || 0;
  const completedOrders = stats?.completedOrders || 0;

  return (
    <AdminSidebar>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Orders Management
          </h1>
          <p className="text-gray-600">
            View and manage all orders and transactions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
            <p className="text-2xl font-bold text-cyan-600 mt-2">
              {stats?.totalOrders || pagination.total || 0}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
            <p className="text-2xl font-bold text-purple-600 mt-2">
              {formattingUtils.currency.formatUSD(totalRevenue)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-sm font-medium text-gray-500">
              Completed Orders
            </h3>
            <p className="text-2xl font-bold text-green-600 mt-2 text-black">
              {completedOrders}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap justify-between items-center">
          {/* Search Input */}
          <div className="mb-6">
            <form
              onSubmit={handleSearchSubmit}
              className="flex md:flex-row flex-col gap-3"
            >
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <input
                    type="email"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by customer email..."
                    className="w-full pl-10 pr-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
                >
                  Search
                </button>
                {currentSearch && (
                  <button
                    type="button"
                    onClick={handleSearchClear}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
            </form>
          </div>

          <FilterButtons
            currentType={currentType}
            onTypeChange={handleTypeChange}
            getTypeDisplayName={getTypeDisplayName}
          />
        </div>

        <div className="bg-white rounded-lg shadow-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                {getTypeDisplayName(currentType)} ({data.length})
                {currentSearch && (
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    - filtered by "{currentSearch}"
                  </span>
                )}
              </h2>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                    Order #
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                    Product
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      {currentSearch ? `No orders found for "${currentSearch}"` : "No orders found"}
                    </td>
                  </tr>
                ) : (
                  data.map((order: Order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-gray-900 font-mono">
                        {order.orderNumber}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {order.customerEmail || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {order.productName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {formattingUtils.currency.formatUSD(Number(order.amount))}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs text-black font-medium ${
                            order.status === ORDER_STATUS.COMPLETED
                              ? "bg-green/20 text-[#0ea968]"
                              : order.status === ORDER_STATUS.CANCELLED
                              ? "bg-red-100 text-red-700"
                              : order.status === ORDER_STATUS.FAILED
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formattingUtils.date.formatDateTime(order.createdAt)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {pagination.totalPages > 1 && (
            <>
              <Pagination
                currentPage={currentPage}
                totalPages={pagination.totalPages}
                hasPrevPage={pagination.hasPrevPage}
                hasNextPage={pagination.hasNextPage}
                onPageChange={handlePageChange}
              />
              <div className="mt-4 text-center text-sm text-gray-400">
                Showing {((currentPage - 1) * pagination.limit) + 1} to {Math.min(currentPage * pagination.limit, pagination.total)} of {pagination.total} {getTypeDisplayName(currentType).toLowerCase()}
              </div>
            </>
          )}
        </div>
      </div>
    </AdminSidebar>
  );
}