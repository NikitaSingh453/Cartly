import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import CartlyLogo from '../components/CartlyLogo';
import { api } from '../api';
import { categoryIcon, categoryGradient } from '../utils/categoryHelpers';
import { useAuth } from '../AuthContext';

const CATEGORIES = [
  { name: 'Smartphones',  icon: '📱', color: '#EEF2FF', count: '120+ products' },
  { name: 'Laptops',      icon: '💻', color: '#F0FDF4', count: '80+ products' },
  { name: 'Audio',        icon: '🎧', color: '#FFF7ED', count: '95+ products' },
  { name: 'Smartwatches', icon: '⌚', color: '#FDF4FF', count: '60+ products' },
  { name: 'Gaming',       icon: '🎮', color: '#FFF1F2', count: '70+ products' },
  { name: 'Accessories',  icon: '🖱️', color: '#F0F9FF', count: '200+ products' },
];

const TRUST = [
  { icon: '🔒', title: 'Secure Checkout',       desc: 'End-to-end encrypted payments for peace of mind.' },
  { icon: '✅', title: 'Genuine Products',       desc: 'Every product sourced directly from verified suppliers.' },
  { icon: '📦', title: 'Order Tracking',         desc: 'Real-time updates on every order from dispatch to door.' },
  { icon: '🤖', title: 'AI-Powered Discovery',   desc: 'Find the right gadget faster with multimodal search.' },
];

function Stars({ rating }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span className="home-product-stars">
      {'★'.repeat(full)}{half ? '½' : ''}{'☆'.repeat(5 - full - (half ? 1 : 0))}
    </span>
  );
}

function ProductCard({ p }) {
  const navigate = useNavigate();
  const [wished, setWished] = useState(false);
  const [added, setAdded] = useState(false);
  const id    = p.productId || p.product_id || p.id;
  const cat   = p.categoryName || p.category_name || '';
  const avg   = p.avgRating   || p.avg_rating   || 0;
  const cnt   = p.reviewCount || p.review_count || 0;
  const sup   = p.supplierName || p.supplier_name || p.brand || '';

  const addToCart = (e) => {
    e.stopPropagation();
    const cart = JSON.parse(localStorage.getItem('cartly_cart') || '[]');
    const existing = cart.find(i => i.product_id === id);
    if (existing) { existing.quantity += 1; }
    else { cart.push({ product_id: id, name: p.name, price: p.price, quantity: 1 }); }
    localStorage.setItem('cartly_cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('storage'));
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="home-product-card" onClick={() => navigate(`/products/${id}`)}>
      <div className="home-product-img" style={{ background: categoryGradient(cat) }}>
        <span style={{ fontSize: '3.5rem', filter: 'drop-shadow(0 4px 10px rgba(0,0,0,.18))' }}>
          {categoryIcon(cat)}
        </span>
        <button
          className="home-product-wishlist"
          onClick={e => { e.stopPropagation(); setWished(w => !w); }}
          title="Wishlist"
        >
          {wished ? '❤️' : '♡'}
        </button>
      </div>
      <div className="home-product-body">
        <div className="home-product-brand">{sup}</div>
        <div className="home-product-name">{p.name}</div>
        <div className="home-product-rating">
          <Stars rating={avg} />
          <span>{avg > 0 ? `${avg} (${cnt.toLocaleString()})` : 'No reviews yet'}</span>
        </div>
        <div className="home-product-price-row">
          <span className="home-product-price">₹{Number(p.price).toLocaleString('en-IN')}</span>
        </div>
      </div>
      <div className="home-product-footer">
        <button
          className="btn-add-cart"
          style={added ? { background: 'var(--green)' } : {}}
          onClick={addToCart}
        >
          {added ? '✓ Added!' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [recording, setRecording] = useState(false);
  const [trending, setTrending] = useState([]);
  const [aiPicks, setAiPicks] = useState([]);

  useEffect(() => {
    api.get('/products?limit=8&page=1').then(data => {
      const products = data.products || [];
      setTrending(products.slice(0, 8));
      setAiPicks(products.slice(0, 4));
    }).catch(() => {});
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImagePreview(url);
  };

  const handleVoice = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Voice search is not supported in your browser. Try Chrome.');
      return;
    }
    setRecording(r => !r);
  };

  const handleSearch = () => {
    if (searchQuery.trim() || imagePreview) navigate('/catalog');
  };

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section style={{ borderBottom: '1.5px solid var(--border)' }}>
        <div className="hero">
          <div className="hero-left">
            <div className="hero-eyebrow">
              <span className="hero-eyebrow-dot" />
              {user ? `WELCOME BACK, ${user.name?.split(' ')[0].toUpperCase()}` : 'THE FUTURE OF SHOPPING'}
            </div>
            <h1 className="hero-title">
              {user ? <>Your next great<br /><span>find awaits.</span></> : <>Discover more.<br /><span>Shop smarter.</span></>}
            </h1>
            <p className="hero-sub">
              {user
                ? `Hey ${user.name?.split(' ')[0]}! Search by text, image or voice — your cart and orders are always saved.`
                : 'Search with words, a picture, or your voice. Let Cartly help you find the right tech for you.'
              }
            </p>

            {/* Multimodal search */}
            <div className="hero-search">
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="upload"
                  style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }}
                />
              )}
              <input
                type="text"
                placeholder="Search gadgets, describe what you need…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
              />
              <div className="hero-search-divider" />
              <label className="hero-search-icon-btn" title="Upload image" style={{ cursor: 'pointer' }}>
                🖼️
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
              </label>
              <button
                className="hero-search-icon-btn"
                title={recording ? 'Stop recording' : 'Voice search'}
                onClick={handleVoice}
                style={recording ? { color: '#dc2626', background: '#fee2e2' } : {}}
              >
                {recording ? '⏹️' : '🎙️'}
              </button>
              <button className="hero-search-btn" onClick={handleSearch}>Search</button>
            </div>

            <div className="hero-search-hints">
              {['Best earbuds under ₹2,000', 'Mechanical keyboard for coding', 'Laptop for video editing'].map(hint => (
                <button
                  key={hint}
                  className="hero-hint-chip"
                  onClick={() => { setSearchQuery(hint); navigate('/catalog'); }}
                >
                  {hint}
                </button>
              ))}
            </div>

            <div className="hero-cta-row">
              <Link to="/catalog"><button className="btn-primary">Explore gadgets</button></Link>
              {user ? (
                <>
                  <Link to="/orders"><button className="btn-secondary">My Orders</button></Link>
                  <Link to="/cart"><button className="btn-secondary">My Cart</button></Link>
                </>
              ) : (
                <>
                  <Link to="/login"><button className="btn-secondary">Sign In</button></Link>
                </>
              )}
            </div>
          </div>

          {/* Right: gadget collage */}
          <div className="hero-right">
            {[
              { emoji: '🎧', bg: '#1a1a2e', label: 'Audio',     dark: true },
              { emoji: '📱', bg: '#0a192f', label: 'Mobile',    dark: true },
              { emoji: '⌚', bg: '#e8f0fe', label: 'Wearables', dark: false },
              { emoji: '💻', bg: '#f5f5f7', label: 'Laptops',   dark: false },
            ].map((tile, i) => (
              <div
                key={i}
                className="hero-gadget-tile"
                style={{ background: tile.bg, flexDirection: 'column', gap: '.45rem' }}
              >
                <span style={{ fontSize: i === 0 ? '4rem' : '3rem' }}>{tile.emoji}</span>
                <span style={{
                  fontSize: '.7rem',
                  fontWeight: 700,
                  letterSpacing: '.06em',
                  textTransform: 'uppercase',
                  color: tile.dark ? 'rgba(255,255,255,.55)' : 'var(--text-dim)',
                  position: 'relative',
                  zIndex: 1,
                }}>{tile.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ── Categories ───────────────────────────────────────────────────── */}
      <section className="home-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-sub">Browse our curated selection of tech categories</p>
          </div>
          <Link to="/catalog" className="section-link">View all →</Link>
        </div>
        <div className="category-grid">
          {CATEGORIES.map(cat => (
            <Link to="/catalog" key={cat.name} className="category-card">
              <div className="category-card-icon" style={{ background: cat.color }}>
                {cat.icon}
              </div>
              <div className="category-card-name">{cat.name}</div>
              <div className="category-card-count">{cat.count}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Trending ─────────────────────────────────────────────────────── */}
      <section className="home-section" style={{ background: 'var(--surface)', borderTop: '1.5px solid var(--border)', borderBottom: '1.5px solid var(--border)', maxWidth: '100%', padding: 0 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '4rem 2rem' }}>
          <div className="section-header">
            <div>
              <h2 className="section-title">Trending Products</h2>
              <p className="section-sub">What everyone's adding to cart right now</p>
            </div>
            <Link to="/catalog" className="section-link">View all →</Link>
          </div>
          <div className="trending-grid">
            {trending.map(p => <ProductCard key={p.productId || p.product_id} p={p} />)}
          </div>
        </div>
      </section>

      {/* ── AI Picks ─────────────────────────────────────────────────────── */}
      <div className="ai-section">
        <div className="ai-section-inner">
          <div className="section-header">
            <div>
              <div className="ai-badge">✨ AI Powered</div>
              <h2 className="section-title">Picked for your tech taste</h2>
              <p className="section-sub">Personalized recommendations based on what you browse and love</p>
            </div>
            <Link to="/catalog" className="section-link">See more picks →</Link>
          </div>
          <div className="trending-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
            {aiPicks.map(p => {
              const id  = p.productId || p.product_id;
              const cat = p.categoryName || p.category_name || '';
              return (
                <div
                  key={id}
                  className="home-product-card"
                  onClick={() => navigate(`/products/${id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="home-product-img" style={{ background: categoryGradient(cat) }}>
                    <span style={{ fontSize: '3.5rem', filter: 'drop-shadow(0 4px 10px rgba(0,0,0,.18))' }}>
                      {categoryIcon(cat)}
                    </span>
                    <span className="home-product-badge badge-ai-pick">AI Pick</span>
                  </div>
                  <div className="home-product-body">
                    <div className="home-product-brand">{p.supplierName || p.supplier_name || ''}</div>
                    <div className="home-product-name">{p.name}</div>
                    <div style={{ fontSize: '.78rem', color: 'var(--purple)', marginTop: '.2rem' }}>✨ Recommended for you</div>
                    <div className="home-product-price-row">
                      <span className="home-product-price">₹{Number(p.price).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                  <div className="home-product-footer">
                    <button className="btn-add-cart" style={{ background: 'var(--purple)' }}
                      onClick={e => { e.stopPropagation(); navigate(`/products/${id}`); }}
                    >
                      View Product
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Trust strip ──────────────────────────────────────────────────── */}
      <div className="trust-strip">
        <div className="trust-strip-inner">
          {TRUST.map(t => (
            <div key={t.title}>
              <div className="trust-item-icon">{t.icon}</div>
              <div className="trust-item-title">{t.title}</div>
              <div className="trust-item-desc">{t.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="footer">
        <div className="footer-inner">
          <div>
            <div className="footer-logo"><CartlyLogo size={22} dark /> Cartly</div>
            <p className="footer-tagline">Discover more. Shop smarter. Your AI-powered destination for tech and gadgets.</p>
            <div className="footer-newsletter">
              <input type="email" placeholder="Your email address" />
              <button className="footer-newsletter-btn">Subscribe</button>
            </div>
          </div>
          <div>
            <div className="footer-col-title">Shop</div>
            <ul className="footer-links">
              {['Smartphones', 'Laptops', 'Audio', 'Smartwatches', 'Gaming', 'Accessories'].map(l => (
                <li key={l}><Link to="/catalog">{l}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <div className="footer-col-title">Support</div>
            <ul className="footer-links">
              {['Help Center', 'Track Order', 'Returns', 'Contact Us', 'Shipping Info'].map(l => (
                <li key={l}><a href="#">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <div className="footer-col-title">Company</div>
            <ul className="footer-links">
              {['About Cartly', 'Careers', 'Press', 'Blog', 'Partners'].map(l => (
                <li key={l}><a href="#">{l}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Cartly. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
