import React from 'react';
import { TrendingUp } from 'lucide-react';
import type { TrendPoint } from '../../hooks/useAttendance';

interface AttendanceTrendChartProps {
  trend?: TrendPoint[];
}

export const AttendanceTrendChart: React.FC<AttendanceTrendChartProps> = ({ trend = [] }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs space-y-6 flex flex-col justify-between h-full">
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-indigo-600" />
          <h3 className="text-sm font-semibold text-slate-900">Attendance Trend</h3>
        </div>
        <span className="text-xs font-normal text-slate-400">Last {trend.length || 6} Months</span>
      </div>

      {/* Visual Bar Chart */}
      <div className="space-y-4 pt-2">
        {trend.length === 0 ? (
          <div className="h-48 flex items-center justify-center text-xs text-slate-400 font-normal">
            No attendance history yet.
          </div>
        ) : (
          <div className="relative h-48 w-full flex items-end justify-between px-2 pt-6">
            <div className="w-full h-full flex items-end justify-around relative z-10">
              {trend.map((item) => (
                <div key={item.month} className="flex flex-col items-center gap-2 group w-10">
                  <div className="w-full bg-slate-100 rounded-t-xl overflow-hidden h-36 flex items-end justify-center p-1 relative">
                    <div
                      style={{ height: `${Math.max(item.rate, 2)}%` }}
                      className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-lg transition-all duration-500 group-hover:from-indigo-500 group-hover:to-indigo-300 shadow-sm"
                    />
                    <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-normal px-2 py-0.5 rounded shadow-md pointer-events-none">
                      {item.rate}%
                    </div>
                  </div>
                  <span className="text-[11px] font-normal text-slate-500">{item.month}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
