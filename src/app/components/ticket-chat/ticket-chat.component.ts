import { Component, signal, computed } from '@angular/core';
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
  ticketIdInput = '';
  // Signal to store the ID we are currently tracking
  trackedId = signal('');
  
  // Computed property to find the ticket reactively
  activeTicket = computed(() => {
    const id = this.trackedId();
    if (!id) return undefined;
    return this.ticketService.tickets().find(t => t.id === id);
  });

  newMessage = '';
  errorMsg = signal('');

  constructor(private ticketService: TicketService, private route: ActivatedRoute) {
    // Optional: if id is passed in query params
    this.route.queryParams.subscribe(params => {
      if (params['id']) {
        this.ticketIdInput = params['id'];
        this.loadTicket();
      }
    });
  }

  loadTicket() {
    this.errorMsg.set('');
    if (!this.ticketIdInput.trim()) return;
    
    // Check if it exists first
    const exists = this.ticketService.getTicketById(this.ticketIdInput.trim());
    if (exists) {
      this.trackedId.set(this.ticketIdInput.trim());
    } else {
      this.trackedId.set('');
      this.errorMsg.set('Ticket not found. Please check the ID.');
    }
  }

  resetView() {
    this.ticketIdInput = '';
    this.trackedId.set('');
    this.errorMsg.set('');
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
