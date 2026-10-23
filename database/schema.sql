-- Cartly - Tech & Gadgets E-Commerce
-- V1 Schema: PostgreSQL 15+

-- ─── Extensions ────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ─── Tables ────────────────────────────────────────────────────────────────

CREATE TABLE category (
  category_id     SERIAL PRIMARY KEY,
  name            VARCHAR(100) NOT NULL UNIQUE,
  parent_id       INT REFERENCES category(category_id) ON DELETE SET NULL
);

CREATE TABLE supplier (
  supplier_id     SERIAL PRIMARY KEY,
  name            VARCHAR(150) NOT NULL,
  contact_email   VARCHAR(255) UNIQUE,
  phone           VARCHAR(20),
  city            VARCHAR(100),
  country         VARCHAR(100) DEFAULT 'India'
);

CREATE TABLE customer (
  customer_id     SERIAL PRIMARY KEY,
  name            VARCHAR(150) NOT NULL,
  email           VARCHAR(255) NOT NULL UNIQUE,
  phone           VARCHAR(20),
  password_hash   TEXT NOT NULL,
  role            VARCHAR(20) NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE address (
  address_id      SERIAL PRIMARY KEY,
  customer_id     INT NOT NULL REFERENCES customer(customer_id) ON DELETE CASCADE,
  line1           VARCHAR(255) NOT NULL,
  city            VARCHAR(100) NOT NULL,
  state           VARCHAR(100) NOT NULL,
  postal_code     VARCHAR(10) NOT NULL,
  is_default      BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE product (
  product_id      SERIAL PRIMARY KEY,
  sku             VARCHAR(50) NOT NULL UNIQUE,
  name            VARCHAR(255) NOT NULL,
  description     TEXT,
  price           NUMERIC(12,2) NOT NULL CHECK (price >= 0),
  category_id     INT NOT NULL REFERENCES category(category_id),
  supplier_id     INT NOT NULL REFERENCES supplier(supplier_id),
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE inventory (
  product_id      INT PRIMARY KEY REFERENCES product(product_id) ON DELETE CASCADE,
  quantity_on_hand INT NOT NULL DEFAULT 0 CHECK (quantity_on_hand >= 0),
  reorder_level   INT NOT NULL DEFAULT 10,
  last_updated    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE orders (
  order_id        SERIAL PRIMARY KEY,
  customer_id     INT NOT NULL REFERENCES customer(customer_id),
  address_id      INT NOT NULL REFERENCES address(address_id),
  order_date      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status          VARCHAR(20) NOT NULL DEFAULT 'PLACED'
                    CHECK (status IN ('PLACED','PAID','SHIPPED','DELIVERED','CANCELLED'))
);

CREATE TABLE order_item (
  order_id        INT NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
  product_id      INT NOT NULL REFERENCES product(product_id),
  quantity        INT NOT NULL CHECK (quantity > 0),
  unit_price      NUMERIC(12,2) NOT NULL CHECK (unit_price >= 0),
  PRIMARY KEY (order_id, product_id)
);

CREATE TABLE payment (
  payment_id      SERIAL PRIMARY KEY,
  order_id        INT NOT NULL REFERENCES orders(order_id),
  method          VARCHAR(20) NOT NULL CHECK (method IN ('UPI','CARD','COD','NETBANKING')),
  amount          NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  status          VARCHAR(20) NOT NULL DEFAULT 'PENDING'
                    CHECK (status IN ('SUCCESS','FAILED','PENDING')),
  transaction_ref VARCHAR(100),
  paid_at         TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE review (
  review_id       SERIAL PRIMARY KEY,
  product_id      INT NOT NULL REFERENCES product(product_id) ON DELETE CASCADE,
  customer_id     INT NOT NULL REFERENCES customer(customer_id),
  rating          SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title           VARCHAR(200),
  comment         TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (product_id, customer_id)
);

-- ─── Indexes ───────────────────────────────────────────────────────────────

CREATE INDEX idx_product_category   ON product(category_id);
CREATE INDEX idx_product_supplier   ON product(supplier_id);
CREATE INDEX idx_product_name       ON product(name);
CREATE INDEX idx_order_customer     ON orders(customer_id);
CREATE INDEX idx_order_date         ON orders(order_date);
CREATE INDEX idx_order_item_product ON order_item(product_id);
CREATE INDEX idx_review_product     ON review(product_id);
CREATE INDEX idx_payment_order      ON payment(order_id);

-- ─── Views ─────────────────────────────────────────────────────────────────

CREATE VIEW order_total_view AS
  SELECT o.order_id,
         c.name   AS customer_name,
         c.email,
         SUM(oi.quantity * oi.unit_price) AS total
  FROM orders o
  JOIN customer c    ON c.customer_id = o.customer_id
  JOIN order_item oi ON oi.order_id   = o.order_id
  GROUP BY o.order_id, c.name, c.email;

CREATE VIEW product_rating_view AS
  SELECT product_id,
         ROUND(AVG(rating)::NUMERIC, 2) AS avg_rating,
         COUNT(*) AS review_count
  FROM review
  GROUP BY product_id;

CREATE VIEW low_stock_view AS
  SELECT p.product_id, p.sku, p.name, i.quantity_on_hand, i.reorder_level
  FROM inventory i
  JOIN product p ON p.product_id = i.product_id
  WHERE i.quantity_on_hand <= i.reorder_level
    AND p.is_active = TRUE;
