import React, { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Fingerprint, Network, CheckCircle2, AlertCircle } from 'lucide-react';
import type { UserRole } from './RoleSwitcher';
import { useLogin } from '../../hooks/useAuth';
import { ApiError } from '../../lib/api';

interface LoginFormProps {
  role: UserRole;
}

export const LoginForm: React.FC<LoginFormProps> = ({ role }) => {
  const navigate = useNavigate();
  const loginMutation = useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const isLoading = loginMutation.isPending;

  // Update default preset email when role changes (seeded demo accounts)
  useEffect(() => {
    if (role === 'admin') {
      setEmail('jagdeep@i11sprint.com');
      setPassword('admin123');
    } else {
      setEmail('ujwal@i11sprint.com');
      setPassword('sprint2024!');
    }
    setErrorMessage('');
  }, [role]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    loginMutation.mutate(
      { email, password },
      {
        onSuccess: (user) => {
          setSuccessMessage(`Welcome back, ${user.fullName}! Redirecting...`);
          setTimeout(() => {
            navigate({ to: '/dashboard' });
          }, 500);
        },
        onError: (err) => {
          setErrorMessage(err instanceof ApiError ? err.message : 'Unable to sign in. Please try again.');
        },
      }
    );
  };

  const handleQuickAuth = (method: string) => {
    setErrorMessage(`${method} sign-in isn't wired up yet — please use email and password.`);
  };

  return (
    <div className="w-full">
      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-7">
        Welcome Back
      </h1>

      {errorMessage && (
        <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold flex items-center gap-2.5 animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs font-semibold flex items-center gap-2.5 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email Address Field */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Email Address
          </label>
          <div className="relative flex items-center bg-[#EEF2FF]/80 hover:bg-[#EEF2FF] border border-indigo-100/60 focus-within:border-indigo-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-100/80 transition-all rounded-xl px-4 py-3.5 group">
            <Mail className="w-5 h-5 text-indigo-400 group-focus-within:text-indigo-600 mr-3 flex-shrink-0 transition-colors" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 font-medium text-sm focus:outline-none"
              required
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Password
            </label>
            <a
              href="#forgot"
              onClick={(e) => {
                e.preventDefault();
                alert('Password reset link has been dispatched to your email.');
              }}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              Forgot?
            </a>
          </div>
          <div className="relative flex items-center bg-[#EEF2FF]/80 hover:bg-[#EEF2FF] border border-indigo-100/60 focus-within:border-indigo-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-100/80 transition-all rounded-xl px-4 py-3.5 group">
            <Lock className="w-5 h-5 text-indigo-400 group-focus-within:text-indigo-600 mr-3 flex-shrink-0 transition-colors" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 font-medium text-sm focus:outline-none"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-slate-400 hover:text-slate-600 ml-2 focus:outline-none transition-colors"
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Remember this device toggle */}
        <div className="flex items-center gap-3 pt-1">
          <button
            type="button"
            role="switch"
            aria-checked={rememberDevice}
            onClick={() => setRememberDevice(!rememberDevice)}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
              rememberDevice ? 'bg-indigo-600' : 'bg-slate-200'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                rememberDevice ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
          <span
            onClick={() => setRememberDevice(!rememberDevice)}
            className="text-sm font-semibold text-slate-700 select-none cursor-pointer"
          >
            Remember this device
          </span>
        </div>

        {/* Sign In Primary Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 hover:gap-3 transition-all duration-200 group focus:ring-4 focus:ring-indigo-200 disabled:opacity-75 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Verifying Credentials...</span>
            </div>
          ) : (
            <>
              <span>Sign In to Dashboard</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-7 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200"></div>
        </div>
        <div className="relative bg-white px-4 text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
          Or Continue With
        </div>
      </div>

      {/* SSO & Passkey Options */}
      <div className="grid grid-cols-2 gap-3.5">
        <button
          type="button"
          onClick={() => handleQuickAuth('SSO')}
          className="border border-slate-200/90 hover:border-indigo-200 hover:bg-slate-50 text-slate-700 font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2.5 transition-all text-xs shadow-xs group"
        >
          <Network className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform" />
          <span>SSO</span>
        </button>

        <button
          type="button"
          onClick={() => handleQuickAuth('Passkey')}
          className="border border-slate-200/90 hover:border-indigo-200 hover:bg-slate-50 text-slate-700 font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2.5 transition-all text-xs shadow-xs group"
        >
          <Fingerprint className="w-4 h-4 text-slate-800 group-hover:scale-110 transition-transform" />
          <span>Passkey</span>
        </button>
      </div>
    </div>
  );
};
