import { Router } from 'express';
import { prisma } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

export const attendanceRouter = Router();

attendanceRouter.use(requireAuth);

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const endOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

const formatTime = (d: Date) => d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

const computeWorkedHours = (clockIn: Date, clockOut: Date) => {
  const ms = clockOut.getTime() - clockIn.getTime();
  const totalMinutes = Math.max(0, Math.round(ms / 60000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${String(minutes).padStart(2, '0')}m`;
};

attendanceRouter.get('/me/today', async (req, res) => {
  const today = new Date();
  const log = await prisma.clockLog.findFirst({
    where: { userId: req.user!.id, date: { gte: startOfDay(today), lte: endOfDay(today) } },
    orderBy: { createdAt: 'desc' },
  });

  if (!log) {
    return res.json({
      currentStatus: 'Clocked Out',
      clockInTime: null,
      clockOutTime: null,
      workedHours: '0h 00m',
      isClockedIn: false,
    });
  }

  res.json({
    currentStatus: log.clockOutTime ? 'Clocked Out' : 'Present',
    clockInTime: log.clockInTime ? formatTime(log.clockInTime) : null,
    clockOutTime: log.clockOutTime ? formatTime(log.clockOutTime) : null,
    workedHours: log.clockInTime && log.clockOutTime ? computeWorkedHours(log.clockInTime, log.clockOutTime) : '0h 00m',
    isClockedIn: !log.clockOutTime,
  });
});

attendanceRouter.post('/clock-in', async (req, res) => {
  const today = new Date();
  const existing = await prisma.clockLog.findFirst({
    where: { userId: req.user!.id, date: { gte: startOfDay(today), lte: endOfDay(today) } },
  });

  const log = existing
    ? await prisma.clockLog.update({
        where: { id: existing.id },
        data: { clockInTime: new Date(), clockOutTime: null, status: 'PRESENT' },
      })
    : await prisma.clockLog.create({
        data: { userId: req.user!.id, date: today, clockInTime: new Date(), status: 'PRESENT' },
      });

  res.status(201).json({
    currentStatus: 'Present',
    clockInTime: formatTime(log.clockInTime!),
    clockOutTime: null,
    workedHours: '0h 00m',
    isClockedIn: true,
  });
});

attendanceRouter.post('/clock-out', async (req, res) => {
  const today = new Date();
  const existing = await prisma.clockLog.findFirst({
    where: { userId: req.user!.id, date: { gte: startOfDay(today), lte: endOfDay(today) } },
  });

  if (!existing || !existing.clockInTime) {
    return res.status(400).json({ error: 'You have not clocked in today' });
  }

  const clockOutTime = new Date();
  const workedHours = computeWorkedHours(existing.clockInTime, clockOutTime);
  const log = await prisma.clockLog.update({
    where: { id: existing.id },
    data: { clockOutTime, workedHours },
  });

  res.json({
    currentStatus: 'Clocked Out',
    clockInTime: formatTime(log.clockInTime!),
    clockOutTime: formatTime(log.clockOutTime!),
    workedHours,
    isClockedIn: false,
  });
});

attendanceRouter.get('/me/history', async (req, res) => {
  const logs = await prisma.clockLog.findMany({
    where: { userId: req.user!.id },
    orderBy: { date: 'desc' },
    take: 10,
  });

  const statusLabel: Record<string, string> = {
    PRESENT: 'Present',
    WORK_FROM_HOME: 'Work From Home',
    LEAVE: 'Leave',
    ABSENT: 'Absent',
  };

  res.json({
    history: logs.map((log) => ({
      id: log.id,
      date: log.date.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short' }),
      status: statusLabel[log.status],
      clockIn: log.clockInTime ? formatTime(log.clockInTime) : '—',
      clockOut: log.clockOutTime ? formatTime(log.clockOutTime) : '—',
      workHours: log.workedHours ?? '0h 00m',
    })),
  });
});

attendanceRouter.get('/me/summary', async (req, res) => {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const logs = await prisma.clockLog.findMany({
    where: { userId: req.user!.id, date: { gte: monthStart, lte: now } },
  });

  const daysPresent = logs.filter((l) => l.status === 'PRESENT').length;
  const wfhDays = logs.filter((l) => l.status === 'WORK_FROM_HOME').length;
  const absentDays = logs.filter((l) => l.status === 'ABSENT').length;

  const approvedLeaves = await prisma.leaveRequest.findMany({
    where: { userId: req.user!.id, status: 'APPROVED', startDate: { gte: monthStart } },
  });
  const leavesTaken = approvedLeaves.reduce((sum, l) => sum + l.totalDays, 0);

  const trackedDays = logs.length || 1;
  const attendanceRate = Math.round(((daysPresent + wfhDays) / trackedDays) * 100);

  res.json({
    daysPresent,
    wfhDays,
    leavesTaken,
    absentDays,
    attendanceRate,
    trackedDays: logs.length,
  });
});

attendanceRouter.get('/me/trend', async (req, res) => {
  const months = Number(req.query.months) || 6;
  const now = new Date();
  const results: { month: string; rate: number }[] = [];

  for (let i = months - 1; i >= 0; i -= 1) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59, 999);

    const logs = await prisma.clockLog.findMany({
      where: { userId: req.user!.id, date: { gte: monthDate, lte: monthEnd } },
    });

    const present = logs.filter((l) => l.status === 'PRESENT' || l.status === 'WORK_FROM_HOME').length;
    const rate = logs.length > 0 ? Math.round((present / logs.length) * 100) : 0;

    results.push({ month: monthDate.toLocaleDateString('en-US', { month: 'short' }), rate });
  }

  res.json({ trend: results });
});
