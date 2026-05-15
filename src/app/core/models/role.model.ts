export enum AppRole {
  SUPER_ADMIN = 'Super Admin',
  ADMIN = 'Admin',
  DOCTOR = 'Doctor',
  NURSE = 'Nurse',
  RECEPTIONIST = 'Receptionist',
  LAB_TECH = 'Lab Technician',
  PHARMACIST = 'Pharmacist',
  ACCOUNTANT = 'Accountant',
  HR_MANAGER = 'HR Manager',
  PATIENT = 'Patient'
}

export interface Permission {
  id: number;
  name: string;
  code: string; // e.g., 'view_patients', 'edit_billing'
  description?: string;
}

export interface Role {
  id: number;
  name: AppRole | string;
  permissions: Permission[];
}
