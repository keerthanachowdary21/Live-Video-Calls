const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const WebSocket = require('ws');
require('dotenv').config();

// Initialize Express App
const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Define Room Schema
const roomSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  participants: { type: Number, default: 0 },
});

const Room = mongoose.model('Room', roomSchema);

// WebSocket Setup
const wss = new WebSocket.Server({ port: process.env.WS_PORT || 8080 });

wss.on('connection', ws => {
  console.log('New WebSocket connection');

  ws.on('message', message => {
    console.log('Received:', message);

    // Broadcast to all connected clients
    wss.clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
});

// 100ms API Token Generation
async function generateToken(roomId) {
  try {
    const response = await axios.post(
      'https://api.100ms.live/v2/api/token',
      {
        room_id: roomId,
        role: 'participant',
        exp: Math.floor(Date.now() / 1000) + 3600, // Token expiry time (1 hour)
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HMS_API_KEY}`,
        },
      }
    );
    return response.data.token;
  } catch (error) {
    console.error('Error generating token:', error.response?.data || error.message);
    throw new Error('Failed to generate token');
  }
}

// API Endpoints

// Create Room
app.post('/api/rooms', async (req, res) => {
  const { roomId } = req.body;
  if (!roomId) {
    return res.status(400).json({ error: 'roomId is required' });
  }

  try {
    const newRoom = new Room({ roomId });
    await newRoom.save();
    res.status(201).json({ message: 'Room created successfully', roomId });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ error: 'Room already exists' });
    } else {
      console.error('Error creating room:', error);
      res.status(500).json({ error: 'Failed to create room' });
    }
  }
});

// Generate Token for Participant
app.post('/api/rooms/:roomId/token', async (req, res) => {
  const { roomId } = req.params;
  try {
    const room = await Room.findOne({ roomId });
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    const token = await generateToken(roomId);
    res.status(200).json({ token });
  } catch (error) {
    console.error('Error generating token for room:', error);
    res.status(500).json({ error: 'Error generating token' }); 
  }
});


// List Active Rooms
app.get('/api/rooms', async (req, res) => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
});

// Delete Room
app.delete('/api/rooms/:roomId', async (req, res) => {
  const { roomId } = req.params;
  try {
    const room = await Room.findOneAndDelete({ roomId });
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    res.status(200).json({ message: 'Room deleted successfully', roomId });
  } catch (error) {
    console.error('Error deleting room:', error);
    res.status(500).json({ error: 'Failed to delete room' });
  }
});

// Start Server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
