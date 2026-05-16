import { AppRole } from './role.model';

export interface User {
  id: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  phone?: string;
  isActive: boolean;
  role: AppRole;
  lastLogin?: Date;
}
