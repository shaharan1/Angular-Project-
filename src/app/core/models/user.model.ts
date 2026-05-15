import { Role } from './role.model';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatarUrl?: string;
  isActive: boolean;
  role: Role;
  lastLogin?: Date;
  departmentId?: string; // Optional: Link to a specific hospital department
}
