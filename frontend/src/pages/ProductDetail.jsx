import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../AuthContext';

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
    const cart = JSON.parse(localStorage.getItem('cartly_cart') || '[]');
    const idx = cart.findIndex(i => i.product_id === product.product_id);
    if (idx >= 0) cart[idx].quantity += qty;
    else cart.push({ product_id: product.product_id, name: product.name, price: product.price, quantity: qty });
    localStorage.setItem('cartly_cart', JSON.stringify(cart));
    setAddMsg('Added to cart!');
    setTimeout(() => setAddMsg(''), 2000);
  };

  const submitReview = async (e) => {
    e.preventDefault();
    setReviewMsg('');
    try {
      await api.post('/reviews', { product_id: product.product_id, ...reviewForm });
      setReviewMsg('Review submitted!');
      const updated = await api.get(`/products/${id}`);
      setProduct(updated);
    } catch (err) {
      setReviewMsg(err.message);
    }
  };

  if (loading) return <div className="loading">Loading…</div>;
  if (!product) return null;

  const inStock = product.quantity_on_hand > 0;

  return (
    <div className="page">
      <button className="back-btn" onClick={() => navigate('/catalog')}>← Back to catalog</button>

      <div className="detail-layout">
        <div className="detail-img-wrap">
          <div className="detail-img-placeholder">{categoryIcon(product.category_name)}</div>
          {!inStock && <div className="oos-overlay">Out of Stock</div>}
        </div>

        <div className="detail-info">
          <p className="product-category">{product.category_name} · {product.supplier_name}</p>
          <h1 className="detail-name">{product.name}</h1>
          <div className="detail-rating">
            <Stars rating={product.avg_rating} />
            <span className="review-count">{product.avg_rating} ({product.review_count} reviews)</span>
          </div>
          <p className="detail-price">₹{Number(product.price).toLocaleString('en-IN')}</p>
          <p className="detail-desc">{product.description}</p>

          <div className="detail-stock">
            {inStock
              ? <span className="in-stock">✓ In Stock ({product.quantity_on_hand} units)</span>
              : <span className="out-stock">✗ Out of Stock</span>}
          </div>

          {inStock && user && user.role !== 'admin' && (
            <div className="cart-row">
              <div className="qty-control">
                <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                <span>{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.quantity_on_hand, q + 1))}>+</button>
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
            <div className="spec-row"><span>Category</span><span>{product.category_name}</span></div>
            <div className="spec-row"><span>Supplier</span><span>{product.supplier_name}, {product.supplier_city}</span></div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="reviews-section">
        <h2>Customer Reviews</h2>
        {product.reviews.length === 0 && <p className="empty">No reviews yet.</p>}
        <div className="review-list">
          {product.reviews.map(r => (
            <div key={r.review_id} className="review-card">
              <div className="review-header">
                <strong>{r.customer_name}</strong>
                <Stars rating={r.rating} />
                <span className="review-date">{new Date(r.created_at).toLocaleDateString('en-IN')}</span>
              </div>
              {r.title && <p className="review-title">{r.title}</p>}
              {r.comment && <p className="review-comment">{r.comment}</p>}
            </div>
          ))}
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

function categoryIcon(cat) {
  const icons = { Smartphones: '📱', Laptops: '💻', Tablets: '📲', Audio: '🎧', Wearables: '⌚', Cameras: '📷', Accessories: '🖱️' };
  return icons[cat] || '📦';
}
