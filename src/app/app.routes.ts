import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { AppRole } from './core/models/role.model';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./pages/home/home').then(m => m.HomeComponent)
  },
  {
    path: 'appointments/book',
    loadComponent: () => import('./features/appointments/pages/appointment-booking/appointment-booking.component').then(m => m.AppointmentBookingComponent)
  },
  {
    path: '',
    loadComponent: () => import('./layouts/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'patients',
        loadChildren: () => import('./features/patient-management/patient.routes').then(m => m.PATIENT_ROUTES)
      },
      {
        path: 'clinical',
        loadChildren: () => import('./features/clinical/clinical.routes').then(m => m.CLINICAL_ROUTES)
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'hr',
        loadChildren: () => import('./features/hr/hr.routes').then(m => m.HR_ROUTES)
      },
      {
        path: 'billing',
        loadChildren: () => import('./features/billing/billing.routes').then(m => m.BILLING_ROUTES)
      },
      {
        path: 'doctors',
        loadChildren: () => import('./features/doctors/doctor.routes').then(m => m.DOCTOR_ROUTES)
      },
      {
        path: 'appointments',
        loadChildren: () => import('./features/appointments/appointments.routes').then(m => m.APPOINTMENT_ROUTES)
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/profile/pages/profile/profile').then(m => m.ProfileComponent)
      },
      {
        path: 'profile/:id',
        loadComponent: () => import('./features/profile/pages/profile/profile').then(m => m.ProfileComponent)
      },
      {
        path: 'pharmacy',
        loadComponent: () => import('./features/pharmacy/pharmacy-dashboard.component').then(m => m.PharmacyDashboardComponent)
      },
      {
        path: 'laboratory',
        loadComponent: () => import('./features/laboratory/lab-dashboard.component').then(m => m.LabDashboardComponent)
      },
      {
        path: 'admin/users',
        loadComponent: () => import('./features/admin/pages/user-management/user-management').then(m => m.UserManagementComponent),
        canActivate: [roleGuard],
        data: { roles: [AppRole.SUPER_ADMIN] }
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
