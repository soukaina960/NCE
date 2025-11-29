// src/app/services/client.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments/environments';

export interface ClientFormData {
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  typeClient: 'particulier' | 'professionnel';
  estActif: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  // Récupérer tous les clients (version client)
  getClients(page = 1, limit = 10): Observable<any> {
    const params = new HttpParams()
      .set('page', page)
      .set('limit', limit);
    return this.http.get<any>(`${this.apiUrl}/clients`, { params });
  }

  // Récupérer un client spécifique
  getClient(clientId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/clients/${clientId}`);
  }

  // Créer un nouveau client
  createClient(clientData: ClientFormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/clients`, clientData);
  }

  // Mettre à jour un client
  updateClient(clientId: string, clientData: Partial<ClientFormData>): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/clients/${clientId}`, clientData);
  }

  // Supprimer un client
  deleteClient(clientId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/clients/${clientId}`);
  }

  // Rechercher des clients
  searchClients(query: string): Observable<any> {
    const params = new HttpParams().set('q', query);
    return this.http.get<any>(`${this.apiUrl}/clients/search`, { params });
  }
}