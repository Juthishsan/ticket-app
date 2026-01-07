import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-role-selection',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="role-container fade-in">
      <h1>Welcome to the Portal</h1>
      <p>Please select your role to proceed</p>
      
      <div class="cards-wrapper">
        <div class="role-card" (click)="selectRole('customer')">
          <div class="icon">👤</div>
          <h2>Customer</h2>
          <p>Raise tickets and track your requests</p>
        </div>

        <div class="role-card admin" (click)="selectRole('admin')">
          <div class="icon">🛡️</div>
          <h2>Administrator</h2>
          <p>Manage tickets and support users</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .role-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 80vh;
      text-align: center;
    }
    
    h1 {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
      background: linear-gradient(135deg, #fff, #94a3b8);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    p { color: var(--text-muted); margin-bottom: 3rem; }
    
    .cards-wrapper {
      display: flex;
      gap: 2rem;
      flex-wrap: wrap;
      justify-content: center;
    }
    
    .role-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      padding: 3rem 2rem;
      width: 300px;
      cursor: pointer;
      transition: all 0.3s;
      position: relative;
      overflow: hidden;
    }
    
    .role-card:hover {
      transform: translateY(-5px);
      border-color: var(--primary);
      box-shadow: var(--shadow-xl);
    }
    
    .role-card.admin:hover {
      border-color: var(--secondary);
    }
    
    .icon {
      font-size: 4rem;
      margin-bottom: 1.5rem;
    }
    
    h2 { margin-bottom: 0.5rem; color: var(--text-main); }
    
    @media (max-width: 650px) {
      .cards-wrapper { flex-direction: column; }
      .role-card { width: 100%; max-width: 300px; }
    }
  `]
})
export class RoleSelectionComponent {
  constructor(private router: Router) {}

  selectRole(role: 'admin' | 'customer') {
    if (role === 'admin') {
      this.router.navigate(['/login']);
    } else {
      // For customer, we assume they are logged in as the 'Portal User'
      this.router.navigate(['/customer']);
    }
  }
}
