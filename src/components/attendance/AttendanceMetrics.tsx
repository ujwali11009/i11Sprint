import React from 'react';
import { Calendar, AlertCircle } from 'lucide-react';
import type { AttendanceSummary } from '../../hooks/useAttendance';

interface AttendanceMetricsProps {
  summary?: AttendanceSummary;
}

export const AttendanceMetrics: React.FC<AttendanceMetricsProps> = ({ summary }) => {
  const daysPresent = summary?.daysPresent ?? 0;
  const wfhDays = summary?.wfhDays ?? 0;
  const leavesTaken = summary?.leavesTaken ?? 0;
  const absentDays = summary?.absentDays ?? 0;
  const attendanceRate = summary?.attendanceRate ?? 0;
  const trackedDays = summary?.trackedDays ?? 0;

  return (
    <div className="space-y-4">
      {/* Top 3 Core Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Days Present */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-3 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              <span className="text-xs font-normal text-slate-500">Days Present</span>
            </div>
            <p className="text-xs text-slate-400 font-normal">Onsite working days</p>
          </div>
          <div className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            {daysPresent} <span className="text-xs font-normal text-slate-400">Days</span>
          </div>
        </div>

        {/* Work From Home */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-3 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-xs font-normal text-slate-500">Work From Home</span>
            </div>
            <p className="text-xs text-slate-400 font-normal">Remote approved days</p>
          </div>
          <div className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            {wfhDays} <span className="text-xs font-normal text-slate-400">Days</span>
          </div>
        </div>

        {/* Leaves Taken */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-3 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
              <span className="text-xs font-normal text-slate-500">Leaves Taken</span>
            </div>
            <p className="text-xs text-slate-400 font-normal">Annual & casual leaves</p>
          </div>
          <div className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            {leavesTaken} <span className="text-xs font-normal text-slate-400">Days</span>
          </div>
        </div>
      </div>

      {/* Second Row: Attendance Rate & Absent Days */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Attendance Rate Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-xs font-normal text-slate-700">
            <div className="w-7 h-7 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <span>Attendance Rate</span>
          </div>
          <div className="text-3xl font-bold text-slate-900 tracking-tight pt-1">
            {attendanceRate}%
          </div>
          <p className="text-xs font-normal text-slate-400">
            {trackedDays === 0 ? 'No attendance logged this month yet.' : `${daysPresent + wfhDays} of ${trackedDays} tracked days attended.`}
          </p>
        </div>

        {/* Absent Days Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-xs font-normal text-slate-700">
            <div className="w-7 h-7 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
            <span>Absent Days</span>
          </div>
          <div className="text-3xl font-bold text-slate-900 tracking-tight pt-1">
            {absentDays} Days
          </div>
          <p className="text-xs font-normal text-slate-400">
            {absentDays === 0 ? 'No unexcused absences reported.' : `${absentDays} unexcused absence(s) this month.`}
          </p>
        </div>
      </div>
    </div>
  );
};
