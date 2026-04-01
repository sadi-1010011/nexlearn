import { create } from "zustand";
import { persist } from "zustand/middleware";
import { sendOtpApi, verifyOtpApi, createProfileApi } from "../api";

export interface User {
  id?: number;
  name?: string;
  email?: string;
  mobile?: string;
  qualification?: string;
  profile_image?: string;
}

interface AuthState {
  mobile: string;
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  otpSent: boolean;
  isNewUser: boolean;
  loading: boolean;
  error: string | null;

  setMobile: (mobile: string) => void;
  sendOtp: (mobile: string) => Promise<boolean>;
  verifyOtp: (otp: string) => Promise<"login" | "new_user" | "error">;
  createProfile: (data: {
    name: string;
    email: string;
    qualification: string;
    profile_image: File;
  }) => Promise<boolean>;
  logout: () => void;
  setTokens: (access: string, refresh: string) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      mobile: "",
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      otpSent: false,
      isNewUser: false,
      loading: false,
      error: null,

      setMobile: (mobile: string) => set({ mobile }),

      sendOtp: async (mobile: string) => {
        set({ loading: true, error: null });
        try {
          const res = await sendOtpApi(mobile);
          if (res.success) {
            set({ mobile, otpSent: true, loading: false });
            return true;
          }
          set({ error: res.message || "Failed to send OTP", loading: false });
          return false;
        } catch (err: unknown) {
          const message =
            err instanceof Error ? err.message : "Failed to send OTP";
          set({ error: message, loading: false });
          return false;
        }
      },

      verifyOtp: async (otp: string) => {
        set({ loading: true, error: null });
        try {
          const res = await verifyOtpApi(get().mobile, otp);
          if (res.success) {
            if (res.login) {
              // Existing user — tokens returned
              set({
                accessToken: res.access_token,
                refreshToken: res.refresh_token,
                isAuthenticated: true,
                isNewUser: false,
                loading: false,
              });
              return "login";
            } else {
              // New user — needs profile creation
              set({ isNewUser: true, loading: false });
              return "new_user";
            }
          }
          set({
            error: res.message || "OTP verification failed",
            loading: false,
          });
          return "error";
        } catch (err: unknown) {
          const message =
            err instanceof Error ? err.message : "OTP verification failed";
          set({ error: message, loading: false });
          return "error";
        }
      },

      createProfile: async (data) => {
        set({ loading: true, error: null });
        try {
          const res = await createProfileApi({
            mobile: get().mobile,
            ...data,
          });
          if (res.success) {
            set({
              accessToken: res.access_token,
              refreshToken: res.refresh_token,
              user: res.user || null,
              isAuthenticated: true,
              isNewUser: false,
              loading: false,
            });
            return true;
          }
          set({
            error: res.message || "Profile creation failed",
            loading: false,
          });
          return false;
        } catch (err: unknown) {
          const message =
            err instanceof Error ? err.message : "Profile creation failed";
          set({ error: message, loading: false });
          return false;
        }
      },

      logout: () => {
        set({
          mobile: "",
          accessToken: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
          otpSent: false,
          isNewUser: false,
          loading: false,
          error: null,
        });
      },

      setTokens: (access: string, refresh: string) =>
        set({ accessToken: access, refreshToken: refresh }),

      clearError: () => set({ error: null }),
    }),
    {
      name: "nexlearn-auth",
      partialize: (state) => ({
        mobile: state.mobile,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
