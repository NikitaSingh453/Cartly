import { Router } from 'express';
import pool from '../db/pool.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// POST /payments
router.post('/', authenticate, async (req, res) => {
  const { order_id, method, amount, transaction_ref } = req.body;
  if (!order_id || !method || !amount) {
    return res.status(400).json({ error: 'order_id, method, amount required' });
  }
  const validMethods = ['UPI', 'CARD', 'COD', 'NETBANKING'];
  if (!validMethods.includes(method)) {
    return res.status(400).json({ error: `method must be one of ${validMethods.join(', ')}` });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    // Verify the order belongs to this customer
    const { rows: orderRows } = await client.query(
      `SELECT * FROM orders WHERE order_id=$1 AND customer_id=$2 FOR UPDATE`,
      [order_id, req.user.id]
    );
    if (!orderRows[0]) { await client.query('ROLLBACK'); return res.status(404).json({ error: 'Order not found' }); }
    if (orderRows[0].status !== 'PLACED') {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Order is not in PLACED status' });
    }

    const { rows } = await client.query(
      `INSERT INTO payment (order_id, method, amount, status, transaction_ref)
       VALUES ($1,$2,$3,'SUCCESS',$4) RETURNING *`,
      [order_id, method, amount, transaction_ref || null]
    );
    await client.query(`UPDATE orders SET status='PAID' WHERE order_id=$1`, [order_id]);
    await client.query('COMMIT');
    res.status(201).json(rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

export default router;
