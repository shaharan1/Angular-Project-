import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { ToastrService } from 'ngx-toastr';

export const permissionGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const toastr = inject(ToastrService);

  const requiredPermission = route.data['permission'] as string;

  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
  }

  const user = authService.currentUserSignal();
  if (!user || !user.role) {
    return router.createUrlTree(['/login']);
  }

  // Super Admin has all permissions
  if (user.role.name === 'Super Admin') return true;

  const hasPermission = user.role.permissions.some(p => p.code === requiredPermission);

  if (hasPermission) {
    return true;
  }

  toastr.error('You lack the specific permission required for this action.', 'Permission Denied');
  return router.createUrlTree(['/dashboard']);
};
