// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { App } from './app';
import { LoginComponent } from './auth/login/login';
import { RegisterComponent } from './auth/register/register';
import { AdminDashboardComponent } from './admin/dashboard/dashboard';
import { AdminGuard } from './guards/admin.guard';
import { ClientDashboardComponent } from './client/dashboard/dashboard';
import { ClientAuthGuard } from './guards/client-auth.guard';
import { ClientGuestGuard } from './guards/client-guest.guard';

export const routes: Routes = [
  // Page d'accueil principale
  { 
    path: '', 
    component: App,
    data: { title: 'Accueil - ElectroSolution' }
  },
  
  // Pages d'authentification - Accessibles seulement aux non-connectés
  { 
    path: 'connexion', 
    component: LoginComponent, 
    canActivate: [ClientGuestGuard],
    data: { title: 'Connexion - ElectroSolution' }
  },
  { 
    path: 'inscription', 
    component: RegisterComponent, 
    canActivate: [ClientGuestGuard],
    data: { title: 'Inscription - ElectroSolution' }
  },

  // Espace admin
  { 
    path: 'admin', 
    component: AdminDashboardComponent, 
    canActivate: [AdminGuard],
    data: { title: 'Administration - ElectroSolution' }
  },

  // Espace client - Protégé par authentification
  { 
    path: 'client',
    component: ClientDashboardComponent,
    canActivate: [ClientAuthGuard],
    data: { title: 'Espace Client - ElectroSolution' }
  },

  // Sous-routes de l'espace client


  // Redirection pour les routes inconnues
  { 
    path: '**', 
    redirectTo: '',
    pathMatch: 'full'
  }
];