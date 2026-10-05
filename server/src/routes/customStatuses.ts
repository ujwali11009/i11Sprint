import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

export const customStatusesRouter = Router();

customStatusesRouter.use(requireAuth);

customStatusesRouter.get('/', async (_req, res) => {
  const statuses = await prisma.customStatus.findMany({ orderBy: { createdAt: 'asc' } });
  res.json({ customStatuses: statuses });
});

const createSchema = z.object({
  name: z.string().min(1),
  color: z.string().min(1),
});

customStatusesRouter.post('/', async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const status = await prisma.customStatus.create({ data: parsed.data });
  res.status(201).json({ customStatus: status });
});
