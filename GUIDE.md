# 🍱 Taberu — Your Personal Recipe Discovery App

> **Welcome, friend!** This guide will walk you through everything you need to get Taberu running on your computer — from scratch to a fully working app. No prior developer experience needed. Just follow the steps carefully, and you'll be good to go! 🚀

---

## 📖 Table of Contents

1. [What is Taberu?](#1--what-is-taberu)
2. [What You Need (Prerequisites)](#2--what-you-need-prerequisites)
3. [XAMPP Setup](#3--xampp-setup)
4. [Fix PHP in PATH (Important!)](#4--fix-php-in-path-important)
5. [Database Setup](#5-️-database-setup)
6. [Backend Setup](#6--backend-setup)
7. [Frontend Setup](#7--frontend-setup)
8. [How to Use the App](#8--how-to-use-the-app)
9. [Demo Accounts](#9--demo-accounts)
10. [Admin Panel](#10--admin-panel)
11. [Resetting / Re-Seeding Data](#11--resetting--re-seeding-data)
12. [Common Errors & Fixes](#12--common-errors--fixes)

---

## 1. 🍽️ What is Taberu?

**Taberu** (食べる — Japanese for "to eat") is a recipe discovery web app. Think of it like a personal cookbook that lives in your browser. Here's what it can do:

- 🔍 **Discover recipes** — Search by ingredient, filter by cuisine or category
- ❤️ **Save favourites** — Bookmark recipes and group them into collections (e.g. "Weeknight Dinners")
- 📅 **Plan your meals** — Drag recipes onto a weekly calendar for breakfast, lunch, dinner, or snacks
- 🛒 **Auto shopping list** — Generate a shopping list from your meal plan automatically
- 📓 **Cook log & notes** — Track what you've cooked and leave personal notes on recipes
- 🛡️ **Admin panel** — Manage all recipes and users from a dedicated dashboard

The app has two parts:
| Part | Technology | What it does |
|------|-----------|-------------|
| **Frontend** | React 19 + Vite + Tailwind CSS | The website you see in the browser |
| **Backend** | Laravel 12 (PHP) | The server that handles data, login, and the database |

---

## 2. 📦 What You Need (Prerequisites)

Before you start, make sure you have all of these installed:

### ✅ Checklist

- [ ] **XAMPP** — Provides Apache and MySQL. Download from [apachefriends.org](https://www.apachefriends.org/)
- [ ] **Composer** — PHP's package manager. Download from [getcomposer.org](https://getcomposer.org/)
- [ ] **Node.js 20+** — JavaScript runtime. Download from [nodejs.org](https://nodejs.org/) *(choose the LTS version)*
- [ ] **A code editor** — [VS Code](https://code.visualstudio.com/) is great if you don't have one

> [!NOTE]
> PHP 8.2+ comes bundled with XAMPP, so you don't need to install PHP separately. Just make sure XAMPP is installed!

### 🔍 How to check if Node.js is installed

Open **Command Prompt** (press `Win + R`, type `cmd`, press Enter) and run:

```bash
node --version
```

You should see something like `v20.x.x` or higher. If you see an error, go install Node.js first.

---

## 3. 🖥️ XAMPP Setup

XAMPP gives you a local MySQL database (which Taberu uses to store all its recipes, users, etc.) and an Apache web server. Here's how to get it running:

### Step-by-step:

1. **Open XAMPP Control Panel** — Find it in your Start menu or desktop shortcut
2. Click **Start** next to **Apache**
3. Click **Start** next to **MySQL**

You should see both rows turn green like this:

```
Apache   [RUNNING]  ✅
MySQL    [RUNNING]  ✅
```

> [!IMPORTANT]
> Keep the XAMPP Control Panel open the whole time you're using Taberu. If you close it, Apache and MySQL will stop, and the app won't work!

> [!TIP]
> If Apache fails to start, it might be because port 80 is already in use by something else (like Skype or another server). You can change Apache's port in XAMPP's config, but for Taberu, **only MySQL is strictly required** — Apache is only needed for phpMyAdmin.

---

## 4. 🔧 Fix PHP in PATH (Important!)

XAMPP installs PHP, but Windows might not know where to find it when you type `php` in the terminal. Let's fix that.

> [!WARNING]
> If you skip this step, you'll get errors like `'php' is not recognized as an internal or external command` when setting up the backend. Don't skip it!

### Steps to add PHP to your PATH:

1. Press `Win + S` and search for **"Environment Variables"**
2. Click **"Edit the system environment variables"**
3. In the window that opens, click **"Environment Variables..."** button at the bottom
4. Under **"System variables"**, find the variable called **`Path`** and click **Edit**
5. Click **New** and add:
   ```
   C:\xampp\php
   ```
   *(If you installed XAMPP somewhere else, like `D:\xampp`, use that path instead)*
6. Click **OK** on all windows to save

> [!IMPORTANT]
> After editing the PATH, you **must close and reopen** any Command Prompt / terminal windows. Old terminals won't pick up the new PATH.

### 🧪 Test it worked:

Open a **new** Command Prompt and run:

```bash
php --version
```

You should see something like:
```
PHP 8.2.x (cli) ...
```

If you see that, you're good! ✅

---

## 5. 🗄️ Database Setup

Now let's create the database that Taberu will use to store everything.

### Steps:

1. Make sure MySQL is running in XAMPP (green light ✅)
2. Open your browser and go to: [http://localhost/phpmyadmin](http://localhost/phpmyadmin)
3. You should see the phpMyAdmin interface — this is a visual tool to manage your database
4. Click on the **"SQL"** tab at the top
5. Paste this query into the text box:

```sql
CREATE DATABASE IF NOT EXISTS taberu CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

6. Click **"Go"** (the blue button)
7. You should see a success message: *"1 query executed successfully."*

> [!NOTE]
> `utf8mb4` is a special character encoding that supports emojis and all international characters. It's important for a food app that might have recipe names in different languages! 🌍

You should now see `taberu` appear in the left sidebar of phpMyAdmin. 

---

## 6. ⚙️ Backend Setup

The backend is the engine of Taberu — it handles all the data, authentication, and API calls. Let's set it up.

> [!NOTE]
> You'll need a terminal for this. Open **Command Prompt** or **PowerShell** — or use the built-in terminal in VS Code (`Ctrl + ~`).

### Step 1 — Navigate to the backend folder

```bash
cd path\to\Project\backend
```

*Replace `path\to\Project` with the actual location. For example, if Project is on your Desktop:*
```bash
cd C:\Users\YourName\Desktop\Project\backend
```

### Step 2 — Install PHP dependencies

```bash
composer install
```

This downloads all the PHP libraries the backend needs. It might take a minute or two. ☕

### Step 3 — Create the `.env` file

```bash
copy .env.example .env
```

> [!NOTE]
> The `.env` file holds your app's configuration — like database passwords and secret keys. It's never shared publicly. `.env.example` is a template with dummy values that you'll now fill in.

### Step 4 — Generate the app key

```bash
php artisan key:generate
```

This creates a unique secret key for your app. You'll see: `Application key set successfully.` ✅

### Step 5 — Configure the `.env` file

Open `Project/backend/.env` in your code editor and find these lines. Update them to match exactly:

```env
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=taberu
DB_USERNAME=root
DB_PASSWORD=

SANCTUM_STATEFUL_DOMAINS=localhost:5173
SESSION_DOMAIN=localhost
SESSION_DRIVER=cookie
```

> [!IMPORTANT]
> `DB_PASSWORD=` should be **empty** (no value after the `=`). XAMPP's default MySQL has no password for the `root` user. If you set a password in XAMPP, put it here.

> [!TIP]
> Make sure `SANCTUM_STATEFUL_DOMAINS=localhost:5173` is set correctly — this tells the backend to trust cookie-based login requests from the frontend. Without it, login won't work!

### Step 6 — Run migrations and seed the database

```bash
php artisan migrate --seed
```

This does two things:
- **Migrate** — Creates all the tables in the database (recipes, users, favourites, meal plans, etc.)
- **Seed** — Fills the database with starter data, including demo recipes and the demo accounts

You'll see a lot of output. If it ends without errors, you're good! ✅

### Step 7 — Start the backend server

```bash
php artisan serve
```

You'll see:
```
INFO  Server running on [http://127.0.0.1:8000].
```

> [!IMPORTANT]
> **Leave this terminal open.** The backend server runs as long as this terminal is open. If you close it, the backend stops and the app won't work.

---

## 7. 🌐 Frontend Setup

The frontend is the part you actually see in your browser. Let's get it running.

### Step 1 — Open a NEW terminal

Don't close the backend terminal! Open a fresh one.

### Step 2 — Navigate to the frontend folder

```bash
cd path\to\Project\frontend
```

### Step 3 — Create the frontend `.env` file

```bash
copy .env.example .env
```

### Step 4 — Check the frontend `.env`

Open `Project/frontend/.env` and make sure it contains:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

> [!NOTE]
> This tells the React app where to find the backend API. If you ever change the backend port (e.g. to 8001), you must update this value too.

### Step 5 — Install JavaScript dependencies

```bash
npm install
```

This downloads all the JavaScript libraries (React, Tailwind, etc.). Might take a minute.

### Step 6 — Start the frontend dev server

```bash
npm run dev
```

You'll see:
```
  VITE v6.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

> [!IMPORTANT]
> **Leave this terminal open too.** You now have two terminals running:
> - Terminal 1: `php artisan serve` (backend)
> - Terminal 2: `npm run dev` (frontend)

### Step 7 — Open the app! 🎉

Go to your browser and visit: **[http://localhost:5173](http://localhost:5173)**

You should see the Taberu landing page. If you do — congratulations, you set it up! 🎊

---

## 8. 🧭 How to Use the App

Here's a walkthrough of everything you can do in Taberu:

### 🏠 Landing Page
The first page you see. It has a hero section, features overview, and buttons to sign up or log in.

### 🔐 Sign Up / Log In
- Click **Sign Up** to create a new account, or **Log In** with an existing one
- Auth uses secure **httpOnly cookies** — you won't need to manage tokens yourself, it's all automatic

### 🔍 Home Page (Recipe Discovery)
After logging in, you land on the home page:
- **Ingredient chips** — Click on ingredients (e.g. 🥚 Egg, 🧄 Garlic) to filter recipes that use them
- **Category filter** — Filter by meal type (Breakfast, Lunch, Dinner, Dessert, etc.)
- **Cuisine filter** — Filter by cuisine (Japanese, Italian, Indian, etc.)
- **Trending recipes** — See what's popular right now
- Click any recipe card to open its details

### 📋 Recipe Detail Modal
Clicking a recipe card opens a modal (popup) with:
- Full ingredient list with quantities
- Step-by-step cooking instructions
- Cook time and serving size
- A button to **save it to favourites** ❤️

### ❤️ Favourites Page
- See all your saved recipes in one place
- Organise them into **Collections** (e.g. "Weeknight Dinners", "Quick Snacks")
- Create new collections and drag recipes into them

### 📅 Meal Planner
- A **weekly calendar grid** showing Monday–Sunday
- Each day has slots: **Breakfast**, **Lunch**, **Dinner**, **Snack**
- Assign recipes to any slot
- Click **"Generate Shopping List"** to get a combined list of all ingredients you need for the week 🛒

### 👤 Profile Page
- View your **cook log** — a history of what you've cooked
- See **personal stats** (recipes cooked, favourites saved, etc.)
- Write **personal notes** on individual recipes

---

## 9. 🔑 Demo Accounts

Two accounts are already created when you run `php artisan migrate --seed`. You can log in with these straight away:

| Role | Email | Password |
|------|-------|----------|
| 👤 Regular User | `sanya@gmail.com` | `sanya123` |
| 🛡️ Admin | `admin@taberu.com` | `admin123` |

> [!TIP]
> Use **sanya's account** to explore the app as a regular user. Use the **admin account** to access the admin panel and manage recipes/users.

---

## 10. 🛡️ Admin Panel

The admin panel is a special section only accessible to admin accounts.

### How to access it:
1. Log in with `admin@taberu.com` / `admin123`
2. Go to: [http://localhost:5173/admin](http://localhost:5173/admin)

> [!WARNING]
> If you try to visit `/admin` while logged in as a regular user (like Sanya), you'll be redirected away. It's only for admins!

### What's in the admin panel:

#### 📊 Dashboard
- Overview stats: total recipes, total users, recipes added this week, etc.
- **"Popular This Week"** — shows which recipes are trending

#### 🍜 Recipes (CRUD)
- **View** all recipes in the database
- **Add** a new recipe (title, ingredients, instructions, cuisine, category, image, cook time)
- **Edit** an existing recipe
- **Delete** a recipe

> [!CAUTION]
> Deleting a recipe is permanent! Make sure you actually want to remove it before clicking delete.

#### 👥 Users
- View all registered users
- **Change roles** — Promote a user to admin, or demote an admin back to user
- View account details

#### 📈 Analytics
- Usage stats and charts
- See how many people are using the app, what they're searching for, etc.

---

## 11. 🔄 Resetting / Re-Seeding Data

If you mess up the database, added test data you want to remove, or just want a clean slate — you can wipe everything and start fresh.

> [!WARNING]
> This will **permanently delete ALL data** in the database — all recipes, users, favourites, and meal plans. Everything gets recreated from scratch. Make sure you want to do this!

### How to reset:

In the **backend terminal** (or a new one pointed to `Project/backend`), run:

```bash
php artisan migrate:fresh --seed
```

This will:
1. **Drop** all tables
2. **Re-run** all migrations (recreate the tables)
3. **Re-seed** all the starter data (including demo accounts)

After this, you can log in with `sanya@gmail.com / sanya123` and `admin@taberu.com / admin123` again as if it's a fresh install. ✅

---

## 12. 🐛 Common Errors & Fixes

### ❌ `'php' is not recognized as an internal or external command`

**Cause:** PHP is not in your system PATH.

**Fix:** Follow [Section 4](#4--fix-php-in-path-important) of this guide. Remember to **restart your terminal** after editing PATH!

---

### ❌ Port 8000 is already in use

**Cause:** Something else is running on port 8000, or a previous backend server didn't stop cleanly.

**Fix:** Run the backend on a different port:
```bash
php artisan serve --port=8001
```
Then update `Project/frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:8001/api
```
Restart the frontend with `npm run dev`.

---

### ❌ CORS errors in the browser (console shows `blocked by CORS policy`)

**Cause:** The backend isn't allowing requests from the frontend's origin.

**Fix:** Open `Project/backend/.env` and make sure this line is exactly:
```env
SANCTUM_STATEFUL_DOMAINS=localhost:5173
```
Then restart the backend (`Ctrl + C`, then `php artisan serve` again).

---

### ❌ 419 Session Expired / CSRF token mismatch

**Cause:** Cookie/session configuration is wrong.

**Fix:** Check these two lines in `Project/backend/.env`:
```env
SESSION_DOMAIN=localhost
SESSION_DRIVER=cookie
```
Make sure both are set. Restart the backend after saving.

---

### ❌ `npm install` fails or throws errors

**Cause:** Wrong version of Node.js.

**Fix:**
1. Check your Node version: `node --version`
2. You need **v20 or higher**. If you have an older version, download the latest LTS from [nodejs.org](https://nodejs.org/)

---

### ❌ Can't connect to database / `SQLSTATE[HY000] [2002] Connection refused`

**Cause:** MySQL isn't running, or the `.env` settings are wrong.

**Fix checklist:**
- [ ] Is MySQL showing as **green/running** in XAMPP Control Panel?
- [ ] Is `DB_HOST=127.0.0.1` in the backend `.env`?
- [ ] Is `DB_USERNAME=root` and `DB_PASSWORD=` (empty)?
- [ ] Did you create the `taberu` database in phpMyAdmin?

---

### ❌ `composer install` fails — Composer not found

**Cause:** Composer isn't installed or isn't in PATH.

**Fix:** Download and install Composer from [getcomposer.org](https://getcomposer.org/). The installer will add it to PATH automatically. Restart your terminal afterward.

---

### ❌ App loads but shows a blank white page

**Cause:** The frontend can't reach the backend, or there's a JavaScript error.

**Fix:**
1. Make sure **both** terminals are running (`php artisan serve` AND `npm run dev`)
2. Check `Project/frontend/.env` has the correct `VITE_API_BASE_URL`
3. Open browser DevTools (`F12`) → Console tab to see if there are any error messages

---

> [!TIP]
> When in doubt, the fastest fix is usually:
> 1. Stop both servers (`Ctrl + C` in each terminal)
> 2. Run `php artisan migrate:fresh --seed` in the backend
> 3. Restart both servers
> 4. Hard refresh the browser with `Ctrl + Shift + R`

---

## 🎉 You're All Set!

That's everything you need to know to set up and use Taberu. Here's a quick recap of what to run every time you want to use the app:

### Every time you want to start Taberu:

**Terminal 1 (Backend):**
```bash
cd path\to\Project\backend
php artisan serve
```

**Terminal 2 (Frontend):**
```bash
cd path\to\Project\frontend
npm run dev
```

Then visit **[http://localhost:5173](http://localhost:5173)** in your browser. Enjoy! 🍱✨

---

*Made with ❤️ for Taberu*
