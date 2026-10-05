import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const hash = (pw: string) => bcrypt.hash(pw, 10);

async function main() {
  const users = [
    {
      email: 'ujwal@i11sprint.com',
      password: 'sprint2024!',
      fullName: 'Ujwal S C',
      role: 'EMPLOYEE' as const,
      jobTitle: 'Developer',
      department: 'Product Strategy',
      employmentType: 'Full-time',
      phoneNumber: '+62 812 9988 7766',
      employeeCode: 'i11009',
      bio: 'Pioneering product roadmaps and high-velocity sprint workflows for modern result-driven teams.',
      skills: ['Product Strategy', 'Sprint Management', 'UX Architecture'],
      avatarUrl: '/avatars/ujwal.png',
    },
    {
      email: 'jagdeep@i11sprint.com',
      password: 'admin123',
      fullName: 'Jagdeep',
      role: 'ADMIN' as const,
      jobTitle: 'Team Lead',
      department: 'Core Infrastructure',
      employmentType: 'Full-time',
      phoneNumber: '',
      employeeCode: 'i11003',
      bio: 'Building resilient microservices, realtime WebSockets, and high-concurrency database schemas.',
      skills: ['Node.js', 'Go', 'PostgreSQL', 'Redis', 'WebSockets'],
      avatarUrl: '/avatars/jagdeep.png',
    },
    {
      email: 'basava@i11sprint.com',
      password: 'changeme123',
      fullName: 'Basava',
      role: 'EMPLOYEE' as const,
      jobTitle: 'Backend Developer',
      department: 'Engineering',
      employmentType: 'Full-time',
      phoneNumber: '',
      employeeCode: 'i11002',
      bio: 'Crafting pixel-perfect, hyper-responsive UI components with React, TypeScript, and Tailwind CSS.',
      skills: ['React JS', 'TypeScript', 'Tailwind CSS', 'WebGL'],
      avatarUrl: '/avatars/basava.png',
    },
    {
      email: 'keerthi@i11sprint.com',
      password: 'changeme123',
      fullName: 'Keerthi',
      role: 'EMPLOYEE' as const,
      jobTitle: 'Mobile App Developer',
      department: 'Design System',
      employmentType: 'Full-time',
      phoneNumber: '',
      employeeCode: 'i11004',
      bio: 'Designing intuitive, high-converting user interfaces and sleek modern design systems.',
      skills: ['Figma', 'Design Systems', 'Micro-Animations', 'User Research'],
      avatarUrl: '/avatars/keerthi.png',
    },
    {
      email: 'santhosh@i11sprint.com',
      password: 'changeme123',
      fullName: 'Santhosh',
      role: 'EMPLOYEE' as const,
      jobTitle: 'DevOps Engineer',
      department: 'Engineering',
      employmentType: 'Full-time',
      phoneNumber: '',
      employeeCode: 'i11005',
      bio: 'Connecting complex frontend web applications with robust, scalable backend APIs.',
      skills: ['React', 'NestJS', 'GraphQL', 'REST APIs'],
      avatarUrl: '/avatars/santhosh.png',
    },
    {
      email: 'saravanan@i11sprint.com',
      password: 'changeme123',
      fullName: 'Saravanan',
      role: 'EMPLOYEE' as const,
      jobTitle: 'QA & Test Automation Engineer',
      department: 'Quality Assurance',
      employmentType: 'Full-time',
      phoneNumber: '',
      employeeCode: 'i11006',
      bio: 'Ensuring zero-defect software builds and seamless end-to-end testing automation.',
      skills: ['Playwright', 'Jest', 'Cypress', 'CI/CD Pipelines'],
      avatarUrl: '/avatars/saravanan.png',
    },
    {
      email: 'shashin@i11sprint.com',
      password: 'changeme123',
      fullName: 'Shashin',
      role: 'EMPLOYEE' as const,
      jobTitle: 'Front End Developer',
      department: 'Cloud & Infrastructure',
      employmentType: 'Full-time',
      phoneNumber: '',
      employeeCode: 'i11007',
      bio: 'Automating continuous deployment pipelines, Kubernetes clusters, and cloud monitoring.',
      skills: ['Docker', 'Kubernetes', 'AWS', 'Terraform', 'GitHub Actions'],
      avatarUrl: '/avatars/shashin.png',
    },
  ];

  for (const u of users) {
    const { password, ...rest } = u;
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: { ...rest, passwordHash: await hash(password) },
    });
  }
  console.log(`Seeded ${users.length} users.`);

  const i11Fleet = await prisma.project.upsert({
    where: { id: 'seed-i11fleet' },
    update: {},
    create: { id: 'seed-i11fleet', name: 'i11Fleet' },
  });

  const otherProjects = ['Kargo', 'CIO Fellows', 'Vialto', 'AIOps'];
  for (const name of otherProjects) {
    const existing = await prisma.project.findFirst({ where: { name } });
    if (!existing) {
      await prisma.project.create({ data: { name } });
    }
  }

  const children = ['Kanban Board', 'Sprint Reports'];
  for (const name of children) {
    const existing = await prisma.project.findFirst({ where: { name, parentProjectId: i11Fleet.id } });
    if (!existing) {
      await prisma.project.create({ data: { name, parentProjectId: i11Fleet.id } });
    }
  }
  console.log('Seeded projects.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
