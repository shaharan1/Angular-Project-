import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';
import { AppRole } from '../../core/models/role.model';

export const HR_ROUTES: Routes = [
  {
    path: '',
    canActivate: [roleGuard],
    data: { roles: [AppRole.SUPER_ADMIN, AppRole.ADMIN, AppRole.HR_MANAGER] },
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./hr-dashboard/hr-dashboard.component').then(m => m.HrDashboardComponent)
      },
      {
        path: 'employees',
        loadComponent: () => import('./employee-list/employee-list.component').then(m => m.EmployeeListComponent)
      },
      {
        path: 'payroll',
        loadComponent: () => import('./payroll/payroll.component').then(m => m.PayrollComponent)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
];
