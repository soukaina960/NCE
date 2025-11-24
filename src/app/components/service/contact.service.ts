// contact.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ContactFormData {
  service: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  projectType: string;
  budget?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = 'http://localhost:5000/api/send-email/contact';

  constructor(private http: HttpClient) {}

  submitContact(formData: ContactFormData): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(this.apiUrl, formData, { headers });
  }
}