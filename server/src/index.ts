import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { authRouter } from './routes/auth.js';
import { usersRouter } from './routes/users.js';
import { projectsRouter } from './routes/projects.js';
import { customStatusesRouter } from './routes/customStatuses.js';
import { tasksRouter } from './routes/tasks.js';
import { meetingsRouter } from './routes/meetings.js';
import { attendanceRouter } from './routes/attendance.js';
import { leavesRouter } from './routes/leaves.js';

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/custom-statuses', customStatusesRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/meetings', meetingsRouter);
app.use('/api/attendance', attendanceRouter);
app.use('/api/leaves', leavesRouter);

const port = Number(process.env.PORT) || 4000;
app.listen(port, () => {
  console.log(`i11Sprint API listening on http://localhost:${port}`);
});
