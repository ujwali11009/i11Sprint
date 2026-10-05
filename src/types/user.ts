export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'EMPLOYEE' | 'ADMIN';
  jobTitle: string;
  avatarUrl: string | null;
  department: string;
  employmentType: string;
  phoneNumber: string | null;
  employeeCode: string | null;
  bio: string | null;
  skills: string[];
  createdAt: string;
  updatedAt: string;
}
