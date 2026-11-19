import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { api } from '../api';
import ProductCard from '../components/ProductCard';

export default function Catalog() {
  const [searchParams]               = useSearchParams();
  const navigate                     = useNavigate();
  const [products, setProducts]      = useState([]);
  const [categories, setCategories]  = useState([]);
  const [total, setTotal]            = useState(0);
  const [loading, setLoading]        = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters]        = useState({
    search:    searchParams.get('search') || '',
    category:  searchParams.get('category') || '',
    min_price: '',
    max_price: '',
    page:      1,
  });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search)    params.set('search',    filters.search);
      if (filters.category)  params.set('category',  filters.category);
      if (filters.min_price) params.set('min_price', filters.min_price);
      if (filters.max_price) params.set('max_price', filters.max_price);
      params.set('page',  filters.page);
      params.set('limit', 12);
      const data = await api.get(`/products?${params}`);
      setProducts(data.products || []);
      setTotal(data.total || 0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  useEffect(() => { api.get('/categories').then(c => setCategories(c)).catch(() => {}); }, []);

  const set  = (k) => (e) => setFilters(f => ({ ...f, [k]: e.target.value, page: 1 }));
  const setV = (k, v) => setFilters(f => ({ ...f, [k]: v, page: 1 }));
  const clearAll = () => setFilters({ search: '', category: '', min_price: '', max_price: '', page: 1 });
  const totalPages  = Math.ceil(total / 12);
  const hasFilters  = filters.search || filters.category || filters.min_price || filters.max_price;
  const parentCats  = categories.filter(c => !c.parentId);

  return (
    <div className="page catalog-page">

      {/* ── Page header ── */}
      <div className="catalog-header">
        <div>
          <h1 className="catalog-title">Shop</h1>
          <p className="catalog-sub">
            {total > 0 ? <><strong style={{ color: 'var(--accent)' }}>{total}</strong> products</> : 'Explore our catalog'}
            {filters.search && <> for "<em>{filters.search}</em>"</>}
          </p>
        </div>
        <button className="catalog-filter-toggle" onClick={() => setShowFilters(v => !v)}>
          <SlidersHorizontal size={15} />
          Filters
          {hasFilters && <span className="filter-dot" />}
        </button>
      </div>

      {/* ── Search bar ── */}
      <div className="catalog-search-wrap">
        <label className="catalog-search">
          <Search size={16} />
          <input
            placeholder="Search products, brands, categories…"
            value={filters.search}
            onChange={set('search')}
          />
          {filters.search && (
            <button onClick={() => setV('search', '')} style={{ background: 'none', border: 0, cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}>
              <X size={14} />
            </button>
          )}
        </label>
      </div>

      {/* ── Category chips ── */}
      {parentCats.length > 0 && (
        <div className="catalog-chips">
          <button
            className={`catalog-chip${!filters.category ? ' active' : ''}`}
            onClick={() => setV('category', '')}
          >All</button>
          {parentCats.map(c => (
            <button
              key={c.categoryId}
              className={`catalog-chip${filters.category === String(c.categoryId) ? ' active' : ''}`}
              onClick={() => setV('category', filters.category === String(c.categoryId) ? '' : String(c.categoryId))}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}

      {/* ── Expandable filter panel ── */}
      {showFilters && (
        <div className="catalog-filter-panel">
          <div className="filter-group">
            <label className="filter-label">Min Price (₹)</label>
            <input type="number" placeholder="0" value={filters.min_price} onChange={set('min_price')} className="filter-input" />
          </div>
          <div className="filter-group">
            <label className="filter-label">Max Price (₹)</label>
            <input type="number" placeholder="Any" value={filters.max_price} onChange={set('max_price')} className="filter-input" />
          </div>
          {hasFilters && (
            <button className="filter-clear" onClick={clearAll}>
              <X size={12} /> Clear all
            </button>
          )}
        </div>
      )}

      {/* ── Product grid ── */}
      {loading ? (
        <div className="grid-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="product-card catalog-skeleton">
              <div className="product-card-img" style={{ background: 'var(--surface2)' }} />
              <div style={{ padding: '0 .75rem .75rem', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div className="skel-line" style={{ width: '80%' }} />
                <div className="skel-line" style={{ width: '50%' }} />
                <div className="skel-line" style={{ width: '65%' }} />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="catalog-empty">
          <span style={{ fontSize: 48 }}>🔍</span>
          <h3>No products found</h3>
          <p>Try a different search or clear your filters.</p>
          <button className="btn" onClick={clearAll}>Clear filters</button>
        </div>
      ) : (
        <div className="grid-4">
          {products.map(p => (
            <ProductCard key={p.productId || p.product_id} p={p} />
          ))}
        </div>
      )}

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="catalog-pagination">
          <button
            className="arrow static"
            disabled={filters.page === 1}
            onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))}
          >
            <ChevronLeft size={16} />
          </button>
          <div className="page-numbers">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(n => n === 1 || n === totalPages || Math.abs(n - filters.page) <= 1)
              .reduce((acc, n, i, arr) => {
                if (i > 0 && n - arr[i - 1] > 1) acc.push('…');
                acc.push(n);
                return acc;
              }, [])
              .map((n, i) =>
                n === '…'
                  ? <span key={`e${i}`} className="page-ellipsis">…</span>
                  : <button key={n} className={`page-btn${n === filters.page ? ' active' : ''}`}
                      onClick={() => setFilters(f => ({ ...f, page: n }))}>{n}</button>
              )}
          </div>
          <button
            className="arrow static"
            disabled={filters.page === totalPages}
            onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
