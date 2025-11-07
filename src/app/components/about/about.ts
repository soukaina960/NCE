import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {
   takeAppointment() {
    // Logique pour prendre rendez-vous
    console.log('Ouverture modal de rendez-vous');
  }

  ngAfterViewInit() {
    this.startCounters();
  }

  startCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
      observer.observe(counter);
    });
  }

  animateCounter(element: Element) {
    const target = +(element.getAttribute('data-target') || 0);
    const duration = 2000; // 2 seconds
    const step = target / (duration / 16); // 60fps
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      
      if (target === 100) {
        element.textContent = Math.round(current) + '%';
      } else if (target === 24) {
        element.textContent = Math.round(current) + '/7';
      } else {
        element.textContent = Math.round(current) + '+';
      }
    }, 16);
  }
}
