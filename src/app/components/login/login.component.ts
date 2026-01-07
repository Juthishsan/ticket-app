import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = signal('');
  isLoading = signal(false);

  constructor(private authService: AuthService, private router: Router) {
    // If already logged in, go to admin
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/admin']);
    }
  }

  onLogin() {
    if (!this.username || !this.password) {
      this.errorMessage.set('Please enter both username and password');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    // Simulate a small network delay for realism
    setTimeout(() => {
      const success = this.authService.login(this.username, this.password);
      
      if (success) {
        this.router.navigate(['/admin']);
      } else {
        this.errorMessage.set('Invalid credentials. Try admin / admin123');
        this.isLoading.set(false);
      }
    }, 800);
  }
}
