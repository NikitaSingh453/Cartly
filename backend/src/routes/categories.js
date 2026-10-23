import { Router } from 'express';
import pool from '../db/pool.js';

const router = Router();

// GET /categories
router.get('/', async (_req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT c.*, p.name AS parent_name
       FROM category c LEFT JOIN category p ON p.category_id = c.parent_id
       ORDER BY c.parent_id NULLS FIRST, c.name`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
