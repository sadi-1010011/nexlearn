import { create } from "zustand";
import { fetchQuestionsApi, submitAnswersApi } from "../api";

export interface Option {
  id: number;
  option_text: string;
  option_image?: string | null;
}

export interface Question {
  id: number;
  question_text: string;
  question_image?: string | null;
  paragraph?: string | null;
  options: Option[];
}

export interface ExamResult {
  exam_history_id: string;
  score: number;
  correct: number;
  wrong: number;
  not_attended: number;
  submitted_at: string;
  details: Array<{
    question_id: number;
    selected_option_id: number | null;
    correct_option_id: number;
    is_correct: boolean;
  }>;
}

interface ExamState {
  // Exam metadata
  questions: Question[];
  questionsCount: number;
  totalMarks: number;
  totalTime: number; // in minutes
  timeForEachQuestion: number;
  markPerAnswer: number;
  instruction: string;

  // Exam progress
  currentIndex: number;
  answers: Record<number, number | null>; // questionId -> selectedOptionId
  markedForReview: Set<number>; // questionIds
  visitedQuestions: Set<number>; // questionIds
  remainingTime: number; // in seconds

  // Results
  examResult: ExamResult | null;

  // UI
  loading: boolean;
  error: string | null;
  examStarted: boolean;

  // Actions
  loadQuestions: () => Promise<boolean>;
  selectOption: (questionId: number, optionId: number) => void;
  clearOption: (questionId: number) => void;
  toggleMarkForReview: (questionId: number) => void;
  goToQuestion: (index: number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  tick: () => void;
  startExam: () => void;
  submitExam: () => Promise<boolean>;
  resetExam: () => void;
}

export const useExamStore = create<ExamState>()((set, get) => ({
  questions: [],
  questionsCount: 0,
  totalMarks: 0,
  totalTime: 0,
  timeForEachQuestion: 0,
  markPerAnswer: 0,
  instruction: "",

  currentIndex: 0,
  answers: {},
  markedForReview: new Set<number>(),
  visitedQuestions: new Set<number>(),
  remainingTime: 0,

  examResult: null,

  loading: false,
  error: null,
  examStarted: false,

  loadQuestions: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetchQuestionsApi();
      if (res.success) {
        // Map API response keys to the internal Question format
        const formattedQuestions = res.questions?.map((q: any) => ({
          id: q.question_id,
          question_text: q.question, // Map 'question' to 'question_text'
          question_image: q.image,   // Map 'image' to 'question_image'
          paragraph: q.comprehension, // Map 'comprehension' to 'paragraph'
          options: q.options?.map((opt: any) => ({
            id: opt.id,
            option_text: opt.option, // Map 'option' to 'option_text'
            option_image: opt.image  // Map 'image' to 'option_image'
          })) || []
        })) || [];

        set({
          questions: formattedQuestions,
          questionsCount: res.questions_count || 0,
          totalMarks: res.total_marks || 0,
          totalTime: res.total_time || 0,
          timeForEachQuestion: res.time_for_each_question || 0,
          markPerAnswer: res.mark_per_each_answer || 0,
          instruction: res.instruction || "",
          remainingTime: (res.total_time || 0) * 60, // convert to seconds
          loading: false,
        });
        return true;
      }
      set({ error: res.message || "Failed to load questions", loading: false });
      return false;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to load questions";
      set({ error: message, loading: false });
      return false;
    }
  },

  selectOption: (questionId: number, optionId: number) => {
    set((state) => ({
      answers: { ...state.answers, [questionId]: optionId },
    }));
  },

  clearOption: (questionId: number) => {
    set((state) => {
      const newAnswers = { ...state.answers };
      delete newAnswers[questionId];
      return { answers: newAnswers };
    });
  },

  toggleMarkForReview: (questionId: number) => {
    set((state) => {
      const newSet = new Set(state.markedForReview);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return { markedForReview: newSet };
    });
  },

  goToQuestion: (index: number) => {
    const { questions } = get();
    if (index >= 0 && index < questions.length) {
      set((state) => {
        const newVisited = new Set(state.visitedQuestions);
        newVisited.add(questions[index].id);
        return { currentIndex: index, visitedQuestions: newVisited };
      });
    }
  },

  nextQuestion: () => {
    const { currentIndex, questions } = get();
    if (currentIndex < questions.length - 1) {
      get().goToQuestion(currentIndex + 1);
    }
  },

  prevQuestion: () => {
    const { currentIndex } = get();
    if (currentIndex > 0) {
      get().goToQuestion(currentIndex - 1);
    }
  },

  tick: () => {
    set((state) => ({
      remainingTime: Math.max(0, state.remainingTime - 1),
    }));
  },

  startExam: () => {
    const { questions } = get();
    const visited = new Set<number>();
    if (questions.length > 0) {
      visited.add(questions[0].id);
    }
    set({ examStarted: true, visitedQuestions: visited });
  },

  submitExam: async () => {
    const { questions, answers } = get();
    set({ loading: true, error: null });

    try {
      const answerPayload = questions.map((q) => ({
        question_id: q.id,
        selected_option_id: answers[q.id] ?? null,
      }));

      const res = await submitAnswersApi(answerPayload);
      if (res.success) {
        set({
          examResult: {
            exam_history_id: res.exam_history_id,
            score: res.score,
            correct: res.correct,
            wrong: res.wrong,
            not_attended: res.not_attended,
            submitted_at: res.submitted_at,
            details: res.details || [],
          },
          examStarted: false,
          loading: false,
        });
        return true;
      }
      set({ error: res.message || "Submission failed", loading: false });
      return false;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Submission failed";
      set({ error: message, loading: false });
      return false;
    }
  },

  resetExam: () => {
    set({
      questions: [],
      questionsCount: 0,
      totalMarks: 0,
      totalTime: 0,
      timeForEachQuestion: 0,
      markPerAnswer: 0,
      instruction: "",
      currentIndex: 0,
      answers: {},
      markedForReview: new Set<number>(),
      visitedQuestions: new Set<number>(),
      remainingTime: 0,
      examResult: null,
      loading: false,
      error: null,
      examStarted: false,
    });
  },
}));
