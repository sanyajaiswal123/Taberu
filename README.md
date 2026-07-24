# Taberu

A recipe discovery app — enter the ingredients you have and find matching meals instantly.

## Features

- Ingredient-chip search with live filtering and autocomplete
- Category and cuisine filters
- Trending recipes (by view count, server-side cached)
- User accounts with saved favorites (httpOnly cookie auth)
- Recently viewed strip
- Fully responsive, keyboard-accessible UI

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 8, Tailwind CSS v4, React Router v7 |
| Backend | Laravel 12, PHP 8.2, Sanctum 4 |
| Database | MySQL (via Laragon on Windows) |
| Auth | Sanctum stateful cookie (`taberu_token`, httpOnly, 7 days) |

## Prerequisites

- [Laragon](https://laragon.org) (bundles Apache, MySQL, PHP 8.2)
- Node 20+
- Composer

## Setup

### 1. Database

Start Laragon and create a `taberu` database via phpMyAdmin or the Laragon UI.

### 2. Backend

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Edit `backend/.env` — set your DB credentials (see env vars table below), then:

```bash
php artisan migrate --seed
php artisan serve
# → API running at http://localhost:8000
```

### 3. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
# → App running at http://localhost:5173
```

## Environment Variables

### Backend (`backend/.env`)

| Variable | Default | Description |
|---|---|---|
| `APP_NAME` | `Taberu` | Application name |
| `APP_URL` | `http://localhost:8000` | Backend URL |
| `DB_CONNECTION` | `mysql` | Database driver |
| `DB_HOST` | `127.0.0.1` | MySQL host |
| `DB_PORT` | `3306` | MySQL port |
| `DB_DATABASE` | `taberu` | Database name |
| `DB_USERNAME` | `root` | MySQL username |
| `DB_PASSWORD` | _(empty)_ | MySQL password (Laragon default is blank) |
| `SANCTUM_STATEFUL_DOMAINS` | `localhost:5173` | Allowed SPA origins for cookie auth |
| `SESSION_DOMAIN` | `localhost` | Cookie domain |

### Frontend (`frontend/.env`)

| Variable | Default | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:8000/api` | Laravel API base URL |

## API Overview

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | — | Register (throttled: 6/min) |
| POST | `/api/auth/login` | — | Login (throttled: 6/min) |
| POST | `/api/auth/logout` | ✓ | Logout (clears cookie) |
| GET | `/api/auth/me` | ✓ | Authenticated user |
| GET | `/api/recipes` | — | All recipes (filterable) |
| GET | `/api/recipes/popular` | — | Top recipes by views (cached 5 min) |
| GET | `/api/recipes/{id}` | — | Single recipe with ingredients |
| POST | `/api/recipes/{id}/view` | — | Increment view count |
| GET | `/api/ingredients/suggestions?q=` | — | Autocomplete suggestions |
| GET | `/api/favorites` | ✓ | User's saved recipes |
| POST | `/api/favorites/{id}` | ✓ | Save recipe |
| DELETE | `/api/favorites/{id}` | ✓ | Remove recipe |

## Production Notes

- Replace `connect-src` in `frontend/index.html` CSP with your production API URL and remove `ws://localhost:5173`
- Remove `'unsafe-eval'` from `script-src` in production (only needed for Vite dev HMR)
- Serve the frontend build (`npm run build`) via nginx or a CDN; point `VITE_API_BASE_URL` to your deployed API
- Set `SESSION_SECURE_COOKIE=true` and `APP_ENV=production` in backend `.env`
- The `popular` endpoint result is cached for 5 minutes using Laravel's file cache driver; switch to Redis for multi-server deployments

## Running Tests

```bash
cd backend
php artisan test
# 30 tests, 30 passing
```

## Demo Accounts

The seeder (`php artisan migrate --seed`) creates two ready-to-use accounts for demos and presentations.

### 👤 Regular User — Sanya Kapoor

| Field | Value |
|---|---|
| Email | `sanya@gmail.com` |
| Password | `sanya123` |
| Role | `user` |

**Seeded data:**
- 10 favourite recipes (Butter Chicken, Salmon, Biryani, Palak Paneer, Matcha Pancakes, …)
- 3 collections: *Weeknight Dinners*, *Brunch Favourites*, *Asian Specials*
- 14 cook log entries with ratings (spanning 45 days)
- 7 personal recipe notes with tips & variations
- Full 7-day meal plan for the current week (breakfast + dinner every day, plus snacks)
- 12-item shopping list (mix of checked and unchecked)

### 🔑 Admin — Taberu Admin

| Field | Value |
|---|---|
| Email | `admin@taberu.com` |
| Password | `admin123` |
| Role | `admin` |

**Seeded data:**
- 10 curated favourite recipes (editorial picks)
- 3 collections: *Staff Picks*, *Trending This Week*, *Under 20 Minutes*
- 8 cook log entries with 5-star ratings
- 5 editorial recipe notes (quality-control / showcase notes)
- Full 7-day meal plan for the current week
- 10-item shopping list

> **Tip:** To reset and re-seed at any time run `php artisan migrate:fresh --seed` from the `backend/` directory.
