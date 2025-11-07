import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class Header implements OnInit, OnDestroy {
  isScrolled = false;
  isMenuActive = false;
  currentSlide = 0;
  private slideInterval: any;

  ngOnInit(): void {
    this.startSlideShow();
    this.createParticles();
  }

  ngOnDestroy(): void {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.isScrolled = window.scrollY > 100;
  }

  toggleMenu(): void {
    this.isMenuActive = !this.isMenuActive;
  }

  closeMenu(): void {
    this.isMenuActive = false;
  }

  scrollToSection(sectionId: string): void {
    this.closeMenu();
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = document.getElementById('header')?.offsetHeight || 0;
      const offsetTop = element.offsetTop - headerHeight;
      
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  }

  // Méthodes pour les boutons d'authentification
  onInscription(): void {
    this.closeMenu();
    // Logique pour l'inscription
    console.log('Redirection vers la page d\'inscription');
  }

  onConnexion(): void {
    this.closeMenu();
    // Logique pour la connexion
    console.log('Redirection vers la page de connexion');
  }

  // Gestion du défilement des images de fond
  private startSlideShow(): void {
    this.slideInterval = setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % 2; // Alterne entre 0 et 1
    }, 6000); // Change toutes les 6 secondes
  }

  // Création des particules dynamiques
  private createParticles(): void {
    // Les particules sont créées via CSS avec le sélecteur :nth-child
    // Cette méthode est optionnelle si vous voulez créer des particules via JavaScript
  }
}