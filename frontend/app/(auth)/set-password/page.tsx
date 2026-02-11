"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api-client";

function SetPasswordForm() {
  const searchParams = useSearchParams();
  const uid = searchParams.get("uid");
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const isValidLink = uid && token;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== passwordConfirm) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post("/auth/set-password/", {
        uid,
        token,
        password,
        password_confirm: passwordConfirm,
      });
      setIsSuccess(true);
    } catch (err: any) {
      const msg = err.message;
      if (Array.isArray(msg)) {
        setError(msg.join(" "));
      } else {
        setError(msg || "Something went wrong. The link may be invalid or expired.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isValidLink) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            Invalid Link
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            This password setup link is missing required parameters. Please
            contact your administrator for a new link.
          </p>
          <Link
            href="/login"
            className="inline-flex px-4 py-2 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            Password Set Successfully
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Your account is now active. You can log in with your email and the
            password you just created.
          </p>
          <Link
            href="/login"
            className="inline-flex px-6 py-2.5 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Set Your Password
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Create a secure password for your UnitoPMS account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl text-sm border border-red-100">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              minLength={8}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              placeholder="Confirm your password"
              required
              minLength={8}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 bg-white"
            />
          </div>

          <p className="text-xs text-gray-400">
            Password must be at least 8 characters and cannot be too similar to
            your personal information.
          </p>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Setting Password...
              </>
            ) : (
              "Set Password & Activate Account"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function SetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SetPasswordForm />
    </Suspense>
  );
}
