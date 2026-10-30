# Portfolio API

The API uses Express and MongoDB. User-uploaded public portfolio media is stored under `uploads/public`; private document-vault files are stored under `uploads/private`.

## Configuration

Copy `.env.example` to `.env` and set `MONGO_URI`, `JWT_SECRET`, and `CLIENT_ORIGIN`. `CLIENT_ORIGIN` may contain a comma-separated list of allowed frontend origins.

## Run locally

```bash
npm install
npm run dev
```

Start MongoDB first, then run `npm run seed:admin`. If `ADMIN_USERNAME` or `ADMIN_PASSWORD` is missing from `.env`, the command securely prompts for it; the password is hidden while typing. Passwords must be at least 12 characters. You can also set these variables in `.env` for non-interactive use. The seed script never uses a built-in password.

To recover access if you forget the admin password, set `ADMIN_USERNAME` to the existing account, set a new `ADMIN_PASSWORD` (at least 12 characters), and temporarily add `ADMIN_RESET_PASSWORD=true` to `.env`. Run `npm run seed:admin` once, then remove `ADMIN_RESET_PASSWORD` and sign in at the frontend's **Admin sign in** link. Password recovery is intentionally a local administrative command, not a public reset endpoint.

## Portfolio API

- `GET /api/profile` — public profile, skills, services, experience, and education.
- `PUT /api/profile` — update profile fields and upload a profile image or resume (admin token required).
- `GET /api/projects` — public project list.
- `POST`, `PUT /:id`, `DELETE /:id` on `/api/projects` — project management (admin token required).
- `GET /api/certificates` — public certificates.
- `POST`, `PUT /:id`, `DELETE /:id` on `/api/certificates` — certificate management (admin token required).
- `POST /api/contact` — submit a contact message.
- `GET /api/contact` — read contact messages (admin token required).
- `/api/documents` — private document management (admin token required).

Protected requests use `Authorization: Bearer <token>`. Uploads accept JPEG, PNG, or PDF files up to 5 MB.
