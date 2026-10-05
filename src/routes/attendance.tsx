import { useState } from 'react';
import { createRoute } from '@tanstack/react-router';
import { Route as rootRoute } from './__root';
import { Sidebar } from '../components/workspace/Sidebar';
import { EmployeeHeaderCard } from '../components/attendance/EmployeeHeaderCard';
import { AttendanceMetrics } from '../components/attendance/AttendanceMetrics';
import { AttendanceTrendChart } from '../components/attendance/AttendanceTrendChart';
import { TodayStatusCard } from '../components/attendance/TodayStatusCard';
import { LeaveBalanceCard } from '../components/attendance/LeaveBalanceCard';
import { ApplyLeaveModal } from '../components/attendance/ApplyLeaveModal';
import { RequireAuth } from '../components/auth/RequireAuth';
import { useCurrentUser } from '../hooks/useAuth';
import {
  useTodayStatus,
  useClockIn,
  useClockOut,
  useAttendanceSummary,
  useAttendanceTrend,
  useAttendanceHistory,
} from '../hooks/useAttendance';
import { useMyLeaves, useLeaveBalance, useApplyLeave, useApproveLeave } from '../hooks/useLeaves';

const AttendanceContent = () => {
  const { data: currentUser } = useCurrentUser();
  const [activeTab, setActiveTab] = useState<'Attendance' | 'Overview' | 'Personal Info' | 'Work Info' | 'Documents'>('Attendance');
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const { data: todayStatus } = useTodayStatus();
  const clockIn = useClockIn();
  const clockOut = useClockOut();
  const { data: summary } = useAttendanceSummary();
  const { data: trend = [] } = useAttendanceTrend();
  const { data: history = [] } = useAttendanceHistory();

  const { data: leaveRequests = [] } = useMyLeaves();
  const { data: leaveBalances = [] } = useLeaveBalance();
  const applyLeave = useApplyLeave();
  const approveLeave = useApproveLeave();

  if (!currentUser) return null;

  const navTabs = ['Overview', 'Personal Info', 'Work Info', 'Attendance', 'Documents'] as const;

  return (
    <div className="flex h-screen w-full bg-[#F8FAFC] overflow-hidden text-slate-900 font-sans">
      {/* Left Navigation Sidebar */}
      <Sidebar />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">

        {/* Scrollable Content Container */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          {/* Employee Header Profile Card */}
          <EmployeeHeaderCard user={currentUser} />

          {/* Navigation Bar */}
          <div className="bg-white p-1.5 rounded-2xl border border-slate-200/80 shadow-2xs overflow-x-auto">
            <div className="flex items-center gap-1 sm:gap-2 min-w-max">
              {navTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2 text-xs font-normal rounded-xl transition-all ${
                    activeTab === tab
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Core Attendance Metrics */}
          <AttendanceMetrics summary={summary} />

          {/* Trend Chart & Today's Status Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7">
              <AttendanceTrendChart trend={trend} />
            </div>

            <div className="lg:col-span-5">
              <TodayStatusCard
                status={todayStatus}
                isBusy={clockIn.isPending || clockOut.isPending}
                onClockIn={() => clockIn.mutate()}
                onClockOut={() => clockOut.mutate()}
              />
            </div>
          </div>

          {/* Leave Balance, Applications & Admin Approval Flow */}
          <LeaveBalanceCard
            leaveRequests={leaveRequests}
            leaveBalances={leaveBalances}
            recentHistory={history}
            isAdmin={currentUser.role === 'ADMIN'}
            onApproveLeave={(id) => approveLeave.mutate(id)}
            onOpenApplyModal={() => setIsApplyModalOpen(true)}
          />
        </main>
      </div>

      {/* Apply Leave Modal */}
      <ApplyLeaveModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        onApplyLeave={(payload) => applyLeave.mutate(payload)}
      />
    </div>
  );
};

export const AttendancePage = () => (
  <RequireAuth>
    <AttendanceContent />
  </RequireAuth>
);

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/attendance',
  component: AttendancePage,
});
