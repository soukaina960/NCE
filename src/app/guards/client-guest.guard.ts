// src/app/guards/client-guest.guard.ts
import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, map, take } from 'rxjs';
import { AuthService } from '../components/service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ClientGuestGuard implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    return this.authService.client$.pipe(
      take(1),
      map(client => {
        const isAuthenticated = !!client && this.authService.isLoggedIn();
        
        if (isAuthenticated) {
          // Rediriger vers le dashboard si déjà connecté
          return this.router.createUrlTree(['/client']);
        }
        
        return true;
      })
    );
  }
}