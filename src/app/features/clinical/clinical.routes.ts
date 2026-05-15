import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';
import { AppRole } from '../../core/models/role.model';

export const CLINICAL_ROUTES: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/doctor-dashboard/doctor-dashboard.component').then(m => m.DoctorDashboardComponent),
    canActivate: [roleGuard],
    data: { roles: [AppRole.SUPER_ADMIN, AppRole.DOCTOR, AppRole.NURSE] }
  },
  {
    path: 'consultation/:appointmentId',
    loadComponent: () => import('./pages/consultation/consultation.component').then(m => m.ConsultationComponent),
    canActivate: [roleGuard],
    data: { roles: [AppRole.SUPER_ADMIN, AppRole.DOCTOR] }
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];
