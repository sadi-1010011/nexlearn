"use client";

import Header from "@/components/Header";
import AuthGuard from "@/components/AuthGuard";
import SubmitModal from "@/components/Modal";
import { Paragraph } from "@/components/Paragraph";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useCallback } from "react";
import { useExamStore } from "@/lib/stores/examStore";

export default function Mcq() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [showParagraph, setShowParagraph] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const {
    questions,
    currentIndex,
    answers,
    markedForReview,
    visitedQuestions,
    remainingTime,
    examStarted,
    loading,
    selectOption,
    toggleMarkForReview,
    goToQuestion,
    nextQuestion,
    prevQuestion,
    tick,
    submitExam,
    loadQuestions,
    startExam,
  } = useExamStore();

  // Load questions if not already loaded (e.g. direct navigation)
  useEffect(() => {
    if (questions.length === 0) {
      loadQuestions().then((success) => {
        if (success) startExam();
      });
    } else if (!examStarted) {
      startExam();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Timer
  useEffect(() => {
    if (examStarted && remainingTime > 0) {
      timerRef.current = setInterval(() => {
        tick();
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [examStarted, tick, remainingTime > 0]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-submit when time runs out
  const handleSubmit = useCallback(async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    const success = await submitExam();
    if (success) {
      router.push("/result");
    }
  }, [submitExam, router]);

  useEffect(() => {
    if (examStarted && remainingTime <= 0 && questions.length > 0) {
      handleSubmit();
    }
  }, [remainingTime, examStarted, questions.length, handleSubmit]);

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Determine status of each question for the grid
  const getQuestionStatus = (questionId: number) => {
    const isAnswered = answers[questionId] !== undefined;
    const isMarked = markedForReview.has(questionId);
    const isVisited = visitedQuestions.has(questionId);

    if (isAnswered && isMarked) return "answered_marked";
    if (isMarked) return "marked";
    if (isAnswered) return "answered";
    if (isVisited) return "not_answered";
    return "not_visited";
  };

  // Count stats
  const attendedCount = Object.keys(answers).length;
  const notAttendedCount = totalQuestions - attendedCount;
  const markedCount = markedForReview.size;

  const letterPrefix = ["A", "B", "C", "D", "E", "F", "G", "H"];

  if (loading || questions.length === 0) {
    return (
      <AuthGuard>
        <div className="flex flex-col min-h-screen">
          <Header />
          <div className="flex-1 flex items-center justify-center bg-[#F4FCFF]">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#187c96]" />
              <p className="text-slate-500 text-sm">Loading questions...</p>
            </div>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="grow bg-[#F4FCFF] p-4 lg:p-8 flex flex-col items-start lg:flex-row gap-8 overflow-auto">
          {/* LeftColumn - Question Area */}
          <section
            className="lg:w-2/3 flex flex-col gap-6"
            data-purpose="question-section"
          >
            {/* Question Header */}
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-medium text-gray-700">
                Ancient Indian History MCQ
              </h1>
              <div className="bg-white border border-gray-200 px-4 py-1 rounded text-sm text-gray-600 font-medium">
                {String(currentIndex + 1).padStart(2, "0")}/
                {String(totalQuestions).padStart(2, "0")}
              </div>
            </div>

            {/* Question Content Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 flex flex-col gap-6 shadow-sm">
              {/* Paragraph button */}
              {currentQuestion?.paragraph && (
                <div className="flex">
                  <button
                    className="bg-[#1c7b9e] text-white px-4 py-2 rounded-sm flex items-center text-sm gap-2 hover:bg-[#15617d] transition-colors"
                    onClick={() => setShowParagraph(true)}
                  >
                    Read Comprehensive Paragraph
                  </button>
                </div>
              )}

              {/* Question text */}
              <div className="text-gray-800 font-medium">
                {currentIndex + 1}. {currentQuestion?.question_text}
              </div>

              {/* Question image */}
              {currentQuestion?.question_image && (
                <div className="w-full max-w-md" data-purpose="question-image">
                  <img
                    alt="Question illustration"
                    className="w-full rounded-sm object-cover aspect-video shadow-sm"
                    src={currentQuestion.question_image}
                  />
                </div>
              )}

              {/* Options */}
              <div className="mt-4">
                <p className="text-xs text-gray-500 mb-4 italic">
                  Choose the answer:
                </p>
                <div className="space-y-3" data-purpose="options-list">
                  {currentQuestion?.options.map((option, idx) => {
                    const isSelected =
                      answers[currentQuestion.id] === option.id;
                    return (
                      <label
                        key={option.id}
                        className={`flex items-center justify-between p-4 border rounded-md cursor-pointer transition-colors group ${
                          isSelected
                            ? "border-2 border-gray-800 bg-gray-50"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                        onClick={() =>
                          selectOption(currentQuestion.id, option.id)
                        }
                      >
                        <span className="text-gray-700 font-medium">
                          {letterPrefix[idx]}. {option.option_text}
                        </span>
                        <div className="relative flex items-center justify-center">
                          <input
                            className={`w-5 h-5 ${
                              isSelected
                                ? "text-gray-800 focus:ring-gray-800"
                                : "text-[#1c7b9e] focus:ring-[#1c7b9e]"
                            }`}
                            name="mcq"
                            type="radio"
                            checked={isSelected}
                            readOnly
                          />
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div
              className="flex flex-col items-center justify-stretch sm:flex-row gap-4 mt-auto"
              data-purpose="bottom-actions"
            >
              <button
                className={`px-10 py-3 rounded-md font-semibold transition-colors flex-1 w-full sm:flex-initial ${
                  markedForReview.has(currentQuestion?.id)
                    ? "bg-[#700070] text-white hover:bg-[#5a005a]"
                    : "bg-[#8b008b] text-white hover:bg-[#700070]"
                }`}
                onClick={() =>
                  currentQuestion && toggleMarkForReview(currentQuestion.id)
                }
              >
                {markedForReview.has(currentQuestion?.id)
                  ? "Unmark Review"
                  : "Mark for Review"}
              </button>
              <button
                className="bg-[#cccccc] flex-1 text-gray-700 px-14 py-3 rounded-md font-semibold hover:bg-[#bbbbbb] transition-colors w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={prevQuestion}
                disabled={currentIndex === 0}
              >
                Previous
              </button>
              {currentIndex < totalQuestions - 1 ? (
                <button
                  className="bg-[#1e2f3e] flex-1 text-white px-20 py-3 rounded-md font-semibold hover:bg-[#16242f] transition-colors w-full sm:w-auto"
                  onClick={nextQuestion}
                >
                  Next
                </button>
              ) : (
                <button
                  className="bg-green-600 flex-1 text-white px-20 py-3 rounded-md font-semibold hover:bg-green-700 transition-colors w-full sm:w-auto"
                  onClick={() => setShowModal(true)}
                >
                  Submit
                </button>
              )}
            </div>
          </section>

          {/* RightColumn - Status Sheet */}
          <aside
            className="lg:w-1/3 flex flex-col bg-white rounded-lg border border-gray-200 p-6 shadow-sm h-fit sticky top-14"
            data-purpose="status-sidebar"
          >
            {/* Status Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold text-gray-700">
                Question No. Sheet:
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-medium">
                  Remaining Time:
                </span>
                <div
                  className={`text-white px-3 py-1.5 rounded flex items-center gap-2 font-mono text-sm ${
                    remainingTime <= 60
                      ? "bg-red-600 animate-pulse"
                      : "bg-[#1e2f3e]"
                  }`}
                >
                  ⏱ {formatTimer(remainingTime)}
                </div>
              </div>
            </div>

            {/* Grid of Questions */}
            <div
              className="grid grid-cols-10 gap-2 mb-8"
              data-purpose="question-grid"
            >
              {questions.map((q, i) => {
                const status = getQuestionStatus(q.id);
                const isCurrent = i === currentIndex;
                let baseStyle =
                  "w-full aspect-square flex items-center justify-center rounded text-sm font-medium cursor-pointer transition-all hover:scale-105 ";

                if (isCurrent) {
                  baseStyle += "ring-2 ring-offset-1 ring-[#1c7b9e] ";
                }

                if (status === "answered_marked") {
                  return (
                    <div
                      key={q.id}
                      className={`${baseStyle} bg-[#8b008b] text-white relative`}
                      onClick={() => goToQuestion(i)}
                    >
                      {i + 1}
                      <div className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 bg-[#5cb85c] rounded-full" />
                    </div>
                  );
                }

                switch (status) {
                  case "answered":
                    baseStyle += "bg-[#5cb85c] text-white";
                    break;
                  case "not_answered":
                    baseStyle += "bg-[#f44336] text-white";
                    break;
                  case "marked":
                    baseStyle += "bg-[#8b008b] text-white";
                    break;
                  default:
                    baseStyle += "border border-gray-300 text-gray-600";
                }

                return (
                  <div
                    key={q.id}
                    className={baseStyle}
                    onClick={() => goToQuestion(i)}
                  >
                    {i + 1}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div
              className="grid grid-cols-2 gap-y-3 mt-4"
              data-purpose="legend"
            >
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#5cb85c] rounded-sm" />
                <span className="text-xs text-gray-600">
                  Attended ({attendedCount})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#f44336] rounded-sm" />
                <span className="text-xs text-gray-600">
                  Not Attended ({notAttendedCount})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#8b008b] rounded-sm" />
                <span className="text-xs text-gray-600">
                  Marked For Review ({markedCount})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative w-4 h-4 bg-[#8b008b] rounded-sm flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-[#5cb85c] rounded-full" />
                </div>
                <span className="text-xs text-gray-600">
                  Answered & Marked
                </span>
              </div>
            </div>

            {/* Submit button in sidebar */}
            <button
              className="mt-6 w-full bg-[#1e293b] hover:bg-[#0f172a] text-white py-3 rounded-lg font-bold text-sm shadow-lg transition-all transform active:scale-[0.98]"
              onClick={() => setShowModal(true)}
            >
              Submit Test
            </button>
          </aside>
        </main>

        {/* Submit Confirmation Modal */}
        {showModal && (
          <SubmitModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            onSubmit={handleSubmit}
            totalQuestions={totalQuestions}
            attended={attendedCount}
            notAttended={notAttendedCount}
            markedForReview={markedCount}
            loading={loading}
          />
        )}

        {/* Paragraph Modal */}
        {showParagraph && currentQuestion?.paragraph && (
          <Paragraph
            isOpen={showParagraph}
            onClose={() => setShowParagraph(false)}
            content={currentQuestion.paragraph}
          />
        )}
      </div>
    </AuthGuard>
  );
}