# Note Taking App

A full-stack CRUD web application that allows authenticated users to create, view, edit, organize, search, pin, and delete personal notes. Built as an academic BSc.CSIT project demonstrating session-based authentication and RESTful API design.

## Features

- User signup, login, and logout with session-based authentication
- Passwords hashed with bcryptjs — never stored in plain text
- Full CRUD functionality for notes (create, read, update, delete)
- Strict data ownership — users can only access their own notes
- Search notes by title and content
- Pin/unpin notes to prioritize important ones
- Clean, responsive UI built with React and Tailwind CSS

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, Tailwind CSS, lucide-react |
| Backend | Node.js, Express |
| Database | MongoDB, Mongoose |
| Authentication | express-session, connect-mongo, bcryptjs |

## Project Structure
## Running Locally

### Backend
```bash
cd server
npm install
# create a .env file with PORT, MONGO_URI, SESSION_SECRET, CLIENT_ORIGIN
node server.js
```

### Frontend
```bash
cd client
npm install
npm run dev
```

The app runs at `http://localhost:5173`, connecting to the API at `http://localhost:5000`.