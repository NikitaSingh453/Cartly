# ⚡ Cartly

**Discover more. Shop smarter.**

Cartly is a full-stack e-commerce platform for tech and gadgets, featuring an AI-powered multimodal shopping experience (text, image, and voice search).

---

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 19 + Vite + React Router v6   |
| Backend   | Spring Boot 3.3.5 (Java 21, Maven)  |
| Database  | PostgreSQL 15+                      |
| Auth      | JWT + Spring Security               |
| Styling   | Custom CSS (Inter font, light theme)|

---

## Project Structure

```
cartly/
├── backend/                        # Spring Boot backend (Java 21, Maven)
│   ├── src/main/java/com/cartly/api/
│   │   ├── config/                 # SecurityConfig, CorsConfig
│   │   ├── security/               # JwtUtil, JwtAuthFilter, UserPrincipal
│   │   ├── entity/                 # JPA entities (10 tables + 3 views)
│   │   ├── repository/             # Spring Data JPA repositories
│   │   ├── dto/                    # Request/response records
│   │   ├── service/                # Business logic
│   │   ├── controller/             # REST controllers
│   │   └── exception/              # GlobalExceptionHandler
│   ├── src/main/resources/
│   │   └── application.properties
│   ├── pom.xml
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx             # Homepage (hero, categories, trending, AI picks)
│   │   │   ├── Catalog.jsx          # Product listing with filters
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Orders.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx        # Admin only
│   │   │   └── ManageProduct.jsx    # Admin only
│   │   ├── components/
│   │   │   └── Navbar.jsx
│   │   ├── AuthContext.jsx          # Auth state (login, register, logout)
│   │   ├── api.js                   # HTTP client wrapper
│   │   └── index.css                # Design system + all styles
│   └── package.json
├── database/
│   ├── schema.sql    # All tables, indexes, views
│   └── seed.sql      # Sample products, customers, orders
└── docker-compose.yml
```

---

## Prerequisites

**Option A — Docker (recommended):**
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

**Option B — Local development:**
- Java 21+
- Maven 3.9+
- Node.js 18+ and npm
- PostgreSQL 15+

---

## Option A — Run Everything with Docker

```bash
# From the repo root
docker-compose up --build
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:4000
- Health check: http://localhost:4000/health

> First build takes a few minutes — Maven downloads all Spring Boot dependencies inside the container.

To stop:

```bash
docker-compose down
```

---

## Option B — Run Locally (two terminals)

### 1. Database setup

```bash
# Create the postgres role (if it doesn't exist)
psql -U $(whoami) -d postgres -c "CREATE ROLE postgres WITH LOGIN SUPERUSER PASSWORD 'postgres';"

# Create the database
psql -U postgres -d postgres -c "CREATE DATABASE cartly OWNER postgres;"

# Run schema and seed data
psql -U postgres -d cartly -f database/schema.sql
psql -U postgres -d cartly -f database/seed.sql
```

### 2. Backend (Terminal 1)

```bash
cd backend
mvn spring-boot:run
```

Backend runs at **http://localhost:4000**

### 3. Frontend (Terminal 2)

```bash
cd frontend
npm install     # first time only
npm run dev
```

Frontend runs at **http://localhost:5173**

---

## Environment Variables (Backend)

All have defaults — only override for production:

| Variable      | Default                              | Description          |
|---------------|--------------------------------------|----------------------|
| `DB_HOST`     | `localhost`                          | PostgreSQL host      |
| `DB_PORT`     | `5432`                               | PostgreSQL port      |
| `DB_NAME`     | `cartly`                             | Database name        |
| `DB_USER`     | `postgres`                           | Database user        |
| `DB_PASSWORD` | `postgres`                           | Database password    |
| `JWT_SECRET`  | `cartly_jwt_secret_change_in_prod`   | JWT signing key      |
| `PORT`        | `4000`                               | Server port          |

---

## Demo Accounts

| Role     | Email              | Password    |
|----------|--------------------|-------------|
| Admin    | admin@cartly.com   | password123 |
| Customer | riya@example.com   | password123 |
| Customer | arjun@example.com  | password123 |

---

## API Endpoints

| Method | Endpoint                  | Description                | Auth     |
|--------|---------------------------|----------------------------|----------|
| POST   | /auth/register            | Register new customer      | —        |
| POST   | /auth/login               | Login, returns JWT         | —        |
| GET    | /products                 | List products (filterable) | —        |
| GET    | /products/:id             | Product detail + reviews   | —        |
| POST   | /products                 | Create product             | Admin    |
| PUT    | /products/:id             | Update product             | Admin    |
| GET    | /categories               | List categories            | —        |
| GET    | /suppliers                | List suppliers             | —        |
| GET    | /orders                   | List orders                | Customer |
| POST   | /orders                   | Place new order            | Customer |
| GET    | /orders/:id               | Order detail               | Customer |
| PATCH  | /orders/:id/cancel        | Cancel order               | Customer |
| POST   | /payments                 | Record payment             | Customer |
| GET    | /reviews/product/:id      | Product reviews            | —        |
| POST   | /reviews                  | Submit review              | Customer |
| GET    | /dashboard                | Admin stats                | Admin    |
| GET    | /dashboard/categories     | Sales by category          | Admin    |
| GET    | /health                   | Health check               | —        |

---

## Features

- **Homepage** — Hero section, multimodal search bar (text / image upload / voice), category grid, trending products, AI picks, footer
- **Product Catalog** — Search, filter by category and price, pagination
- **Product Detail** — Specs, stock status, add to cart, customer reviews
- **Shopping Cart** — localStorage-based cart, quantity controls, order placement
- **Orders** — Order history, status tracking, cancel orders
- **Authentication** — Register, login, JWT-based sessions, role-based access
- **Admin Dashboard** — Revenue stats, recent orders, top sellers, low stock alerts
- **Admin Product Management** — Create and edit products

---

## Design System

- **Background:** `#FFFFFF`
- **Text:** `#171A1F`
- **Accent:** `#B7F36B` (lime green)
- **Secondary text:** `#68717D`
- **Font:** Inter
- **Border radius:** 12–16px

---
