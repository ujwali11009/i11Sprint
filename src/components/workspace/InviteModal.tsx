import React, { useState } from 'react';
import { X, Send, UserPlus, CheckCircle2 } from 'lucide-react';

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InviteModal: React.FC<InviteModalProps> = ({ isOpen, onClose }) => {
  const [emails, setEmails] = useState('');
  const [role, setRole] = useState('Member');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emails.trim()) return;

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setEmails('');
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-5 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <UserPlus className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900">Invite Team Members</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="font-extrabold text-slate-900 text-base">Invitations Dispatched!</h4>
            <p className="text-xs text-slate-500 font-medium">Team members will receive an invite link via email.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
            <div>
              <label className="block text-slate-700 uppercase tracking-wider text-[10px] font-bold mb-1.5">
                Email Addresses (comma separated)
              </label>
              <textarea
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
                placeholder="colleague@agency.com, lead@company.com"
                rows={3}
                className="w-full bg-slate-100 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl px-4 py-3 text-slate-900 focus:outline-none transition-all resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 uppercase tracking-wider text-[10px] font-bold mb-1.5">
                Project Permission Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-slate-100 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none transition-all"
              >
                <option value="Member">Member (Can edit tasks)</option>
                <option value="Viewer">Viewer (Read-only access)</option>
                <option value="Admin">Admin (Full project management)</option>
              </select>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Send Invites</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
