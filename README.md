# devpulse


## Live Link
https://dev-pulse-five-beta.vercel.app/

# DevPulse API

Internal tech issue & feature tracker for software teams. Built with Node.js, TypeScript, Express, and PostgreSQL.

## Tech Stack

- **Runtime:** Node.js (LTS 24.x+)
- **Language:** TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL (native `pg` driver, raw SQL only)
- **Auth:** JWT (`jsonwebtoken`) + `bcrypt` (salt rounds 8–12)

---

## Getting Started

```bash
npm install
npm run dev
```

Make sure your PostgreSQL database is running and `.env` is configured with your DB credentials and JWT secret.

---

## User Roles

| Role | Permissions |
|------|-------------|
| `contributor` | Register, login, create issues, view all issues |
| `maintainer` | All contributor permissions + update/delete any issue, change status, access metrics |

---

## Authentication

All protected routes require a JWT in the `Authorization` header:

```
Authorization: <JWT_TOKEN>
```

---

## API Endpoints

### Auth

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/signup` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Login and receive JWT |

### Issues

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/issues` | Authenticated | Create a new issue |
| GET | `/api/issues` | Public | Get all issues (supports filters) |
| GET | `/api/issues/:id` | Public | Get a single issue |
| PATCH | `/api/issues/:id` | Maintainer / Issue owner (if open) | Update an issue |
| DELETE | `/api/issues/:id` | Maintainer only | Delete an issue |

#### GET /api/issues — Query Parameters

| Param | Values | Default |
|-------|--------|---------|
| `sort` | `newest`, `oldest` | `newest` |
| `type` | `bug`, `feature_request` | — |
| `status` | `open`, `in_progress`, `resolved` | — |

---

## Database Schema

### `users`
| Column | Type | Notes |
|--------|------|-------|
| `id` | serial PK | Auto-increment |
| `name` | varchar | Required |
| `email` | varchar | Unique, required |
| `password` | varchar | Hashed, never returned |
| `role` | varchar | `contributor` (default) or `maintainer` |
| `created_at` | timestamp | Auto-generated |
| `updated_at` | timestamp | Auto-updated |

### `issues`
| Column | Type | Notes |
|--------|------|-------|
| `id` | serial PK | Auto-increment |
| `title` | varchar(150) | Required |
| `description` | text | Required, min 20 chars |
| `type` | varchar | `bug` or `feature_request` |
| `status` | varchar | `open` (default), `in_progress`, `resolved` |
| `reporter_id` | integer | References `users.id` (app-level validation) |
| `created_at` | timestamp | Auto-generated |
| `updated_at` | timestamp | Auto-updated |

---

## Response Format

**Success**
```json
{
  "success": true,
  "message": "Operation description",
  "data": {}
}
```

**Error**
```json
{
  "success": false,
  "message": "Error description",
  "errors": "Error details"
}
```