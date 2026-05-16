export enum AppRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  DOCTOR = 'DOCTOR',
  NURSE = 'NURSE',
  RECEPTIONIST = 'RECEPTIONIST',
  LAB_TECHNICIAN = 'LAB_TECHNICIAN',
  PHARMACIST = 'PHARMACIST',
  FINANCE = 'FINANCE',
  HR_MANAGER = 'HR_MANAGER',
  USER = 'USER'
}

export interface Permission {
  id: number;
  name: string;
  code: string;
  description?: string;
}

export interface Role {
  id: number;
  name: string;
  code: AppRole | string;
  permissions?: Permission[];
}
