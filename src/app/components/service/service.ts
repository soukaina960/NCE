import { Component } from '@angular/core';

@Component({
  selector: 'app-services',
  templateUrl: './service.html',
  styleUrls: ['./service.scss']
})
export class Services {
  takeAppointment(serviceName: string) {
    console.log('Ouverture modal de rendez-vous depuis les services');
    this.requestAppointment(serviceName);
  }

  // Méthode appelée quand un utilisateur demande un rendez-vous
  requestAppointment(serviceName: string) {
    console.log(`Rendez-vous demandé pour: ${serviceName}`);
    
    // Exemple d'action possible :
    this.openAppointmentModal(serviceName);
  
    // Autres options possibles :
    // this.router.navigate(['/contact'], { queryParams: { service: serviceName } });
    // this.openContactForm(serviceName);
  }

  // Méthode pour afficher les détails d'un service
  showServiceDetails(serviceId: number) {
    console.log(`Détails demandés pour le service: ${serviceId}`);
    this.openServiceDetailsModal(serviceId);
  }

  // Méthode privée pour ouvrir le modal de rendez-vous
  private openAppointmentModal(serviceName: string) {
    console.log(`Ouverture modal rendez-vous pour ${serviceName}`);
    // Exemple : this.modalService.open(AppointmentModalComponent, { data: { service: serviceName } });
  }

  // Méthode privée pour ouvrir le modal de détails
  private openServiceDetailsModal(serviceId: number) {
    console.log(`Ouverture modal détails pour service ${serviceId}`);
    // Exemple : this.modalService.open(ServiceDetailsModalComponent, { data: { serviceId: serviceId } });
  }

  // Méthode pour faire défiler la page jusqu'aux détails
  private scrollToServiceDetails(serviceId: number) {
    const element = document.getElementById(`service-details-${serviceId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
