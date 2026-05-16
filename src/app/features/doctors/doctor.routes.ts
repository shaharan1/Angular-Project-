import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';
import { AppRole } from '../../core/models/role.model';

export const DOCTOR_ROUTES: Routes = [
  {
    path: '',
    canActivate: [roleGuard],
    data: { roles: [AppRole.SUPER_ADMIN, AppRole.ADMIN, AppRole.DOCTOR] },
    children: [
      {
        path: '',
        loadComponent: () => import('./doctor-monitoring/doctor-monitoring.component').then(m => m.DoctorMonitoringComponent)
      }
    ]
  }
];
