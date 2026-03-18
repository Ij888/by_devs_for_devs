# byDevsforDevs (BDFD)

Recruiting transparency, built by builders.

byDevsforDevs is a full-stack web application that implements a structured
“collections of things” model for tracking job applications.

Users create pipelines (collections) and manage applications (things)
within them using authenticated CRUD operations.

---

## Core Concept

- Collection = Pipeline
- Thing = Application

Each user:
- Creates multiple pipelines
- Adds applications inside pipelines
- Updates and deletes records
- Accesses protected resources via JWT authentication

---

## Tech Stack

Backend:
- Node.js
- Express
- SurrealDB (NoSQL)
- JWT Authentication
- Zod validation
- OpenAPI / Swagger

Frontend:
- Vue 3 (Vite)
- Vue Router
- Native Fetch API

Deployment:
- Railway or Render for the API
- GitHub Pages for the frontend (`apps/web`)

---

## Architecture

Vue SPA → Express API → SurrealDB

---

## Product Screens / Design

### Trello (delivery plan)
![Trello board](docs/trello/trello-board.png)

### Lo-fi wireframes
| Home | Auth |
|---|---|
| ![Lo-fi Home](docs/mockups/lofi/01-home.png) | ![Lo-fi Auth](docs/mockups/lofi/02-login.png) |

| Dashboard | Collection Detail |
|---|---|
| ![Lo-fi Dashboard](docs/mockups/lofi/03-dashboard.png) | ![Lo-fi Collection Detail](docs/mockups/lofi/04-collection-detail.png) |

### Hi-fi mockups
| Home | Dashboard |
|---|---|
| ![Hi-fi Home](docs/mockups/hifi/01-home.png) | ![Hi-fi Dashboard](docs/mockups/hifi/03-dashboard.png) |

## Why Vue (Minimal Frontend)

The frontend is intentionally lightweight.

It:
- Demonstrates API consumption
- Handles route-based navigation
- Avoids unnecessary architectural overhead
- Focuses on CRUD and authentication flows

No global state library was introduced to avoid over-engineering.

---

## Why NoSQL (SurrealDB)

The domain benefits from schema flexibility:

- Application records may evolve
- User → pipeline → application maps cleanly to document-style storage
- Rapid iteration without rigid schema migrations

The choice prioritises adaptability and development speed.

---

## Planned API Endpoints

Auth
- POST /auth/register
- POST /auth/login

Collections
- GET /collections
- POST /collections
- GET /collections/:id
- PATCH /collections/:id
- DELETE /collections/:id

Things
- GET /collections/:id/things
- POST /collections/:id/things
- GET /things/:id
- PATCH /things/:id
- DELETE /things/:id

Public
- GET /public/things

---

## Status

MVP foundation defined.
Authentication, CRUD, database integration, and deployment in progress.

---

## GitHub Pages

The repository includes a GitHub Actions workflow that deploys the Vue frontend
from `apps/web` to GitHub Pages on pushes to `main`.

Notes:
- GitHub Pages only hosts the static frontend.
- The Express API must still be deployed separately (for example on Railway or Render).
- Set `VITE_API_BASE_URL` in the Pages workflow later if you want the frontend to call a live API.
