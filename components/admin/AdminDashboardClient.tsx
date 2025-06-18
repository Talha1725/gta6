"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Preorder } from "@/types";
import { formattingUtils } from "@/lib/utils/formatting";

const SimpleCountdown = ({ targetDate }: { targetDate: string | null }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  // Timer logic can remain here if needed for live countdown

  return (
    <div className="flex justify-center gap-2">
      {[
        { value: timeLeft.days, label: "Days" },
        { value: timeLeft.hours, label: "Hours" },
        { value: timeLeft.minutes, label: "Minutes" },
        { value: timeLeft.seconds, label: "Seconds" },
      ].map((item, index) => (
        <div key={index} className="flex flex-col items-center px-2">
          <div className="bg-white rounded-lg p-2 min-w-[50px] text-center">
            <div className="text-lg font-bold text-gray-900">{item.value}</div>
            <div className="text-xs text-gray-500">{item.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default function AdminDashboardClient({ preorders }: { preorders: Preorder[] }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // ...rest of the previous AdminDashboard logic, but use preorders prop instead of fetching

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-white">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <AdminSidebar>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Preorder Countdown Dashboard
          </h1>
          <p className="text-gray-600">
            Monitor all active preorder countdowns
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            ❌ {error}
          </div>
        )}

        {/* Preorders with Countdown */}
        <div className="bg-white rounded-lg shadow-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                Active Preorder Countdowns ({preorders.length})
              </h2>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {preorders.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">
                {loading ? "Loading preorders..." : "No preorders found"}
              </div>
            ) : (
              preorders.map((preorder) => {
                // ...rest of the rendering logic
                return (
                  <div
                    key={preorder.id}
                    className={`px-6 py-4`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Preorder #{preorder.id}
                          </h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Created:</span>{" "}
                            {formattingUtils.date.formatLong(preorder.createdAt)}
                          </div>
                          <div>
                            <span className="font-medium">Release Date:</span>{" "}
                            {preorder.releaseDate ? formattingUtils.date.formatLong(preorder.releaseDate) : "-"}
                          </div>
                          <div>
                            <span className="font-medium">Notes:</span>{" "}
                            {preorder.notes || "-"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </AdminSidebar>
  );
} 