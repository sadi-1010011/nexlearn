"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/authStore";
import { useExamStore } from "@/lib/stores/examStore";

export default function Header() {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const resetExam = useExamStore((s) => s.resetExam);

  const handleLogout = () => {
    resetExam();
    logout();
    router.push("/");
  };

  return (
    <header
      className="w-full bg-white border-b border-slate-100 px-6 py-4 flex justify-between items-center sticky top-0 z-10"
      data-purpose="navigation-header"
    >
      <div className="flex-1" />
      {/* Logo */}
      <div className="flex flex-col items-center" data-purpose="logo-container">
        <div className="flex items-center gap-2">
          <svg
            className="w-8 h-8 text-[#187c96]"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM3.89 9.5l8.11 4.42 8.11-4.42L12 5.08 3.89 9.5z" />
            <path d="M12 16.5l-6-3.27V16l6 3.27L18 16v-2.77l-6 3.27z" />
          </svg>
          <div className="flex flex-col leading-tight">
            <span className="text-xl font-extrabold tracking-tight text-[#1e3a5f]">
              NexLearn
            </span>
            <span className="text-[10px] uppercase tracking-widest text-[#187c96] font-semibold -mt-1">
              futuristic learning
            </span>
          </div>
        </div>
      </div>
      <div className="flex-1 flex justify-end">
        <button
          className="bg-[#187c96] hover:bg-[#156a81] text-white px-6 py-2 rounded-md text-sm font-semibold transition-colors"
          data-purpose="logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </header>
  );
}