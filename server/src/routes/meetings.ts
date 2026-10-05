import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import type { Prisma } from '@prisma/client';

export const meetingsRouter = Router();

meetingsRouter.use(requireAuth);

const meetingInclude = {
  createdBy: true,
  participants: { include: { user: true } },
} satisfies Prisma.MeetingInclude;

type MeetingWithRelations = Prisma.MeetingGetPayload<{ include: typeof meetingInclude }>;

const formatDateGroup = (date: Date) => {
  const today = new Date();
  const isSameDay = date.toDateString() === today.toDateString();
  const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
  const formatted = date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  return isSameDay ? `Today, ${formatted}` : `${weekday}, ${formatted}`;
};

const serializeMeeting = (meeting: MeetingWithRelations) => ({
  id: meeting.id,
  title: meeting.title,
  description: meeting.description,
  dateGroup: formatDateGroup(meeting.date),
  startTime: meeting.startTime,
  endTime: meeting.endTime,
  timezone: meeting.timezone,
  timezoneName: meeting.timezoneName,
  meetingLink: meeting.meetingLink,
  email: meeting.createdBy.email,
  meetingNotes: meeting.meetingNotes,
  status: meeting.status,
  participantsCount: String(meeting.participants.length),
  createdAt: meeting.createdAt.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
});

meetingsRouter.get('/', async (_req, res) => {
  const meetings = await prisma.meeting.findMany({
    include: meetingInclude,
    orderBy: { date: 'asc' },
  });
  res.json({ meetings: meetings.map(serializeMeeting) });
});

const createMeetingSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  date: z.string().datetime(),
  startTime: z.string().min(1),
  endTime: z.string().min(1),
  timezone: z.string().min(1),
  timezoneName: z.string().min(1),
  meetingLink: z.string().min(1),
  meetingNotes: z.string().optional().default(''),
});

meetingsRouter.post('/', async (req, res) => {
  const parsed = createMeetingSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const { date, ...rest } = parsed.data;
  const meeting = await prisma.meeting.create({
    data: {
      ...rest,
      date: new Date(date),
      createdById: req.user!.id,
      participants: { create: [{ userId: req.user!.id }] },
    },
    include: meetingInclude,
  });
  res.status(201).json({ meeting: serializeMeeting(meeting) });
});

const updateStatusSchema = z.object({
  status: z.enum(['Ongoing', 'Pending', 'Rescheduled', 'Cancelled']),
});

meetingsRouter.patch('/:id/status', async (req, res) => {
  const parsed = updateStatusSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  try {
    const meeting = await prisma.meeting.update({
      where: { id: req.params.id },
      data: { status: parsed.data.status },
      include: meetingInclude,
    });
    res.json({ meeting: serializeMeeting(meeting) });
  } catch {
    res.status(404).json({ error: 'Meeting not found' });
  }
});
