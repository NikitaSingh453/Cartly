import { useEffect, useState, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../api';

export default function Catalog() {
  const [searchParams] = useSearchParams();
  const [products, setProducts]     = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal]           = useState(0);
  const [loading, setLoading]       = useState(false);
  const [filters, setFilters]       = useState({
    search:    searchParams.get('search') || '',
    category:  '',
    min_price: '',
    max_price: '',
    page:      1,
  });

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
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 className="page-title" style={{ marginBottom: '.25rem' }}>Shop</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '.875rem' }}>
          Discover {total > 0 ? total : ''} products across all categories
        </p>
      </div>

      <div className="filter-bar">
        <div className="filter-search" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <span style={{ position: 'absolute', left: '.75rem', color: 'var(--text-muted)', fontSize: '.875rem', pointerEvents: 'none' }}>🔍</span>
          <input
            style={{ paddingLeft: '2.2rem' }}
            placeholder="Search gadgets, brands…"
            value={filters.search}
            onChange={set('search')}
          />
        </div>
        <select value={filters.category} onChange={set('category')} style={{ width: '180px' }}>
          <option value="">All Categories</option>
          {categories.filter(c => !c.parentId).map(c => (
            <option key={c.categoryId} value={c.categoryId}>{c.name}</option>
          ))}
          {categories.filter(c => c.parentId).map(c => (
            <option key={c.categoryId} value={c.categoryId}>  {c.name}</option>
          ))}
        </select>
        <input className="filter-price" placeholder="Min ₹" type="number" value={filters.min_price} onChange={set('min_price')} />
        <input className="filter-price" placeholder="Max ₹" type="number" value={filters.max_price} onChange={set('max_price')} />
      </div>

      {loading ? (
        <div className="loading">Loading products…</div>
      ) : (
        <>
          <p className="result-count">
            {total} product{total !== 1 ? 's' : ''} found
            {filters.search && <> for "<strong>{filters.search}</strong>"</>}
          </p>

          {products.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🔍</div>
              <h3>No products found</h3>
              <p>Try adjusting your filters or searching for something else.</p>
              <button className="btn-secondary" onClick={() => setFilters({ search: '', category: '', min_price: '', max_price: '', page: 1 })}>
                Clear filters
              </button>
            </div>
          ) : (
            <div className="product-grid">
              {products.map(p => <ProductCard key={p.productId || p.product_id} p={p} />)}
            </div>
          )}

          {totalPages > 1 && (
            <div className="pagination">
              <button
                disabled={filters.page === 1}
                onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))}
              >
                ← Previous
              </button>
              <span>Page {filters.page} of {totalPages}</span>
              <button
                disabled={filters.page === totalPages}
                onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))}
              >
                Next →
              </button>
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
        <span key={i} style={{ color: i <= Math.round(rating) ? '#f59e0b' : '#D4D4D8' }}>★</span>
      ))}
    </span>
  );
}

export function ProductCard({ p }) {
  const id    = p.productId || p.product_id;
  const name  = p.name;
  const qty   = p.quantityOnHand ?? p.quantity_on_hand;
  const price = p.price;
  const cat   = p.categoryName || p.category_name;
  const sup   = p.supplierName || p.supplier_name;
  const avg   = p.avgRating    || p.avg_rating    || 0;
  const cnt   = p.reviewCount  || p.review_count  || 0;
  const active = p.isActive    ?? p.is_active     ?? true;

  return (
    <Link to={`/products/${id}`} className="product-card">
      <div className="product-img-wrap">
        <div className="product-img-placeholder" style={{ background: categoryGradient(cat) }}>
          <span style={{ filter: 'drop-shadow(0 4px 10px rgba(0,0,0,.18))', transition: 'transform .2s ease' }}>
            {categoryIcon(cat)}
          </span>
        </div>
        {!active && <span className="badge-inactive">Inactive</span>}
        {qty <= 5 && qty > 0 && <span className="badge-lowstock">Only {qty} left</span>}
        {qty === 0 && <span className="badge-oos">Out of stock</span>}
      </div>
      <div className="product-info">
        <p className="product-category">{cat}</p>
        <h3 className="product-name">{name}</h3>
        <div className="product-meta">
          <Stars rating={avg} />
          <span className="review-count">({cnt})</span>
        </div>
        <div className="product-footer">
          <span className="product-price">₹{Number(price).toLocaleString('en-IN')}</span>
          <span className="supplier-badge">{sup}</span>
        </div>
      </div>
    </Link>
  );
}

export function categoryIcon(cat) {
  const map = {
    Smartphones: '📱', Laptops: '💻', Tablets: '📲', Audio: '🎧',
    Wearables: '⌚', Cameras: '📷', Accessories: '🖱️', Electronics: '⚡',
    Gaming: '🎮', Storage: '💾', Networking: '📡', Monitors: '🖥️',
  };
  return map[cat] || '📦';
}

export function categoryGradient(cat) {
  const map = {
    Smartphones: 'linear-gradient(145deg, #E8F0FE 0%, #C7D7FC 100%)',
    Laptops:     'linear-gradient(145deg, #F0F4FF 0%, #D9E3FF 100%)',
    Tablets:     'linear-gradient(145deg, #EDE9FE 0%, #D4CAFE 100%)',
    Audio:       'linear-gradient(145deg, #FFF7ED 0%, #FDE8C8 100%)',
    Wearables:   'linear-gradient(145deg, #F0FDF4 0%, #BBFCD0 100%)',
    Cameras:     'linear-gradient(145deg, #FFF1F2 0%, #FFD1D6 100%)',
    Accessories: 'linear-gradient(145deg, #F0F9FF 0%, #BFEDFF 100%)',
    Electronics: 'linear-gradient(145deg, #FEFCE8 0%, #FEF08A 100%)',
    Gaming:      'linear-gradient(145deg, #FDF4FF 0%, #EDCAFE 100%)',
    Storage:     'linear-gradient(145deg, #F0FDF4 0%, #C8F7DC 100%)',
    Networking:  'linear-gradient(145deg, #EFF6FF 0%, #BFDBFE 100%)',
    Monitors:    'linear-gradient(145deg, #F8FAFC 0%, #E2E8F0 100%)',
  };
  return map[cat] || 'linear-gradient(145deg, #F4F4F5 0%, #E4E4E7 100%)';
}
