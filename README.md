# Sleep Analysis Backend

This is the Express/Mongoose backend for the Sleep Quality Analysis System.

## Setup

1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
2. Create a `.env` file (see `.env` example) with:
   ```text
   PORT=5000
   MONGO_URI=your-mongodb-connection-string
   ```
3. Start the server:
   ```bash
   npm start
   ```

## API

- `POST /api/sleep` – add a sleep record (validate fields)
- `GET /api/sleep` – retrieve all records

The server includes basic request logging (morgan) and centralized error handling.
