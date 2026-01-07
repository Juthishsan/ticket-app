import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private authService = inject(AuthService);
  protected readonly title = signal('ticket-app');
  
  isAuthenticated = this.authService.isAuthenticated;

  logout() {
    this.authService.logout();
  }
}
