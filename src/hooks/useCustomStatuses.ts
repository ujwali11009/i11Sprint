import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { CustomStatusItem } from '../types/workspace';

export const useCustomStatuses = () =>
  useQuery({
    queryKey: ['customStatuses'],
    queryFn: () => api.get<{ customStatuses: CustomStatusItem[] }>('/custom-statuses').then((r) => r.customStatuses),
  });

export const useCreateCustomStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { name: string; color: string }) =>
      api.post<{ customStatus: CustomStatusItem }>('/custom-statuses', payload).then((r) => r.customStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customStatuses'] });
    },
  });
};
