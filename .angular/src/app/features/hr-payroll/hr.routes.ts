import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';
import { AppRole } from '../../core/models/role.model';

export const HR_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/hr-dashboard/hr-dashboard.component').then(m => m.HrDashboardComponent),
    canActivate: [roleGuard],
    data: { roles: [AppRole.SUPER_ADMIN, AppRole.ADMIN, AppRole.HR_MANAGER] }
  }
];
