import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';
import { AppRole } from '../../core/models/role.model';

export const BILLING_ROUTES: Routes = [
  {
    path: '',
    canActivate: [roleGuard],
    data: { roles: [AppRole.SUPER_ADMIN, AppRole.ADMIN, AppRole.FINANCE] },
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/billing-dashboard/billing-dashboard.component').then(m => m.BillingDashboardComponent)
      },
      {
        path: 'create',
        loadComponent: () => import('./pages/invoice-form/invoice-form.component').then(m => m.InvoiceFormComponent)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
];
