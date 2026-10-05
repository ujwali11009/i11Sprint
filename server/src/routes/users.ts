import { Router } from 'express';
import { prisma } from '../db.js';
import { toPublicUser } from '../utils/serialize.js';
import { requireAuth } from '../middleware/auth.js';

export const usersRouter = Router();

usersRouter.use(requireAuth);

usersRouter.get('/', async (_req, res) => {
  const users = await prisma.user.findMany({ orderBy: { fullName: 'asc' } });
  res.json({ users: users.map(toPublicUser) });
});

usersRouter.get('/:id', async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.params.id } });
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user: toPublicUser(user) });
});
