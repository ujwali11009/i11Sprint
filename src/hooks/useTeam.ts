import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { User } from '../types/user';

export const useTeam = () =>
  useQuery({
    queryKey: ['users'],
    queryFn: () => api.get<{ users: User[] }>('/users').then((r) => r.users),
  });
