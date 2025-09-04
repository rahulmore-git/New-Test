# Task Tracker (MERN)

A full-stack Task Tracker built with React + TailwindCSS (frontend) and Node.js + Express + MongoDB (backend). Features JWT auth, per-user tasks, tags, priority, search, filtering, and timestamps.

## Prerequisites
- Node.js 18+ and npm
- MongoDB (local service or Atlas)

## Project Structure
```
root/
  client/   # React + Vite + Tailwind frontend
  server/   # Node + Express + Mongoose backend
```

## Backend Setup (server)
```powershell
cd server
npm install
```

Create a .env file in server/ (copy and adjust):
```
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017/task_tracker
JWT_SECRET=replace_with_a_long_random_secret
CLIENT_ORIGIN=http://localhost:5173
```

Seed sample data (creates users and tasks):
```powershell
npm run seed
```

Run the backend in dev mode:
```powershell
npm run dev
```

Health check:
- GET http://localhost:4000/api/health

## Frontend Setup (client)
```powershell
cd client
npm install
```

Create client/.env:
```
VITE_API_URL=http://localhost:4000/api
```

Run the frontend:
```powershell
npm run dev
```

Open: http://localhost:5173

## Test Accounts (from seed)
- alice@example.com / password123
- bob@example.com / password123

## Features
- Add, edit, delete tasks
- Mark tasks completed/pending
- Tags and priority (low/medium/high)
- Search and filter (query, status, priority)
- Created/updated timestamps
- JWT authentication (signup/login), users see their own tasks
- Modular backend (routes, controllers, models, middleware)
- Input validation and error handling

## Backend API (summary)
- Auth
  - POST /api/auth/signup { name, email, password }
  - POST /api/auth/login { email, password }
  - GET /api/auth/me (Bearer token)
- Tasks (Bearer token required)
  - GET /api/tasks?q=&priority=&completed=&page=&limit=
  - POST /api/tasks { title, description?, priority?, tags?, dueDate? }
  - GET /api/tasks/:id
  - PUT /api/tasks/:id { ...fields }
  - DELETE /api/tasks/:id

## Configure MongoDB Atlas (optional)
1. Create a free Atlas cluster
2. Allow network access for your IP or 0.0.0.0/0 for testing
3. Create a database user and password
4. Set MONGODB_URI in server/.env, e.g.
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/<db>?retryWrites=true&w=majority

## Troubleshooting
- CORS errors: ensure CLIENT_ORIGIN in server/.env includes your frontend URL
- API not reachable: verify backend (4000) and frontend (5173) are running
- JWT issues: regenerate a strong JWT_SECRET and restart backend
- Mongo connection: confirm MONGODB_URI and Mongo service/Atlas credentials

## Scripts
- server
  - npm run dev – start Express with nodemon
  - npm run seed – populate sample users and tasks
- client
  - npm run dev – start Vite dev server
  - npm run build – production build

## License
MIT
