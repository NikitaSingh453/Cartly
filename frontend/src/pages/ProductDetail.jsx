import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../AuthContext';
import { categoryIcon, categoryGradient } from './Catalog';

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

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(setProduct)
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

  const submitReview = async (e) => {
    e.preventDefault();
    setReviewMsg('');
    const pid = product.productId || product.product_id;
    try {
      await api.post('/reviews', { product_id: pid, ...reviewForm });
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
            <p className="auth-hint"><a href="/login">Sign in</a> to purchase</p>
          )}

          <div className="spec-box">
            <div className="spec-row"><span>SKU</span><span>{product.sku}</span></div>
            <div className="spec-row"><span>Category</span><span>{cat}</span></div>
            <div className="spec-row"><span>Supplier</span><span>{sup}{supCity ? `, ${supCity}` : ''}</span></div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="reviews-section">
        <h2>Customer Reviews</h2>
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
