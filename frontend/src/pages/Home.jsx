import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowRight, Mail, Zap, Clock3, ShoppingCart, Globe, Link2, ExternalLink, ArrowUp } from "lucide-react";
import { api } from "../api";
import ProductCard from "../components/ProductCard";
import Icon from "../components/Icon";
import { getProductSVG } from "../components/ProductSVG";

// ── Static assets ────────────────────────────────────────────────────────────
import primeImg     from "../assets/prime.png";
import heroImg      from "../assets/hero.jpg";
import giftImg      from "../assets/c-gift.png";
import exclusiveArt from "../assets/exclusive-art.png";
import trackArt     from "../assets/track-art.png";
import envelope     from "../assets/envelope.png";
import phonePng     from "../assets/phone.png";
import appstore     from "../assets/appstore.png";
import gplay        from "../assets/gplay.png";
import cLaptop      from "../assets/c-laptop.png";
import cMobile      from "../assets/c-mobile.png";
import cAudio       from "../assets/c-audio.png";
import cWatch       from "../assets/c-watch.png";
import cCamera      from "../assets/c-camera.png";
import cBag         from "../assets/c-bag.png";
import paymentsImg  from "../assets/payments.png";

// ── Static data ───────────────────────────────────────────────────────────────
const SIDEBAR_CATS = [
  { name: "Laptops",     icon: "Laptop",      count: 48, categoryId: 3 },
  { name: "Tablets",     icon: "Tablet",      count: 32, categoryId: 4 },
  { name: "Audio",       icon: "Headphones",  count: 24, categoryId: 5 },
  { name: "Wearables",   icon: "Watch",       count: 20, categoryId: 6 },
  { name: "Cameras",     icon: "Camera",      count: 18, categoryId: 8 },
  { name: "Accessories", icon: "ShoppingBag", count: 30, categoryId: 7 },
];

const BRANDS = [
  { name: "Apple",    count: 48 },
  { name: "Samsung",  count: 42 },
  { name: "Sony",     count: 28 },
  { name: "Logitech", count: 20 },
];

const CHIPS = [
  { name: "Laptops",     img: cLaptop, categoryId: 3 },
  { name: "Mobiles",     img: cMobile, categoryId: 2 },
  { name: "Audio",       img: cAudio,  categoryId: 5 },
  { name: "Wearables",   img: cWatch,  categoryId: 6 },
  { name: "Cameras",     img: cCamera, categoryId: 8 },
  { name: "Accessories", img: cBag,    categoryId: 7 },];

const DISCOUNT_BADGES = [
  { label: 40, color: "green" },
  { label: 30, color: "red" },
  { label: 25, color: "purple" },
  { label: 20, color: "green" },
];

const FOOTER_COLS = [
  ["Quick Links",       ["Home", "Shop", "Wishlist", "Orders", "Deals"]],
  ["Customer Support",  ["Help Center", "Track Order", "Returns & Refunds", "Contact Us"]],
  ["About Cartly",      ["Our Story", "Careers", "Privacy Policy", "Terms of Service"]],
];
const FOOTER_PATHS = { Home: "/", Shop: "/catalog", Orders: "/orders", "Track Order": "/orders" };

// ── Countdown timer ───────────────────────────────────────────────────────────
function useCountdown(seconds) {
  const [s, setS] = useState(seconds);
  useEffect(() => {
    const t = setInterval(() => setS((v) => (v > 0 ? v - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);
  return [Math.floor(s / 86400), Math.floor((s % 86400) / 3600), Math.floor((s % 3600) / 60), s % 60];
}

// ── Map backend product to ProductCard shape ──────────────────────────────────
function toCardShape(p, badgeIdx) {
  const badge = DISCOUNT_BADGES[badgeIdx % 4];
  const off   = badge.label;
  return {
    id:      p.productId || p.product_id,
    name:    p.name,
    price:   p.price,
    old:     Math.round(p.price / (1 - off / 100)),
    off,
    color:   badge.color,
    rating:  p.avgRating || p.avg_rating || 0,
    reviews: (() => { const rc = p.reviewCount || p.review_count || 0; return rc > 0 ? (rc >= 1000 ? `${(rc/1000).toFixed(1)}k` : `${rc}`) : null; })(),
    _raw: p,
  };
}

function toTrendShape(p) {
  return {
    id:      p.productId || p.product_id,
    name:    p.name,
    price:   p.price,
    rating:  p.avgRating || p.avg_rating || 0,
    reviews: p.reviewCount || p.review_count
      ? `${Number(p.reviewCount || p.review_count).toLocaleString()}`
      : null,
    _raw: p,
  };
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
function Sidebar() {
  const navigate = useNavigate();
  const [max, setMax] = useState(100000);
  const [brand, setBrand] = useState('');

  const applyPrice = () => navigate(max < 100000 ? `/catalog?max_price=${max}` : '/catalog');
  const toggleBrand = (name) => {
    const next = brand === name ? '' : name;
    setBrand(next);
    navigate(next ? `/catalog?search=${encodeURIComponent(next)}` : '/catalog');
  };

  return (
    <aside className="sidebar">
      <div className="prime">
        <img src={primeImg} alt="Upgrade to Cartly Prime" />
        <a className="hotspot" style={{ left: "7.5%", top: "68%", width: "40%", height: "14%" }}
          href="#" aria-label="Explore Benefits" />
      </div>

      <div className="side-block">
        <div className="side-head">
          <h4>Categories</h4>
          <Link to="/catalog" className="link-sm">See all <ArrowRight size={11} /></Link>
        </div>
        <ul className="cat-list">
          {SIDEBAR_CATS.map((c) => (
            <li key={c.name}>
              <Icon name={c.icon} size={14} />
              <span><Link to={`/catalog?category=${c.categoryId}`} style={{ color: "inherit", textDecoration: "none" }}>{c.name}</Link></span>
              <em>{c.count}</em>
            </li>
          ))}
        </ul>
      </div>

      <div className="side-block">
        <h4>Price Range</h4>
        <input type="range" min="0" max="100000" step="500" value={max}
          onChange={(e) => setMax(+e.target.value)} className="range" />
        <div className="price-inputs">
          <span>₹0</span>
          <span>₹{max.toLocaleString("en-IN")}{max < 100000 ? '' : '+'}</span>
        </div>
        {max < 100000 && (
          <button className="btn btn-sm" style={{ marginTop: '.5rem', width: '100%' }} onClick={applyPrice}>
            Shop under ₹{max.toLocaleString("en-IN")}
          </button>
        )}
      </div>

      <div className="side-block">
        <h4>Brand</h4>
        <ul className="check-list">
          {BRANDS.map((b) => (
            <li key={b.name}>
              <label style={{ cursor: 'pointer' }} onClick={() => toggleBrand(b.name)}>
                <input type="checkbox" readOnly checked={brand === b.name} /> {b.name}
              </label>
              <em>{b.count}</em>
            </li>
          ))}
        </ul>
        <button className="link-sm plain" style={{ background: "none", border: 0, cursor: "pointer" }}>
          Show more <ChevronRight size={11} />
        </button>
      </div>

      <div className="side-block">
        <h4>Rating</h4>
        <ul className="check-list">
          {[["4 & above", 72, 4], ["3 & above", 98, 3]].map(([t, n, s]) => (
            <li key={t}>
              <label style={{ cursor: 'pointer' }} onClick={() => navigate('/catalog')}>
                <input type="checkbox" readOnly />
                <span className="stars">
                  {Array.from({ length: s }).map((_, i) => (
                    <svg key={i} width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                    </svg>
                  ))}
                </span>
                {t} ({n})
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div className="side-block">
        <h4>Availability</h4>
        <ul className="check-list">
          <li><label><input type="checkbox" defaultChecked /> In Stock (✓)</label></li>
        </ul>
      </div>
    </aside>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function Hero() {
  const [i, setI] = useState(0);
  const total = 3;
  return (
    <section className="hero">
      <img className="hero-img" src={heroImg} alt="Upgrade Your Tech. Up to 50% off." />
      <a className="hotspot" style={{ left: "8.2%", top: "78%", width: "18.6%", height: "17%" }}
        href="/catalog" aria-label="Shop the Sale" />
      <button className="arrow left" onClick={() => setI((i + total - 1) % total)} aria-label="Previous">
        <ChevronLeft size={16} />
      </button>
      <button className="arrow right" onClick={() => setI((i + 1) % total)} aria-label="Next">
        <ChevronRight size={16} />
      </button>
      <div className="dots">
        {Array.from({ length: total }).map((_, n) => (
          <i key={n} className={n === i ? "on" : ""} onClick={() => setI(n)} />
        ))}
      </div>
    </section>
  );
}

// ── Category chips ────────────────────────────────────────────────────────────
function CategoryChips() {
  return (
    <section className="chips">
      {CHIPS.map((c) => (
        <Link key={c.name} to={`/catalog?category=${c.categoryId}`} className="chip">
          <img src={c.img} alt="" /> {c.name}
        </Link>
      ))}
      <Link to="/catalog" className="chip special">
        <img className="gift" src={giftImg} alt="" />
        <span>
          <strong>Special Offers</strong>
          <small>Just for You <ArrowRight size={10} /></small>
        </span>
      </Link>
    </section>
  );
}

// ── Flash Sale ────────────────────────────────────────────────────────────────
function FlashSale({ products }) {
  const navigate = useNavigate();
  const parts  = useCountdown(86400 + 12 * 3600 + 45 * 60 + 30);
  const labels = ["Days", "Hrs", "Min", "Sec"];

  const addToCart = (p) => {
    const id   = p.id || p.productId || p.product_id;
    const cart = JSON.parse(localStorage.getItem("cartly_cart") || "[]");
    const ex   = cart.find((i) => i.product_id === id);
    if (ex) ex.quantity += 1;
    else cart.push({ product_id: id, name: p.name, price: p.price, quantity: 1 });
    localStorage.setItem("cartly_cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <section className="panel">
      <div className="panel-head">
        <h2>Flash Sale <Zap className="bolt" size={20} fill="currentColor" /></h2>
        <div className="timer">
          {parts.map((v, n) => (
            <div key={n} className="timer-wrap">
              <div className="time-box">
                <b>{String(v).padStart(2, "0")}</b>
                <small>{labels[n]}</small>
              </div>
              {n < 3 && <span className="colon">:</span>}
            </div>
          ))}
        </div>
        <Link to="/catalog" className="link-sm view-all">View All Deals <ArrowRight size={11} /></Link>
      </div>
      <div className="grid-4">
        {products.map((p, i) => (
          <ProductCard key={p.id} p={p} onAdd={addToCart} />
        ))}
      </div>
    </section>
  );
}

// ── Banners ───────────────────────────────────────────────────────────────────
function Banners() {
  const navigate = useNavigate();
  return (
    <section className="banners">
      <div className="banner exclusive">
        <div className="banner-text">
          <h3>Exclusive Deals</h3>
          <p className="big">Up to <b>70% OFF</b></p>
          <p>on top accessories</p>
          <button className="btn btn-sm" onClick={() => navigate("/catalog")}>
            Shop Now <ArrowRight size={11} />
          </button>
        </div>
        <img className="banner-art" src={exclusiveArt} alt="" />
      </div>
      <div className="banner track">
        <div className="banner-text">
          <h3>Track Your Order</h3>
          <p>Stay updated with<br />real-time delivery status.</p>
          <button className="btn btn-sm" onClick={() => navigate("/orders")}>
            Track Order <ArrowRight size={11} />
          </button>
        </div>
        <img className="banner-art" src={trackArt} alt="" />
      </div>
    </section>
  );
}

// ── Trending ──────────────────────────────────────────────────────────────────
function Trending({ products }) {
  const gridRef = useRef(null);
  const scroll = (dir) => gridRef.current?.scrollBy({ left: dir * 260, behavior: 'smooth' });

  const addToCart = (p) => {
    const id   = p.id || p.productId || p.product_id;
    const cart = JSON.parse(localStorage.getItem("cartly_cart") || "[]");
    const ex   = cart.find((i) => i.product_id === id);
    if (ex) ex.quantity += 1;
    else cart.push({ product_id: id, name: p.name, price: p.price, quantity: 1 });
    localStorage.setItem("cartly_cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <section>
      <div className="section-head">
        <h2>Trending Now 🔥</h2>
        <div className="arrows">
          <button className="arrow static" onClick={() => scroll(-1)}><ChevronLeft size={16} /></button>
          <button className="arrow static" onClick={() => scroll(1)}><ChevronRight size={16} /></button>
        </div>
      </div>
      <div ref={gridRef} className="grid-5" style={{ overflowX: 'auto', scrollbarWidth: 'none', flexWrap: 'nowrap' }}>
        {products.map((p) => (
          <ProductCard key={p.id} p={p} onAdd={addToCart} />
        ))}
      </div>
    </section>
  );
}

// ── Recently Viewed ───────────────────────────────────────────────────────────
function RecentlyViewed({ products }) {
  const navigate = useNavigate();
  if (products.length === 0) return null;
  return (
    <section>
      <div className="section-head">
        <h2>Recently Viewed <Clock3 size={16} className="clock" /></h2>
        <Link to="/catalog" className="link-sm">View All <ArrowRight size={11} /></Link>
      </div>
      <div className="recent">
        {products.map((p, n) => (
          <div key={n} className="recent-item" style={{ cursor: 'pointer' }}
            onClick={() => navigate(`/products/${p.product_id}`)}>
            <div className="svg-thumb" style={{ position: 'relative', width: '100%', height: '100%' }}>
              {getProductSVG(p.name, p.category_name, 60)}
            </div>
          </div>
        ))}
        <button className="recent-more" aria-label="More"><ChevronRight size={16} /></button>
      </div>
    </section>
  );
}

// ── Newsletter ────────────────────────────────────────────────────────────────
function Newsletter() {
  const [email, setEmail] = useState("");
  const [done,  setDone]  = useState(false);
  return (
    <section className="newsletter">
      <Mail className="mail" size={42} strokeWidth={1.3} />
      <div className="nl-copy">
        <h3>Stay in the loop</h3>
        <p>Get the latest deals and product updates straight to your inbox.</p>
      </div>
      <div className="nl-form-wrap">
        <form className="nl-form" onSubmit={(e) => { e.preventDefault(); if (email) setDone(true); }}>
          <input type="email" placeholder="Enter your email address"
            value={email} onChange={(e) => setEmail(e.target.value)} />
          <button className="btn">{done ? "Subscribed ✓" : "Subscribe"}</button>
        </form>
        <img className="nl-envelope" src={envelope} alt="" />
      </div>
      <div className="nl-app">
        <h3>Download Our App</h3>
        <p>Shop on the go, anytime!</p>
        <div className="stores">
          <a href="#"><img src={appstore} alt="Download on the App Store" /></a>
          <a href="#"><img src={gplay}    alt="Get it on Google Play" /></a>
        </div>
        <img className="phone" src={phonePng} alt="" />
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="f-brand">
          <Link to="/" className="logo" style={{ fontSize: 18 }}>
            <ShoppingCart size={24} /> <span>Cartly</span>
          </Link>
          <p>Shop. Save. Smile.</p>
          <div className="socials">
            {[Globe, Link2, ExternalLink, Globe, Link2].map((Icon, n) => (
              <a key={n} href="#" aria-label="social"><Icon size={16} /></a>
            ))}
          </div>
        </div>

        {FOOTER_COLS.map(([title, items]) => (
          <div key={title} className="f-col">
            <h4>{title}</h4>
            <ul>
              {items.map((item) => (
                <li key={item}>
                  {FOOTER_PATHS[item]
                    ? <Link to={FOOTER_PATHS[item]}>{item}</Link>
                    : <a href="#">{item}</a>
                  }
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="f-col f-pay">
          <h4>Payment Methods</h4>
          <img className="pays-img" src={paymentsImg}
            alt="Visa, Mastercard, UPI, RuPay, PayPal" />
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
            {["VISA", "MC", "UPI", "RuPay", "PayPal"].map((m) => (
              <span key={m} style={{ fontSize: 10, fontWeight: 700, padding: "6px 8px", borderRadius: 6, background: "#e8e6f5", color: "#1a1a4a", fontStyle: "italic" }}>{m}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="copyright">
        <span>© 2026 Cartly. All rights reserved.</span>
        <button className="to-top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Back to top">
          <ArrowUp size={16} />
        </button>
      </div>
    </footer>
  );
}

// ── Home page ─────────────────────────────────────────────────────────────────
export default function Home() {
  const [products, setProducts] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);

  useEffect(() => {
    api.get("/products?limit=12&page=1")
      .then((data) => setProducts(data.products || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setRecentProducts(JSON.parse(localStorage.getItem('cartly_recently_viewed') || '[]').slice(0, 5));
    const onStorage = () => setRecentProducts(JSON.parse(localStorage.getItem('cartly_recently_viewed') || '[]').slice(0, 5));
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const flashProducts    = products.slice(0, 4).map((p, i) => toCardShape(p, i));
  const trendingProducts = products.slice(4, 9).map(toTrendShape);

  return (
    <>
      <div className="layout">
        <Sidebar />
        <main className="home-main">
          <Hero />
          <CategoryChips />
          <FlashSale products={flashProducts} />
          <Banners />
          <Trending products={trendingProducts} />
          <RecentlyViewed products={recentProducts} />
        </main>
        <div className="full">
          <Newsletter />
        </div>
      </div>
      <Footer />
    </>
  );
}
