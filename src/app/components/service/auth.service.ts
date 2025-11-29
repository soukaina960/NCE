// src/app/services/auth.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

export interface Client {
  _id: string;
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  estActif: boolean;
  dateInscription: string;
  typeClient: 'particulier' | 'professionnel';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'http://localhost:5000/api'; // Ajustez selon votre API

  private clientSubject = new BehaviorSubject<Client | null>(this.getClientFromStorage());
  public client$ = this.clientSubject.asObservable();

  // Connexion client
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/client/login`, { email, password })
      .pipe(
        tap(response => {
          if (response.success && response.token) {
            localStorage.setItem('client_token', response.token);
            localStorage.setItem('client_data', JSON.stringify(response.client));
            this.clientSubject.next(response.client);
          }
        })
      );
  }

  // Inscription client
  register(clientData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/client/register`, clientData);
  }

  // Déconnexion
  logout(): void {
    localStorage.removeItem('client_token');
    localStorage.removeItem('client_data');
    this.clientSubject.next(null);
    this.router.navigate(['/connexion']);
  }

  // Vérifier si connecté
  isLoggedIn(): boolean {
    return !!localStorage.getItem('client_token');
  }

  // Getter du token
  getToken(): string | null {
    return localStorage.getItem('client_token');
  }

  // Récupérer les données du client depuis le localStorage
  private getClientFromStorage(): Client | null {
    const clientData = localStorage.getItem('client_data');
    return clientData ? JSON.parse(clientData) : null;
  }

  // Récupérer le client actuel
  getCurrentClient(): Client | null {
    return this.clientSubject.value;
  }
}