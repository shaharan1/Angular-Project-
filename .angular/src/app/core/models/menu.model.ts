import { AppRole } from './role.model';

export interface MenuItem {
  title: string;
  icon: string;
  route?: string;
  children?: MenuItem[];
  allowedRoles?: AppRole[]; // If undefined, available to all authenticated users
}
