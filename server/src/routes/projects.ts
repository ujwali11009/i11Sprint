import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

export const projectsRouter = Router();

projectsRouter.use(requireAuth);

projectsRouter.get('/', async (_req, res) => {
  const projects = await prisma.project.findMany({ orderBy: { createdAt: 'asc' } });
  res.json({ projects });
});

const createProjectSchema = z.object({
  name: z.string().min(1),
  parentProjectId: z.string().uuid().nullable().optional(),
});

projectsRouter.post('/', requireAdmin, async (req, res) => {
  const parsed = createProjectSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const project = await prisma.project.create({ data: parsed.data });
  res.status(201).json({ project });
});
