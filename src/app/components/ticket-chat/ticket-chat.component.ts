import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TicketService } from '../../services/ticket.service';
import { Ticket } from '../../models/ticket.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ticket-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ticket-chat.component.html',
  styleUrl: './ticket-chat.component.css'
})
export class TicketChatComponent {
  private ticketService = inject(TicketService);
  private route = inject(ActivatedRoute);

  ticketIdInput = '';
  // Signal to store the ID we are currently tracking
  trackedId = signal('');

  // Computed property to find the ticket reactively
  // We search within loaded tickets which are already filtered by user
  activeTicket = computed(() => {
    const id = this.trackedId();
    if (!id) return undefined;
    return this.ticketService.tickets().find(t => t.id === id);
  });

  newMessage = '';
  // Expose tickets signal directly to template as 'myTickets'
  myTickets = this.ticketService.tickets;

  constructor() {
    // Load this user's tickets immediately
    this.ticketService.loadTickets(this.ticketService.MOCK_USER.email);

    // Check params to see if we linked from success page
    this.route.queryParams.subscribe(params => {
      if (params['id']) {
        this.trackedId.set(params['id']);
      }
    });
  }

  viewTicket(id: string) {
    this.trackedId.set(id);
  }

  resetView() {
    this.trackedId.set('');
    // Refresh list
    this.ticketService.loadTickets(this.ticketService.MOCK_USER.email);
  }

  sendMessage() {
    const ticket = this.activeTicket();
    if (!this.newMessage.trim() || !ticket) return;

    this.ticketService.addMessage(ticket.id, {
      sender: 'customer',
      text: this.newMessage
    });

    this.newMessage = '';
  }
}
