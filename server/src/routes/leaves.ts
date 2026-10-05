import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

export const leavesRouter = Router();

leavesRouter.use(requireAuth);

const LEAVE_TYPE_LABEL: Record<string, string> = {
  ANNUAL_LEAVE: 'Annual Leave',
  CASUAL_LEAVE: 'Casual Leave',
  SICK_LEAVE: 'Sick Leave',
};
const LEAVE_TYPE_KEY: Record<string, 'ANNUAL_LEAVE' | 'CASUAL_LEAVE' | 'SICK_LEAVE'> = {
  'Annual Leave': 'ANNUAL_LEAVE',
  'Casual Leave': 'CASUAL_LEAVE',
  'Sick Leave': 'SICK_LEAVE',
};
const STATUS_LABEL: Record<string, string> = { PENDING: 'Pending', APPROVED: 'Approved', REJECTED: 'Rejected' };

const serializeLeave = (leave: {
  id: string;
  leaveType: string;
  startDate: Date;
  endDate: Date;
  totalDays: number;
  reason: string;
  status: string;
  createdAt: Date;
}) => ({
  id: leave.id,
  leaveType: LEAVE_TYPE_LABEL[leave.leaveType],
  startDate: leave.startDate.toISOString().slice(0, 10),
  endDate: leave.endDate.toISOString().slice(0, 10),
  totalDays: leave.totalDays,
  reason: leave.reason,
  status: STATUS_LABEL[leave.status],
  requestedAt: leave.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
});

leavesRouter.get('/me', async (req, res) => {
  const leaves = await prisma.leaveRequest.findMany({
    where: { userId: req.user!.id },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ leaveRequests: leaves.map(serializeLeave) });
});

const LEAVE_ALLOTMENT: Record<'ANNUAL_LEAVE' | 'CASUAL_LEAVE' | 'SICK_LEAVE', number> = {
  ANNUAL_LEAVE: 14,
  CASUAL_LEAVE: 6,
  SICK_LEAVE: 7,
};

leavesRouter.get('/balance/me', async (req, res) => {
  const approved = await prisma.leaveRequest.findMany({
    where: { userId: req.user!.id, status: 'APPROVED' },
  });

  const balances = (Object.keys(LEAVE_ALLOTMENT) as Array<keyof typeof LEAVE_ALLOTMENT>).map((type) => {
    const taken = approved.filter((l) => l.leaveType === type).reduce((sum, l) => sum + l.totalDays, 0);
    return { type: LEAVE_TYPE_LABEL[type], taken, total: LEAVE_ALLOTMENT[type] };
  });

  res.json({ balances });
});

const applyLeaveSchema = z.object({
  leaveType: z.enum(['Annual Leave', 'Casual Leave', 'Sick Leave']),
  startDate: z.string(),
  endDate: z.string(),
  totalDays: z.number().int().positive(),
  reason: z.string().min(1),
});

leavesRouter.post('/', async (req, res) => {
  const parsed = applyLeaveSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const { leaveType, startDate, endDate, totalDays, reason } = parsed.data;

  const leave = await prisma.leaveRequest.create({
    data: {
      userId: req.user!.id,
      leaveType: LEAVE_TYPE_KEY[leaveType],
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      totalDays,
      reason,
    },
  });
  res.status(201).json({ leaveRequest: serializeLeave(leave) });
});

leavesRouter.patch('/:id/approve', requireAdmin, async (req, res) => {
  try {
    const leave = await prisma.leaveRequest.update({
      where: { id: req.params.id },
      data: { status: 'APPROVED', approvedById: req.user!.id },
    });
    res.json({ leaveRequest: serializeLeave(leave) });
  } catch {
    res.status(404).json({ error: 'Leave request not found' });
  }
});

leavesRouter.patch('/:id/reject', requireAdmin, async (req, res) => {
  try {
    const leave = await prisma.leaveRequest.update({
      where: { id: req.params.id },
      data: { status: 'REJECTED', approvedById: req.user!.id },
    });
    res.json({ leaveRequest: serializeLeave(leave) });
  } catch {
    res.status(404).json({ error: 'Leave request not found' });
  }
});
