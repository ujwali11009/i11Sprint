import React from 'react';
import { Clock, LogIn, LogOut, CheckCircle2 } from 'lucide-react';
import type { ClockStatus } from '../../types/attendance';

interface TodayStatusCardProps {
  status?: ClockStatus;
  isBusy?: boolean;
  onClockIn: () => void;
  onClockOut: () => void;
}

export const TodayStatusCard: React.FC<TodayStatusCardProps> = ({ status, isBusy, onClockIn, onClockOut }) => {
  const isClockedIn = status?.isClockedIn ?? false;
  const currentStatus = status?.currentStatus ?? 'Clocked Out';
  const clockInTime = status?.clockInTime ?? '—';
  const clockOutTime = status?.clockOutTime ?? '—';
  const workedHours = status?.workedHours ?? '0h 00m';

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
          <Clock className="w-4 h-4 text-indigo-600" />
          <span>Today's Attendance Status</span>
        </h3>
        <span className="text-[11px] font-normal text-slate-400">
          {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
        </span>
      </div>

      <div className="space-y-3">
        {/* Current Status */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/60">
          <span className="text-xs font-normal text-slate-500">Current Status</span>
          <span
            className={`text-xs font-normal px-3 py-1 rounded-full flex items-center gap-1.5 ${
              isClockedIn
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
                : 'bg-amber-50 text-amber-700 border border-amber-200/80'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{currentStatus}</span>
          </span>
        </div>

        {/* Clock In */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/60">
          <span className="text-xs font-normal text-slate-500">Clock In</span>
          <span className="text-xs font-normal text-slate-900">{clockInTime}</span>
        </div>

        {/* Clock Out */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/60">
          <span className="text-xs font-normal text-slate-500">Clock Out</span>
          <span className="text-xs font-normal text-slate-900">{clockOutTime}</span>
        </div>

        {/* Worked Hours */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/60">
          <span className="text-xs font-normal text-slate-500">Worked Hours</span>
          <span className="text-xs font-normal text-slate-900">{workedHours}</span>
        </div>
      </div>

      {/* Clock Action Button */}
      <button
        onClick={isClockedIn ? onClockOut : onClockIn}
        disabled={isBusy}
        className={`w-full py-3 px-4 rounded-xl text-xs font-normal flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] disabled:opacity-60 ${
          isClockedIn
            ? 'bg-slate-900 hover:bg-slate-800 text-white'
            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20'
        }`}
      >
        {isClockedIn ? (
          <>
            <LogOut className="w-4 h-4" />
            <span>Clock Out Now</span>
          </>
        ) : (
          <>
            <LogIn className="w-4 h-4" />
            <span>Clock In Now</span>
          </>
        )}
      </button>
    </div>
  );
};
