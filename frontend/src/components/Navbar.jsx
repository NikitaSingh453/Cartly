import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { useState, useEffect, useRef } from "react";
import { ShoppingCart, Home, Search, Heart, Moon, ChevronDown, Package, Loader2 } from "lucide-react";
import { geminiGenerate, parseGeminiJSON } from "../utils/gemini";

const NAV_LINKS = ["Shop", "Deals", "Orders"];
const NAV_PATHS = { Shop: "/catalog", Deals: "/catalog", Orders: "/orders" };

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [cartCount, setCartCount]       = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [search, setSearch]             = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [dropOpen, setDropOpen]         = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    const update = () => {
      const cart = JSON.parse(localStorage.getItem("cartly_cart") || "[]");
      setCartCount(cart.reduce((s, i) => s + i.quantity, 0));
      const wish = JSON.parse(localStorage.getItem("cartly_wishlist") || "[]");
      setWishlistCount(wish.length);
    };
    update();
    window.addEventListener("storage", update);
    const t = setInterval(update, 500);
    return () => { window.removeEventListener("storage", update); clearInterval(t); };
  }, []);

  useEffect(() => {
    const handler = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const doLogout = () => { setDropOpen(false); logout(); navigate("/login"); };
  const handleSearch = async (e) => {
    if (e.key !== "Enter" || !search.trim()) return;
    const q = search.trim();
    const isNaturalLanguage = q.split(" ").length >= 3 || /under|below|cheap|best|good|top|around|budget|premium|₹|\d{3,}/i.test(q);
    if (isNaturalLanguage) {
      setSearchLoading(true);
      try {
        const reply = await geminiGenerate(
          `Parse this shopping query and return ONLY valid JSON with keys: search (string, main product keyword), max_price (number or null), min_price (number or null).\n\nQuery: "${q}"`,
          { temperature: 0.1 }
        );
        const parsed = parseGeminiJSON(reply);
        const params = new URLSearchParams();
        if (parsed.search)     params.set('search', parsed.search);
        if (parsed.max_price)  params.set('max_price', parsed.max_price);
        if (parsed.min_price)  params.set('min_price', parsed.min_price);
        setSearch("");
        navigate(`/catalog?${params.toString()}`);
      } catch {
        navigate(`/catalog?search=${encodeURIComponent(q)}`);
        setSearch("");
      } finally {
        setSearchLoading(false);
      }
    } else {
      navigate(`/catalog?search=${encodeURIComponent(q)}`);
      setSearch("");
    }
  };
  const isActive = (path) => location.pathname === path;
  const initials = user?.name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "PJ";

  return (
    <header className="header">
      <Link to={user?.role === "admin" ? "/dashboard" : "/"} className="logo">
        <ShoppingCart size={24} />
        <span>Cartly</span>
      </Link>

      <nav className="nav">
        <Link to="/" className={`nav-link${isActive("/") ? " active" : ""}`}>
          <Home size={14} /> Home
        </Link>
        {user?.role === "admin" ? (
          <>
            <Link to="/dashboard" className={`nav-link${isActive("/dashboard") ? " active" : ""}`}>Dashboard</Link>
            <Link to="/catalog"   className={`nav-link${isActive("/catalog")   ? " active" : ""}`}>Catalog</Link>
            <Link to="/products/new" className="nav-link">+ Add Product</Link>
          </>
        ) : (
          NAV_LINKS.map((l) => (
            <Link
              key={l}
              to={NAV_PATHS[l]}
              className={`nav-link${isActive(NAV_PATHS[l]) ? " active" : ""}`}
            >
              {l}
            </Link>
          ))
        )}
      </nav>

      <label className="search">
        {searchLoading ? <Loader2 size={16} className="ai-spin" /> : <Search size={16} />}
        <input
          placeholder="Search or ask AI…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleSearch}
          disabled={searchLoading}
        />
        <kbd>⌘ K</kbd>
      </label>

      <div className="header-actions">
        <button className="icon-btn" aria-label="Wishlist" style={{ position: "relative" }}
          onClick={() => navigate("/wishlist")}>
          <Heart size={18} />
          {wishlistCount > 0 && <span className="header-badge">{wishlistCount}</span>}
        </button>

        <button className="icon-btn" aria-label="Cart" style={{ position: "relative" }}
          onClick={() => navigate("/cart")}>
          <ShoppingCart size={18} />
          {cartCount > 0 && <span className="header-badge">{cartCount}</span>}
        </button>

        <button className="icon-btn" aria-label="Theme" title="Dark mode"><Moon size={18} /></button>

        {user ? (
          <div ref={dropRef} style={{ position: "relative" }}>
            <button className="avatar" onClick={() => setDropOpen((d) => !d)}>
              {initials} <ChevronDown size={12} style={{ transition: "transform .15s", transform: dropOpen ? "rotate(180deg)" : "none" }} />
            </button>
            {dropOpen && (
              <div className="avatar-dropdown">
                <button onClick={() => { setDropOpen(false); navigate("/orders"); }}>
                  <Package size={14} /> My Orders
                </button>
                <button onClick={doLogout} className="logout-item">
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login">
            <button className="avatar">Sign In <ChevronDown size={12} /></button>
          </Link>
        )}
      </div>
    </header>
  );
}
