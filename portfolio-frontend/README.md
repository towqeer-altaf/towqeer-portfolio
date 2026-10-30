# Towqeer Portfolio

The public portfolio is built from independent React section components and reads profile details, projects, and certificates from the backend API. The admin dashboard lets you update your profile, manage projects and certificates, and access private documents and contact messages.

## Run locally

1. Start the backend by following `../portfolio-backend/README.md`.
2. Install frontend dependencies with `npm install`.
3. Optionally set `VITE_API_URL` to the backend API URL (defaults to `http://localhost:5000/api`).
4. Run `npm run dev`.

The public portfolio is at `/`, admin sign-in is at `/login`, and the dashboard is at `/admin/dashboard`.

## Production build

Run `npm run build`, then serve the generated `dist/` directory with a static web server. Configure `VITE_API_URL` to point to the deployed backend before building.
