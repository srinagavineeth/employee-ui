import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {

  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (token) {
    return true; // ✅ allow access
  }

  // ❌ no token → redirect to login
  router.navigate(['/']);
  return false;
};