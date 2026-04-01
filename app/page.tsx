"use client";

import { FloatingLabel, HelperText } from "flowbite-react";
import { useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { useAuthStore } from "@/lib/stores/authStore";

export default function Home() {
  const router = useRouter();
  const {
    isAuthenticated,
    otpSent,
    isNewUser,
    loading,
    error,
    mobile,
    sendOtp,
    verifyOtp,
    createProfile,
    clearError,
  } = useAuthStore();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [qualification, setQualification] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Derive which card to show from auth state
  const activeCard = isNewUser ? "adduser" : otpSent ? "otp" : "login";

  // If already authenticated, redirect to instructions
  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/instructions");
    }
  }, [isAuthenticated, router]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;
    await sendOtp(phone.trim());
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) return;
    const result = await verifyOtp(otp.trim());
    if (result === "login") {
      router.push("/instructions");
    }
    // If "new_user", the state change will switch to adduser card
  };

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !qualification.trim() || !profileImage)
      return;
    const success = await createProfile({
      name: name.trim(),
      email: email.trim(),
      qualification: qualification.trim(),
      profile_image: profileImage,
    });
    if (success) {
      router.push("/instructions");
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      className="flex items-center justify-center h-screen bg-opacity-50"
      style={{
        backgroundImage: "url('/bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <main className="w-full max-w-5xl flex flex-col md:flex-row overflow-hidden rounded-xl bg-linear-to-b from-[#1C3141] to-[#487EA7] min-h-[400px]">
        {/* Left Section: NexLearn Brand */}
        <section className="hidden md:flex md:w-1/2 flex-col justify-between p-8 relative overflow-hidden">
          <div className="relative z-10">
            <img
              alt="Diverse students interacting with floating holographic interfaces and digital learning tablets in a high-tech study environment"
              className="w-full h-auto drop-shadow-2xl"
              src="/login_img1.png"
            />
          </div>
        </section>

        {/* Right Section: Login Form */}
        <section className="w-full md:w-1/2 bg-white flex flex-col justify-center p-8 m-3 rounded-xl md:p-16">
          {/* Mobile Logo (Visible only on small screens) */}
          <div className="md:hidden flex items-center gap-2 mb-12">
            <span
              className="material-symbols-outlined text-[#0c1322] text-3xl"
              style={{ fontVariationSettings: '"FILL" 1' }}
            >
              school
            </span>
            <span className="font-headline font-black text-xl text-[#0c1322]">
              NexLearn
            </span>
          </div>

          {/* Error banner */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-4 flex items-center justify-between">
              <span>{error}</span>
              <button
                onClick={clearError}
                className="text-red-500 hover:text-red-700 font-bold text-lg leading-none"
              >
                ×
              </button>
            </div>
          )}

          {/* ─── Login Card ─── */}
          {activeCard === "login" ? (
            <form
              className="max-w-sm mx-auto w-full flex flex-col gap-6 justify-between h-full"
              onSubmit={handleSendOtp}
            >
              <div className="space-y-6">
                <header className="mb-5">
                  <h2 className="text-[#0c1322] font-headline font-semibold text-3xl mb-3 tracking-tight">
                    Enter your phone number
                  </h2>
                  <p className="text-slate-500 font-body text-md leading-relaxed">
                    We use your mobile number to identify your account
                  </p>
                </header>
                <FloatingLabel
                  className="text-black"
                  variant="outlined"
                  label="Phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <HelperText color="info">
                  By tapping Get started, you agree to the Terms & Conditions
                </HelperText>
              </div>
              <button
                className="w-full bg-[#0c1322] hover:bg-[#1c2639] text-white py-4 px-6 rounded-xl font-headline font-bold text-lg shadow-xl shadow-slate-200 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                type="submit"
                disabled={loading || !phone.trim()}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    Sending...
                  </span>
                ) : (
                  "Get Started"
                )}
              </button>
            </form>
          ) : null}

          {/* ─── OTP Card ─── */}
          {activeCard === "otp" ? (
            <form
              className="max-w-sm mx-auto w-full flex flex-col gap-6 justify-between h-full"
              onSubmit={handleVerifyOtp}
            >
              <div className="space-y-6">
                <header className="mb-5">
                  <h2 className="text-[#0c1322] font-headline font-semibold text-3xl mb-3 tracking-tight">
                    Enter the code we texted you
                  </h2>
                  <p className="text-slate-500 font-body text-md leading-relaxed">
                    We&apos;ve sent an SMS to +91 {mobile}
                  </p>
                </header>
                <FloatingLabel
                  variant="outlined"
                  label="SMS code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <HelperText color="info">
                  Your 6 digit code is on its way. This can sometimes take a few
                  moments to arrive.
                </HelperText>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="text-[#0c1322] underline font-semibold text-sm hover:text-[#1c2639] transition-colors"
                    onClick={() => sendOtp(mobile)}
                    disabled={loading}
                  >
                    Resend code
                  </button>
                </div>
              </div>
              <button
                className="w-full bg-[#0c1322] hover:bg-[#1c2639] text-white py-4 px-6 rounded-xl font-headline font-bold text-lg shadow-xl shadow-slate-200 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                type="submit"
                disabled={loading || !otp.trim()}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    Verifying...
                  </span>
                ) : (
                  "Verify OTP"
                )}
              </button>
            </form>
          ) : null}

          {/* ─── Create Profile Card ─── */}
          {activeCard === "adduser" ? (
            <form
              className="max-w-sm mx-auto w-full flex flex-col gap-6 justify-between h-full"
              onSubmit={handleCreateProfile}
            >
              <div className="space-y-6">
                <header className="mb-5">
                  <h2 className="text-[#0c1322] font-headline font-semibold text-3xl mb-3 tracking-tight">
                    Add Your Details
                  </h2>
                </header>
                {/* IMAGE UPLOAD OPTION */}
                <div className="flex items-center gap-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageSelect}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="relative w-20 h-20 rounded-full border-2 border-dashed border-gray-300 hover:border-[#0c1322] transition-colors flex items-center justify-center overflow-hidden group"
                  >
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="material-symbols-outlined text-gray-400 text-3xl group-hover:text-[#0c1322] transition-colors">
                        add_a_photo
                      </span>
                    )}
                  </button>
                  <div className="flex flex-col">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-[#0c1322] underline font-semibold text-sm"
                    >
                      Upload Image
                    </button>
                    <span className="text-xs text-slate-400 mt-1">
                      {profileImage ? profileImage.name : "JPG, PNG (max 5MB)"}
                    </span>
                  </div>
                </div>
                <FloatingLabel
                  variant="outlined"
                  label="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <FloatingLabel
                  variant="outlined"
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <FloatingLabel
                  variant="outlined"
                  label="Your Qualification"
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                />
              </div>
              <button
                className="w-full bg-[#0c1322] hover:bg-[#1c2639] text-white py-3 px-6 rounded-xl font-headline font-bold text-lg shadow-xl shadow-slate-200 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                type="submit"
                disabled={
                  loading ||
                  !name.trim() ||
                  !email.trim() ||
                  !qualification.trim() ||
                  !profileImage
                }
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    Creating...
                  </span>
                ) : (
                  "Get Started"
                )}
              </button>
            </form>
          ) : null}
        </section>
      </main>
    </div>
  );
}
