import { Router } from 'express';
import pool from '../db/pool.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// POST /orders  — place order (transactional, atomic stock deduction)
router.post('/', authenticate, async (req, res) => {
  const { address_id, items } = req.body;
  // items: [{ product_id, quantity }]
  if (!address_id || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'address_id and items[] required' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Verify address belongs to this customer
    const addrRes = await client.query(
      `SELECT address_id FROM address WHERE address_id=$1 AND customer_id=$2`,
      [address_id, req.user.id]
    );
    if (!addrRes.rows[0]) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Invalid address' });
    }

    // Lock inventory rows and validate stock
    const productIds = items.map(i => i.product_id);
    const invRes = await client.query(
      `SELECT p.product_id, p.name, p.price, i.quantity_on_hand
       FROM product p JOIN inventory i ON i.product_id=p.product_id
       WHERE p.product_id = ANY($1) AND p.is_active=TRUE
       FOR UPDATE`,
      [productIds]
    );
    const invMap = Object.fromEntries(invRes.rows.map(r => [r.product_id, r]));

    for (const item of items) {
      const inv = invMap[item.product_id];
      if (!inv) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: `Product ${item.product_id} not found or inactive` });
      }
      if (inv.quantity_on_hand < item.quantity) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: `Insufficient stock for "${inv.name}" (available: ${inv.quantity_on_hand})` });
      }
    }

    // Create order
    const orderRes = await client.query(
      `INSERT INTO orders (customer_id, address_id) VALUES ($1,$2) RETURNING order_id`,
      [req.user.id, address_id]
    );
    const order_id = orderRes.rows[0].order_id;

    // Insert items and deduct stock
    for (const item of items) {
      const inv = invMap[item.product_id];
      await client.query(
        `INSERT INTO order_item (order_id, product_id, quantity, unit_price) VALUES ($1,$2,$3,$4)`,
        [order_id, item.product_id, item.quantity, inv.price]
      );
      await client.query(
        `UPDATE inventory SET quantity_on_hand = quantity_on_hand - $1, last_updated=NOW()
         WHERE product_id = $2`,
        [item.quantity, item.product_id]
      );
    }

    await client.query('COMMIT');
    res.status(201).json({ order_id, message: 'Order placed successfully' });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// GET /orders  — customer sees own orders; admin sees all
router.get('/', authenticate, async (req, res) => {
  try {
    const isAdmin = req.user.role === 'admin';
    const { rows } = await pool.query(
      `SELECT o.order_id, o.order_date, o.status,
              c.name AS customer_name,
              SUM(oi.quantity * oi.unit_price) AS total
       FROM orders o
       JOIN customer c   ON c.customer_id = o.customer_id
       JOIN order_item oi ON oi.order_id = o.order_id
       WHERE ($1 OR o.customer_id = $2)
       GROUP BY o.order_id, c.name
       ORDER BY o.order_date DESC`,
      [isAdmin, req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /orders/:id
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT o.*, c.name AS customer_name, c.email,
              a.line1, a.city, a.state, a.postal_code
       FROM orders o
       JOIN customer c ON c.customer_id = o.customer_id
       JOIN address  a ON a.address_id  = o.address_id
       WHERE o.order_id = $1 AND ($2 OR o.customer_id = $3)`,
      [req.params.id, req.user.role === 'admin', req.user.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Order not found' });

    const { rows: items } = await pool.query(
      `SELECT oi.product_id, p.name, oi.quantity, oi.unit_price
       FROM order_item oi JOIN product p ON p.product_id = oi.product_id
       WHERE oi.order_id = $1`,
      [req.params.id]
    );

    const { rows: payments } = await pool.query(
      `SELECT * FROM payment WHERE order_id = $1`, [req.params.id]
    );

    res.json({ ...rows[0], items, payments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /orders/:id/cancel
router.patch('/:id/cancel', authenticate, async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { rows } = await client.query(
      `SELECT * FROM orders WHERE order_id=$1 AND customer_id=$2 FOR UPDATE`,
      [req.params.id, req.user.id]
    );
    if (!rows[0]) { await client.query('ROLLBACK'); return res.status(404).json({ error: 'Order not found' }); }
    if (!['PLACED', 'PAID'].includes(rows[0].status)) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Cannot cancel order in current status' });
    }

    await client.query(`UPDATE orders SET status='CANCELLED' WHERE order_id=$1`, [req.params.id]);

    // Restore stock
    const { rows: items } = await client.query(
      `SELECT product_id, quantity FROM order_item WHERE order_id=$1`, [req.params.id]
    );
    for (const item of items) {
      await client.query(
        `UPDATE inventory SET quantity_on_hand = quantity_on_hand + $1, last_updated=NOW() WHERE product_id=$2`,
        [item.quantity, item.product_id]
      );
    }

    await client.query('COMMIT');
    res.json({ message: 'Order cancelled and stock restored' });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

export default router;
