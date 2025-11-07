import { Component } from '@angular/core';

@Component({
  selector: 'app-services',
  templateUrl: './service.html',
  styleUrls: ['./service.scss']
})
export class Services {
  isModalOpen = false;
  currentService: any = null;

  servicesData: { [key: string]: any } = {
    interphone: {
      title: 'Systèmes d\'interphone vidéo',
      icon: 'fas fa-video',
      fullDescription: 'Nous installons des systèmes d\'interphone vidéo de pointe qui combinent technologies de communication avancées et vision haute définition pour assurer votre sécurité et votre confort. Nos solutions incluent des fonctionnalités innovantes pour une protection optimale.',
      features: [
        'Contrôle d\'accès sécurisé avec reconnaissance faciale',
        'Vidéo HD et audio bidirectionnel de qualité studio',
        'Accès et contrôle via application mobile dédiée',
        'Installation et configuration professionnelle complète',
        'Support technique 24h/24',
        'Intégration avec les systèmes existants'
      ],
      technologies: ['Interphones vidéo HD', 'Applications mobiles', 'Systèmes de réseau', 'Capteurs haute sensibilité']
    },
    securite: {
      title: 'Système de sécurité complet',
      icon: 'fas fa-shield-alt',
      fullDescription: 'Notre système de sécurité intégré offre une protection complète pour votre domicile ou entreprise. Avec des capteurs haute sensibilité, des sirènes puissantes et une application mobile intuitive, vous gardez le contrôle total où que vous soyez.',
      features: [
        'Capteurs de mouvement et d\'ouverture haute sensibilité',
        'Sirènes puissantes avec flash lumineux',
        'Application mobile avec notifications instantanées',
        'Surveillance 24h/24 par notre centre de sécurité',
        'Contrôle à distance en temps réel',
        'Rapports détaillés et historiques'
      ],
      technologies: ['Capteurs intelligents', 'Centrale d\'alarme', 'Application mobile', 'Système de monitoring']
    },
    energie: {
      title: 'Systèmes intelligents de contrôle de l\'énergie',
      icon: 'fas fa-bolt',
      fullDescription: 'Optimisez votre consommation énergétique avec nos systèmes intelligents de gestion de l\'énergie. Des solutions innovantes pour réduire vos coûts tout en améliorant votre confort et votre sécurité électrique.',
      features: [
        'Gestion énergétique intelligente et automatisée',
        'Automatisation résidentielle complète',
        'Optimisation de la consommation en temps réel',
        'Contrôle à distance via smartphone',
        'Alertes de surconsommation',
        'Rapports détaillés d\'économie d\'énergie'
      ],
      technologies: ['Automates intelligents', 'Capteurs énergétiques', 'Applications de contrôle', 'Systèmes IoT']
    },
    'controle-acces': {
      title: 'Contrôle d\'accès avancé',
      icon: 'fas fa-door-closed',
      fullDescription: 'Systèmes de contrôle d\'accès sécurisés et pratiques intégrant les dernières technologies en matière de sécurité physique et électronique. Protégez vos accès avec des solutions adaptées à vos besoins.',
      features: [
        'Portiers vidéo haute définition avec vision nocturne',
        'Moniteurs intérieurs tactiles',
        'Enregistreurs réseau avec stockage cloud',
        'Installation professionnelle et configuration',
        'Maintenance préventive et corrective',
        'Formation à l\'utilisation'
      ],
      technologies: ['Portiers vidéo HD', 'Moniteurs tactiles', 'Enregistreurs numériques', 'Systèmes de stockage']
    },
    cameras: {
      title: 'Caméras de sécurité',
      icon: 'fas fa-camera',
      fullDescription: 'Surveillez votre propriété en temps réel avec nos systèmes de caméras de sécurité haute définition. Accédez à vos images depuis n\'importe quel appareil, à tout moment, avec une qualité d\'image exceptionnelle.',
      features: [
        'Surveillance en temps réel 24h/24',
        'Accès multi-appareils simultanés',
        'Enregistrement continu avec détection de mouvement',
        'Vision nocturne jusqu\'à 30 mètres',
        'Stockage cloud sécurisé',
        'Alertes intelligentes'
      ],
      technologies: ['Caméras IP HD', 'Systèmes NVR', 'Vision nocturne', 'Stockage cloud']
    },
    serrurerie: {
      title: 'Serrurerie & Sécurité Physique',
      icon: 'fas fa-lock',
      fullDescription: 'Solutions complètes de serrurerie et de sécurité physique pour une protection maximale de vos biens. De la serrurerie traditionnelle aux systèmes électroniques les plus avancés.',
      features: [
        'Serrures haute sécurité anti-effraction',
        'Systèmes de verrouillage électroniques',
        'Contrôle d\'accès biométrique',
        'Dépannage urgent 24h/24 et 7j/7',
        'Audit de sécurité personnalisé',
        'Maintenance préventive'
      ],
      technologies: ['Serrures certifiées', 'Systèmes biométriques', 'Contrôleurs d\'accès', 'Cylindres haute sécurité']
    }
  };

  openServiceModal(serviceKey: string) {
    this.currentService = this.servicesData[serviceKey];
    this.isModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeServiceModal() {
    this.isModalOpen = false;
    this.currentService = null;
    document.body.style.overflow = 'auto';
  }

  takeAppointment() {
    // Logique pour prendre rendez-vous
    alert('Redirection vers le formulaire de rendez-vous');
    // this.router.navigate(['/rendez-vous']);
  }

  callEmergency() {
    window.location.href = 'tel:+212662385179';
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }
}
