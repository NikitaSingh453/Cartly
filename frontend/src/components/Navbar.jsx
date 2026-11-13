import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { useState, useEffect, useRef } from 'react';
import CartlyLogo from './CartlyLogo';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [search, setSearch]       = useState('');
  const searchRef = useRef(null);

  useEffect(() => {
    const update = () => {
      const cart = JSON.parse(localStorage.getItem('cartly_cart') || '[]');
      setCartCount(cart.reduce((s, i) => s + i.quantity, 0));
    };
    update();
    window.addEventListener('storage', update);
    const t = setInterval(update, 500);
    return () => { window.removeEventListener('storage', update); clearInterval(t); };
  }, []);

  const doLogout = () => { logout(); navigate('/login'); };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && search.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(search.trim())}`);
      setSearch('');
    }
  };

  return (
    <nav className="navbar">
      <Link to={user?.role === 'admin' ? '/dashboard' : '/'} className="nav-logo">
        <CartlyLogo size={26} />
        <span>Cartly</span>
      </Link>

      <div className="nav-links">
        {user?.role === 'admin' ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/catalog">Catalog</Link>
            <Link to="/products/new">+ Add Product</Link>
          </>
        ) : (
          <>
            <Link to="/">Home</Link>
            <Link to="/catalog">Shop</Link>
          </>
        )}
      </div>

      {user?.role !== 'admin' && (
        <div className="nav-search">
          <span className="nav-search-icon">🔍</span>
          <input
            ref={searchRef}
            type="text"
            placeholder="Search products…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>
      )}

      <div className="nav-right">
        {user ? (
          <>
            {user.role !== 'admin' && (
              <>
                <Link to="/orders" className="nav-icon-btn" style={{ textDecoration: 'none' }} title="Orders">
                  📦
                </Link>
                <Link to="/cart" className="nav-icon-btn cart-link" style={{ textDecoration: 'none' }} title="Cart">
                  🛒
                  {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                </Link>
              </>
            )}
            <span className="nav-user">{user.name?.split(' ')[0]}</span>
            <button className="btn-ghost" style={{ fontSize: '.78rem', padding: '.35rem .8rem' }} onClick={doLogout}>
              Sign out
            </button>
          </>
        ) : (
          <>
            <Link to="/cart" className="nav-icon-btn cart-link" style={{ textDecoration: 'none' }} title="Cart">
              🛒
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
            <Link to="/login">
              <button className="btn-primary" style={{ fontSize: '.78rem', padding: '.38rem .9rem' }}>
                Sign In
              </button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
