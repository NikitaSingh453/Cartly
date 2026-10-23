import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';

export default function Catalog() {
  const [products, setProducts]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal]         = useState(0);
  const [loading, setLoading]     = useState(false);
  const [filters, setFilters]     = useState({ search: '', category: '', min_price: '', max_price: '', page: 1 });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search)    params.set('search', filters.search);
      if (filters.category)  params.set('category', filters.category);
      if (filters.min_price) params.set('min_price', filters.min_price);
      if (filters.max_price) params.set('max_price', filters.max_price);
      params.set('page', filters.page);
      params.set('limit', 12);
      const data = await api.get(`/products?${params}`);
      setProducts(data.products);
      setTotal(data.total);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  useEffect(() => { api.get('/categories').then(c => setCategories(c)).catch(() => {}); }, []);

  const set = (k) => (e) => setFilters(f => ({ ...f, [k]: e.target.value, page: 1 }));

  const totalPages = Math.ceil(total / 12);

  return (
    <div className="page">
      <h1 className="page-title">Products</h1>

      <div className="filter-bar">
        <input
          className="filter-search"
          placeholder="Search gadgets…"
          value={filters.search}
          onChange={set('search')}
        />
        <select value={filters.category} onChange={set('category')}>
          <option value="">All Categories</option>
          {categories.filter(c => !c.parent_id).map(c => (
            <option key={c.category_id} value={c.category_id}>{c.name}</option>
          ))}
          {categories.filter(c => c.parent_id).map(c => (
            <option key={c.category_id} value={c.category_id}>└ {c.name}</option>
          ))}
        </select>
        <input className="filter-price" placeholder="Min ₹" type="number" value={filters.min_price} onChange={set('min_price')} />
        <input className="filter-price" placeholder="Max ₹" type="number" value={filters.max_price} onChange={set('max_price')} />
      </div>

      {loading ? (
        <div className="loading">Loading…</div>
      ) : (
        <>
          <p className="result-count">{total} product{total !== 1 ? 's' : ''} found</p>
          <div className="product-grid">
            {products.map(p => <ProductCard key={p.product_id} p={p} />)}
            {products.length === 0 && <p className="empty">No products found.</p>}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button disabled={filters.page === 1} onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))}>← Prev</button>
              <span>Page {filters.page} of {totalPages}</span>
              <button disabled={filters.page === totalPages} onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))}>Next →</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function Stars({ rating }) {
  return (
    <span className="stars">
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= Math.round(rating) ? '#f59e0b' : '#d1d5db' }}>★</span>
      ))}
    </span>
  );
}

function ProductCard({ p }) {
  return (
    <Link to={`/products/${p.product_id}`} className="product-card">
      <div className="product-img-wrap">
        <div className="product-img-placeholder">
          {categoryIcon(p.category_name)}
        </div>
        {!p.is_active && <span className="badge-inactive">Inactive</span>}
        {p.quantity_on_hand <= 5 && p.quantity_on_hand > 0 && (
          <span className="badge-lowstock">Only {p.quantity_on_hand} left</span>
        )}
        {p.quantity_on_hand === 0 && <span className="badge-oos">Out of stock</span>}
      </div>
      <div className="product-info">
        <p className="product-category">{p.category_name}</p>
        <h3 className="product-name">{p.name}</h3>
        <div className="product-meta">
          <Stars rating={p.avg_rating} />
          <span className="review-count">({p.review_count})</span>
        </div>
        <div className="product-footer">
          <span className="product-price">₹{Number(p.price).toLocaleString('en-IN')}</span>
          <span className="supplier-badge">{p.supplier_name}</span>
        </div>
      </div>
    </Link>
  );
}

function categoryIcon(cat) {
  const icons = {
    Smartphones: '📱', Laptops: '💻', Tablets: '📲', Audio: '🎧',
    Wearables: '⌚', Cameras: '📷', Accessories: '🖱️', Electronics: '⚡',
  };
  return icons[cat] || '📦';
}
