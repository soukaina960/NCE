import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { RegisterRequest } from '../../shared/models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  showPassword = false;
  showConfirmPassword = false;
  successMessage = '';

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
    this.registerForm = this.createForm();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      // Informations personnelles
      nom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      prenom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.required, Validators.pattern(/^(\+33|0)[1-9](\d{2}){4}$/)]],
      
      // Mot de passe
      password: ['', [
        Validators.required, 
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      ]],
      confirmPassword: ['', [Validators.required]],
      
      // Adresse
      adresse: this.fb.group({
        rue: ['', [Validators.required, Validators.minLength(5)]],
        ville: ['', [Validators.required, Validators.minLength(2)]],
        codePostal: ['', [Validators.required, Validators.pattern(/^[0-9]{5}$/)]],
        pays: ['France', [Validators.required]]
      }),
      
      // Préférences
      typeClient: ['particulier', [Validators.required]],
      newsletter: [true],
      conditionsAcceptees: [false, [Validators.requiredTrue]]
    }, { validators: this.passwordMatchValidator });
  }

  private passwordMatchValidator(g: FormGroup) {
    const password = g.get('password')?.value;
    const confirmPassword = g.get('confirmPassword')?.value;
    
    if (password !== confirmPassword) {
      g.get('confirmPassword')?.setErrors({ mismatch: true });
      return { mismatch: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const formValue = this.registerForm.value;
      const userData: RegisterRequest = {
        nom: formValue.nom,
        prenom: formValue.prenom,
        email: formValue.email,
        password: formValue.password,
        telephone: formValue.telephone,
        adresse: formValue.adresse,
        typeClient: formValue.typeClient,
        newsletter: formValue.newsletter
      };

      console.log('📝 Données d\'inscription:', userData);

      this.authService.register(userData).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success) {
            this.successMessage = 'Inscription réussie ! Redirection...';
            console.log('✅ Inscription réussie:', response);
            
            // Redirection après un court délai
            setTimeout(() => {
              if (response.user?.role === 'admin') {
                this.router.navigate(['/admin']);
              } else {
                this.router.navigate(['/client/dashboard']);
              }
            }, 2000);
          } else {
            this.errorMessage = response.message || 'Erreur lors de l\'inscription';
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 
                            error.message || 
                            'Erreur lors de l\'inscription. Veuillez réessayer.';
          console.error('❌ Erreur inscription:', error);
        }
      });
    } else {
      this.markFormGroupTouched();
      this.errorMessage = 'Veuillez corriger les erreurs dans le formulaire';
    }
  }

  togglePasswordVisibility(field: 'password' | 'confirmPassword'): void {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      if (control instanceof FormGroup) {
        Object.keys(control.controls).forEach(subKey => {
          control.get(subKey)?.markAsTouched();
        });
      } else {
        control?.markAsTouched();
      }
    });
  }

  getPasswordStrength(): string {
    const password = this.password?.value;
    if (!password) return '';

    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[@$!%*?&]/.test(password);
    const isLong = password.length >= 8;

    const score = [hasLower, hasUpper, hasNumber, hasSpecial, isLong].filter(Boolean).length;

    switch (score) {
      case 5: return 'strong';
      case 4: return 'good';
      case 3: return 'fair';
      default: return 'weak';
    }
  }
  // Ajoutez cette méthode dans votre RegisterComponent
fillTestData(): void {
  this.registerForm.patchValue({
    nom: 'Dupont',
    prenom: 'Jean',
    email: 'jean.dupont@email.com',
    telephone: '0123456789',
    password: 'Test123!',
    confirmPassword: 'Test123!',
    adresse: {
      rue: '123 Rue de la République',
      ville: 'Paris',
      codePostal: '75001',
      pays: 'France'
    },
    typeClient: 'particulier',
    newsletter: true,
    conditionsAcceptees: true
  });
  
  console.log('🧪 Données de test remplies');
  console.log('✅ Formulaire valide:', this.registerForm.valid);
}

  // Getters pour les contrôles du formulaire
  get nom() { return this.registerForm.get('nom'); }
  get prenom() { return this.registerForm.get('prenom'); }
  get email() { return this.registerForm.get('email'); }
  get telephone() { return this.registerForm.get('telephone'); }
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }
  get rue() { return this.registerForm.get('adresse.rue'); }
  get ville() { return this.registerForm.get('adresse.ville'); }
  get codePostal() { return this.registerForm.get('adresse.codePostal'); }
  get pays() { return this.registerForm.get('adresse.pays'); }
  get typeClient() { return this.registerForm.get('typeClient'); }
  get conditionsAcceptees() { return this.registerForm.get('conditionsAcceptees'); }
} 