import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TicketService } from '../../services/ticket.service';

@Component({
  selector: 'app-customer-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-view.component.html',
  styleUrl: './customer-view.component.css'
})
export class CustomerViewComponent {
  customerName = '';
  email = '';
  title = '';
  description = '';
  images: string[] = [];
  
  isSubmitting = signal(false);
  successMessage = signal('');

  constructor(private ticketService: TicketService, private router: Router) {}

  onFileSelected(event: any) {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.images.push(e.target.result);
        };
        reader.readAsDataURL(files[i]);
      }
    }
  }

  removeImage(index: number) {
    this.images.splice(index, 1);
  }

  submitTicket() {
    if (!this.customerName || !this.email || !this.title || !this.description) {
      alert('Please fill in all required fields');
      return;
    }

    this.isSubmitting.set(true);
    
    // Simulate delay for effect
    setTimeout(() => {
      this.ticketService.createTicket({
        customerName: this.customerName,
        email: this.email,
        title: this.title,
        description: this.description,
        images: this.images
      });
      
      this.isSubmitting.set(false);
      this.successMessage.set('Ticket raised successfully! Check the Admin View.');
      
      // Reset form
      this.customerName = '';
      this.email = '';
      this.title = '';
      this.description = '';
      this.images = [];
      
      // Optional: Redirect or just show message
      // setTimeout(() => this.successMessage.set(''), 3000);
    }, 1000);
  }
}
