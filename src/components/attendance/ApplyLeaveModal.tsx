import React, { useState } from 'react';
import { X, Calendar, Palmtree } from 'lucide-react';
import type { LeaveRequest } from '../../types/attendance';

interface ApplyLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyLeave: (request: Omit<LeaveRequest, 'id' | 'status' | 'requestedAt'>) => void;
}

export const ApplyLeaveModal: React.FC<ApplyLeaveModalProps> = ({
  isOpen,
  onClose,
  onApplyLeave,
}) => {
  const todayIso = new Date().toISOString().slice(0, 10);
  const [leaveType, setLeaveType] = useState<'Annual Leave' | 'Casual Leave' | 'Sick Leave'>('Annual Leave');
  const [startDate, setStartDate] = useState(todayIso);
  const [endDate, setEndDate] = useState(todayIso);
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const calculateDays = () => {
    if (!startDate || !endDate) return 1;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return isNaN(diffDays) || diffDays < 1 ? 1 : diffDays;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApplyLeave({
      leaveType,
      startDate,
      endDate,
      totalDays: calculateDays(),
      reason,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn font-sans text-slate-900">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-normal">
              <Palmtree className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Apply for Leave</h3>
              <p className="text-xs text-slate-500 font-normal">Select dates and submit for admin approval</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-normal">
          {/* Leave Type */}
          <div>
            <label className="block text-slate-700 uppercase tracking-wider text-[10px] font-normal mb-1.5">
              Leave Type
            </label>
            <select
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200/80 focus:border-purple-500 focus:bg-white rounded-xl px-4 py-3 text-slate-900 focus:outline-none transition-all font-normal"
            >
              <option value="Annual Leave">Annual Leave (Paid Time Off)</option>
              <option value="Casual Leave">Casual Leave</option>
              <option value="Sick Leave">Sick Leave</option>
            </select>
          </div>

          {/* Date Picker Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 uppercase tracking-wider text-[10px] font-normal mb-1.5">
                Start Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200/80 focus:border-purple-500 focus:bg-white rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none transition-all font-normal"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 uppercase tracking-wider text-[10px] font-normal mb-1.5">
                End Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200/80 focus:border-purple-500 focus:bg-white rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none transition-all font-normal"
                  required
                />
              </div>
            </div>
          </div>

          {/* Total Duration Banner */}
          <div className="bg-purple-50 border border-purple-200/80 rounded-xl p-3 flex items-center justify-between text-xs text-purple-900 font-normal">
            <span>Total Leave Duration:</span>
            <span className="font-normal text-purple-700 bg-white px-2.5 py-0.5 rounded-md border border-purple-200">
              {calculateDays()} {calculateDays() === 1 ? 'Day' : 'Days'}
            </span>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-slate-700 uppercase tracking-wider text-[10px] font-normal mb-1.5">
              Reason for Leave
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Provide context or reason for this leave request..."
              rows={3}
              className="w-full bg-slate-50 border border-slate-200/80 focus:border-purple-500 focus:bg-white rounded-xl px-4 py-3 text-slate-900 focus:outline-none transition-all resize-none font-normal"
              required
            />
          </div>

          {/* Actions */}
          <div className="pt-3 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-normal py-3 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-normal py-3 rounded-xl shadow-md shadow-purple-600/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <Calendar className="w-4 h-4" />
              <span>Submit for Approval</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
