import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { LeaveRequest } from '../types/attendance';

export const useMyLeaves = () =>
  useQuery({
    queryKey: ['leaves', 'me'],
    queryFn: () => api.get<{ leaveRequests: LeaveRequest[] }>('/leaves/me').then((r) => r.leaveRequests),
  });

export interface LeaveBalance {
  type: string;
  taken: number;
  total: number;
}

export const useLeaveBalance = () =>
  useQuery({
    queryKey: ['leaves', 'balance'],
    queryFn: () => api.get<{ balances: LeaveBalance[] }>('/leaves/balance/me').then((r) => r.balances),
  });

interface ApplyLeavePayload {
  leaveType: LeaveRequest['leaveType'];
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
}

export const useApplyLeave = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ApplyLeavePayload) =>
      api.post<{ leaveRequest: LeaveRequest }>('/leaves', payload).then((r) => r.leaveRequest),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['leaves'] }),
  });
};

export const useApproveLeave = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.patch<{ leaveRequest: LeaveRequest }>(`/leaves/${id}/approve`).then((r) => r.leaveRequest),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['leaves'] }),
  });
};

export const useRejectLeave = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.patch<{ leaveRequest: LeaveRequest }>(`/leaves/${id}/reject`).then((r) => r.leaveRequest),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['leaves'] }),
  });
};
