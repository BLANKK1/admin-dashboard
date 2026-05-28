# RUN_LOCALLY.md

# Running the Application Locally

This project is a **pnpm monorepo** containing:

- Angular frontend SPA
- Express backend API
- Shared TypeScript libraries

No database setup is required because the backend currently uses an in-memory data store.

---

# Prerequisites

## 1. Install Node.js

Recommended version:

```bash
Node.js 24.x
```

Download and install:

https://nodejs.org/

Verify installation:

```bash
node -v
npm -v
```

---

## 2. Install pnpm

This project requires **pnpm** and will reject npm/yarn installs.

Install globally:

```bash
npm install -g pnpm
```

Verify installation:

```bash
pnpm -v
```

Documentation:

https://pnpm.io/

---

## 3. Install Git (Optional)

Required only if cloning from a repository.

Download:

https://git-scm.com/

Verify:

```bash
git --version
```

---

# Project Structure

## Frontend

Location:

```bash
artifacts/angular-spa
```

Tech stack:

- Angular 16
- Angular Router
- SCSS
- RxJS

---

## Backend

Location:

```bash
artifacts/api-server
```

Tech stack:

- Express 5
- TypeScript
- esbuild
- Pino logging

---

# Installation

From the project root directory:

```bash
pnpm install
```

---

# Running the Application

## Start Backend API

Open terminal 1:

```bash
pnpm --filter @workspace/api-server run dev
```

Backend will run on:

```bash
http://localhost:8080
```

API base route:

```bash
/api
```

---

## Start Angular Frontend

Open terminal 2:

```bash
pnpm --filter @workspace/angular-spa run dev
```

Frontend will run on:

```bash
http://localhost:19504
```

---

# Build Commands

## Build Entire Workspace

```bash
pnpm run build
```

This includes:

- Type checking
- Frontend build
- Backend build

---

## Build Frontend Only

```bash
pnpm --filter @workspace/angular-spa run build
```

---

## Build Backend Only

```bash
pnpm --filter @workspace/api-server run build
```

---

# Type Checking

## Entire Workspace

```bash
pnpm run typecheck
```

---

# Ports Used

| Service | Port |
|----------|------|
| Angular Frontend | 19504 |
| Express Backend API | 8080 |

---

# Database Requirements

No external database is required.

The backend currently uses an in-memory store located at:

```bash
artifacts/api-server/src/data/store.ts
```

---

# Recommended VS Code Extensions

Optional but useful:

- Angular Language Service
- ESLint
- Prettier
- TypeScript Hero

---

# Quick Start

After installing Node.js and pnpm:

```bash
pnpm install
```

Start backend:

```bash
pnpm --filter @workspace/api-server run dev
```

Start frontend:

```bash
pnpm --filter @workspace/angular-spa run dev
```

Open in browser:

```bash
http://localhost:19504
```
