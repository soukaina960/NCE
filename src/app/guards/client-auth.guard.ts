// src/app/guards/client-auth.guard.ts
import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, map, take } from 'rxjs';
import { AuthService } from '../components/service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ClientAuthGuard implements CanActivate {
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
          // Vérifier si le compte est actif
          if (client.estActif === false) {
            this.authService.logout();
            return this.router.createUrlTree(['/connexion'], {
              queryParams: { 
                error: 'compte_desactive' 
              }
            });
          }
          return true;
        } else {
          // Rediriger vers la page de connexion
          return this.router.createUrlTree(['/connexion'], {
            queryParams: { 
              returnUrl: state.url 
            }
          });
        }
      })
    );
  }
}