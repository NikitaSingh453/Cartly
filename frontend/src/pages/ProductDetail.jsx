import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../AuthContext';
import { categoryIcon, categoryGradient } from '../utils/categoryHelpers';
import { geminiGenerate, aiCacheGet, aiCacheSet } from '../utils/gemini';
import { Sparkles, Loader2 } from 'lucide-react';
import ProductCard from '../components/ProductCard';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty]         = useState(1);
  const [addMsg, setAddMsg]   = useState('');
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '' });
  const [reviewMsg, setReviewMsg]   = useState('');
  const [aiSummary, setAiSummary]   = useState('');
  const [aiSumLoading, setAiSumLoading] = useState(false);
  const [aiRecs, setAiRecs]         = useState([]);
  const [aiRecsLoading, setAiRecsLoading] = useState(false);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(p => {
        setProduct(p);
        // Track recently viewed
        const pid = p.productId || p.product_id;
        const item = { product_id: pid, name: p.name, price: p.price, category_name: p.categoryName || p.category_name || '' };
        const prev = JSON.parse(localStorage.getItem('cartly_recently_viewed') || '[]');
        const next = [item, ...prev.filter(x => x.product_id !== pid)].slice(0, 10);
        localStorage.setItem('cartly_recently_viewed', JSON.stringify(next));
      })
      .catch(() => navigate('/catalog'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const addToCart = () => {
    const p = product;
    const pid = p.productId || p.product_id;
    const cart = JSON.parse(localStorage.getItem('cartly_cart') || '[]');
    const idx = cart.findIndex(i => i.product_id === pid);
    if (idx >= 0) cart[idx].quantity += qty;
    else cart.push({ product_id: pid, name: p.name, price: p.price, quantity: qty });
    localStorage.setItem('cartly_cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('storage'));
    setAddMsg('Added to cart!');
    setTimeout(() => setAddMsg(''), 2000);
  };

  // AI: summarize reviews when 3+ exist (delayed to avoid rate limits)
  useEffect(() => {
    const revList = product?.reviews || [];
    if (!product || revList.length < 3 || aiSummary) return;
    const timer = setTimeout(() => {
      const pid = product.productId || product.product_id;
      const cached = aiCacheGet(`review_sum_${pid}`);
      if (cached) { setAiSummary(cached); return; }
      setAiSumLoading(true);
      const reviewText = revList.slice(0, 15).map(r => `${r.rating}/5 stars: "${r.comment || r.title || ''}"`).join('\n');
      geminiGenerate(
        `Summarize these customer reviews for "${product.name}" in 2 sentences. Mention top pros and any cons. Be specific.\n\n${reviewText}`,
        { maxOutputTokens: 180 }
      ).then(r => { setAiSummary(r); aiCacheSet(`review_sum_${pid}`, r); }).catch(() => {}).finally(() => setAiSumLoading(false));
    }, 500);
    return () => clearTimeout(timer);
  }, [product?.productId, (product?.reviews || []).length]);

  // AI: load product recommendations (delayed 3s to avoid colliding with review summary)
  useEffect(() => {
    if (!product) return;
    const catName = product.categoryName || product.category_name || '';
    const pid = product.productId || product.product_id;
    const timer = setTimeout(() => {
      const cached = aiCacheGet(`recs_${pid}`);
      if (cached) { setAiRecs(cached); return; }
      setAiRecsLoading(true);
      api.get('/products?limit=20').then(async (d) => {
        const all = d.products || [];
        const others = all.filter(p => (p.productId || p.product_id) !== pid);
        const catalog = others.map(p => `ID:${p.productId || p.product_id} ${p.name} ₹${p.price}`).join('\n');
        const reply = await geminiGenerate(
          `A customer is viewing "${product.name}" (${catName}, ₹${product.price}). From this product list, pick 3 IDs of products they'd likely also want. Return ONLY a JSON array of 3 numbers, e.g. [1,5,12].\n\nProducts:\n${catalog}`,
          { temperature: 0.3, maxOutputTokens: 30 }
        );
        const match = reply.match(/\[\s*\d+[\s,\d]*\]/);
        if (match) {
          const ids = JSON.parse(match[0]);
          const recs = all.filter(p => ids.includes(p.productId || p.product_id)).slice(0, 3);
          setAiRecs(recs);
          aiCacheSet(`recs_${pid}`, recs);
        }
      }).catch(() => {}).finally(() => setAiRecsLoading(false));
    }, 3000);
    return () => clearTimeout(timer);
  }, [product?.productId]);

  const submitReview = async (e) => {
    e.preventDefault();
    setReviewMsg('');
    const pid = product.productId || product.product_id;
    try {
      await api.post('/reviews', { productId: pid, ...reviewForm });
      setReviewMsg('Review submitted!');
      const updated = await api.get(`/products/${id}`);
      setProduct(updated);
    } catch (err) {
      setReviewMsg(err.message);
    }
  };

  if (loading) return <div className="loading">Loading…</div>;
  if (!product) return null;

  const cat      = product.categoryName  || product.category_name;
  const sup      = product.supplierName  || product.supplier_name;
  const supCity  = product.supplierCity  || product.supplier_city;
  const stock    = product.quantityOnHand ?? product.quantity_on_hand ?? 0;
  const avgRat   = product.avgRating     || product.avg_rating     || 0;
  const revCount = product.reviewCount   || product.review_count   || 0;
  const reviews  = product.reviews       || [];
  const inStock  = stock > 0;

  return (
    <div className="page">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

      <div className="detail-layout">
        <div className="detail-img-wrap">
          <div className="detail-img-placeholder" style={{ background: categoryGradient(cat) }}>
            <span style={{ filter: 'drop-shadow(0 6px 20px rgba(0,0,0,.2))', position: 'relative', zIndex: 1 }}>
              {categoryIcon(cat)}
            </span>
          </div>
          {!inStock && <div className="oos-overlay">Out of Stock</div>}
        </div>

        <div className="detail-info">
          <p className="product-category">{cat} · {sup}</p>
          <h1 className="detail-name">{product.name}</h1>
          <div className="detail-rating">
            <Stars rating={avgRat} />
            <span className="review-count">{avgRat > 0 ? avgRat.toFixed(1) : '—'} ({revCount} reviews)</span>
          </div>
          <p className="detail-price">₹{Number(product.price).toLocaleString('en-IN')}</p>
          <p className="detail-desc">{product.description}</p>

          <div className="detail-stock">
            {inStock
              ? <span className="in-stock">✓ In Stock ({stock} units)</span>
              : <span className="out-stock">✗ Out of Stock</span>}
          </div>

          {inStock && user && user.role !== 'admin' && (
            <div className="cart-row">
              <div className="qty-control">
                <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                <span>{qty}</span>
                <button onClick={() => setQty(q => Math.min(stock, q + 1))}>+</button>
              </div>
              <button className="btn-primary" onClick={addToCart}>Add to Cart</button>
              {addMsg && <span className="add-msg">{addMsg}</span>}
            </div>
          )}
          {!user && (
            <p className="auth-hint"><Link to="/login">Sign in</Link> to purchase</p>
          )}

          <div className="spec-box">
            <div className="spec-row"><span>SKU</span><span>{product.sku}</span></div>
            <div className="spec-row"><span>Category</span><span>{cat}</span></div>
            <div className="spec-row"><span>Supplier</span><span>{sup}{supCity ? `, ${supCity}` : ''}</span></div>
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      {(aiRecsLoading || aiRecs.length > 0) && (
        <div className="ai-section">
          <h2 className="ai-section-title"><Sparkles size={16} /> AI Picks For You</h2>
          {aiRecsLoading ? (
            <div className="ai-loading-row"><Loader2 size={18} className="ai-spin" /> Finding similar products…</div>
          ) : (
            <div className="grid-4" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
              {aiRecs.map(p => <ProductCard key={p.productId || p.product_id} p={p} />)}
            </div>
          )}
        </div>
      )}

      {/* Reviews */}
      <div className="reviews-section">
        <h2>Customer Reviews</h2>

        {/* AI Review Summary */}
        {(aiSumLoading || aiSummary) && (
          <div className="ai-review-summary">
            <span className="ai-badge"><Sparkles size={12} /> AI Summary</span>
            {aiSumLoading
              ? <span className="ai-sum-loading"><Loader2 size={14} className="ai-spin" /> Analysing reviews…</span>
              : <p>{aiSummary}</p>
            }
          </div>
        )}

        {reviews.length === 0 && <p className="empty">No reviews yet.</p>}
        <div className="review-list">
          {reviews.map(r => {
            const rid  = r.reviewId   || r.review_id;
            const name = r.customerName || r.customer_name;
            const date = r.createdAt  || r.created_at;
            return (
              <div key={rid} className="review-card">
                <div className="review-header">
                  <strong>{name}</strong>
                  <Stars rating={r.rating} />
                  <span className="review-date">{new Date(date).toLocaleDateString('en-IN')}</span>
                </div>
                {r.title   && <p className="review-title">{r.title}</p>}
                {r.comment && <p className="review-comment">{r.comment}</p>}
              </div>
            );
          })}
        </div>

        {user && user.role !== 'admin' && (
          <form onSubmit={submitReview} className="review-form">
            <h3>Write a Review</h3>
            <div className="rating-input">
              {[1,2,3,4,5].map(n => (
                <button type="button" key={n}
                  className={`star-btn ${n <= reviewForm.rating ? 'active' : ''}`}
                  onClick={() => setReviewForm(f => ({ ...f, rating: n }))}>★</button>
              ))}
            </div>
            <input placeholder="Review title" value={reviewForm.title}
              onChange={e => setReviewForm(f => ({ ...f, title: e.target.value }))} />
            <textarea rows={3} placeholder="Your review…" value={reviewForm.comment}
              onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))} />
            {reviewMsg && <p className={reviewMsg.includes('!') ? 'form-success' : 'form-error'}>{reviewMsg}</p>}
            <button type="submit" className="btn-secondary">Submit Review</button>
          </form>
        )}
      </div>
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
