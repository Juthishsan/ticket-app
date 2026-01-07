export interface ChatMessage {
  sender: 'customer' | 'admin' | 'system';
  text: string;
  timestamp: Date;
}

export interface Ticket {
  id: string;
  customerName: string;
  email: string;
  title: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  createdAt: Date;
  images: string[]; // Base64 strings for simplicity in local-only app
  messages: ChatMessage[];
}
