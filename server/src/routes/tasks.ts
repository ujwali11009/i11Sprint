import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import type { Prisma } from '@prisma/client';

export const tasksRouter = Router();

tasksRouter.use(requireAuth);

const taskInclude = {
  assignee: true,
  comments: { include: { user: true }, orderBy: { createdAt: 'asc' as const } },
  attachments: true,
  subtasks: { orderBy: { createdAt: 'asc' as const } },
} satisfies Prisma.TaskInclude;

type TaskWithRelations = Prisma.TaskGetPayload<{ include: typeof taskInclude }>;

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

const serializeTask = (task: TaskWithRelations) => ({
  id: task.id,
  title: task.title,
  description: task.description ?? undefined,
  commentsCount: task.comments.length,
  attachmentsCount: task.attachments.length,
  subtasksCompleted: task.subtasks.filter((s) => s.isCompleted).length,
  subtasksTotal: task.subtasks.length,
  isAsap: task.isAsap,
  status: task.status,
  type: task.type,
  dueDay: task.dueDate ? String(task.dueDate.getDate()) : undefined,
  dueMonth: task.dueDate ? MONTHS[task.dueDate.getMonth()] : undefined,
  assignee: {
    id: task.assignee.id,
    name: task.assignee.fullName,
    avatar: task.assignee.avatarUrl ?? '',
  },
  isHighlighted: task.isHighlighted,
  category: task.status === 'COMPLETED' ? ('completed' as const) : ('active' as const),
  commentsList: task.comments.map((c) => ({
    id: c.id,
    authorName: c.user.fullName,
    authorAvatar: c.user.avatarUrl ?? '',
    content: c.content,
    createdAt: c.createdAt.toISOString(),
  })),
  attachmentsList: task.attachments.map((a) => ({ id: a.id, name: a.name, size: a.size })),
  subtasksList: task.subtasks.map((s) => ({ id: s.id, title: s.title, isCompleted: s.isCompleted })),
});

tasksRouter.get('/', async (req, res) => {
  const { projectId } = req.query;
  const tasks = await prisma.task.findMany({
    where: projectId ? { projectId: String(projectId) } : undefined,
    include: taskInclude,
    orderBy: { createdAt: 'desc' },
  });
  res.json({ tasks: tasks.map(serializeTask) });
});

const createTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.string().default('IN PROGRESS'),
  type: z.enum(['Operational', 'Design', 'Deployment', 'Development']).default('Operational'),
  dueDate: z.string().datetime().optional().nullable(),
  isAsap: z.boolean().optional(),
  isHighlighted: z.boolean().optional(),
  assigneeId: z.string().uuid(),
  projectId: z.string().uuid().optional().nullable(),
});

tasksRouter.post('/', async (req, res) => {
  const parsed = createTaskSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const { dueDate, ...rest } = parsed.data;
  const task = await prisma.task.create({
    data: { ...rest, dueDate: dueDate ? new Date(dueDate) : null },
    include: taskInclude,
  });
  res.status(201).json({ task: serializeTask(task) });
});

const updateTaskSchema = createTaskSchema.partial();

tasksRouter.patch('/:id', async (req, res) => {
  const parsed = updateTaskSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const { dueDate, ...rest } = parsed.data;
  try {
    const task = await prisma.task.update({
      where: { id: req.params.id },
      data: { ...rest, ...(dueDate !== undefined ? { dueDate: dueDate ? new Date(dueDate) : null } : {}) },
      include: taskInclude,
    });
    res.json({ task: serializeTask(task) });
  } catch {
    res.status(404).json({ error: 'Task not found' });
  }
});

tasksRouter.delete('/:id', async (req, res) => {
  try {
    await prisma.task.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch {
    res.status(404).json({ error: 'Task not found' });
  }
});

const addCommentSchema = z.object({ content: z.string().min(1) });

tasksRouter.post('/:id/comments', async (req, res) => {
  const parsed = addCommentSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  await prisma.taskComment.create({
    data: { taskId: req.params.id, userId: req.user!.id, content: parsed.data.content },
  });
  const task = await prisma.task.findUnique({ where: { id: req.params.id }, include: taskInclude });
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.status(201).json({ task: serializeTask(task) });
});

const addSubtaskSchema = z.object({ title: z.string().min(1) });

tasksRouter.post('/:id/subtasks', async (req, res) => {
  const parsed = addSubtaskSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  await prisma.subtask.create({ data: { taskId: req.params.id, title: parsed.data.title } });
  const task = await prisma.task.findUnique({ where: { id: req.params.id }, include: taskInclude });
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.status(201).json({ task: serializeTask(task) });
});

const toggleSubtaskSchema = z.object({ isCompleted: z.boolean() });

tasksRouter.patch('/:id/subtasks/:subtaskId', async (req, res) => {
  const parsed = toggleSubtaskSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  await prisma.subtask.update({
    where: { id: req.params.subtaskId },
    data: { isCompleted: parsed.data.isCompleted },
  });
  const task = await prisma.task.findUnique({ where: { id: req.params.id }, include: taskInclude });
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json({ task: serializeTask(task) });
});
