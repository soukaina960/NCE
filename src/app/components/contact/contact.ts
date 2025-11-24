// contact.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ContactService, ContactFormData } from '../../components/service/contact.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
  providers: [ContactService] // Ajoutez le service ici
})
export class Contact implements OnInit {
  contactForm: FormGroup;
  isSubmitting = false;
  submitMessage = '';
  messageType: 'success' | 'error' | '' = '';

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService
  ) {
    this.contactForm = this.createForm();
  }

  ngOnInit(): void {}

  private createForm(): FormGroup {
    return this.fb.group({
      service: ['', Validators.required],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[\d\s-()\s]+$/)]],
      message: ['', [Validators.required, Validators.minLength(10)]],
      projectType: [''],
      budget: ['']
    });
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      this.isSubmitting = true;
      this.submitMessage = '';
      
      const formData: ContactFormData = this.contactForm.value;
      
      this.contactService.submitContact(formData).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.messageType = 'success';
          this.submitMessage = response.message || 'Votre demande a été envoyée avec succès ! Nous vous recontacterons rapidement.';
          this.contactForm.reset();
        },
        error: (error) => {
          this.isSubmitting = false;
          this.messageType = 'error';
          this.submitMessage = error.error?.message || 'Une erreur s\'est produite lors de l\'envoi. Veuillez réessayer.';
          console.error('Erreur lors de l\'envoi:', error);
        }
      });
    } else {
      this.markFormGroupTouched(this.contactForm);
      this.messageType = 'error';
      this.submitMessage = 'Veuillez corriger les erreurs dans le formulaire.';
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Getters pour un accès facile aux contrôles dans le template
  get service() { return this.contactForm.get('service'); }
  get firstName() { return this.contactForm.get('firstName'); }
  get lastName() { return this.contactForm.get('lastName'); }
  get email() { return this.contactForm.get('email'); }
  get phone() { return this.contactForm.get('phone'); }
  get message() { return this.contactForm.get('message'); }
  get projectType() { return this.contactForm.get('projectType'); }
  get budget() { return this.contactForm.get('budget'); }
}