import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { ClockStatus, AttendanceRecord } from '../types/attendance';

export const useTodayStatus = () =>
  useQuery({
    queryKey: ['attendance', 'today'],
    queryFn: () => api.get<ClockStatus>('/attendance/me/today'),
  });

export const useClockIn = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.post<ClockStatus>('/attendance/clock-in'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    },
  });
};

export const useClockOut = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.post<ClockStatus>('/attendance/clock-out'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    },
  });
};

export interface AttendanceSummary {
  daysPresent: number;
  wfhDays: number;
  leavesTaken: number;
  absentDays: number;
  attendanceRate: number;
  trackedDays: number;
}

export const useAttendanceSummary = () =>
  useQuery({
    queryKey: ['attendance', 'summary'],
    queryFn: () => api.get<AttendanceSummary>('/attendance/me/summary'),
  });

export interface TrendPoint {
  month: string;
  rate: number;
}

export const useAttendanceTrend = (months = 6) =>
  useQuery({
    queryKey: ['attendance', 'trend', months],
    queryFn: () => api.get<{ trend: TrendPoint[] }>(`/attendance/me/trend?months=${months}`).then((r) => r.trend),
  });

export const useAttendanceHistory = () =>
  useQuery({
    queryKey: ['attendance', 'history'],
    queryFn: () => api.get<{ history: AttendanceRecord[] }>('/attendance/me/history').then((r) => r.history),
  });
