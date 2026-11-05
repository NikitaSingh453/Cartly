# ⚡ Cartly

**Discover more. Shop smarter.**

Cartly is a full-stack e-commerce platform for tech and gadgets, featuring an AI-powered multimodal shopping experience (text, image, and voice search).

---

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 19 + Vite + React Router v6   |
| Backend   | Spring Boot (Java)                  |
| Database  | PostgreSQL 15+                      |
| Auth      | JWT + Spring Security               |
| Styling   | Custom CSS (Inter font, light theme)|

---

## Project Structure

```
cartly/
├── backend/                   # Spring Boot backend (Java) — in progress
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
└── database/
    ├── schema.sql    # All tables, indexes, views
    └── seed.sql      # Sample products, customers, orders
```

---

## Prerequisites

Make sure you have these installed:

**Frontend:**
- [Node.js](https://nodejs.org/) v18+
- npm (comes with Node)

**Backend:**
- Java 17+
- Maven or Gradle
- [PostgreSQL](https://www.postgresql.org/) v15+

---

## Database Setup

Run these once on your local PostgreSQL:

```bash
# Create the postgres role (if it doesn't exist)
psql -U $(whoami) -d postgres -c "CREATE ROLE postgres WITH LOGIN SUPERUSER PASSWORD 'postgres';"

# Create the database
psql -U postgres -d postgres -c "CREATE DATABASE cartly OWNER postgres;"

# Run schema and seed data
psql -U postgres -d cartly -f database/schema.sql
psql -U postgres -d cartly -f database/seed.sql
```

---

## Running the Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at **http://localhost:5173**

---

## Running the Backend

> Backend is being migrated to Spring Boot. Instructions will be updated once ready.

Expected configuration in `application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/cartly
spring.datasource.username=postgres
spring.datasource.password=postgres
spring.jpa.hibernate.ddl-auto=validate
server.port=4000
```

---

## Demo Accounts

| Role     | Email              | Password    |
|----------|--------------------|-------------|
| Admin    | admin@cartly.com   | password123 |
| Customer | riya@example.com   | password123 |
| Customer | arjun@example.com  | password123 |

---

## API Endpoints

| Method | Endpoint            | Description               | Auth     |
|--------|---------------------|---------------------------|----------|
| POST   | /auth/register      | Register new customer     | —        |
| POST   | /auth/login         | Login, returns JWT        | —        |
| GET    | /products           | List products (filterable)| —        |
| GET    | /products/:id       | Product detail            | —        |
| POST   | /products           | Create product            | Admin    |
| PUT    | /products/:id       | Update product            | Admin    |
| GET    | /categories         | List categories           | —        |
| GET    | /orders             | Customer's orders         | Customer |
| POST   | /orders             | Place new order           | Customer |
| POST   | /payments           | Record payment            | Customer |
| GET    | /reviews/:productId | Product reviews           | —        |
| POST   | /reviews            | Submit review             | Customer |
| GET    | /dashboard          | Admin stats               | Admin    |

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
