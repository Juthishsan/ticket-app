import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketService } from '../../services/ticket.service';
import { Ticket } from '../../models/ticket.model';

@Component({
  selector: 'app-admin-view',
  standalone: true,
  imports: [CommonModule],
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

  toggleExpand(id: string) {
    this.expandedTicketId = this.expandedTicketId === id ? null : id;
  }

  updateStatus(id: string, status: Ticket['status'], event: Event) {
    event.stopPropagation(); // Prevent toggling expand
    this.ticketService.updateStatus(id, status);
  }
}
