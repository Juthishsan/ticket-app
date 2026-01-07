import { Injectable, signal, effect } from '@angular/core';
import { Ticket } from '../models/ticket.model';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private readonly STORAGE_KEY = 'ticket_app_data';
  
  // Signals for reactivity
  tickets = signal<Ticket[]>([]);

  constructor() {
    this.loadTickets();
    
    // Auto-save whenever tickets change
    effect(() => {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.tickets()));
    });
  }

  private loadTickets() {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (data) {
      try {
        const parsed = JSON.parse(data);
        // Restore Date objects? JSON.parse leaves them as strings.
        // Let's just keep them as potentially strings or parse them if needed. 
        // For display, the date pipe handles strings often, but let's be safe.
        this.tickets.set(parsed);
      } catch (e) {
        console.error('Failed to load tickets', e);
      }
    }
  }

  createTicket(data: Omit<Ticket, 'id' | 'status' | 'createdAt' | 'messages'>): string {
    const newTicket: Ticket = {
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
    
    this.tickets.update(current => [newTicket, ...current]);
    return newTicket.id;
  }

  updateStatus(id: string, status: Ticket['status']) {
    this.tickets.update(current => 
      current.map(t => t.id === id ? { ...t, status } : t)
    );
  }

  addMessage(ticketId: string, message: { sender: 'customer' | 'admin', text: string }) {
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
                timestamp: new Date()
              }
            ]
          };
        }
        return t;
      })
    );
  }

  getTicketById(id: string): Ticket | undefined {
    return this.tickets().find(t => t.id === id);
  }
}
