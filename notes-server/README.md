# NoteKeep — Full Stack Notes App

A full-stack notes management system built with **React + Node.js + Express + MongoDB**.

---

## Tech Stack

| Layer     | Tech                                          |
|-----------|-----------------------------------------------|
| Frontend  | React 18, React Router v6, Axios, Vite        |
| Backend   | Node.js, Express 4, express-async-errors      |
| Database  | MongoDB + Mongoose 8                          |
| Auth      | JWT (jsonwebtoken) + bcryptjs                 |
| Validation| Zod (server), inline (client)                 |
| Styling   | CSS Variables + Tailwind utility classes       |

---

## Project Structure

```
notes-app/
├── client/          # React frontend
├── server/          # Node/Express backend
├── package.json     # Root — runs both with concurrently
└── README.md
```

---

## Quick Start

### 1. Clone & install

```bash
git clone <repo-url>
cd notes-app

# Install all dependencies at once
npm run install:all
```

### 2. Configure environment

```bash
cd server
cp .env.example .env
# Edit .env — set MONGO_URI and JWT_SECRET
```

Generate a strong JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3. Run in development

```bash
# From project root — starts both servers
npm run dev

# Or individually:
npm run server   # http://localhost:5000
npm run client   # http://localhost:5173
```

---

## API Reference

### Auth — `/api/auth`

| Method | Endpoint    | Body                          | Auth | Response              |
|--------|-------------|-------------------------------|------|-----------------------|
| POST   | `/register` | `{name, email, password}`     | ✗    | `{token, user}`       |
| POST   | `/login`    | `{email, password}`           | ✗    | `{token, user}`       |

### Notes — `/api/notes`

All note endpoints require `Authorization: Bearer <token>` header.

| Method | Endpoint  | Body                                | Response       |
|--------|-----------|-------------------------------------|----------------|
| GET    | `/`       | —                                   | `Note[]`       |
| POST   | `/`       | `{title, content?, tags?}`          | `Note`         |
| PUT    | `/:id`    | `{title?, content?, tags?}`         | `Note`         |
| DELETE | `/:id`    | —                                   | `{message, id}`|

### Note shape

```json
{
  "_id":       "ObjectId",
  "user":      "ObjectId",
  "title":     "string",
  "content":   "string",
  "tags":      ["string"],
  "isPinned":  false,
  "createdAt": "ISO date",
  "updatedAt": "ISO date"
}
```

---

## Environment Variables

| Variable        | Description                         | Default                         |
|-----------------|-------------------------------------|---------------------------------|
| `PORT`          | Server port                         | `5000`                          |
| `NODE_ENV`      | Environment                         | `development`                   |
| `MONGO_URI`     | MongoDB connection string           | `mongodb://localhost:27017/notesapp` |
| `JWT_SECRET`    | Secret key for signing JWTs         | **required**                    |
| `JWT_EXPIRES_IN`| Token lifetime                      | `7d`                            |
| `CLIENT_ORIGIN` | CORS allowed origin                 | `http://localhost:5173`         |

---

## Key Design Decisions

**Ownership checks in every DB query** — `findOneAndUpdate({ _id, user: req.user._id })` prevents a user from reading or mutating another user's notes, even with a valid JWT.

**`express-async-errors`** — patches all async route handlers so thrown errors propagate to the global error middleware without manual `try/catch` everywhere.

**Zod on the server** — request bodies are parsed and coerced before they touch the database. Invalid data returns a structured `400` with all failing field messages.

**Password never returned** — the `password` field has `select: false` in the schema. It's only fetched when explicitly needed (login), then discarded.
