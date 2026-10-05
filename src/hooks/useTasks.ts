import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { Task, TaskStatus, TaskType } from '../types/workspace';

export const useTasks = () =>
  useQuery({
    queryKey: ['tasks'],
    queryFn: () => api.get<{ tasks: Task[] }>('/tasks').then((r) => r.tasks),
  });

interface NewTaskPayload {
  title: string;
  status: TaskStatus;
  type: TaskType;
  isAsap?: boolean;
  assigneeId: string;
  projectId?: string | null;
}

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: NewTaskPayload) => api.post<{ task: Task }>('/tasks', payload).then((r) => r.task),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string } & Partial<NewTaskPayload>) =>
      api.patch<{ task: Task }>(`/tasks/${id}`, payload).then((r) => r.task),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });
};

export const useAddTaskComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, content }: { taskId: string; content: string }) =>
      api.post<{ task: Task }>(`/tasks/${taskId}/comments`, { content }).then((r) => r.task),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });
};

export const useAddSubtask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, title }: { taskId: string; title: string }) =>
      api.post<{ task: Task }>(`/tasks/${taskId}/subtasks`, { title }).then((r) => r.task),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });
};

export const useToggleSubtask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, subtaskId, isCompleted }: { taskId: string; subtaskId: string; isCompleted: boolean }) =>
      api.patch<{ task: Task }>(`/tasks/${taskId}/subtasks/${subtaskId}`, { isCompleted }).then((r) => r.task),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });
};
