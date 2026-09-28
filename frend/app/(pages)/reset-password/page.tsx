'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Loader2, CheckCircle2 } from 'lucide-react';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token, newPassword: password }),
      });
      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => router.push('/Sign-in'), 3000);
      } else {
        setErrorMsg(data.message || 'Link is invalid or has expired.');
      }
    } catch {
      setErrorMsg('Failed to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  if (!token || !email) {
    return (
      <div className="text-center space-y-3">
        <p className="text-red-500 font-semibold text-sm">Invalid or missing reset token.</p>
        <Link href="/forgot-password" className="text-xs text-[#00535B] underline">
          Request a new link
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white max-w-md w-full p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
      {success ? (
        <div className="text-center space-y-4 py-4">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 size={32} />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Password Reset!</h2>
          <p className="text-sm text-slate-500">
            Your password has been reset successfully. Redirecting to login...
          </p>
        </div>
      ) : (
        <>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Set New Password</h1>
            <p className="text-sm text-slate-500 mt-1">Please enter your new password below.</p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleReset} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#00535B]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#00535B]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#00535B] hover:bg-[#003d42] text-white font-semibold text-sm rounded-xl transition shadow-sm flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Update Password'}
            </button>
          </form>
        </>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[#EDFCFF] flex items-center justify-center p-4">
      <Suspense fallback={<div className="text-slate-400 text-sm">Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}