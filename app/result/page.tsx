"use client";

import Header from "@/components/Header";
import AuthGuard from "@/components/AuthGuard";
import { useRouter } from "next/navigation";
import { useExamStore } from "@/lib/stores/examStore";

export default function Result() {
  const router = useRouter();
  const { examResult, totalMarks, questionsCount, resetExam } = useExamStore();

  const handleDone = () => {
    resetExam();
    router.push("/instructions");
  };

  const score = examResult?.score ?? 0;
  const correct = examResult?.correct ?? 0;
  const wrong = examResult?.wrong ?? 0;
  const notAttended = examResult?.not_attended ?? 0;

  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="grow flex flex-col items-center justify-start pt-12 px-4 pb-20">
          {/* ScoreCard */}
          <section className="w-full max-w-md" data-purpose="score-summary">
            <div className="score-card-gradient rounded-2xl p-8 text-center text-white shadow-xl mb-8">
              <p className="text-sm font-medium opacity-90 mb-2">
                Marks Obtained:
              </p>
              <h1
                className="text-6xl font-semibold tracking-tight"
                id="score-display"
              >
                {score} / {totalMarks || questionsCount}
              </h1>
              {examResult?.submitted_at && (
                <p className="text-xs opacity-70 mt-3">
                  Submitted at{" "}
                  {new Date(examResult.submitted_at).toLocaleString()}
                </p>
              )}
            </div>
          </section>

          {/* StatisticsList */}
          <section
            className="w-full max-w-md space-y-4 px-2"
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
                {String(questionsCount).padStart(3, "0")}
              </span>
            </div>

            {/* Correct Answers */}
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
                  Correct Answers:
                </span>
              </div>
              <span className="text-xl font-bold text-slate-800">
                {String(correct).padStart(3, "0")}
              </span>
            </div>

            {/* Incorrect Answers */}
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
                  Incorrect Answers:
                </span>
              </div>
              <span className="text-xl font-bold text-slate-800">
                {String(wrong).padStart(3, "0")}
              </span>
            </div>

            {/* Not Attended Questions */}
            <div
              className="flex items-center justify-between py-1"
              data-purpose="stat-row"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-md bg-[#64748b] flex items-center justify-center text-white shadow-sm">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
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
          </section>

          {/* ActionButton */}
          <div className="w-full max-w-md mt-10" data-purpose="footer-actions">
            <button
              className="w-full bg-[#1e293b] hover:bg-[#0f172a] text-white py-4 rounded-lg font-bold text-lg shadow-lg transition-all transform active:scale-[0.98]"
              data-purpose="done-button"
              onClick={handleDone}
            >
              Done
            </button>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}