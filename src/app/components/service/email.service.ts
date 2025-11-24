// email.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private apiUrl = 'https://votre-backend.com/api/send-email'; // Remplacez par votre URL backend

  constructor(private http: HttpClient) { }

  sendContactForm(formData: any) {
    return this.http.post(this.apiUrl, formData);
  }
}