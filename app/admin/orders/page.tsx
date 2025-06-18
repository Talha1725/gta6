// app/admin/orders/page.tsx
"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type Order = {
  id: number;
  orderNumber: string;
  customerEmail: string | null;
  productName: string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed" | "cancelled";
  createdAt: Date;
  paymentId: string;
  transactionStatus: "success" | "failed" | "pending" | "refunded" | null;
  transactionCreatedAt: Date | null;
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (session?.user?.role !== "admin") {
      router.push("/");
    }
  }, [session, status, router]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/admin/orders");
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        setOrders(
          data.orders.map((order: any) => ({
            ...order,
            createdAt: new Date(order.createdAt),
            transactionCreatedAt: order.transactionCreatedAt
              ? new Date(order.transactionCreatedAt)
              : null,
          }))
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.role === "admin") {
      fetchOrders();
    }
  }, [session]);

  if (loading) {
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

  if (error) {
    return (
      <AdminSidebar>
        <div className="p-6">
          <div className="bg-red-500/20 text-red-400 p-4 rounded-lg">
            {error}
          </div>
        </div>
      </AdminSidebar>
    );
  }

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
              {orders.length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
            <p className="text-2xl font-bold text-purple-600 mt-2">
              ${orders.reduce((sum, order) => sum + order.amount, 0).toFixed(2)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-sm font-medium text-gray-500">
              Completed Orders
            </h3>
            <p className="text-2xl font-bold text-green-600 mt-2">
              {orders.filter((order) => order.status === "completed").length}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                All Orders ({orders.length})
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
                {orders.map((order) => (
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
                      {order.amount} {order.currency}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : order.status === "cancelled"
                            ? "bg-red-100 text-red-700"
                            : order.status === "failed"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Intl.DateTimeFormat("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }).format(order.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminSidebar>
  );
}
