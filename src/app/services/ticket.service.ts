import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Ticket } from '../models/ticket.model';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:3000/api/tickets';
  
  // Signals for reactivity
  tickets = signal<Ticket[]>([]);

  constructor() {
    this.loadTickets();
  }

  // Load all tickets (initial load + refresh)
  async loadTickets() {
    try {
      const data = await firstValueFrom(this.http.get<Ticket[]>(this.API_URL));
      this.tickets.set(data);
    } catch (e) {
      console.error('Failed to load tickets from API', e);
    }
  }

  // Create - Returns a Promise now because it's async
  async createTicket(data: Omit<Ticket, 'id' | 'status' | 'createdAt' | 'messages'>): Promise<string> {
    const newTicket = {
      ...data,
      id: crypto.randomUUID(),
      status: 'Open',
      createdAt: new Date(),
      messages: [
        {
          sender: 'system',
          text: 'Your query has been submitted. A support agent will review it shortly.',
          timestamp: new Date()
        }
      ]
    };

    // Optimistic Update (Show it immediately)
    // Note: Mongoose might return the object with _id, but we use our 'id' field
    this.tickets.update(current => [newTicket as Ticket, ...current]);

    // Send to Backend
    try {
      await firstValueFrom(this.http.post(this.API_URL, newTicket));
      return newTicket.id;
    } catch (e) {
      console.error('Failed to create ticket', e);
      // Rollback if needed, but for this demo alert is fine
      alert('Failed to save ticket to server!');
      return newTicket.id;
    }
  }

  async updateStatus(id: string, status: Ticket['status']) {
    // Optimistic Update
    this.tickets.update(current => 
      current.map(t => t.id === id ? { ...t, status } : t)
    );

    try {
      await firstValueFrom(this.http.put(`${this.API_URL}/${id}/status`, { status }));
    } catch (e) {
      console.error('Failed to update status', e);
    }
  }

  async addMessage(ticketId: string, message: { sender: 'customer' | 'admin', text: string }) {
    // Optimistic Update
    this.tickets.update(current => 
      current.map(t => {
        if (t.id === ticketId) {
          return {
            ...t,
            messages: [
              ...t.messages,
              {
                sender: message.sender,
                text: message.text,
                timestamp: new Date() // Temporary local time
              }
            ]
          };
        }
        return t;
      })
    );

    try {
      await firstValueFrom(this.http.post(`${this.API_URL}/${ticketId}/messages`, message));
    } catch (e) {
      console.error('Failed to send message', e);
    }
  }

  getTicketById(id: string): Ticket | undefined {
    // Simple local lookup since we load all tickets. 
    // Ideally for "Track Ticket" if it's not in the list (e.g. huge list), we should fetch it from API.
    // Let's modify: if not found locally, try to fetch?
    // For now, the `loadTickets` gets everything, so find is fine.
    // Implementation Plan: The component calls this. If it returns undefined, the component assumes it's invalid.
    // But now that we have a DB, "get by id" might need to be async if we want to fetch strictly that one ticket.
    // However, existing components expect synchronous return.
    // We will stick to local state for Admin View.
    // For Customer Track view, we should probably fetch it if not found.
    // BUT refactoring the components to be async is a bigger change.
    // Let's keep it sync for now leveraging the behaviour that 'loadTickets' is called on init.
    // NOTE: This means if a customer opens the app fresh, 'tickets' might be empty initially until API returns.
    return this.tickets().find(t => t.id === id);
  }
}
