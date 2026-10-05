import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { Meeting, MeetingStatus } from '../types/meeting';

export const useMeetings = () =>
  useQuery({
    queryKey: ['meetings'],
    queryFn: () => api.get<{ meetings: Meeting[] }>('/meetings').then((r) => r.meetings),
  });

interface NewMeetingPayload {
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  timezone: string;
  timezoneName: string;
  meetingLink: string;
  meetingNotes?: string;
}

export const useCreateMeeting = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: NewMeetingPayload) =>
      api.post<{ meeting: Meeting }>('/meetings', payload).then((r) => r.meeting),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['meetings'] }),
  });
};

export const useUpdateMeetingStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: MeetingStatus }) =>
      api.patch<{ meeting: Meeting }>(`/meetings/${id}/status`, { status }).then((r) => r.meeting),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['meetings'] }),
  });
};
