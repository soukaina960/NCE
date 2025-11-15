// guards/redirect.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

export const RedirectGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('🛡️ RedirectGuard pour:', state.url);
  
  if (authService.isAuthenticated()) {
    console.log('🔐 Utilisateur authentifié, redirection...');
    const user = authService.getCurrentUser();
    
    // Éviter la boucle de redirection
    const isAuthRoute = state.url.includes('/connexion') || state.url.includes('/inscription');
    
    if (isAuthRoute) {
      if (user?.role === 'admin') {
        console.log('➡️ Redirection vers /admin');
        router.navigate(['/admin']);
      } else {
        console.log('➡️ Redirection vers /client/dashboard');
        router.navigate(['/client/dashboard']);
      }
      return false;
    }
  }

  console.log('✅ RedirectGuard - Accès autorisé aux pages auth');
  return true;
};