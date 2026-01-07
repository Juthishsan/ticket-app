import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TicketService } from '../../services/ticket.service';
import { Ticket } from '../../models/ticket.model';

@Component({
  selector: 'app-admin-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-view.component.html',
  styleUrl: './admin-view.component.css'
})
export class AdminViewComponent {
  private ticketService = inject(TicketService);
  
  // Directly expose the signal
  tickets = this.ticketService.tickets;
  
  // Example compued: Open count
  openCount = computed(() => this.tickets().filter(t => t.status === 'Open').length);
  resolvedCount = computed(() => this.tickets().filter(t => t.status === 'Resolved').length);

  expandedTicketId: string | null = null;
  newMessage = '';

  // Removed redundant constructor logic since inject() is used above

  toggleExpand(id: string) {
    this.expandedTicketId = this.expandedTicketId === id ? null : id;
  }

  updateStatus(id: string, status: Ticket['status'], event: Event) {
    event.stopPropagation(); // Prevent toggling expand
    this.ticketService.updateStatus(id, status);
  }

  sendMessage(ticketId: string) {
    if (!this.newMessage.trim()) return;

    this.ticketService.addMessage(ticketId, {
      sender: 'admin',
      text: this.newMessage
    });
    
    this.newMessage = '';
  }
}
