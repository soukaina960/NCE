import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  standalone: true, // ← Ajoutez cette ligne
  imports: [CommonModule, ReactiveFormsModule], // ← Importez les modules nécessaires
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact implements OnInit {
  contactForm: FormGroup;
  isSubmitting = false;

  constructor(private fb: FormBuilder) {
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
      
      console.log('Formulaire soumis:', this.contactForm.value);
      
      setTimeout(() => {
        this.isSubmitting = false;
        alert('Votre demande a été envoyée avec succès ! Nous vous recontacterons rapidement.');
        this.contactForm.reset();
      }, 2000);
    } else {
      this.markFormGroupTouched(this.contactForm);
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