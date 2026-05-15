import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';
import { AppRole } from '../../core/models/role.model';

export const APPOINTMENT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/appointment-dashboard/appointment-dashboard.component').then(m => m.AppointmentDashboardComponent),
    canActivate: [roleGuard],
    data: { roles: [AppRole.SUPER_ADMIN, AppRole.ADMIN, AppRole.RECEPTIONIST, AppRole.DOCTOR] }
  }
];
