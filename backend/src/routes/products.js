import { Router } from 'express';
import pool from '../db/pool.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

// GET /products?search=&category=&min_price=&max_price=&page=&limit=
router.get('/', async (req, res) => {
  const { search = '', category, min_price, max_price, page = 1, limit = 20 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);
  const values = [];
  const conditions = ['p.is_active = TRUE'];

  if (search) {
    values.push(`%${search}%`);
    conditions.push(`(p.name ILIKE $${values.length} OR p.description ILIKE $${values.length})`);
  }
  if (category) {
    values.push(parseInt(category));
    conditions.push(`p.category_id = $${values.length}`);
  }
  if (min_price) {
    values.push(parseFloat(min_price));
    conditions.push(`p.price >= $${values.length}`);
  }
  if (max_price) {
    values.push(parseFloat(max_price));
    conditions.push(`p.price <= $${values.length}`);
  }

  const where = conditions.join(' AND ');
  values.push(parseInt(limit), offset);

  try {
    const { rows } = await pool.query(
      `SELECT p.product_id, p.sku, p.name, p.description, p.price, p.is_active,
              c.name AS category_name, s.name AS supplier_name,
              i.quantity_on_hand,
              COALESCE(r.avg_rating, 0) AS avg_rating,
              COALESCE(r.review_count, 0) AS review_count
       FROM product p
       JOIN category c   ON c.category_id = p.category_id
       JOIN supplier s   ON s.supplier_id = p.supplier_id
       LEFT JOIN inventory i ON i.product_id = p.product_id
       LEFT JOIN product_rating_view r ON r.product_id = p.product_id
       WHERE ${where}
       ORDER BY p.created_at DESC
       LIMIT $${values.length - 1} OFFSET $${values.length}`,
      values
    );

    const countValues = values.slice(0, values.length - 2);
    const { rows: countRows } = await pool.query(
      `SELECT COUNT(*) FROM product p WHERE ${where}`,
      countValues
    );

    res.json({ products: rows, total: parseInt(countRows[0].count), page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /products/:id
router.get('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT p.*, c.name AS category_name, s.name AS supplier_name,
              s.city AS supplier_city,
              i.quantity_on_hand, i.reorder_level,
              COALESCE(r.avg_rating, 0) AS avg_rating,
              COALESCE(r.review_count, 0) AS review_count
       FROM product p
       JOIN category c   ON c.category_id = p.category_id
       JOIN supplier s   ON s.supplier_id = p.supplier_id
       LEFT JOIN inventory i ON i.product_id = p.product_id
       LEFT JOIN product_rating_view r ON r.product_id = p.product_id
       WHERE p.product_id = $1`,
      [req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Product not found' });

    const { rows: reviews } = await pool.query(
      `SELECT rv.review_id, rv.rating, rv.title, rv.comment, rv.created_at,
              cu.name AS customer_name
       FROM review rv
       JOIN customer cu ON cu.customer_id = rv.customer_id
       WHERE rv.product_id = $1
       ORDER BY rv.created_at DESC`,
      [req.params.id]
    );

    res.json({ ...rows[0], reviews });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /products  (admin)
router.post('/', authenticate, requireAdmin, async (req, res) => {
  const { sku, name, description, price, category_id, supplier_id, quantity_on_hand = 0, reorder_level = 10 } = req.body;
  if (!sku || !name || !price || !category_id || !supplier_id) {
    return res.status(400).json({ error: 'sku, name, price, category_id, supplier_id required' });
  }
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { rows } = await client.query(
      `INSERT INTO product (sku, name, description, price, category_id, supplier_id)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [sku, name, description || null, price, category_id, supplier_id]
    );
    await client.query(
      `INSERT INTO inventory (product_id, quantity_on_hand, reorder_level) VALUES ($1,$2,$3)`,
      [rows[0].product_id, quantity_on_hand, reorder_level]
    );
    await client.query('COMMIT');
    res.status(201).json(rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    if (err.code === '23505') return res.status(409).json({ error: 'SKU already exists' });
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// PUT /products/:id  (admin)
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  const { name, description, price, category_id, supplier_id, is_active, quantity_on_hand, reorder_level } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { rows } = await client.query(
      `UPDATE product SET
         name        = COALESCE($1, name),
         description = COALESCE($2, description),
         price       = COALESCE($3, price),
         category_id = COALESCE($4, category_id),
         supplier_id = COALESCE($5, supplier_id),
         is_active   = COALESCE($6, is_active)
       WHERE product_id = $7 RETURNING *`,
      [name, description, price, category_id, supplier_id, is_active, req.params.id]
    );
    if (!rows[0]) { await client.query('ROLLBACK'); return res.status(404).json({ error: 'Product not found' }); }

    if (quantity_on_hand !== undefined || reorder_level !== undefined) {
      await client.query(
        `UPDATE inventory SET
           quantity_on_hand = COALESCE($1, quantity_on_hand),
           reorder_level    = COALESCE($2, reorder_level),
           last_updated     = NOW()
         WHERE product_id = $3`,
        [quantity_on_hand, reorder_level, req.params.id]
      );
    }
    await client.query('COMMIT');
    res.json(rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

export default router;
