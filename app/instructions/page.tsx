"use client";

import Header from "@/components/Header";
import AuthGuard from "@/components/AuthGuard";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useExamStore } from "@/lib/stores/examStore";
import { motion } from "framer-motion";

export default function Instructions() {
  const router = useRouter();
  const {
    loadQuestions,
    questionsCount,
    totalMarks,
    totalTime,
    instruction,
    loading,
    startExam,
    questions,
  } = useExamStore();

  useEffect(() => {
    if (questions.length === 0) {
      loadQuestions();
    }
  }, [loadQuestions, questions.length]);

  const handleStartTest = () => {
    startExam();
    router.push("/mcq");
  };

  const formatTime = (minutes: number) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hrs > 0) return `${hrs}h ${mins.toString().padStart(2, "0")}m`;
    return `${mins}:00`;
  };

  return (
    <AuthGuard>
      <div className="flex flex-col items-center justify-start min-h-screen bg-[#F4FCFF]">
        <Header />

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#187c96]" />
              <p className="text-slate-500 text-sm">Loading exam details...</p>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-[90%] flex flex-col items-center justify-center mx-auto"
          >
            <p className="text-2xl my-4 font-medium text-center">
              Ancient Indian History MCQ
            </p>
            <section
              className="w-full max-w-2xl bg-[#1C3141] rounded-xl flex justify-around items-center py-4"
              data-purpose="score-summary"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="rounded-2xl p-4 text-center text-white shadow-xl"
              >
                <p className="text-sm font-medium opacity-90 mb-2">
                  Total MCQs:
                </p>
                <h1
                  className="text-4xl font-medium tracking-tight"
                  id="total-mcqs"
                >
                  {questionsCount}
                </h1>
              </motion.div>

              <div className="w-px h-12 bg-gray-500 opacity-50 rounded" />

              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="rounded-2xl p-4 text-center text-white shadow-xl"
              >
                <p className="text-sm font-medium opacity-90 mb-2">
                  Total Marks:
                </p>
                <h1
                  className="text-4xl font-medium tracking-tight"
                  id="total-marks"
                >
                  {totalMarks}
                </h1>
              </motion.div>

              <div className="w-px h-12 bg-gray-500 opacity-50 rounded" />

              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="rounded-2xl p-4 text-center text-white shadow-xl"
              >
                <p className="text-sm font-medium opacity-90 mb-2">
                  Total Time:
                </p>
                <h1
                  className="text-4xl font-medium tracking-tight"
                  id="total-time"
                >
                  {formatTime(totalTime)}
                </h1>
              </motion.div>
            </section>

            <section className="self-center max-w-2xl px-4">
              <h3 className="text-xl my-4 font-bold">Instructions:</h3>
              {instruction ? (
                <div
                  className="text-slate-700 leading-relaxed space-y-2"
                  dangerouslySetInnerHTML={{ __html: instruction }}
                />
              ) : (
                <motion.ol
                  initial="hidden"
                  animate="show"
                  variants={{ show: { transition: { staggerChildren: 0.1 } } }}
                  className="list-decimal list-inside space-y-2 text-slate-700"
                >
                  {[
                    `Complete the test within the given time.`,
                    `Test consists of ${questionsCount} multiple-choice questions.`,
                    `Ensure you are in a quiet environment and have a stable internet connection.`,
                    `Keep an eye on the timer, and try to answer all questions within the given time.`,
                    `Do not use any external resources such as dictionaries, websites, or assistance.`,
                    `Complete the test honestly to accurately assess your proficiency level.`,
                    `Check answers before submitting.`,
                    `Your test results will be displayed immediately after submission.`
                  ].map((text, i) => (
                    <motion.li
                      key={i}
                      variants={{ hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0 } }}
                    >
                      {text}
                    </motion.li>
                  ))}
                </motion.ol>
              )}
            </section>

            {/* ActionButton */}
            <div className="w-full max-w-sm mt-10 mb-8 px-4" data-purpose="footer-actions">
              <motion.button
                whileHover={{ scale: questions.length === 0 ? 1 : 1.02 }}
                whileTap={{ scale: questions.length === 0 ? 1 : 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="w-full bg-[#1e293b] hover:bg-[#0f172a] text-white py-3 rounded-lg font-bold text-lg shadow-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                data-purpose="done-button"
                disabled={questions.length === 0}
                onClick={handleStartTest}
              >
                Start Test
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </AuthGuard>
  );
}