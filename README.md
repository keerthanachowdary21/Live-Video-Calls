# API for Live Call Integration

## Description
This project is a backend service that integrates with the [100ms API](https://www.100ms.live/docs) to manage live video calls. The service provides REST APIs for room management, token generation for participants, and real-time updates using WebSocket. It also stores room and participant details in a database for tracking purposes.

---

## Features
1. **REST API**:
   - **Create Room**: Create a room for live video calls.
   - **Generate Tokens**: Generate tokens for participants to join the room.
   - **List Active Rooms**: Retrieve a list of active rooms with their participant count.

2. **WebSocket Integration**:
   - Send and receive real-time updates about participants joining or leaving the call.

3. **Database**:
   - Store room and participant details to enable room tracking and participant management.

---

## Requirements
### Functional
- REST API to manage rooms and tokens.
- WebSocket for real-time updates.
- Database integration for persistent storage.

### Technical
- Understanding of real-time API integration.
- Clean and modular code structure.
- Efficient database schema for room and participant tracking.

---

## Technology Stack
- **Backend Framework**: Node.js with Express
- **Database**: MongoDB (via Mongoose)
- **Real-time Communication**: WebSocket
- **API Integration**: 100ms API
- **Environment Variables**: `dotenv`

---

## Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone https://keerthanachowdary21/your-repository/Live-Video-Call.git
   cd Live-Video-Call
   ```
---   
## Environment Variables

Create a `.env` file in the root directory and add the following:

```bash
PORT=5000
WS_PORT=8080
MONGO_URI=YOUR_MONGO_URL
HMS_API_KEY=your_100ms_api_key
```
---
## Start the Application

   ```bash
npm start
```
---
## API Endpoints

1. Create Room
Endpoint: `POST /api/rooms`
**Request Body**:
```bash
JSON
{
  "roomId": "unique_room_id"
}
```
**Response**:
```bash
JSON
{
  "message": "Room created successfully",
  "roomId": "unique_room_id"
}
```

2. List Active Rooms
Endpoint: `GET /api/rooms`
**Response**:
```bash
JSON

[
  {
    "roomId": "room123",
    "participants": 10
  }
]
```

3. Delete Room
Endpoint: `DELETE /api/rooms/:roomId`
**Response**:
```bash
JSON
{
  "message": "Room deleted successfully",
  "roomId": "room123"
}
```
---
## WebSocket Events
 - On Connection: Logs new WebSocket connections.
 - On Message: Broadcasts real-time updates to all connected clients about participant changes.


