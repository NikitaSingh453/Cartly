import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const CATEGORIES = [
  { name: 'Smartphones',  icon: '📱', color: '#EEF2FF', count: '120+ products' },
  { name: 'Laptops',      icon: '💻', color: '#F0FDF4', count: '80+ products' },
  { name: 'Audio',        icon: '🎧', color: '#FFF7ED', count: '95+ products' },
  { name: 'Smartwatches', icon: '⌚', color: '#FDF4FF', count: '60+ products' },
  { name: 'Gaming',       icon: '🎮', color: '#FFF1F2', count: '70+ products' },
  { name: 'Accessories',  icon: '🖱️', color: '#F0F9FF', count: '200+ products' },
];

const TRENDING = [
  { id: 9,  brand: 'Sony',     name: 'WH-1000XM5 Headphones',     price: 29990, original: 34990, rating: 4.8, reviews: 2341, badge: 'Bestseller', color: '#1a1a2e', emoji: '🎧' },
  { id: 2,  brand: 'Apple',    name: 'iPhone 15 Pro Max',          price: 159900,                 rating: 4.9, reviews: 1823, badge: 'New',        color: '#F5F5F7', emoji: '📱' },
  { id: 13, brand: 'Logitech', name: 'MX Master 3S Mouse',         price: 8995,  original: 10995, rating: 4.7, reviews: 987,  badge: 'AI Pick',    color: '#e8f4ff', emoji: '🖱️' },
  { id: 5,  brand: 'Apple',    name: 'MacBook Pro 14" M3 Pro',     price: 199900,                 rating: 4.9, reviews: 3102, badge: 'Bestseller', color: '#f5f5f7', emoji: '💻' },
  { id: 11, brand: 'Apple',    name: 'Watch Series 9 45mm',        price: 44900, original: 49900, rating: 4.8, reviews: 1456, badge: 'New',        color: '#e8f0fe', emoji: '⌚' },
  { id: 17, brand: 'Apple',    name: 'AirPods Pro (2nd Gen)',       price: 24900, original: 26900, rating: 4.9, reviews: 4210, badge: 'Bestseller', color: '#fff9f0', emoji: '🎵' },
  { id: 18, brand: 'Asus',     name: 'ROG Strix G16 Gaming',       price: 159999,                 rating: 4.7, reviews: 632,  badge: 'AI Pick',    color: '#1a0a2e', emoji: '🎮' },
  { id: 1,  brand: 'Samsung',  name: 'Galaxy S24 Ultra',           price: 134999, original: 144999, rating: 4.8, reviews: 2876, badge: 'New',      color: '#0a192f', emoji: '📱' },
];

const AI_PICKS = [
  { id: 9,  brand: 'Sony',   name: 'WH-1000XM5',      price: 29990, emoji: '🎧', color: '#1a1a2e', reason: 'Based on your audio interests' },
  { id: 13, brand: 'Logi',   name: 'MX Master 3S',    price: 8995,  emoji: '🖱️', color: '#e8f4ff', reason: 'Perfect for your setup' },
  { id: 5,  brand: 'Apple',  name: 'MacBook Pro M3',  price: 199900, emoji: '💻', color: '#f5f5f7', reason: 'Matches your usage pattern' },
  { id: 17, brand: 'Apple',  name: 'AirPods Pro 2',   price: 24900, emoji: '🎵', color: '#fff9f0', reason: 'Trending in your category' },
];

const TRUST = [
  { icon: '🔒', title: 'Secure Checkout',       desc: 'End-to-end encrypted payments for peace of mind.' },
  { icon: '✅', title: 'Genuine Products',       desc: 'Every product sourced directly from verified suppliers.' },
  { icon: '📦', title: 'Order Tracking',         desc: 'Real-time updates on every order from dispatch to door.' },
  { icon: '🤖', title: 'AI-Powered Discovery',   desc: 'Find the right gadget faster with multimodal search.' },
];

function badgeClass(badge) {
  if (badge === 'Bestseller') return 'badge-bestseller';
  if (badge === 'New')        return 'badge-new';
  if (badge === 'AI Pick')    return 'badge-ai-pick';
  return '';
}

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
  const discount = p.original ? Math.round((1 - p.price / p.original) * 100) : null;

  return (
    <div className="home-product-card" onClick={() => navigate(`/products/${p.id}`)}>
      <div className="home-product-img" style={{ background: p.color }}>
        <span>{p.emoji}</span>
        {p.badge && <span className={`home-product-badge ${badgeClass(p.badge)}`}>{p.badge}</span>}
        <button
          className="home-product-wishlist"
          onClick={e => { e.stopPropagation(); setWished(w => !w); }}
          title="Wishlist"
        >
          {wished ? '❤️' : '♡'}
        </button>
      </div>
      <div className="home-product-body">
        <div className="home-product-brand">{p.brand}</div>
        <div className="home-product-name">{p.name}</div>
        <div className="home-product-rating">
          <Stars rating={p.rating} />
          <span>{p.rating} ({p.reviews.toLocaleString()})</span>
        </div>
        <div className="home-product-price-row">
          <span className="home-product-price">₹{p.price.toLocaleString()}</span>
          {p.original && <span className="home-product-original">₹{p.original.toLocaleString()}</span>}
          {discount && <span className="home-product-discount">{discount}% off</span>}
        </div>
      </div>
      <div className="home-product-footer">
        <button
          className="btn-add-cart"
          onClick={e => {
            e.stopPropagation();
            const cart = JSON.parse(localStorage.getItem('cartly_cart') || '[]');
            const existing = cart.find(i => i.id === p.id);
            if (existing) { existing.quantity += 1; }
            else { cart.push({ id: p.id, name: p.name, price: p.price, emoji: p.emoji, quantity: 1 }); }
            localStorage.setItem('cartly_cart', JSON.stringify(cart));
            window.dispatchEvent(new Event('storage'));
          }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [recording, setRecording] = useState(false);

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
              THE FUTURE OF SHOPPING
            </div>
            <h1 className="hero-title">
              Discover more.<br />
              <span>Shop smarter.</span>
            </h1>
            <p className="hero-sub">
              Search with words, a picture, or your voice. Let Cartly help you find the right tech for you.
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
              <button className="btn-secondary">How AI shopping works</button>
            </div>
          </div>

          {/* Right: gadget collage */}
          <div className="hero-right">
            {[
              { emoji: '🎧', bg: '#1a1a2e' },
              { emoji: '📱', bg: '#0a192f' },
              { emoji: '⌚', bg: '#e8f0fe' },
              { emoji: '💻', bg: '#f5f5f7' },
            ].map((tile, i) => (
              <div
                key={i}
                className="hero-gadget-tile"
                style={{ background: tile.bg }}
              >
                {tile.emoji}
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
            {TRENDING.map(p => <ProductCard key={p.id} p={p} />)}
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
            {AI_PICKS.map(p => (
              <div
                key={p.id}
                className="home-product-card"
                onClick={() => navigate(`/products/${p.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <div className="home-product-img" style={{ background: p.color }}>
                  <span>{p.emoji}</span>
                  <span className="home-product-badge badge-ai-pick">AI Pick</span>
                </div>
                <div className="home-product-body">
                  <div className="home-product-brand">{p.brand}</div>
                  <div className="home-product-name">{p.name}</div>
                  <div style={{ fontSize: '.78rem', color: 'var(--purple)', marginTop: '.2rem' }}>✨ {p.reason}</div>
                  <div className="home-product-price-row">
                    <span className="home-product-price">₹{p.price.toLocaleString()}</span>
                  </div>
                </div>
                <div className="home-product-footer">
                  <Link to={`/products/${p.id}`} style={{ display: 'block', width: '100%' }}>
                    <button className="btn-add-cart" style={{ background: 'var(--purple)' }}>View Product</button>
                  </Link>
                </div>
              </div>
            ))}
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
            <div className="footer-logo">⚡ Cartly</div>
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
