// dashboard.component.ts - Version corrigée
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../shared/models/user.model';
import { environment } from '../../environments/environments/environments';


interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface Stats {
  totalClients: number;
  totalAdmins: number;
  nouveauxClientsMois: number;
  clientsActifs: number;
  clientsInactifs: number;
  clientsParType: { _id: string; count: number }[];
}

interface Client {
  _id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  estActif: boolean;
  dateInscription: string;
  typeClient?: string;
  notesAdmin?: any[];
  adresse?: any;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class AdminDashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private http = inject(HttpClient);
  
  currentUser: User | null = null;
  isLoading = true;
  activeTab: 'dashboard' | 'clients' = 'dashboard';
  
  stats: Stats = {
    totalClients: 0,
    totalAdmins: 0,
    nouveauxClientsMois: 0,
    clientsActifs: 0,
    clientsInactifs: 0,
    clientsParType: []
  };

  clients: Client[] = [];
  clientsPagination: Pagination = {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  };
  selectedClient: Client | null = null;
  newNoteContent: string = '';
  searchTerm: string = '';

  ngOnInit(): void {
    this.loadUserData();
    this.loadStats();
    this.loadClients();
  }

  private loadUserData(): void {
    this.currentUser = this.authService.getCurrentUser();
    console.log('👤 Admin connecté:', this.currentUser);
  }

  // Chargement des statistiques
  loadStats(): void {
    this.isLoading = true;
    this.http.get<any>(`${environment.apiUrl}/admin/statistiques`).subscribe({
      next: (response) => {
        if (response.success) {
          this.stats = response.statistiques;
          console.log('📊 Stats réelles:', this.stats);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Erreur chargement stats:', error);
        this.isLoading = false;
      }
    });
  }

  // Chargement des clients
  loadClients(page: number = 1): void {
    this.isLoading = true;
    
    this.http.get<any>(`${environment.apiUrl}/admin/clients?page=${page}&limit=${this.clientsPagination.limit}`).subscribe({
      next: (response) => {
        console.log('📨 Réponse API clients:', response);
        
        if (response.success) {
          this.clients = response.clients;
          this.clientsPagination = response.pagination;
          console.log('✅ Clients chargés:', this.clients.length);
          
          // Debug: afficher les clients réels
          this.clients.forEach(client => {
            console.log('👤 Client:', client.nom, client.prenom, client.email);
          });
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Erreur chargement clients:', error);
        this.isLoading = false;
      }
    });
  }

  // AJOUT DE LA MÉTHODE MANQUANTE - RECHERCHE DE CLIENTS
  searchClients(): void {
    if (!this.searchTerm.trim()) {
      this.loadClients();
      return;
    }

    this.isLoading = true;
    console.log('🔍 Recherche clients:', this.searchTerm);
    
    this.http.get<any>(`${environment.apiUrl}/admin/clients/search?q=${encodeURIComponent(this.searchTerm)}`).subscribe({
      next: (response) => {
        if (response.success) {
          this.clients = response.clients;
          this.clientsPagination = {
            page: 1,
            limit: 20,
            total: response.total,
            pages: 1
          };
          console.log('✅ Clients trouvés:', this.clients.length);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Erreur recherche clients:', error);
        this.isLoading = false;
      }
    });
  }

  // Route de debug
  debugUsers(): void {
    this.http.get<any>(`${environment.apiUrl}/admin/debug-users`).subscribe({
      next: (response) => {
        console.log('🔍 DEBUG - Tous les utilisateurs:', response);
      },
      error: (error) => {
        console.error('❌ Erreur debug:', error);
      }
    });
  }

  // Chargement détail client
  loadClientDetail(clientId: string): void {
    if (!clientId) {
      console.error('❌ ID client manquant');
      return;
    }
    
    this.http.get<any>(`${environment.apiUrl}/admin/clients/${clientId}`).subscribe({
      next: (response) => {
        if (response.success) {
          this.selectedClient = response.client;
          console.log('✅ Détail client chargé:', this.selectedClient);
        }
      },
      error: (error) => {
        console.error('❌ Erreur détail client:', error);
      }
    });
  }

  // Ajouter une note à un client
  addNoteToClient(clientId: string | undefined): void {
    if (!clientId) {
      console.error('❌ ID client manquant pour ajouter une note');
      return;
    }
    
    if (!this.newNoteContent.trim()) return;

    this.http.post<any>(`${environment.apiUrl}/admin/clients/${clientId}/notes`, {
      contenu: this.newNoteContent
    }).subscribe({
      next: (response) => {
        if (response.success) {
          this.newNoteContent = '';
          this.loadClientDetail(clientId);
        }
      },
      error: (error) => {
        console.error('❌ Erreur ajout note:', error);
      }
    });
  }

  // Changer statut client
  toggleUserStatus(clientId: string | undefined, currentStatus: boolean): void {
    if (!clientId) {
      console.error('❌ ID client manquant pour changer le statut');
      return;
    }
    
    if (!confirm(`Êtes-vous sûr de vouloir ${currentStatus ? 'désactiver' : 'activer'} ce client ?`)) {
      return;
    }

    this.http.patch<any>(`${environment.apiUrl}/admin/clients/${clientId}/statut`, {
      estActif: !currentStatus
    }).subscribe({
      next: (response) => {
        if (response.success) {
          this.loadClients(this.clientsPagination.page);
          if (this.selectedClient && this.selectedClient._id === clientId) {
            this.selectedClient.estActif = !currentStatus;
          }
        }
      },
      error: (error) => {
        console.error('❌ Erreur changement statut:', error);
      }
    });
  }

  // Navigation entre pages
  changePage(page: number): void {
    if (page >= 1 && page <= this.clientsPagination.pages) {
      this.loadClients(page);
    }
  }

  // Changer d'onglet
  setActiveTab(tab: 'dashboard' | 'clients'): void {
    this.activeTab = tab;
    if (tab === 'clients') {
      this.loadClients();
    } else if (tab === 'dashboard') {
      this.loadStats();
    }
  }

  // Formatage des dates
  formatDate(dateString: string): string {
    if (!dateString) return 'Date inconnue';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Formater le type de client
  formatTypeClient(type: string | undefined): string {
    if (!type) return 'Particulier';
    return type.charAt(0).toUpperCase() + type.slice(1);
  }

  // Vérifier si client actif
  isClientActive(client: Client | null): boolean {
    if (!client) return false;
    return client.estActif !== undefined ? client.estActif : true;
  }

  // Formater l'adresse
  formatAdresse(adresse: any): string {
    if (!adresse) return 'Non renseignée';
    
    const parts = [];
    if (adresse.rue) parts.push(adresse.rue);
    if (adresse.ville) parts.push(adresse.ville);
    if (adresse.codePostal) parts.push(adresse.codePostal);
    if (adresse.pays) parts.push(adresse.pays);
    
    return parts.length > 0 ? parts.join(', ') : 'Non renseignée';
  }

  // Déconnexion
  logout(): void {
    this.authService.logout();
  }
}