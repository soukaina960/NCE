// src/app/client/dashboard/dashboard.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService, Client } from '../../components/service/auth.service';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Navigation -->
      <nav class="bg-white shadow-sm border-b">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center">
              <h1 class="text-xl font-semibold text-gray-800">Espace Client</h1>
            </div>
            <div class="flex items-center space-x-4">
              <span class="text-gray-700">Bonjour, {{ client?.prenom }}</span>
              <button
                (click)="logout()"
                class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </nav>

      <!-- Contenu principal -->
      <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 py-6 sm:px-0">
          <div class="border-4 border-dashed border-gray-200 rounded-lg p-8">
            <h2 class="text-2xl font-bold text-gray-800 mb-4">Bienvenue dans votre espace client</h2>
            
            <!-- Cartes de navigation -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 class="text-lg font-semibold mb-2">Mon Profil</h3>
                <p class="text-gray-600 mb-4">Gérez vos informations personnelles</p>
                <a routerLink="/client/profil" class="text-blue-600 hover:text-blue-800">
                  Modifier le profil →
                </a>
              </div>

              <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 class="text-lg font-semibold mb-2">Mes Commandes</h3>
                <p class="text-gray-600 mb-4">Consultez votre historique de commandes</p>
                <a routerLink="/client/commandes" class="text-blue-600 hover:text-blue-800">
                  Voir les commandes →
                </a>
              </div>

              <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 class="text-lg font-semibold mb-2">Paramètres</h3>
                <p class="text-gray-600 mb-4">Personnalisez vos préférences</p>
                <a routerLink="/client/parametres" class="text-blue-600 hover:text-blue-800">
                  Configurer →
                </a>
              </div>
            </div>

            <!-- Informations du compte -->
            <div class="mt-8 bg-white p-6 rounded-lg shadow-md">
              <h3 class="text-lg font-semibold mb-4">Informations de votre compte</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-500">Nom complet</p>
                  <p class="font-medium">{{ client?.prenom }} {{ client?.nom }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Email</p>
                  <p class="font-medium">{{ client?.email }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Téléphone</p>
                  <p class="font-medium">{{ client?.telephone || 'Non renseigné' }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Type de compte</p>
                  <p class="font-medium">{{ client?.typeClient }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Date d'inscription</p>
                  <p class="font-medium">{{ client?.dateInscription | date:'dd/MM/yyyy' }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Statut</p>
                  <span 
                    [class]="client?.estActif ? 
                      'bg-green-100 text-green-800 px-2 py-1 rounded text-sm' : 
                      'bg-red-100 text-red-800 px-2 py-1 rounded text-sm'"
                  >
                    {{ client?.estActif ? 'Actif' : 'Inactif' }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `
})
export class ClientDashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  client: Client | null = null;

  ngOnInit() {
    this.authService.client$.subscribe(client => {
      this.client = client;
      if (!client) {
        this.router.navigate(['/connexion']);
      }
    });
  }

  logout() {
    this.authService.logout();
  }
}