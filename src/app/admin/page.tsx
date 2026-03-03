"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { verifyAdmin, loginAdmin, resetPassword } from "@/lib/clientStore";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!verifyAdmin(username, password)) {
        setError("Invalid username or password");
        setLoading(false);
        return;
      }

      loginAdmin();
      router.push("/admin/dashboard");
    } catch {
      setError("Something went wrong");
      setLoading(false);
    }
  };

  const handleResetPassword = () => {
    resetPassword();
    setResetDone(true);
    setShowReset(false);
    setUsername("admin");
    setPassword("");
    setError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-stone-50">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-brand-green rounded-2xl flex items-center justify-center mx-auto">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
          </div>
          <h1 className="font-heading font-bold text-xl text-stone-900 mt-4">
            QuickMart Admin
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Sign in to manage your store
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-600 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green"
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm rounded-xl p-3 border border-red-200">
              {error}
            </div>
          )}

          {resetDone && (
            <div className="bg-emerald-50 text-emerald-700 text-sm rounded-xl p-3 border border-emerald-200">
              Password reset! Use <strong>admin</strong> / <strong>admin123</strong> to login.
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-green hover:bg-brand-green-dark text-white font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setShowReset(true)}
              className="text-xs text-stone-400 hover:text-brand-green transition-colors"
            >
              Forgot Password?
            </button>
          </div>
        </form>

        {/* Forgot Password Modal */}
        {showReset && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
              <h3 className="font-heading font-bold text-lg text-stone-900 mb-2">
                Reset Password
              </h3>
              <p className="text-sm text-stone-500 mb-5">
                This will reset your admin password back to the default
                credentials:
              </p>
              <div className="bg-stone-50 rounded-xl p-3 mb-5 border border-stone-200">
                <p className="text-sm text-stone-700">
                  Username: <strong>admin</strong>
                </p>
                <p className="text-sm text-stone-700">
                  Password: <strong>admin123</strong>
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowReset(false)}
                  className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium py-2.5 rounded-xl text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResetPassword}
                  className="flex-1 bg-brand-orange hover:bg-brand-orange-dark text-white font-medium py-2.5 rounded-xl text-sm transition-colors"
                >
                  Reset Password
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
