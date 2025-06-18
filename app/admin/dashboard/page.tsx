"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Preorder } from "@/types";
import { preorderService } from "@/lib/services";
import { formattingUtils } from "@/lib/utils/formatting";

// Simple countdown component (if CountdownTimer doesn't exist)
const SimpleCountdown = ({ targetDate }: { targetDate: string | null }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    if (!targetDate) return;

    const timer = setInterval(() => {
      const countdown = formattingUtils.time.formatCountdown(targetDate);
      
      setTimeLeft({
        days: countdown.days.toString().padStart(2, "0"),
        hours: countdown.hours.toString().padStart(2, "0"),
        minutes: countdown.minutes.toString().padStart(2, "0"),
        seconds: countdown.seconds.toString().padStart(2, "0"),
      });
      
      if (countdown.isExpired) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!targetDate) {
    return <div className="text-gray-500 text-sm">No release date set</div>;
  }

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

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [preorders, setPreorders] = useState<Preorder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/admin");
    } else {
      fetchPreorders();
    }
  }, [session, status, router]);

  const fetchPreorders = async () => {
    try {
      setError(null);
      const preordersData = await preorderService.getAllPreorders();
      setPreorders(preordersData);
    } catch (error) {
      console.error("Error fetching preorders:", error);
      setError("Network error while fetching preorders");
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh preorders every 30 seconds
  useEffect(() => {
    if (!session) return;

    const interval = setInterval(() => {
      fetchPreorders();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [session]);

  // Calculate days until release
  const getDaysUntilRelease = (releaseDate: string | null) => {
    if (!releaseDate) return null;

    try {
      const countdown = formattingUtils.time.formatCountdown(releaseDate);
      return countdown.isExpired ? 0 : countdown.days;
    } catch (error) {
      return null;
    }
  };

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
              <button
                onClick={fetchPreorders}
                disabled={loading}
                className="px-3 py-1 text-sm bg-cyan-100 text-cyan-700 rounded-md hover:bg-cyan-200 transition-colors disabled:opacity-50"
              >
                {loading ? "🔄 Loading..." : "🔄 Refresh"}
              </button>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {preorders.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">
                {loading ? "Loading preorders..." : "No preorders found"}
              </div>
            ) : (
              preorders.map((preorder) => {
                const daysUntilRelease = getDaysUntilRelease(preorder.releaseDate);
                const isExpired = daysUntilRelease !== null && daysUntilRelease <= 0;

                return (
                  <div
                    key={preorder.id}
                    className={`px-6 py-4 ${
                      isExpired ? "bg-red-50" : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Preorder #{preorder.id}
                          </h3>
                          {isExpired && (
                            <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                              EXPIRED
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Created:</span>{" "}
                            {formattingUtils.date.formatLong(preorder.createdAt)}
                          </div>
                          <div>
                            <span className="font-medium">Selected Date:</span>{" "}
                            {preorder.selectedDate
                              ? formattingUtils.date.formatLong(preorder.selectedDate)
                              : "Not set"}
                          </div>
                          <div>
                            <span className="font-medium">Release Date:</span>{" "}
                            {preorder.releaseDate
                              ? formattingUtils.date.formatLong(preorder.releaseDate)
                              : "Not set"}
                          </div>
                        </div>

                        {preorder.notes && (
                          <div className="mt-2">
                            <span className="font-medium text-gray-600">Notes:</span>{" "}
                            <span className="text-gray-700">{preorder.notes}</span>
                          </div>
                        )}

                        {daysUntilRelease !== null && (
                          <div className="mt-3">
                            <span className="font-medium text-gray-600">
                              Days until release:
                            </span>{" "}
                            <span
                              className={`font-semibold ${
                                isExpired
                                  ? "text-red-600"
                                  : daysUntilRelease <= 7
                                  ? "text-orange-600"
                                  : "text-green-600"
                              }`}
                            >
                              {isExpired ? "Released" : `${daysUntilRelease} days`}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="ml-4">
                        <SimpleCountdown targetDate={preorder.releaseDate} />
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
