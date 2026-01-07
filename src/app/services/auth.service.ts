import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly ADMIN_USER = 'admin';
  private readonly ADMIN_PASS = 'admin123';
  private readonly AUTH_KEY = 'ticket_app_auth';

  // Signal to track login state
  isAuthenticated = signal<boolean>(this.checkInitialAuth());

  constructor(private router: Router) {}

  private checkInitialAuth(): boolean {
    return localStorage.getItem(this.AUTH_KEY) === 'true';
  }

  login(username: string, pass: string): boolean {
    if (username === this.ADMIN_USER && pass === this.ADMIN_PASS) {
      localStorage.setItem(this.AUTH_KEY, 'true');
      this.isAuthenticated.set(true);
      return true;
    }
    return false;
  }

  logout() {
    localStorage.removeItem(this.AUTH_KEY);
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }
}
