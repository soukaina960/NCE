import { Routes } from '@angular/router';
import { App } from './app';
import { LoginComponent } from './auth/login/login';
import { RegisterComponent } from './auth/register/register';
import { AdminDashboardComponent } from './admin/dashboard/dashboard';
import { AdminGuard } from './guards/admin.guard';
// import { RedirectGuard } from './guards/redirect.guard'; // ← Commenté temporairement

export const routes: Routes = [
  // Page d'accueil principale
  { 
    path: '', 
    component: App,
    data: { title: 'Accueil - ElectroSolution' }
  },
  
  // Pages d'authentification SANS guard temporairement
  { 
    path: 'connexion', 
    component: LoginComponent, 
    // canActivate: [RedirectGuard], // ← Commenté pour test
    data: { title: 'Connexion - ElectroSolution' }
  },
  { 
    path: 'inscription', 
    component: RegisterComponent, 
    // canActivate: [RedirectGuard], // ← Commenté pour test
    data: { title: 'Inscription - ElectroSolution' }
  },

  // Espace admin
  { 
    path: 'admin', 
    component: AdminDashboardComponent, 
    canActivate: [AdminGuard],
    data: { title: 'Administration - ElectroSolution' }
  },

  // Redirection pour les routes inconnues
  { 
    path: '**', 
    redirectTo: '',
    pathMatch: 'full'
  }
];