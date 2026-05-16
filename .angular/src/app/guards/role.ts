import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth';
import { UserRole } from '../models/user';

export const roleGuard = (allowedRoles: UserRole[]): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const userRole = authService.userRole();

    if (userRole && allowedRoles.includes(userRole)) {
      return true;
    }

    router.navigate(['/dashboard']);
    return false;
  };
};
