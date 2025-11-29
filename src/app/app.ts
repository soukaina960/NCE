import { Component, signal, OnInit, OnDestroy, inject } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

// Components
import { Header } from './components/header/header';
import { Services } from './components/service/service';
import { About } from './components/about/about';
import { Contact } from './components/contact/contact';
import { Footer } from './components/footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    Header, 
    Services,
    About,
    Contact,
    Footer
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit, OnDestroy {
  private router = inject(Router);
  private routerSubscription!: Subscription;

  readonly title = signal('ElectroSolution');
  currentSection = signal('home');
  isAuthPage = signal(false);

  ngOnInit(): void {
    this.setupRouterListener();
    this.checkCurrentRoute();
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  /**
   * Écoute les changements de route
   */
  private setupRouterListener(): void {
    this.routerSubscription = this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe(() => {
        this.checkCurrentRoute();
      });
  }

  /**
   * Vérifie la route actuelle
   */
  private checkCurrentRoute(): void {
    const currentRoute = this.router.url;
    this.isAuthPage.set(
      currentRoute === '/connexion' || 
      currentRoute === '/inscription' ||
      currentRoute === '/admin'||
      currentRoute === '/client/dashboard'
    );
  }

  /**
   * Scroll vers une section spécifique
   */
  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
      this.currentSection.set(sectionId);
    }
  }

  /**
   * Vérifie si une section est active
   */
  isActiveSection(sectionId: string): boolean {
    return this.currentSection() === sectionId;
  }
}