import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments/environments';

export interface NoteAdmin {
  auteur: string;
  contenu: string;
  createdAt?: string;
}

export interface Client {
  _id: string;
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  estActif: boolean;
  dateInscription: string;
  typeClient?: 'particulier' | 'professionnel';
  notesAdmin: NoteAdmin[];
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ClientsResponse {
  success: boolean;
  clients: Client[];
  pagination: Pagination;
}

export interface ClientResponse {
  success: boolean;
  client: Client;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getClients(page = 1, limit = 10): Observable<ClientsResponse> {
    const params = new HttpParams()
      .set('page', page)
      .set('limit', limit);
    return this.http.get<ClientsResponse>(`${this.apiUrl}/admin/clients`, { params });
  }

  getClientDetail(clientId: string): Observable<ClientResponse> {
    return this.http.get<ClientResponse>(`${this.apiUrl}/admin/clients/${clientId}`);
  }

  addClientNote(clientId: string, contenu: string) {
    return this.http.post(`${this.apiUrl}/admin/clients/${clientId}/notes`, { contenu });
  }

  toggleUserStatus(clientId: string, estActif: boolean) {
    return this.http.patch(`${this.apiUrl}/admin/clients/${clientId}/statut`, { estActif });
  }

  searchClients(query: string): Observable<ClientsResponse> {
    const params = new HttpParams().set('q', query);
    return this.http.get<ClientsResponse>(`${this.apiUrl}/admin/clients/search`, { params });
  }
}
