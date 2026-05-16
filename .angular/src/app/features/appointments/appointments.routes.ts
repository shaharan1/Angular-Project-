import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';
import { AppRole } from '../../core/models/role.model';

export const APPOINTMENT_ROUTES: Routes = [
  {
    path: '',
    canActivate: [roleGuard],
    data: { roles: [AppRole.SUPER_ADMIN, AppRole.ADMIN, AppRole.RECEPTIONIST, AppRole.DOCTOR] },
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/appointment-dashboard/appointment-dashboard.component').then(m => m.AppointmentDashboardComponent)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
];
