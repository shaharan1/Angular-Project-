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
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/patient-detail/patient-detail.component').then(m => m.PatientDetailComponent),
    canActivate: [roleGuard],
    data: { roles: [AppRole.SUPER_ADMIN, AppRole.ADMIN, AppRole.DOCTOR, AppRole.NURSE, AppRole.RECEPTIONIST] }
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./pages/patient-edit/patient-edit.component').then(m => m.PatientEditComponent),
    canActivate: [roleGuard],
    data: { roles: [AppRole.SUPER_ADMIN, AppRole.ADMIN, AppRole.RECEPTIONIST] }
  }
];
