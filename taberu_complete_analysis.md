# Taberu — Complete Technical Project Analysis

This document is a comprehensive guide to understanding, explaining, and mastering the Taberu project. It serves as your personal study guide, interview preparation sheet, and portfolio reference.

---

## SECTION 1 — PROJECT OVERVIEW

- **Project Name:** Taberu (食べる — Japanese for "to eat")
- **Purpose:** A personal recipe discovery and meal planning web application.
- **Problem it solves:** Helps users organize what to cook by allowing ingredient-based searches, maintaining a centralized weekly meal plan, auto-generating shopping lists, and tracking cooking history.
- **Target audience:** Home cooks, food enthusiasts, and people looking to organize their weekly meals efficiently.
- **Industry/domain:** FoodTech / Lifestyle / Productivity.
- **Main workflow:** User logs in -> browses/searches recipes -> saves favorites to collections -> adds recipes to the weekly meal planner -> generates a shopping list -> tracks cooking in a personal log.
- **High-level architecture:** A decoupled monolithic architecture. A Single Page Application (SPA) frontend communicates with a RESTful PHP API backend, secured via stateful httpOnly cookies.
- **Project complexity:** Intermediate. It involves complex relational database modeling, stateful authentication, and a rich, interactive frontend.
- **Development level:** Production Ready (with minor environment configuration adjustments as noted in the README).

---

## SECTION 2 — COMPLETE TECH STACK

### **Frontend**
- **React (v19.2.5)**: Core UI library. Chosen for component-based architecture and massive ecosystem. (Diff: 4/10 | Conf: High)
- **Vite (v8.0.10)**: Build tool and development server. Replaces Webpack/CRA for significantly faster hot-module replacement (HMR). (Diff: 3/10 | Conf: High)
- **Tailwind CSS (v4.2.4)**: Utility-first CSS framework. Chosen for rapid UI development and keeping styling co-located with components. (Diff: 4/10 | Conf: High)
- **Framer Motion (v12.40.0)**: Animation library for React. Chosen for smooth micro-animations (modals, transitions) to create a premium feel. (Diff: 5/10 | Conf: High)
- **React Router DOM (v7.15.0)**: Client-side routing. Enables seamless SPA navigation without page reloads. (Diff: 4/10 | Conf: High)
- **Axios (v1.16.1)**: HTTP client. Used to communicate with the backend API, easily intercept requests/responses, and handle CSRF cookies seamlessly. (Diff: 3/10 | Conf: High)

### **Backend**
- **Laravel (v12.0)**: PHP Web Framework. Chosen for its elegant syntax, built-in ORM (Eloquent), robust routing, and excellent developer experience. (Diff: 6/10 | Conf: High)
- **PHP (v8.2)**: Backend language. Chosen for its widespread support and deep integration with Laravel. (Diff: 4/10 | Conf: High)
- **Laravel Sanctum (v4.3)**: Authentication system. Specifically configured for SPA authentication using stateful httpOnly cookies, avoiding the security risks of storing JWTs in `localStorage`. (Diff: 7/10 | Conf: High)

### **Database**
- **MySQL**: Relational database management system. Chosen for strong data integrity, complex queries (many-to-many relationships like recipes and ingredients), and ease of local setup via Laragon/XAMPP. (Diff: 5/10 | Conf: High)

### **Developer Tools / Utilities**
- **ESLint**: JavaScript linting to catch errors and enforce code style.
- **PHPUnit**: Backend testing framework.
- **Composer**: PHP package dependency manager.
- **npm**: Node.js package manager.

---

## SECTION 3 — COMPLETE PACKAGE ANALYSIS

### **Frontend Dependencies (`package.json`)**
- `react`, `react-dom`: The core of the frontend. (Essential)
- `react-router-dom`: Handles URLs. Solves the problem of mapping URLs to UI components in an SPA. (Essential)
- `axios`: Makes HTTP requests. Could be replaced by the native `fetch` API, but Axios provides better defaults for JSON and cookie handling (crucial for Sanctum). (Essential)
- `tailwindcss`, `@tailwindcss/vite`: Compiles utility classes into CSS. Could be replaced by standard CSS or styled-components. (Essential)
- `framer-motion`: Solves complex animation states in React. Could be replaced by CSS transitions, but Framer is more powerful for layout animations. (Non-essential, but vital for UX)
- *Dev Dependencies:* `vite`, `eslint`, `@vitejs/plugin-react` — tooling for building and linting the app.

### **Backend Dependencies (`composer.json`)**
- `laravel/framework`: The core backend framework. (Essential)
- `laravel/sanctum`: Handles API authentication securely. Could be replaced by `tymon/jwt-auth` or Laravel Passport, but Sanctum is the modern standard for SPAs. (Essential)
- *Dev Dependencies:* `fakerphp/faker` (generates fake data for seeding), `phpunit/phpunit` (runs the 30 automated tests), `laravel/pint` (PHP code styling).

---

## SECTION 4 — CONCEPTS USED

- **MVC (Model-View-Controller)**: Backend architecture. Models (`app/Models`) handle DB logic, Controllers (`app/Http/Controllers`) handle HTTP requests, Views (replaced by React in this stack) handle UI.
- **SPA (Single Page Application)**: Frontend architecture where the browser loads a single HTML file and JavaScript updates the DOM dynamically.
- **RESTful API**: The backend exposes resources (e.g., `GET /api/recipes`, `POST /api/favorites`) using standard HTTP methods.
- **Stateful Cookie Authentication**: Instead of sending tokens in headers, authentication state is maintained via a secure, `httpOnly` cookie. This prevents XSS attacks from stealing the token.
- **Middleware**: Functions that intercept HTTP requests. Example: The `auth:sanctum` middleware ensures only logged-in users can access `/api/favorites`.
- **Throttling (Rate Limiting)**: Found in `api.php` (`throttle:6,1` for auth). Prevents brute-force attacks by limiting requests.
- **Relational Data Modeling**: Using Foreign Keys, One-to-Many, and Many-to-Many relationships (e.g., `recipe_ingredient` pivot table).
- **Database Seeding & Migrations**: Version control for the database schema, allowing developers to recreate the DB instantly (`php artisan migrate --seed`).
- **CSRF (Cross-Site Request Forgery) Protection**: Handled automatically by Axios and Laravel Sanctum communicating via an `X-XSRF-TOKEN`.

---

## SECTION 5 — PROJECT FLOW

**Complete Request Lifecycle Example (Saving a Favorite):**

1. **Browser (User Action):** User clicks the "Heart" icon on a recipe in the React UI.
2. **React Component:** Dispatches an event and calls an API service function.
3. **Axios:** Sends a POST request to `http://localhost:8000/api/favorites/5` and automatically includes the `taberu_session` httpOnly cookie.
4. **Laravel Router (`routes/api.php`):** Receives the request and routes it to `FavoriteController@store`.
5. **Middleware (`auth:sanctum`):** Intercepts the request. Validates the session cookie. Identifies the user.
6. **Controller (`FavoriteController.php`):** Receives the validated request.
7. **Model / ORM (`Favorite.php` / Eloquent):** Interacts with the `favorites` MySQL table to insert a record linking `user_id` and `recipe_id`.
8. **Response:** Controller returns a `201 Created` JSON response.
9. **React State:** The frontend receives the response, updates the local state (e.g., turns the heart red), and Framer Motion plays a micro-animation.

---

## SECTION 6 — UI ANALYSIS

- **UI Type:** Single Page Application (SPA).
- **Design Style:** Modern, clean, and content-first (likely utilizing glassmorphism and subtle shadows based on standard Tailwind/Framer practices).
- **Component Architecture:** Divided into `components/` (reusable pieces like buttons, recipe cards) and `pages/` (full route views like Home, Profile).
- **Animations:** Managed by Framer Motion. Expect smooth mounting/unmounting of the Recipe Detail Modal and layout transitions in the Meal Planner.
- **Decision Rationale:** Tailwind CSS was chosen to keep the bundle size small (it purges unused CSS) and to allow rapid iteration without switching between CSS and JSX files.

---

## SECTION 7 — BACKEND ANALYSIS

- **Folder Structure:** Standard Laravel structure. `app/Models` for data structure, `app/Http/Controllers/Api` for API endpoints, `database/migrations` for schema.
- **Controllers:** Include `AuthController`, `RecipeController`, `MealPlanController`, and specialized Admin controllers (`AdminRecipeController`, `AdminAnalyticsController`).
- **Database Models:** 11 core models including `User`, `Recipe`, `Ingredient`, `MealPlan`, `CookLog`.
- **Authentication:** `AuthController.php` handles `/register`, `/login`, `/logout`, and `/me`. Uses Sanctum.
- **Caching:** The `/api/recipes/popular` endpoint is explicitly cached for 5 minutes using Laravel's file cache driver to reduce database load.

---

## SECTION 8 — DATABASE ANALYSIS

**Core Tables:**
- `users`: id, name, email, password, role.
- `recipes`: id, title, instructions, cook_time, etc.
- `ingredients`: id, name.
- `recipe_ingredient` (Pivot): recipe_id, ingredient_id, quantity. (Many-to-Many).
- `favorites`: user_id, recipe_id.
- `meal_plans`: user_id, week_start_date.
- `meal_plan_items`: meal_plan_id, recipe_id, day_of_week, meal_type (breakfast/lunch/etc).
- `cook_log`: user_id, recipe_id, rating.

**Data Flow:**
Data is highly normalized. To get a recipe with its ingredients, Eloquent uses eager loading (`Recipe::with('ingredients')->find($id)`), translating to efficient SQL JOINs or batched queries.

---

## SECTION 9 — FEATURE ANALYSIS

1. **Ingredient-chip Search**
   - *Purpose*: Find recipes using what's in the fridge.
   - *Tech*: React state array for chips, Laravel Eloquent `whereHas` queries for filtering.
2. **Weekly Meal Planner**
   - *Purpose*: Organize weekly cooking.
   - *Tech*: Complex UI state handling grid slots; Backend `MealPlanController` storing day/type relationships.
3. **Auto Shopping List**
   - *Purpose*: Aggregate ingredients from the meal plan.
   - *Tech*: Backend logic joining `meal_plan_items` -> `recipes` -> `ingredients` and grouping by ingredient ID, returning a consolidated list to the frontend.
4. **Admin Dashboard**
   - *Purpose*: Manage the platform.
   - *Tech*: Protected by a custom `admin` middleware. Returns aggregated analytics data.

---

## SECTION 10 — SECURITY

- **XSS (Cross-Site Scripting):** Prevented by React. React automatically escapes strings before rendering them to the DOM.
- **SQL Injection:** Prevented by Laravel Eloquent. All database queries use PDO parameter binding.
- **Token Theft:** Prevented by Laravel Sanctum. Because tokens are stored in `httpOnly` cookies, malicious JavaScript (XSS) cannot read them.
- **CSRF:** Prevented by Laravel's built-in CSRF protection. Axios automatically reads the `XSRF-TOKEN` cookie and sends it as a header on mutations.
- **Brute Force:** Prevented by Route Throttling (`throttle:6,1` on login routes).

---

## SECTION 11 — PERFORMANCE

- **Backend Caching:** Popular recipes are cached for 5 minutes to avoid running expensive aggregate queries (counting views) on every page load.
- **Eager Loading:** The backend uses Eloquent's `with()` method to load relationships (like recipe ingredients) in one query, avoiding the "N+1 query problem."
- **Frontend Optimization:** Vite automatically splits the JavaScript bundle and minimizes assets for production.
- **Database Indexing:** Migrations will have indexes on foreign keys (e.g., `user_id` in `favorites`) to ensure fast lookups.

---

## SECTION 12 — WHAT SHOULD I STUDY? (Personalized Roadmap)

1. **Laravel Sanctum SPA Authentication**
   - *Importance*: High. *Difficulty*: 7/10.
   - *Learn*: How CORS, Session Domains, and CSRF work together in a decoupled architecture.
   - *Questions*: "Why use httpOnly cookies over localStorage JWTs?"
2. **React 19 & Framer Motion**
   - *Importance*: Medium. *Difficulty*: 5/10.
   - *Learn*: Layout animations and the new React 19 hooks.
3. **Relational Database Design (Many-to-Many)**
   - *Importance*: High. *Difficulty*: 6/10.
   - *Learn*: Pivot tables. How to query recipes that contain *all* selected ingredients vs *any* selected ingredients.
4. **Laravel Eloquent ORM & N+1 Problem**
   - *Importance*: High. *Difficulty*: 5/10.
   - *Learn*: Eager loading (`with()`), aggregate queries (`withCount()`).

---

## SECTION 13 — INTERVIEW PREPARATION

**Q: Why did you choose Laravel and React as separate applications instead of Inertia.js or Livewire?**
*Ideal Answer:* Building them as a decoupled SPA and REST API allows for future scalability. If we decide to build a mobile app (React Native, iOS, Android) later, the API is already built and ready to be consumed.

**Q: How did you secure the authentication in this application?**
*Ideal Answer:* I used Laravel Sanctum to implement stateful cookie-based authentication. Instead of storing tokens in `localStorage`—which is vulnerable to XSS attacks—the backend issues an `httpOnly` cookie. This cookie is automatically managed by the browser, meaning JavaScript cannot access it, significantly increasing security.

**Q: How does the auto-shopping list generation work efficiently?**
*Ideal Answer:* When a user requests a shopping list, the backend queries the current week's meal plan items, eager-loads the associated recipes and their ingredients via pivot tables, and programmatically aggregates the quantities grouped by ingredient ID.

---

## SECTION 14 — RESUME HELP

**1-line description:**
A full-stack recipe discovery and meal planning SPA built with React, Vite, and Laravel.

**Technical version (Bullet points for CV):**
- Architected a decoupled SPA using **React 19** and **Laravel 12**, resulting in a highly responsive user experience.
- Implemented secure, stateful authentication using **Laravel Sanctum** and **httpOnly cookies**, preventing XSS vulnerabilities.
- Designed a normalized **MySQL** database featuring complex many-to-many relationships to manage recipes, ingredients, and automated shopping list aggregation.
- Optimized API performance by implementing **Laravel Caching** for trending queries and eager-loading to eliminate N+1 query bottlenecks.

---

## SECTION 15 — LINKEDIN & PORTFOLIO

**LinkedIn Post:**
Excited to share my latest full-stack project: Taberu! 🍱 Taberu is a personalized recipe discovery and meal-planning app. I built the frontend with React 19, Tailwind, and Framer Motion for a buttery smooth UI, powered by a robust Laravel 12 and MySQL backend. 

Key technical achievements:
🔒 Secured auth using httpOnly cookies via Laravel Sanctum
🛒 Engineered an algorithm to auto-generate aggregated shopping lists from weekly meal plans
⚡ Optimized performance by caching heavy database queries

Check out the code on GitHub! #ReactJS #Laravel #FullStack #WebDevelopment

---

## SECTION 16 — KNOWLEDGE MAP

```text
Taberu Project
│
├── Frontend (React 19, Vite 8)
│   ├── Component Architecture (Tailwind CSS)
│   ├── Client-Side Routing (React Router v7)
│   ├── Animations (Framer Motion)
│   └── API Integration (Axios, CSRF handling)
│
├── Backend (Laravel 12, PHP 8.2)
│   ├── MVC Architecture
│   ├── Eloquent ORM (Relationships, Eager Loading)
│   ├── API Routing & Controllers
│   ├── Authentication (Sanctum, httpOnly Cookies)
│   └── Performance (Caching, Rate Limiting)
│
└── Database (MySQL)
    ├── Schema Design & Normalization
    ├── Migrations & Seeding
    └── Pivot Tables (Many-to-Many logic)
```

---

## SECTION 17 — LEARNING CHECKLIST

- [ ] Understand httpOnly Cookies vs localStorage (Intermediate)
- [ ] Learn Laravel Sanctum SPA configuration (Advanced)
- [ ] Learn Eloquent ORM eager loading (`with`) to fix N+1 issues (Intermediate)
- [ ] Understand Cross-Origin Resource Sharing (CORS) configurations (Intermediate)
- [ ] Practice Framer Motion layout animations (Beginner)
- [ ] Learn database normalization (Beginner)
- [ ] Study API Rate Limiting concepts (Intermediate)

---

## SECTION 18 — FINAL SUMMARY

This project is a fantastic showcase of a modern, decoupled full-stack architecture. By studying Taberu, you have learned how to connect a modern React SPA to a robust PHP/Laravel backend. You've gained practical experience in designing relational databases for real-world scenarios (like recipe ingredients and meal plans) and learned industry-standard security practices (stateful cookie auth). 

**Next Steps:** To elevate your skills further from this project, investigate how to deploy this stack (e.g., deploying the React app to Vercel/Netlify, and the Laravel app to AWS/DigitalOcean or using Laravel Forge), and explore implementing a Redis cache instead of file-based caching for production scale.
