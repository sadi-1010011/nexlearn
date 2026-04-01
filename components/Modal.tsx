"use client";

import { X } from "lucide-react";

interface SubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  totalQuestions: number;
  attended: number;
  notAttended: number;
  markedForReview: number;
  loading: boolean;
}

export default function SubmitModal({
  isOpen,
  onClose,
  onSubmit,
  totalQuestions,
  attended,
  notAttended,
  markedForReview,
  loading,
}: SubmitModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed max-w-md w-[calc(100%-2rem)] p-6 rounded-2xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white flex flex-col items-center justify-center z-50 shadow-2xl">
        <p className="text-xl my-2 font-medium text-black text-left w-full">
          Are you sure you want to submit the test?
        </p>
        <button
          className="absolute top-6 right-6 hover:bg-gray-100 rounded-full p-1 transition-colors"
          onClick={onClose}
        >
          <X className="stroke-1" />
        </button>
        <hr className="h-[0.5px] w-full my-2 bg-slate-200" />

        {/* StatisticsList */}
        <section
          className="w-full max-w-md space-y-4 px-2 mt-3"
          data-purpose="statistics-breakdown"
        >
          {/* Total Questions */}
          <div
            className="flex items-center justify-between py-1"
            data-purpose="stat-row"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-md bg-[#eab308] flex items-center justify-center text-white shadow-sm">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </div>
              <span className="text-lg font-medium text-slate-600">
                Total Questions:
              </span>
            </div>
            <span className="text-xl font-bold text-slate-800">
              {String(totalQuestions).padStart(3, "0")}
            </span>
          </div>

          {/* Attended */}
          <div
            className="flex items-center justify-between py-1"
            data-purpose="stat-row"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-md bg-[#22c55e] flex items-center justify-center text-white shadow-sm">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 13l4 4L19 7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </div>
              <span className="text-lg font-medium text-slate-600">
                Attended:
              </span>
            </div>
            <span className="text-xl font-bold text-slate-800">
              {String(attended).padStart(3, "0")}
            </span>
          </div>

          {/* Not Attended */}
          <div
            className="flex items-center justify-between py-1"
            data-purpose="stat-row"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-md bg-[#ef4444] flex items-center justify-center text-white shadow-sm">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 18L18 6M6 6l12 12"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </div>
              <span className="text-lg font-medium text-slate-600">
                Not Attended:
              </span>
            </div>
            <span className="text-xl font-bold text-slate-800">
              {String(notAttended).padStart(3, "0")}
            </span>
          </div>

          {/* Marked for Review */}
          <div
            className="flex items-center justify-between py-1"
            data-purpose="stat-row"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-md bg-[#8b008b] flex items-center justify-center text-white shadow-sm">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </div>
              <span className="text-lg font-medium text-slate-600">
                Marked for Review:
              </span>
            </div>
            <span className="text-xl font-bold text-slate-800">
              {String(markedForReview).padStart(3, "0")}
            </span>
          </div>
        </section>

        {/* ActionButton */}
        <div className="w-full max-w-md mt-6" data-purpose="footer-actions">
          <button
            className="w-full bg-[#1e293b] hover:bg-[#0f172a] text-white py-2.5 rounded-lg font-bold text-lg shadow-lg transition-all transform active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            data-purpose="done-button"
            onClick={onSubmit}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                Submitting...
              </span>
            ) : (
              "Submit Test"
            )}
          </button>
        </div>
      </div>
    </>
  );
}