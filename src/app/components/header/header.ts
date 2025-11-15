import { Component, HostListener, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface NavigationState {
  isScrolled: boolean;
  isMenuActive: boolean;
  currentSlide: number;
  slideInterval: any;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class Header implements OnInit, OnDestroy {
  private router = inject(Router);
  
  public navigationState: NavigationState = {
    isScrolled: false,
    isMenuActive: false,
    currentSlide: 0,
    slideInterval: null
  };

  private readonly SLIDE_INTERVAL = 5000; // 5 secondes
  private readonly SCROLL_THRESHOLD = 100;
  private readonly MOBILE_BREAKPOINT = 768;

  ngOnInit(): void {
    this.initBackgroundSlider();
    this.checkScrollPosition();
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.checkScrollPosition();
  }

  @HostListener('window:resize', [])
  onWindowResize(): void {
    this.handleResize();
  }

  private checkScrollPosition(): void {
    this.navigationState.isScrolled = window.scrollY > this.SCROLL_THRESHOLD;
  }

  private initBackgroundSlider(): void {
    this.navigationState.slideInterval = setInterval(() => {
      this.nextSlide();
    }, this.SLIDE_INTERVAL);
  }

  private nextSlide(): void {
    this.navigationState.currentSlide = 
      (this.navigationState.currentSlide + 1) % 2; // 2 slides
  }

  private handleResize(): void {
    if (window.innerWidth > this.MOBILE_BREAKPOINT && this.navigationState.isMenuActive) {
      this.closeMenu();
    }
  }

  public scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = this.getHeaderHeight();
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      if (this.navigationState.isMenuActive) {
        this.closeMenu();
      }
    }
  }

  public toggleMenu(): void {
    this.navigationState.isMenuActive = !this.navigationState.isMenuActive;
    
    if (this.navigationState.isMenuActive) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
  }

  public closeMenu(): void {
    this.navigationState.isMenuActive = false;
    document.body.classList.remove('no-scroll');
  }

  public onInscription(): void {
    console.log('🔴 onInscription() appelé');
    this.router.navigate(['/inscription']).then(success => {
      console.log('🟢 Navigation inscription:', success);
      if (!success) {
        console.error('❌ Navigation échouée');
        // Fallback
        window.location.href = '/inscription';
      }
    });
  }

  public onConnexion(): void {
    console.log('🔴 onConnexion() appelé');
    this.router.navigate(['/connexion']).then(success => {
      console.log('🟢 Navigation connexion:', success);
      if (!success) {
        console.error('❌ Navigation échouée');
        // Fallback
        window.location.href = '/connexion';
      }
    });
  }

  private getHeaderHeight(): number {
    const header = document.querySelector('header');
    return header ? header.offsetHeight : 0;
  }

  private cleanup(): void {
    if (this.navigationState.slideInterval) {
      clearInterval(this.navigationState.slideInterval);
    }
    document.body.classList.remove('no-scroll');
  }

  // Getters pour le template
  get isScrolled(): boolean {
    return this.navigationState.isScrolled;
  }

  get isMenuActive(): boolean {
    return this.navigationState.isMenuActive;
  }

  get currentSlide(): number {
    return this.navigationState.currentSlide;
  }
}