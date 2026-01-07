require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Ticket = require('./models/Ticket');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increase limit for Base64 images

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Routes
app.get('/', (req, res) => {
  res.send('Ticket App API is running!');
});

// 1. Get all tickets (for Admin) OR Filter by Email (for Customer)
app.get('/api/tickets', async (req, res) => {
  try {
    const { email } = req.query;
    const query = email ? { email } : {};
    
    const tickets = await Ticket.find(query).sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Get single ticket by UUID (for Tracking)
app.get('/api/tickets/:id', async (req, res) => {
  try {
    // Note: We are searching by our custom 'id' field, not MongoDB '_id'
    const ticket = await Ticket.findOne({ id: req.params.id });
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Create Ticket
app.post('/api/tickets', async (req, res) => {
  try {

    const newTicket = new Ticket(req.body);
    await newTicket.save();
    res.status(201).json(newTicket);
  } catch (err) {
    console.error('Create Ticket Error:', err);
    res.status(400).json({ error: err.message, details: err.errors });
  }
});

// 4. Update Status
app.put('/api/tickets/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const ticket = await Ticket.findOneAndUpdate(
      { id: req.params.id },
      { status },
      { new: true }
    );
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Add Message
app.post('/api/tickets/:id/messages', async (req, res) => {
  try {
    const { sender, text } = req.body;
    const ticket = await Ticket.findOne({ id: req.params.id });

    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    ticket.messages.push({
      sender,
      text,
      timestamp: new Date()
    });

    await ticket.save();
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
