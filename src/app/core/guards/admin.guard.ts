import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuthenticated = authService.isAuthenticated();
  const isAdmin = authService.isAdmin();

  console.log('Admin Guard Check:', { isAuthenticated, isAdmin, url: state.url });

  if (isAuthenticated && isAdmin) {
    return true;
  }

  console.log('Admin Guard: Redirecting to login');
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};

