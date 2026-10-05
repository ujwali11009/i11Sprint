import React, { useState } from 'react';
import { Calendar, Palmtree, Thermometer, CheckCircle2, Clock, Check, Sparkles, X } from 'lucide-react';
import type { AttendanceRecord, LeaveRequest } from '../../types/attendance';
import type { LeaveBalance } from '../../hooks/useLeaves';

interface LeaveBalanceCardProps {
  leaveRequests: LeaveRequest[];
  leaveBalances: LeaveBalance[];
  recentHistory: AttendanceRecord[];
  isAdmin: boolean;
  onApproveLeave: (id: string) => void;
  onOpenApplyModal: () => void;
}

const BALANCE_ICON: Record<string, { icon: typeof Palmtree; color: string }> = {
  'Annual Leave': { icon: Palmtree, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  'Casual Leave': { icon: Calendar, color: 'text-blue-600 bg-blue-50 border-blue-200' },
  'Sick Leave': { icon: Thermometer, color: 'text-purple-600 bg-purple-50 border-purple-200' },
};

export const LeaveBalanceCard: React.FC<LeaveBalanceCardProps> = ({
  leaveRequests,
  leaveBalances,
  recentHistory,
  isAdmin,
  onApproveLeave,
  onOpenApplyModal,
}) => {
  const [approvedToastMessage, setApprovedToastMessage] = useState<string | null>(null);

  const handleApprove = (req: LeaveRequest) => {
    onApproveLeave(req.id);
    setApprovedToastMessage(`Leave request for ${req.leaveType} (${req.startDate} to ${req.endDate}) has been APPROVED by Admin! 🎉`);
    setTimeout(() => {
      setApprovedToastMessage(null);
    }, 4500);
  };

  return (
    <div className="space-y-6 relative">
      {/* Animated Approved Status Popup Toast */}
      {approvedToastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border border-emerald-500/50 flex items-center gap-3 animate-bounce max-w-md">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="flex-1 text-xs">
            <span className="font-normal block text-emerald-400">Leave Status Approved! 🎉</span>
            <p className="font-normal text-slate-300 mt-0.5">{approvedToastMessage}</p>
          </div>
          <button
            onClick={() => setApprovedToastMessage(null)}
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Grid: Leave Balances & Applied Leave Applications */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Leave Balance Grid */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Palmtree className="w-4 h-4 text-emerald-600" />
              <span>Leave Balance</span>
            </h3>
            <button
              onClick={onOpenApplyModal}
              className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-normal px-3 py-1.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
            >
              <span>+ Apply Leave</span>
            </button>
          </div>

          <div className="space-y-3">
            {leaveBalances.map((item) => {
              const meta = BALANCE_ICON[item.type] ?? BALANCE_ICON['Annual Leave'];
              const Icon = meta.icon;
              const remaining = item.total - item.taken;

              return (
                <div
                  key={item.type}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl border flex items-center justify-center ${meta.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-normal text-slate-900 block">{item.type}</span>
                      <span className="text-[11px] font-normal text-slate-400">
                        {item.taken} used of {item.total} days
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-semibold text-slate-900 block">{remaining} Days</span>
                    <span className="text-[10px] font-normal text-emerald-600">Remaining</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Applied Leave Applications & Admin Approvals */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-600" />
              <span>My Leave Applications & Approvals</span>
            </h3>
            <span className="text-[11px] font-normal text-slate-400">
              {leaveRequests.length} Requests
            </span>
          </div>

          {leaveRequests.length === 0 ? (
            <div className="text-center py-8 bg-slate-50 rounded-2xl border border-slate-200/60 space-y-2">
              <p className="text-xs font-normal text-slate-500">No leave requests submitted yet.</p>
              <button
                onClick={onOpenApplyModal}
                className="text-xs font-normal text-purple-600 hover:underline"
              >
                Apply for your first leave
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200/80 text-[11px] font-normal text-slate-400 uppercase tracking-wider">
                    <th className="py-2.5 px-3">Type & Dates</th>
                    <th className="py-2.5 px-3">Reason</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Admin Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {leaveRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3">
                        <span className="font-normal text-slate-900 block">{req.leaveType}</span>
                        <span className="text-[11px] font-normal text-slate-400">
                          {req.startDate} to {req.endDate} ({req.totalDays}d)
                        </span>
                      </td>
                      <td className="py-3 px-3 font-normal text-slate-600 max-w-[140px] truncate">
                        {req.reason}
                      </td>
                      <td className="py-3 px-3">
                        {req.status === 'Approved' ? (
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-xs px-2.5 py-0.5 rounded-full font-normal inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Approved 🎉</span>
                          </span>
                        ) : req.status === 'Rejected' ? (
                          <span className="bg-red-50 text-red-700 border border-red-200/80 text-xs px-2.5 py-0.5 rounded-full font-normal inline-flex items-center gap-1">
                            <X className="w-3 h-3 text-red-600" />
                            <span>Rejected</span>
                          </span>
                        ) : (
                          <span className="bg-amber-50 text-amber-700 border border-amber-200/80 text-xs px-2.5 py-0.5 rounded-full font-normal inline-flex items-center gap-1">
                            <Clock className="w-3 h-3 text-amber-600" />
                            <span>Pending Admin Approval</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right">
                        {req.status === 'Pending' && isAdmin ? (
                          <button
                            onClick={() => handleApprove(req)}
                            className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-[11px] font-normal px-3 py-1.5 rounded-xl shadow-xs transition-all flex items-center gap-1 ml-auto"
                          >
                            <Check className="w-3 h-3" />
                            <span>Approve</span>
                          </button>
                        ) : (
                          <span className="text-[11px] font-normal text-slate-400">
                            {req.status === 'Pending' ? 'Awaiting admin' : 'Verified'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Recent Attendance Log */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
        <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Calendar className="w-4 h-4 text-indigo-600" />
          <span>Recent Attendance Logs</span>
        </h3>

        {recentHistory.length === 0 ? (
          <p className="text-xs font-normal text-slate-400 py-4 text-center">No attendance logs yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200/80 text-[11px] font-normal text-slate-400 uppercase tracking-wider">
                  <th className="py-2 px-3">Date</th>
                  <th className="py-2 px-3">Status</th>
                  <th className="py-2 px-3">Clock In</th>
                  <th className="py-2 px-3">Clock Out</th>
                  <th className="py-2 px-3">Work Hours</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentHistory.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-normal text-slate-900">{rec.date}</td>
                    <td className="py-3 px-3">
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-xs px-2.5 py-0.5 rounded-full font-normal">
                        {rec.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-normal text-slate-600">{rec.clockIn}</td>
                    <td className="py-3 px-3 font-normal text-slate-600">{rec.clockOut}</td>
                    <td className="py-3 px-3 font-normal text-slate-800">{rec.workHours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
