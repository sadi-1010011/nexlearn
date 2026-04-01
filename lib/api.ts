import axios from "axios";
import { useAuthStore } from "./stores/authStore";

const api = axios.create({
  baseURL: "/api",
});

// Request interceptor — attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth state and redirect to login
      useAuthStore.getState().logout();
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

// ─── Auth APIs ───────────────────────────────────────────────────

export async function sendOtpApi(mobile: string) {
  const formData = new FormData();
  formData.append("mobile", mobile);
  const { data } = await api.post("/auth/send-otp", formData);
  return data;
}

export async function verifyOtpApi(mobile: string, otp: string) {
  const formData = new FormData();
  formData.append("mobile", mobile);
  formData.append("otp", otp);
  const { data } = await api.post("/auth/verify-otp", formData);
  return data;
}

export async function createProfileApi(profileData: {
  mobile: string;
  name: string;
  email: string;
  qualification: string;
  profile_image: File;
}) {
  const formData = new FormData();
  formData.append("mobile", profileData.mobile);
  formData.append("name", profileData.name);
  formData.append("email", profileData.email);
  formData.append("qualification", profileData.qualification);
  formData.append("profile_image", profileData.profile_image);
  const { data } = await api.post("/auth/create-profile", formData);
  return data;
}

// ─── Exam APIs ───────────────────────────────────────────────────

export async function fetchQuestionsApi() {
  const { data } = await api.get("/question/list");
  return data;
}

export async function submitAnswersApi(
  answers: { question_id: number; selected_option_id: number | null }[]
) {
  const formData = new FormData();
  formData.append("answers", JSON.stringify(answers));
  const { data } = await api.post("/answers/submit", formData);
  return data;
}

export default api;
