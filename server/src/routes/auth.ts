import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../db.js';
import { signToken } from '../utils/jwt.js';
import { toPublicUser } from '../utils/serialize.js';
import { generateTempPassword } from '../utils/password.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

export const authRouter = Router();

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: false,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

// Account creation is admin-only — there is no public self-serve signup.
// The admin creates the account here and shares the generated password
// with the employee out of band; the employee then logs in normally.
const createEmployeeSchema = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  jobTitle: z.string().min(1).optional(),
  department: z.string().min(1).optional(),
  role: z.enum(['EMPLOYEE', 'ADMIN']).optional(),
});

authRouter.post('/employees', requireAuth, requireAdmin, async (req, res) => {
  const parsed = createEmployeeSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const { fullName, email, jobTitle, department, role } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(409).json({ error: 'Email already in use' });
  }

  const temporaryPassword = generateTempPassword();
  const passwordHash = await bcrypt.hash(temporaryPassword, 10);
  const user = await prisma.user.create({
    data: {
      fullName,
      email,
      passwordHash,
      role: role ?? 'EMPLOYEE',
      ...(jobTitle ? { jobTitle } : {}),
      ...(department ? { department } : {}),
    },
  });

  // Returned once, here only — not stored anywhere in plaintext.
  res.status(201).json({ user: toPublicUser(user), temporaryPassword });
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

authRouter.post('/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = signToken({ userId: user.id });
  res.cookie('token', token, COOKIE_OPTIONS);
  res.json({ user: toPublicUser(user) });
});

authRouter.post('/logout', (_req, res) => {
  res.clearCookie('token', COOKIE_OPTIONS);
  res.status(204).send();
});

authRouter.get('/me', requireAuth, (req, res) => {
  res.json({ user: toPublicUser(req.user!) });
});
