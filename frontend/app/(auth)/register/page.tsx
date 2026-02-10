"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }

      // TODO: Replace with actual API call
      // Mock registration for now
      if (email && password && name) {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          login({
              id: "2",
              email,
              full_name: name,
              is_platform_admin: false,
              active_organization: null
          });
          router.push("/host/dashboard");
      } else {
        throw new Error("Please fill in all fields");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during registration");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white lg:grid lg:grid-cols-2 pt-20 lg:pt-0">
      {/* Left Side - Info & Branding */}
      <div className="hidden lg:flex flex-col justify-center px-12 relative bg-slate-900 text-white overflow-hidden">
        {/* Background Gradient/Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-950 z-0" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />

        <div className="relative z-10 max-w-lg">
          <h1 className="text-4xl font-bold mb-6 leading-tight">
            Join the Future of <span className="text-purple-400">Hospitality</span>
          </h1>
          <p className="text-lg text-gray-300 mb-8 leading-relaxed">
            Create an account to streamline your operations, enhance guest experiences, and grow your business.
          </p>

          <div className="space-y-6">
            <div className="p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></div>
                <span className="text-sm font-medium text-purple-300 uppercase tracking-wider">Fast Setup</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-1">Get Started in Minutes</h3>
              <p className="text-sm text-gray-400">No credit card required for 14-day trial.</p>
            </div>

            <div className="flex gap-4 pt-4">
              <div className="flex -space-x-3">
                 <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-gray-700 flex items-center justify-center overflow-hidden relative z-[5]">
                  <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800"></div>
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-gray-700 flex items-center justify-center overflow-hidden relative z-[4]">
                  <div className="w-full h-full bg-gradient-to-br from-gray-500 to-gray-700"></div>
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-gray-700 flex items-center justify-center overflow-hidden relative z-[3]">
                  <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600"></div>
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-gray-700 flex items-center justify-center overflow-hidden relative z-[2]">
                  <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-500 text-xs font-bold text-white flex items-center justify-center">+4k</div>
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-sm font-bold text-white">Join 4,000+ Managers</span>
                <span className="text-xs text-gray-400">Growing together</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24 py-12 lg:py-0 overflow-y-auto h-full">
        {/* Space for fixed navbar on mobile/desktop */}
        <div className="h-0 lg:h-20 shrink-0"></div>

        <div className="w-full max-w-sm mx-auto lg:w-96">
          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Create Account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Start your journey with UnitoPMS
            </p>
          </div>

          <div className="bg-white">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm border border-red-100">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-1">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full appearance-none rounded-xl border border-gray-200 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm text-gray-900 bg-white"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-1">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full appearance-none rounded-xl border border-gray-200 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm text-gray-900 bg-white"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full appearance-none rounded-xl border border-gray-200 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm text-gray-900 bg-white"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-900 mb-1">
                  Confirm Password
                </label>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full appearance-none rounded-xl border border-gray-200 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm text-gray-900 bg-white"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full justify-center rounded-xl border border-transparent bg-gradient-to-r from-slate-900 via-purple-700 to-indigo-500 py-3 px-4 text-sm font-bold text-white shadow-sm hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                       <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Creating Account...
                    </span>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </div>
            </form>

            <div className="mt-8 text-center text-sm">
              <span className="text-gray-600">Already have an account? </span>
              <Link
                href="/login"
                className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
