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
    window.open('tel:+212662385179');
    // Ou redirection vers un formulaire de contact
    // this.router.navigate(['/contact']);
  }
}
