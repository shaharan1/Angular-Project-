export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  HOSPITAL_ADMIN = 'HOSPITAL_ADMIN',
  DOCTOR = 'DOCTOR',
  NURSE = 'NURSE',
  RECEPTIONIST = 'RECEPTIONIST',
  LAB_TECHNICIAN = 'LAB_TECHNICIAN',
  PHARMACIST = 'PHARMACIST',
  ACCOUNTANT = 'ACCOUNTANT',
  HR_MANAGER = 'HR_MANAGER',
  PATIENT = 'PATIENT'
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatarUrl?: string;
  permissions: string[];
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}
