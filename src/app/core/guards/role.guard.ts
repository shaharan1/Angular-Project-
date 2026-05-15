import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { AppRole } from '../models/role.model';
import { ToastrService } from 'ngx-toastr';

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const toastr = inject(ToastrService);

  const allowedRoles = route.data['roles'] as AppRole[];

  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
  }

  if (!allowedRoles || allowedRoles.length === 0) {
    // If no roles specified, assume any authenticated user can access
    return true;
  }

  if (authService.hasRole(allowedRoles)) {
    return true;
  }

  // User does not have permission
  toastr.error('You do not have permission to access this module.', 'Access Denied');
  return router.createUrlTree(['/dashboard']);
};
