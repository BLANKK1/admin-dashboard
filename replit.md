# NexusPortal

Enterprise access management SPA — role-based dashboard with Angular 16 frontend and Express 5 backend using an in-memory data store.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080, path `/api`)
- `pnpm --filter @workspace/angular-spa run dev` — run the Angular SPA (port 19504, path `/`)
- `pnpm run typecheck` — full typecheck across all packages

## Stack

- pnpm workspaces, Node.js 24, TypeScript
- API: Express 5, in-memory store (no database required)
- Frontend: Angular 16.2, SCSS, lazy-loaded feature modules
- Build: esbuild (API), Angular CLI (frontend)

## Where things live

- `artifacts/api-server/src/data/store.ts` — in-memory store: 6 users, 10 records, session Map
- `artifacts/api-server/src/routes/` — auth, users, records, health routes
- `artifacts/api-server/src/middlewares/auth-middleware.ts` — Bearer token validation
- `artifacts/angular-spa/src/app/core/` — services, guards, interceptors
- `artifacts/angular-spa/src/app/features/` — auth (login), dashboard, admin (lazy-loaded)
- `artifacts/angular-spa/src/app/shared/` — SpinnerComponent

## Architecture decisions

- In-memory store avoids DATABASE_URL requirement for this demo app
- Role validated at login: sending wrong role returns 401 ("Incorrect role selected")
- Auth interceptor adds `Authorization: Bearer <token>` to all HTTP requests
- Loading interceptor tracks active requests and shows/hides global spinner
- AuthGuard and AdminGuard protect `/dashboard` and `/admin` routes respectively
- Records endpoint accepts `?delay=0–5000ms` to simulate async loading
- Angular strict templates: no arrow functions allowed in template expressions — use component methods instead

## Product

- **Login page**: User ID + Password + Role selector (General User / Admin). Role is validated server-side.
- **Dashboard**: Profile card, stats row, async record loader with configurable API delay slider, role-filtered records table
- **Admin panel** (admin-only): Full CRUD for users — add, edit, delete with inline confirmation

## Demo Credentials

| Role | User ID | Password |
|------|---------|----------|
| Admin | admin01 | Admin@123 |
| Admin | superadmin | Admin@123 |
| General | john.doe | User@123 |
| General | jane.smith | User@123 |
| General | bob.wilson | User@123 |

## User preferences

_Populate as requested._

## Gotchas

- Angular 16 uses `browserTarget` in serve config (not `buildTarget` which is Angular 17+)
- Arrow functions (`=>`) are not allowed in Angular template expressions — use component methods
- `NG_CLI_ANALYTICS=false` must be set to prevent interactive analytics prompt blocking startup
- The `build.configurations.development` block must NOT contain `buildTarget` (circular)
