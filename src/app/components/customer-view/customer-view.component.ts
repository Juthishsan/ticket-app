import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TicketService } from '../../services/ticket.service';

@Component({
  selector: 'app-customer-view',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './customer-view.component.html',
  styleUrl: './customer-view.component.css'
})
export class CustomerViewComponent {
  customerName = '';
  email = '';
  title = '';
  description = '';
  images = signal<string[]>([]);
  
  isSubmitting = signal(false);
  successMessage = signal('');
  createdTicketId = signal(''); // Store the ID of the newly created ticket

  constructor(private ticketService: TicketService, private router: Router) {
    // Pre-fill with Hardcoded User
    this.customerName = this.ticketService.MOCK_USER.name;
    this.email = this.ticketService.MOCK_USER.email;
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.images.update(imgs => [...imgs, e.target.result]);
        };
        reader.readAsDataURL(files[i]);
      }
    }
  }

  removeImage(index: number) {
    this.images.update(imgs => imgs.filter((_, i) => i !== index));
  }

  submitTicket() {
    if (!this.customerName || !this.email || !this.title || !this.description) {
      alert('Please fill in all required fields');
      return;
    }

    this.isSubmitting.set(true);
    
    // Simulate delay for effect
    setTimeout(async () => {
      const newId = await this.ticketService.createTicket({
        customerName: this.customerName,
        email: this.email,
        title: this.title,
        description: this.description,
        images: this.images()
      });
      
      this.isSubmitting.set(false);
      this.createdTicketId.set(newId);
      this.successMessage.set('Ticket raised successfully!');
      
      // Reset form
      this.customerName = '';
      this.email = '';
      this.title = '';
      this.description = '';
      this.images.set([]);
    }, 1000);
  }
}
