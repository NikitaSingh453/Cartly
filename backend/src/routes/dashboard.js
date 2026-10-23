import { Router } from 'express';
import pool from '../db/pool.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

// GET /dashboard  (admin only)
router.get('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const [productCount, orderStats, revenue, lowStock, recentOrders, topSellers] = await Promise.all([
      pool.query(`SELECT COUNT(*) FROM product WHERE is_active=TRUE`),
      pool.query(`SELECT COUNT(*) AS orders_today FROM orders WHERE order_date::date = CURRENT_DATE`),
      pool.query(`SELECT COALESCE(SUM(oi.quantity * oi.unit_price),0) AS total_revenue
                  FROM order_item oi JOIN orders o ON o.order_id=oi.order_id
                  WHERE o.status != 'CANCELLED'`),
      pool.query(`SELECT COUNT(*) FROM low_stock_view`),
      pool.query(`SELECT o.order_id, c.name AS customer, o.status, o.order_date,
                         SUM(oi.quantity * oi.unit_price) AS total
                  FROM orders o
                  JOIN customer c ON c.customer_id=o.customer_id
                  JOIN order_item oi ON oi.order_id=o.order_id
                  GROUP BY o.order_id, c.name
                  ORDER BY o.order_date DESC LIMIT 5`),
      pool.query(`SELECT p.product_id, p.name, SUM(oi.quantity) AS units_sold
                  FROM order_item oi JOIN product p ON p.product_id=oi.product_id
                  JOIN orders o ON o.order_id=oi.order_id
                  WHERE o.status != 'CANCELLED'
                  GROUP BY p.product_id, p.name
                  ORDER BY units_sold DESC LIMIT 5`),
    ]);

    res.json({
      product_count:   parseInt(productCount.rows[0].count),
      orders_today:    parseInt(orderStats.rows[0].orders_today),
      total_revenue:   parseFloat(revenue.rows[0].total_revenue),
      low_stock_count: parseInt(lowStock.rows[0].count),
      recent_orders:   recentOrders.rows,
      top_sellers:     topSellers.rows,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /dashboard/categories  — sales by category
router.get('/categories', authenticate, requireAdmin, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT c.name AS category, SUM(oi.quantity * oi.unit_price) AS revenue,
              COUNT(DISTINCT o.order_id) AS order_count
       FROM order_item oi
       JOIN product p  ON p.product_id = oi.product_id
       JOIN category c ON c.category_id = p.category_id
       JOIN orders o   ON o.order_id = oi.order_id
       WHERE o.status != 'CANCELLED'
       GROUP BY c.name ORDER BY revenue DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
