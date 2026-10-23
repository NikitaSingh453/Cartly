import { Router } from 'express';
import pool from '../db/pool.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// POST /reviews
router.post('/', authenticate, async (req, res) => {
  const { product_id, rating, title, comment } = req.body;
  if (!product_id || !rating) return res.status(400).json({ error: 'product_id and rating required' });
  if (rating < 1 || rating > 5) return res.status(400).json({ error: 'rating must be 1-5' });

  try {
    // Check customer has purchased this product
    const { rows: purchased } = await pool.query(
      `SELECT 1 FROM order_item oi
       JOIN orders o ON o.order_id = oi.order_id
       WHERE oi.product_id=$1 AND o.customer_id=$2
         AND o.status IN ('PAID','SHIPPED','DELIVERED')
       LIMIT 1`,
      [product_id, req.user.id]
    );
    if (!purchased[0]) {
      return res.status(403).json({ error: 'You can only review products you have purchased' });
    }

    const { rows } = await pool.query(
      `INSERT INTO review (product_id, customer_id, rating, title, comment)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [product_id, req.user.id, rating, title || null, comment || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'You have already reviewed this product' });
    res.status(500).json({ error: err.message });
  }
});

// GET /reviews/product/:id
router.get('/product/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT rv.*, cu.name AS customer_name
       FROM review rv JOIN customer cu ON cu.customer_id = rv.customer_id
       WHERE rv.product_id=$1 ORDER BY rv.created_at DESC`,
      [req.params.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
