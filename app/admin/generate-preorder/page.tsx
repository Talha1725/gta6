"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { FormData } from "@/types";
import { validationUtils } from "@/lib/utils/validation";
import { formattingUtils } from "@/lib/utils/formatting";
import { USER_ROLES } from "@/lib/constants";
import { createPreorderAction } from '@/actions/preorder';

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
    if (!session || session.user.role !== USER_ROLES.ADMIN) {
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

    // Validate date using utility
    const dateError = validationUtils.date.getError(formData.selectedDate);
    if (dateError) {
      setMessage(`❌ ${dateError}`);
      return;
    }

    // Validate date is not too far in the future (max 2 years)
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 2);
    const selectedDate = new Date(formData.selectedDate);

    if (selectedDate > maxDate) {
      setMessage("❌ Release date cannot be more than 2 years in the future.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const result = await createPreorderAction({
        notes: formData.notes || `Manual preorder created on ${formattingUtils.date.formatShort(new Date())}`,
        selectedDate: formData.selectedDate,
      });

      if (result.success) {
        setMessage("✅ Preorder created successfully!");

        // Auto-clear success message after 2 seconds and redirect
        setTimeout(() => {
          setMessage("");
          router.push("/admin/dashboard");
        }, 2000);
      } else {
        setMessage("❌ Error creating preorder: " + result.error);
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

  // Calculate days until selected date
  const getDaysUntilDate = (dateString: string) => {
    if (!dateString) return 0;

    try {
      const countdown = formattingUtils.time.formatCountdown(dateString);
      return countdown.isExpired ? 0 : countdown.days;
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
                <div className="mt-3 p-4 bg-cyan-50 rounded-lg border border-cyan-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-cyan-800">
                        Selected Date: {formattingUtils.date.formatLong(formData.selectedDate)}
                      </p>
                      <p className="text-sm text-cyan-600">
                        Days until release: {getDaysUntilDate(formData.selectedDate)}
                      </p>
                    </div>
                    <div className="text-2xl">⏰</div>
                  </div>
                </div>
              )}
            </div>

            {/* Notes */}
            <div>
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Notes (Optional)
              </label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={4}
                className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all resize-none"
                placeholder="Add any additional notes about this preorder..."
                disabled={loading}
              />
            </div>

            {/* Message Display */}
            {message && (
              <div
                className={`p-4 rounded-lg ${
                  message.startsWith("✅")
                    ? "bg-green-50 border border-green-200 text-green-800"
                    : "bg-red-50 border border-red-200 text-red-800"
                }`}
              >
                <p className="text-sm">{message}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading || !formData.selectedDate}
                className="flex-1 bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:cursor-not-allowed"
              >
                {loading ? "Creating..." : "Create Preorder"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                disabled={loading}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminSidebar>
  );
}
