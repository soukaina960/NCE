import { Component, signal } from '@angular/core';
import { Header } from './components/header/header';
import { Services } from './components/service/service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Header, Services],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('ncee');
}
