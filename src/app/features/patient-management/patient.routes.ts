import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';
import { AppRole } from '../../core/models/role.model';

export const PATIENT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/patient-list/patient-list.component').then(m => m.PatientListComponent),
    canActivate: [roleGuard],
    data: { roles: [AppRole.SUPER_ADMIN, AppRole.ADMIN, AppRole.DOCTOR, AppRole.NURSE, AppRole.RECEPTIONIST] }
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/patient-registration/patient-registration.component').then(m => m.PatientRegistrationComponent),
    canActivate: [roleGuard],
    data: { roles: [AppRole.SUPER_ADMIN, AppRole.RECEPTIONIST, AppRole.ADMIN] }
  }
];
