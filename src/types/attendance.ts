export interface AttendanceMetric {
  title: string;
  count: string | number;
  unit?: string;
  colorDot: string; // e.g. 'bg-blue-600'
}

export interface ClockStatus {
  currentStatus: 'Present' | 'Clocked Out' | 'On Break' | 'Absent';
  clockInTime: string;
  clockOutTime: string;
  workedHours: string;
  isClockedIn: boolean;
}

export interface LeaveBalance {
  type: 'Annual Leave' | 'Casual Leave' | 'Sick Leave';
  taken: number;
  total: number;
  color: string;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  status: 'Present' | 'Work From Home' | 'Leave' | 'Absent';
  clockIn: string;
  clockOut: string;
  workHours: string;
}

export interface LeaveRequest {
  id: string;
  leaveType: 'Annual Leave' | 'Casual Leave' | 'Sick Leave';
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  requestedAt: string;
}
