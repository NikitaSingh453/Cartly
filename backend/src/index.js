import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import authRoutes       from './routes/auth.js';
import productRoutes    from './routes/products.js';
import orderRoutes      from './routes/orders.js';
import paymentRoutes    from './routes/payments.js';
import reviewRoutes     from './routes/reviews.js';
import dashboardRoutes  from './routes/dashboard.js';
import categoryRoutes   from './routes/categories.js';
import supplierRoutes   from './routes/suppliers.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth',       authRoutes);
app.use('/products',   productRoutes);
app.use('/orders',     orderRoutes);
app.use('/payments',   paymentRoutes);
app.use('/reviews',    reviewRoutes);
app.use('/dashboard',  dashboardRoutes);
app.use('/categories', categoryRoutes);
app.use('/suppliers',  supplierRoutes);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Cartly API running on http://localhost:${PORT}`));
