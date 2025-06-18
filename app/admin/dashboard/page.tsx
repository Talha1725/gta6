"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Preorder } from "@/types";

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
      const now = new Date();
      const target = new Date(targetDate);
      const difference = target.getTime() - now.getTime();

      if (difference <= 0) {
        setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00" });
        clearInterval(timer);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({
        days: days.toString().padStart(2, "0"),
        hours: hours.toString().padStart(2, "0"),
        minutes: minutes.toString().padStart(2, "0"),
        seconds: seconds.toString().padStart(2, "0"),
      });
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
      const response = await fetch("/api/admin/preorders");
      const data = await response.json();

      if (data.success) {
        setPreorders(data.data || []);
      } else {
        setError(data.error || "Failed to fetch preorders");
      }
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

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "No date set";

    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  // Calculate days until release
  const getDaysUntilRelease = (releaseDate: string | null) => {
    if (!releaseDate) return null;

    try {
      const release = new Date(releaseDate);
      const now = new Date();
      const diffTime = release.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
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

          <div className="p-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto mb-4"></div>
                <p className="text-gray-500">Loading preorders...</p>
              </div>
            ) : preorders.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">⏰</div>
                <p className="text-gray-500 mb-2 text-lg">
                  No preorder countdowns active
                </p>
                <p className="text-sm text-gray-400">
                  Create a new preorder to start a countdown timer
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {preorders.map((preorder) => (
                  <div
                    key={preorder.id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                      {/* Preorder Info */}
                      <div className="lg:col-span-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="font-semibold text-lg text-gray-900">
                            Preorder #{preorder.id}
                          </h3>
                        </div>

                        {preorder.selectedDate && (
                          <p className="text-sm text-cyan-600 mb-2">
                            🎯 <strong>Release Date:</strong>{" "}
                            {formatDate(preorder.selectedDate)}
                          </p>
                        )}

                        {preorder.notes && (
                          <p className="text-sm text-gray-600 mb-2">
                            📝 <strong>Notes:</strong> {preorder.notes}
                          </p>
                        )}

                        <p className="text-xs text-gray-500">
                          <strong>Created:</strong>{" "}
                          {new Date(preorder.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                      </div>

                      {/* Countdown Timer */}
                      <div className="lg:col-span-2 flex justify-center lg:justify-end">
                        <div className="bg-gradient-to-r from-cyan-50 to-purple-50 rounded-lg p-4 w-full max-w-md">
                          <div className="text-center mb-2">
                            <p className="text-sm font-medium text-gray-700">
                              Time Until Release
                            </p>
                          </div>
                          <SimpleCountdown targetDate={preorder.releaseDate} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Summary Stats */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <div className="bg-white rounded-lg p-4">
                        <div className="text-2xl font-bold text-cyan-600">
                          {preorders.length}
                        </div>
                        <div className="text-sm text-gray-500">
                          Total Active Countdowns
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-4">
                        <div className="text-2xl font-bold text-purple-600">
                          {
                            preorders.filter((p) => {
                              const days = getDaysUntilRelease(p.releaseDate);
                              return days !== null && days <= 7 && days > 0;
                            }).length
                          }
                        </div>
                        <div className="text-sm text-gray-500">
                          Releasing This Week
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-4">
                        <div className="text-2xl font-bold text-green-600">
                          {
                            preorders.filter((p) => {
                              const days = getDaysUntilRelease(p.releaseDate);
                              return days !== null && days > 0;
                            }).length
                          }
                        </div>
                        <div className="text-sm text-gray-500">
                          Future Releases
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminSidebar>
  );
}
