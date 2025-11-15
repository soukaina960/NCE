import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { LoginRequest } from '../../shared/models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  showPassword = false;
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.createForm();
  }

  ngOnInit(): void {
    // Vérifier si l'utilisateur est déjà connecté
    if (this.authService.isAuthenticated()) {
      this.redirectBasedOnRole();
    }

    // Vérifier s'il y a un message de succès après inscription
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state?.['successMessage']) {
      this.successMessage = navigation.extras.state['successMessage'];
      
      setTimeout(() => {
        this.successMessage = '';
      }, 5000);
    }

    // Remplir l'email si "Se souvenir de moi" était coché
    this.fillSavedEmail();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

onSubmit(): void {
  if (this.loginForm.valid) {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const credentials: LoginRequest = {
      email: this.loginForm.get('email')?.value.toLowerCase().trim(),
      password: this.loginForm.get('password')?.value
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.isLoading = false;

        if (response.success) {
          // Stocker l’utilisateur connecté
          localStorage.setItem('currentUser', JSON.stringify(response.user));

          // Stocker la préférence "Se souvenir de moi"
          if (this.loginForm.get('rememberMe')?.value) {
            localStorage.setItem('rememberMe', 'true');
            localStorage.setItem('savedEmail', credentials.email);
          } else {
            localStorage.removeItem('rememberMe');
            localStorage.removeItem('savedEmail');
          }

          // 🔹 Redirection automatique selon le rôle
          const user = response.user;
          if (user.role === 'admin') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/client/dashboard']);
          }
        }
      },
      error: (error) => {
        this.isLoading = false;

        if (error.status === 401) {
          this.errorMessage = error.error?.message || 'Email ou mot de passe incorrect.';
        } else if (error.status === 0) {
          this.errorMessage = 'Impossible de se connecter au serveur. Vérifiez votre connexion.';
        } else {
          this.errorMessage = error.error?.message || 'Une erreur est survenue lors de la connexion. Veuillez réessayer.';
        }

        console.error('Erreur de connexion:', error);
      }
    });
  } else {
    this.markFormGroupTouched();
  }
}


  private redirectBasedOnRole(): void {
    const user = this.authService.getCurrentUser();
    if (user?.role === 'admin') {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/client/dashboard']);
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      this.loginForm.get(key)?.markAsTouched();
    });
  }

  fillSavedEmail(): void {
    if (localStorage.getItem('rememberMe') === 'true') {
      const savedEmail = localStorage.getItem('savedEmail');
      if (savedEmail) {
        this.loginForm.patchValue({ email: savedEmail, rememberMe: true });
      }
    }
  }

  // Getters pour le template
  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
}