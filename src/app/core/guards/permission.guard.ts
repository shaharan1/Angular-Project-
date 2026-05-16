import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { AppRole } from '../models/role.model';

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
  if (user.role === AppRole.SUPER_ADMIN) return true;

  // Placeholder for complex permission check
  // For now, if you are logged in and NOT super admin, we'll assume you don't have special 'permissions' 
  // unless we implement a full permission list in User model.
  
  toastr.error('You lack the specific permission required for this action.', 'Permission Denied');
  return router.createUrlTree(['/dashboard']);
};
