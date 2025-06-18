"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { FormData } from "@/types";

export default function GeneratePreorderPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    notes: "",
    selectedDate: "", // Initialize empty, user must select
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Get today's date in YYYY-MM-DD format for min date
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  // Get max date (2 years from now) to prevent unrealistic dates
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 2);
    return maxDate.toISOString().split("T")[0];
  };

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/admin");
    }
  }, [session, status, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate date is selected and not empty
    if (!formData.selectedDate || formData.selectedDate.trim() === "") {
      setMessage("❌ Please select a valid date for the preorder.");
      return;
    }

    // Validate date is not in the past
    const selectedDate = new Date(formData.selectedDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to compare only dates

    if (selectedDate < today) {
      setMessage("❌ Release date cannot be in the past.");
      return;
    }

    // Validate date is not too far in the future (max 2 years)
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 2);

    if (selectedDate > maxDate) {
      setMessage("❌ Release date cannot be more than 2 years in the future.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // Create the preorder with user-selected date
      const preorderResponse = await fetch("/api/admin/generate-preorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notes:
            formData.notes ||
            `Manual preorder created on ${new Date().toLocaleDateString()}`,
          selectedDate: formData.selectedDate,
          releaseDate: new Date(
            formData.selectedDate + "T23:59:59"
          ).toISOString(),
        }),
      });

      const preorderData = await preorderResponse.json();

      if (preorderData.success) {
        setMessage("✅ Preorder created successfully!");

        // Auto-clear success message after 2 seconds and redirect
        setTimeout(() => {
          setMessage("");
          router.push("/admin/dashboard");
        }, 2000);
      } else {
        setMessage("❌ Error creating preorder: " + preorderData.error);
      }
    } catch (error) {
      setMessage("❌ Network error. Please try again.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      notes: "",
      selectedDate: "", // Reset to empty, user must select
    });
    setMessage("");
  };

  // Format date for display
  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid Date";

      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  // Calculate days until selected date
  const getDaysUntilDate = (dateString: string) => {
    if (!dateString) return 0;

    try {
      const selectedDate = new Date(dateString);
      const today = new Date();
      const diffTime = selectedDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return Math.max(0, diffDays);
    } catch (error) {
      return 0;
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <AdminSidebar>
      <div className="p-6 max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Generate Preorder
          </h1>
          <p className="text-gray-600">
            Create a new preorder entry with custom countdown date
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date Selection */}
            <div>
              <label
                htmlFor="selectedDate"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Select Release Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="selectedDate"
                value={formData.selectedDate}
                min={getTodayDate()}
                max={getMaxDate()}
                onChange={(e) =>
                  setFormData({ ...formData, selectedDate: e.target.value })
                }
                className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                disabled={loading}
                required
              />

              {/* Show date info only if date is selected */}
              {formData.selectedDate && (
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-cyan-600">
                    📅 Selected:{" "}
                    <strong>
                      {formatDateForDisplay(formData.selectedDate)}
                    </strong>
                  </p>
                </div>
              )}
            </div>

            {/* Notes */}
            <div>
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Notes
              </label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                rows={4}
                placeholder="Add any notes about this preorder..."
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Optional: Add context about this preorder entry
              </p>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => router.push("/admin/dashboard")}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  disabled={loading}
                >
                  Reset
                </button>

                <button
                  type="submit"
                  disabled={loading || !formData.selectedDate}
                  className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-lg hover:from-cyan-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-lg"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </div>
                  ) : (
                    "🎮 Create Preorder"
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Status Message */}
          {message && (
            <div
              className={`mt-6 p-4 rounded-lg ${
                message.includes("✅")
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              {message}
            </div>
          )}
        </div>
      </div>
    </AdminSidebar>
  );
}
