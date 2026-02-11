'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (!email || !password) {
        throw new Error('Please enter both email and password.');
      }
      
      // Navigate to dashboard (simulating expected behavior)
      console.log('Login successful for:', email);
      // Save dummy user to local storage if needed, or rely on cookie from backend
      localStorage.setItem('user', JSON.stringify({ email, role: 'host' }));
      
      router.push('/dashboard'); 
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white lg:grid lg:grid-cols-2 pt-20 lg:pt-0">
      {/* ─── Left Side: Branding & Info (Hidden on Mobile) ─── */}
      <div className="hidden lg:flex flex-col justify-center px-12 relative bg-slate-950 text-white overflow-hidden">
        {/* Background Gradient/Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-950 z-0" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />

        <div className="relative z-10 max-w-lg">
          <h1 className="text-4xl font-bold mb-6 leading-tight">
            Welcome Back to <span className="text-teal-400">UnitoPMS</span>
          </h1>
          <p className="text-lg text-gray-300 mb-8 leading-relaxed">
            Log in to access your dashboard, manage properties, and monitor performance in real-time.
          </p>

          <div className="space-y-6">
            <div className="p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                <span className="text-sm font-medium text-teal-300 uppercase tracking-wider">System Status</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-1">All Systems Operational</h3>
              <p className="text-sm text-gray-400">Running v2.5.0 with latest AI updates.</p>
            </div>

            <div className="flex gap-4 pt-4">
              <div className="flex -space-x-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} style={{zIndex: 5-i}} className={`w-10 h-10 rounded-full border-2 border-slate-900 bg-gray-700 flex items-center justify-center overflow-hidden relative`}>
                    <div className={`w-full h-full bg-gradient-to-br from-gray-${600-i*100} to-gray-${800-i*100}`}></div>
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-gray-700 flex items-center justify-center overflow-hidden relative z-[2]">
                  <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-500 text-xs font-bold text-white flex items-center justify-center">+4k</div>
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-sm font-bold text-white">4,000+ Property Managers</span>
                <span className="text-xs text-gray-400">Trust UnitoPMS daily</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Right Side: Login Form ─── */}
      <div className="flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24 py-12 lg:py-0 overflow-y-auto h-full">
        {/* Spacer for fixed navbar */}
        <div className="h-0 lg:h-20 shrink-0"></div>

        <div className="w-full max-w-sm mx-auto lg:w-96">
          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Sign in
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Access your property management dashboard
            </p>
          </div>

          <div className="bg-white">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm border border-red-100 flex items-center gap-2">
                  <span className="font-semibold">Error:</span> {error}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-1">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="text"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full appearance-none rounded-xl border border-gray-200 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-teal-500 sm:text-sm text-gray-900 bg-white"
                  placeholder="admin@unitopms.com"
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
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full appearance-none rounded-xl border border-gray-200 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-teal-500 sm:text-sm text-gray-900 bg-white"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link href="/forgot-password" className="font-medium text-teal-600 hover:text-teal-500">
                    Forgot password?
                  </Link>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full justify-center rounded-xl border border-transparent bg-gradient-to-r from-slate-900 via-cyan-700 to-teal-500 py-3 px-4 text-sm font-bold text-white shadow-sm hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                       <Loader2 className="animate-spin h-4 w-4" />
                       Signing in...
                    </span>
                  ) : (
                    "Sign in"
                  )}
                </button>
              </div>
            </form>

            <div className="mt-8 text-center text-sm">
              <span className="text-gray-600">Don't have an account? </span>
              <Link
                href="/register"
                className="font-medium text-teal-600 hover:text-teal-500 transition-colors"
              >
                Create free account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
