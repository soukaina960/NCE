import { Component, signal } from '@angular/core';
import { Header } from './components/header/header';
import { Services } from './components/service/service';
import { About } from './components/about/about';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Header, Services,About],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('ncee');
}
