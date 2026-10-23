-- Cartly Seed Data — Tech & Gadgets

-- ─── Categories ────────────────────────────────────────────────────────────
INSERT INTO category (name, parent_id) VALUES
  ('Electronics', NULL),
  ('Smartphones', 1),
  ('Laptops', 1),
  ('Tablets', 1),
  ('Audio', 1),
  ('Wearables', 1),
  ('Accessories', 1),
  ('Cameras', 1);

-- ─── Suppliers ─────────────────────────────────────────────────────────────
INSERT INTO supplier (name, contact_email, phone, city) VALUES
  ('Samsung India',    'b2b@samsung.in',    '1800-40-SAMSUNG', 'Bengaluru'),
  ('Apple India',      'trade@apple.in',    '1800-4250-744',   'Mumbai'),
  ('Xiaomi India',     'supply@mi.com',     '1800-103-6286',   'Bengaluru'),
  ('Sony India',       'b2b@sony.in',       '1800-103-7799',   'Delhi'),
  ('Logitech India',   'sales@logitech.in', '022-4900-5900',   'Mumbai'),
  ('OnePlus India',    'b2b@oneplus.in',    '1800-102-8411',   'Hyderabad'),
  ('Boat Lifestyle',   'trade@boat.in',     '011-4560-0000',   'Delhi'),
  ('Asus India',       'b2b@asus.in',       '1800-2090-365',   'Bengaluru');

-- ─── Customers (password = "password123" bcrypt hash) ──────────────────────
INSERT INTO customer (name, email, phone, password_hash, role) VALUES
  ('Admin User',    'admin@cartly.com',   '9000000000', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh3y', 'admin'),
  ('Riya Sharma',   'riya@example.com',   '9111111111', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh3y', 'customer'),
  ('Arjun Mehta',   'arjun@example.com',  '9222222222', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh3y', 'customer'),
  ('Priya Nair',    'priya@example.com',  '9333333333', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh3y', 'customer'),
  ('Vikram Singh',  'vikram@example.com', '9444444444', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh3y', 'customer'),
  ('Sneha Reddy',   'sneha@example.com',  '9555555555', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh3y', 'customer');

-- ─── Addresses ─────────────────────────────────────────────────────────────
INSERT INTO address (customer_id, line1, city, state, postal_code, is_default) VALUES
  (2, '12 MG Road',      'Bengaluru',  'Karnataka',   '560001', TRUE),
  (3, '45 Linking Road',  'Mumbai',    'Maharashtra', '400050', TRUE),
  (4, '8 Anna Salai',    'Chennai',    'Tamil Nadu',  '600002', TRUE),
  (5, '33 Connaught Pl', 'Delhi',      'Delhi',       '110001', TRUE),
  (6, '7 Banjara Hills', 'Hyderabad',  'Telangana',   '500034', TRUE);

-- ─── Products ──────────────────────────────────────────────────────────────
INSERT INTO product (sku, name, description, price, category_id, supplier_id) VALUES
  ('SAM-S24U-256',  'Samsung Galaxy S24 Ultra',        'Flagship Android phone with 200MP camera and S Pen.',              134999, 2, 1),
  ('APL-IP15PM-256','Apple iPhone 15 Pro Max',         'Titanium design, A17 Pro chip, 48MP main camera.',                159900, 2, 2),
  ('XMI-14P-256',   'Xiaomi 14 Pro',                   'Leica cameras, Snapdragon 8 Gen 3, 120W fast charge.',             74999, 2, 3),
  ('ONE-12P-256',   'OnePlus 12',                      'Hasselblad camera, 100W SUPERVOOC, Snapdragon 8 Gen 3.',            64999, 2, 6),
  ('APL-MBP14M3',   'Apple MacBook Pro 14" M3 Pro',    'M3 Pro chip, 18GB RAM, 18-hour battery, Liquid Retina XDR.',      199900, 3, 2),
  ('ASU-ZB14-32',   'Asus ZenBook 14 OLED',            'Intel i7-13700H, 32GB RAM, 1TB SSD, OLED display.',                94999, 3, 8),
  ('SAM-QN95B-55',  'Samsung Galaxy Tab S9+',          '12.4" AMOLED, S Pen included, Snapdragon 8 Gen 2.',                84999, 4, 1),
  ('APL-IPADPRO13', 'Apple iPad Pro 13" M4',           'M4 chip, Ultra Retina XDR, Apple Pencil Pro support.',            149900, 4, 2),
  ('SON-WH1000XM5', 'Sony WH-1000XM5',                 'Industry-leading ANC, 30hr battery, multipoint connection.',       29990, 5, 4),
  ('BOA-ROCKz-BLK', 'boAt Rockerz 550',                'Wireless over-ear, 20hr battery, 40mm drivers.',                   1499, 5, 7),
  ('APL-WATCH9-45', 'Apple Watch Series 9 45mm',       'S9 chip, double-tap gesture, Always-On Retina display.',           44900, 6, 2),
  ('SAM-GW5PRO-BLK','Samsung Galaxy Watch 5 Pro',      'Titanium build, 80hr battery, advanced fitness tracking.',         26999, 6, 1),
  ('LOG-MX3S-GRY',  'Logitech MX Master 3S',           'Ergonomic wireless mouse, 8K DPI, MagSpeed scroll wheel.',         8995, 7, 5),
  ('LOG-MX-KEYS-S', 'Logitech MX Keys S',              'Advanced wireless keyboard, Smart Actions, logi bolt.',            9995, 7, 5),
  ('SON-A7IV-BODY', 'Sony Alpha A7 IV Body',           'Full-frame mirrorless, 33MP, 4K60, real-time tracking AF.',       219990, 8, 4),
  ('XMI-BUDS4PRO',  'Xiaomi Buds 4 Pro',              'Hi-Res Audio, 48dB ANC, 9hr playtime + 27hr with case.',            7999, 5, 3),
  ('APL-AIRPODSP3', 'Apple AirPods Pro (2nd Gen)',     'H2 chip, Adaptive Audio, USB-C charging case.',                    24900, 5, 2),
  ('ASU-ROG-G16',   'Asus ROG Strix G16 Gaming Laptop','RTX 4070, i9-13980HX, 16GB DDR5, 240Hz display.',                159999, 3, 8),
  ('SAM-GBP4-BLK',  'Samsung Galaxy Buds2 Pro',       '360 Audio, ANC, IPX7 waterproof, 8hr + 21hr case.',                11999, 5, 1),
  ('LOG-C920-HD',   'Logitech C920 HD Pro Webcam',    '1080p/30fps, autofocus, dual stereo mics, plug-and-play.',          6495, 7, 5);

-- ─── Inventory ─────────────────────────────────────────────────────────────
INSERT INTO inventory (product_id, quantity_on_hand, reorder_level) VALUES
  (1, 85,  10), (2, 60,  10), (3, 120, 15), (4, 95,  15),
  (5, 40,   5), (6, 55,   8), (7, 70,  10), (8, 30,   5),
  (9, 110, 20), (10,250, 30), (11,45,  10), (12,60,  10),
  (13,130, 20), (14,100, 20), (15,18,   5), (16,200, 25),
  (17,75,  15), (18,35,   8), (19,90,  15), (20,160, 25);

-- ─── Orders + Items + Payments ─────────────────────────────────────────────
INSERT INTO orders (customer_id, address_id, status) VALUES
  (2, 1, 'DELIVERED'),
  (3, 2, 'SHIPPED'),
  (4, 3, 'PAID'),
  (5, 4, 'PLACED'),
  (6, 5, 'DELIVERED'),
  (2, 1, 'CANCELLED'),
  (3, 2, 'DELIVERED');

INSERT INTO order_item (order_id, product_id, quantity, unit_price) VALUES
  (1, 9,  1, 29990),
  (1, 13, 1,  8995),
  (2, 1,  1, 134999),
  (3, 5,  1, 199900),
  (4, 4,  1,  64999),
  (4, 16, 2,   7999),
  (5, 11, 1,  44900),
  (5, 17, 1,  24900),
  (6, 7,  1,  84999),
  (7, 18, 1, 159999),
  (7, 14, 1,   9995);

INSERT INTO payment (order_id, method, amount, status, transaction_ref) VALUES
  (1, 'UPI',       38985, 'SUCCESS', 'UPI20241001A'),
  (2, 'CARD',     134999, 'SUCCESS', 'CARD20241002B'),
  (3, 'NETBANKING',199900,'SUCCESS', 'NB20241003C'),
  (5, 'UPI',       69800, 'SUCCESS', 'UPI20241005E'),
  (7, 'CARD',     169994, 'SUCCESS', 'CARD20241007G');

-- ─── Reviews ───────────────────────────────────────────────────────────────
INSERT INTO review (product_id, customer_id, rating, title, comment) VALUES
  (9,  2, 5, 'Best headphones ever!',       'The noise cancellation is absolutely magical. Worth every penny.'),
  (13, 2, 4, 'Great mouse, minor gripes',   'Super smooth scroll wheel. Wish the software was simpler.'),
  (1,  3, 5, 'Incredible flagship',         'S Pen integration is smooth, camera output is stunning.'),
  (5,  4, 5, 'MacBook Pro is a beast',      'M3 Pro handles everything I throw at it. Battery lasts all day.'),
  (11, 6, 4, 'Love the watch',              'Double tap is a great feature. Wish the band was more durable.'),
  (17, 6, 5, 'AirPods Pro are perfect',     'Adaptive Audio is a game changer for commuting.'),
  (18, 3, 4, 'Gaming powerhouse',           'RTX 4070 handles all modern games at ultra. Gets warm under load.');
