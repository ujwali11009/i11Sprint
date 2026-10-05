# i11Sprint — Work Management Platform for Result-Driven Teams 🚀

> **Accelerate your team's potential.**  
> A high-performance, modern web application for task management, meeting scheduling, attendance tracking, and automated leave approval workflows.

---

## 🎯 Production Backend & Database Architecture

This document provides a production-grade blueprint for integrating a backend service, database schema, REST APIs, WebSockets, and authentication for **i11Sprint**.

---

## 🏗️ 1. Recommended Backend Tech Stack

| Layer                   | Technology Choice                              | Rationale                                                               |
| ----------------------- | ---------------------------------------------- | ----------------------------------------------------------------------- |
| **Runtime & Framework** | **Node.js (NestJS / Express)** or **Go (Gin)** | High concurrency, type-safe integration with TypeScript frontend        |
| **Database**            | **PostgreSQL (v16+)**                          | Relational integrity, ACID compliance, complex queries & date indexing  |
| **ORM / Migration**     | **Prisma ORM** or **Drizzle ORM**              | Schema safety, auto-generated TypeScript types, seamless migrations     |
| **Caching & Pub/Sub**   | **Redis (v7+)**                                | Session store, rate limiting, realtime WebSocket event broadcasting     |
| **Realtime Gateway**    | **Socket.io / WebSockets**                     | Realtime Kanban updates, meeting notifications, instant approval alerts |
| **Object Storage**      | **AWS S3 / Google Cloud Storage**              | Task attachments, avatar uploads (`.png`, `.pdf`, `.docx`)              |
| **Authentication**      | **OAuth 2.0 / JWT + HTTP-Only Cookies**        | Secure token handling, SSO (Google Workspace, SAML 2.0), Passkeys       |

---

## 🗄️ 2. Production Database Schema (Prisma ORM Format)

```prisma
// schema.prisma

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  EMPLOYEE
  ADMIN
}

enum TaskStatus {
  IN_PROGRESS
  SCHEDULED
  COMPLETED
}

enum TaskCategory {
  DEPLOYMENT
  DESIGN
  DEVELOPMENT
  OPERATIONAL
  ALL_TASKS
}

enum MeetingStatus {
  ONGOING
  PENDING
  RESCHEDULED
  CANCELLED
}

enum AttendanceStatus {
  PRESENT
  WORK_FROM_HOME
  LEAVE
  ABSENT
}

enum LeaveType {
  ANNUAL_LEAVE
  CASUAL_LEAVE
  SICK_LEAVE
}

enum LeaveStatus {
  PENDING
  APPROVED
  REJECTED
}

model User {
  id              String             @id @default(uuid())
  email           String             @unique
  passwordHash    String?
  fullName        String
  role            Role               @default(EMPLOYEE)
  avatarUrl       String?
  department      String             @default("Product")
  employmentType  String             @default("Full-time")
  phoneNumber     String?
  createdAt       DateTime           @default(now())
  updatedAt       DateTime           @updatedAt

  tasksAssigned   Task[]             @relation("TaskAssignee")
  taskComments    TaskComment[]
  leaveRequests   LeaveRequest[]     @relation("UserLeaveRequests")
  approvedLeaves  LeaveRequest[]     @relation("AdminApprovedLeaves")
  clockLogs       ClockLog[]
  meetingMembers  MeetingMember[]

  @@index([email])
}

model Project {
  id          String   @id @default(uuid())
  name        String
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  tasks       Task[]
}

model Task {
  id                  String         @id @default(uuid())
  title               String
  status              TaskStatus     @default(IN_PROGRESS)
  type                String         // Design, Deployment, Development, etc.
  category            TaskCategory   @default(ALL_TASKS)
  dueDay              String?
  dueMonth            String?
  isHighlighted       Boolean        @default(false)
  isAsap              Boolean        @default(false)
  assigneeId          String
  assignee            User           @relation("TaskAssignee", fields: [assigneeId], references: [id])
  projectId           String
  project             Project        @relation(fields: [projectId], references: [id], onDelete: Cascade)
  comments            TaskComment[]
  subtasksCompleted   Int            @default(0)
  subtasksTotal       Int            @default(0)
  createdAt           DateTime       @default(now())
  updatedAt           DateTime       @updatedAt

  @@index([status, category])
}

model TaskComment {
  id        String   @id @default(uuid())
  content   String
  taskId    String
  task      Task     @relation(fields: [taskId], references: [id], onDelete: Cascade)
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())
}

model Meeting {
  id                String          @id @default(uuid())
  title             String
  description       String
  dateGroup         String          // e.g., "Today, 1 May 2025"
  startTime         String
  endTime           String
  timezone          String
  timezoneName      String
  meetingLink       String
  email             String
  meetingNotes      String
  status            MeetingStatus   @default(PENDING)
  participantsCount String          @default("0")
  createdAt         DateTime        @default(now())
  updatedAt         DateTime        @updatedAt
  members           MeetingMember[]
}

model MeetingMember {
  id        String   @id @default(uuid())
  meetingId String
  meeting   Meeting  @relation(fields: [meetingId], references: [id], onDelete: Cascade)
  userId    String
  user      User     @relation(fields: [userId], references: [id])
}

model ClockLog {
  id            String           @id @default(uuid())
  userId        String
  user          User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  date          DateTime         @default(now())
  status        AttendanceStatus @default(PRESENT)
  clockInTime   DateTime
  clockOutTime  DateTime?
  workedHours   String?
  createdAt     DateTime         @default(now())
}

model LeaveRequest {
  id          String      @id @default(uuid())
  userId      String
  user        User        @relation("UserLeaveRequests", fields: [userId], references: [id], onDelete: Cascade)
  leaveType   LeaveType
  startDate   DateTime
  endDate     DateTime
  totalDays   Int
  reason      String
  status      LeaveStatus @default(PENDING)
  approvedById String?
  approvedBy  User?       @relation("AdminApprovedLeaves", fields: [approvedById], references: [id])
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
}
```

---

## 📡 3. Module-by-Module REST API Endpoints

### 🔐 Auth & Identity Module (`/api/v1/auth`)

| Method | Endpoint               | Description                              | Auth Required |
| ------ | ---------------------- | ---------------------------------------- | ------------- |
| `POST` | `/api/v1/auth/login`   | Email/Password login (Employee vs Admin) | ❌            |
| `POST` | `/api/v1/auth/sso`     | Google Workspace SSO callback            | ❌            |
| `POST` | `/api/v1/auth/passkey` | FIDO2 / WebAuthn Passkey login           | ❌            |
| `POST` | `/api/v1/auth/logout`  | Revoke refresh token & clear cookies     | ✅            |
| `GET`  | `/api/v1/auth/me`      | Fetch current logged-in user profile     | ✅            |

#### Sample Response (`POST /api/v1/auth/login`):

```json
{
  "success": true,
  "user": {
    "id": "usr_9981",
    "email": "ujwal@i11sprint.com",
    "fullName": "Ujwal S C",
    "role": "admin",
    "department": "Product",
    "avatarUrl": "/assets/ujwal.png"
  },
  "token": "eyJhbGciOiJIUzI1NiIsIn..."
}
```

---

### 📋 Task Management & Kanban Module (`/api/v1/tasks`)

| Method   | Endpoint                   | Description                                                  | Auth Required |
| -------- | -------------------------- | ------------------------------------------------------------ | ------------- |
| `GET`    | `/api/v1/tasks`            | Get tasks with category, status, and query filters           | ✅            |
| `POST`   | `/api/v1/tasks`            | Create a new task                                            | ✅            |
| `PATCH`  | `/api/v1/tasks/:id/status` | Update task status (`IN PROGRESS`, `SCHEDULED`, `COMPLETED`) | ✅            |
| `DELETE` | `/api/v1/tasks/:id`        | Delete task                                                  | ✅ (Admin)    |

#### Sample Request (`PATCH /api/v1/tasks/task-102/status`):

```json
{
  "status": "COMPLETED"
}
```

---

### 📅 Meetings & Appointments Module (`/api/v1/meetings`)

| Method  | Endpoint                          | Description                                                                      | Auth Required |
| ------- | --------------------------------- | -------------------------------------------------------------------------------- | ------------- |
| `GET`   | `/api/v1/meetings`                | Get meetings grouped by date (`Upcoming`, `Ongoing`, `Rescheduled`, `Cancelled`) | ✅            |
| `POST`  | `/api/v1/meetings`                | Schedule a new appointment/webinar                                               | ✅            |
| `PATCH` | `/api/v1/meetings/:id/reschedule` | Reschedule meeting time/date                                                     | ✅            |
| `PATCH` | `/api/v1/meetings/:id/cancel`     | Cancel scheduled meeting                                                         | ✅            |

---

### ⏱️ Attendance & Clock-In Module (`/api/v1/attendance`)

| Method | Endpoint                       | Description                                           | Auth Required |
| ------ | ------------------------------ | ----------------------------------------------------- | ------------- |
| `GET`  | `/api/v1/attendance/summary`   | Fetch metrics (Days Present, WFH, Leaves Taken, Rate) | ✅            |
| `POST` | `/api/v1/attendance/clock-in`  | Record clock-in timestamp                             | ✅            |
| `POST` | `/api/v1/attendance/clock-out` | Record clock-out timestamp and calculate work hours   | ✅            |
| `GET`  | `/api/v1/attendance/history`   | Fetch recent clock logs & attendance history          | ✅            |

---

### 🏖️ Leave Management & Approval Module (`/api/v1/leaves`)

| Method  | Endpoint                     | Description                                            | Auth Required |
| ------- | ---------------------------- | ------------------------------------------------------ | ------------- |
| `POST`  | `/api/v1/leaves/apply`       | Submit new leave application (dates, type, reason)     | ✅            |
| `GET`   | `/api/v1/leaves/my-requests` | Get employee leave applications & status               | ✅            |
| `PATCH` | `/api/v1/leaves/:id/approve` | Approve leave application & emit realtime notification | ✅ (Admin)    |
| `PATCH` | `/api/v1/leaves/:id/reject`  | Reject leave request                                   | ✅ (Admin)    |

#### Sample Response (`PATCH /api/v1/leaves/req-884/approve`):

```json
{
  "success": true,
  "message": "Leave application approved",
  "data": {
    "id": "req-884",
    "leaveType": "Annual Leave",
    "startDate": "2026-08-05",
    "endDate": "2026-08-07",
    "totalDays": 3,
    "status": "APPROVED",
    "approvedAt": "2026-07-29T01:58:00Z"
  }
}
```

---

## ⚡ 4. Realtime WebSockets Event Blueprint

Connect frontend via `Socket.io` on `wss://api.i11sprint.com/ws`:

| Event Channel              | Payload Data                            | Trigger Condition                                       |
| -------------------------- | --------------------------------------- | ------------------------------------------------------- |
| `task:created`             | `{ taskId, title, category, assignee }` | New task added by team member                           |
| `task:status_changed`      | `{ taskId, oldStatus, newStatus }`      | Task dragged or completed                               |
| `leave:approved`           | `{ requestId, userEmail, leaveType }`   | Admin approves leave request -> Triggers toast popup 🎉 |
| `attendance:clock_updated` | `{ userId, clockIn, status }`           | User clocks in / out                                    |

---

## 🛡️ 5. Security & Production Checklist

1. **Role-Based Access Control (RBAC)**:
   - Use NestJS `@Roles('ADMIN')` or Express middleware to restrict endpoints like `/api/v1/leaves/:id/approve` to Admin accounts only.
2. **CORS & CSRF Protection**:
   - Allow cross-origin requests exclusively from `https://app.i11sprint.com`.
3. **Database Connection Pooling**:
   - Configure PgBouncer with `max_connections = 100` to prevent connection exhaustion under high concurrency.
4. **Environment Variables**:
   - Secure secrets (`DATABASE_URL`, `JWT_SECRET`, `REDIS_URL`) using AWS Secrets Manager or HashiCorp Vault.

---

## 🚀 6. Frontend API Client Setup (`src/services/api.ts`)

Connect your existing TanStack Query / Axios frontend code:

```typescript
import axios from "axios";

export const apiClient = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL || "https://api.i11sprint.com/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("i11sprint_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

_Built with ❤️ for i11Sprint Teams._
