import React, { useState } from 'react';
import { X, UserPlus, CheckCircle2, Copy, Check, AlertCircle } from 'lucide-react';
import type { User } from '../../types/user';
import { ApiError } from '../../lib/api';

interface NewEmployeeInput {
  fullName: string;
  email: string;
  jobTitle?: string;
  department?: string;
  role?: 'EMPLOYEE' | 'ADMIN';
}

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateEmployee: (payload: NewEmployeeInput) => Promise<{ user: User; temporaryPassword: string }>;
}

export const InviteModal: React.FC<InviteModalProps> = ({ isOpen, onClose, onCreateEmployee }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [role, setRole] = useState<'EMPLOYEE' | 'ADMIN'>('EMPLOYEE');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [created, setCreated] = useState<{ user: User; temporaryPassword: string } | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const reset = () => {
    setFullName('');
    setEmail('');
    setJobTitle('');
    setDepartment('');
    setRole('EMPLOYEE');
    setErrorMessage('');
    setCreated(null);
    setCopied(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) return;

    setErrorMessage('');
    setIsSubmitting(true);
    try {
      const result = await onCreateEmployee({
        fullName: fullName.trim(),
        email: email.trim(),
        jobTitle: jobTitle.trim() || undefined,
        department: department.trim() || undefined,
        role,
      });
      setCreated(result);
    } catch (err) {
      setErrorMessage(err instanceof ApiError ? err.message : 'Could not create the account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = async () => {
    if (!created) return;
    await navigator.clipboard.writeText(`Email: ${created.user.email}\nPassword: ${created.temporaryPassword}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-5 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <UserPlus className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900">Add Employee</h3>
          </div>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {created ? (
          <div className="py-4 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 text-base">{created.user.fullName}'s account is ready</h4>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Share these credentials with them directly — this password is shown only once.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2 font-mono">
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-sans font-bold">Email</span>
                <span className="text-sm text-slate-900">{created.user.email}</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-sans font-bold">Temporary Password</span>
                <span className="text-sm text-slate-900">{created.temporaryPassword}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCopy}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy Credentials'}</span>
              </button>
              <button
                onClick={handleClose}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl shadow-md shadow-emerald-600/20 transition-all"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div>
              <label className="block text-slate-700 uppercase tracking-wider text-[10px] font-bold mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Priya Sharma"
                className="w-full bg-slate-100 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl px-4 py-3 text-slate-900 focus:outline-none transition-all font-medium"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="block text-slate-700 uppercase tracking-wider text-[10px] font-bold mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="priya@i11sprint.com"
                className="w-full bg-slate-100 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl px-4 py-3 text-slate-900 focus:outline-none transition-all font-medium"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 uppercase tracking-wider text-[10px] font-bold mb-1.5">
                  Job Title
                </label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="Optional"
                  className="w-full bg-slate-100 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-slate-700 uppercase tracking-wider text-[10px] font-bold mb-1.5">
                  Department
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="Optional"
                  className="w-full bg-slate-100 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 uppercase tracking-wider text-[10px] font-bold mb-1.5">
                Access Level
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as 'EMPLOYEE' | 'ADMIN')}
                className="w-full bg-slate-100 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none transition-all"
              >
                <option value="EMPLOYEE">Employee (view tasks, update status)</option>
                <option value="ADMIN">Admin (full task & team management)</option>
              </select>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-60"
              >
                <UserPlus className="w-4 h-4" />
                <span>{isSubmitting ? 'Creating...' : 'Create Account'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
