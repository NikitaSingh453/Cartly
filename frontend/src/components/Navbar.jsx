import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);

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

  return (
    <nav className="navbar">
      <Link to={user?.role === 'admin' ? '/dashboard' : '/'} className="nav-logo">
        <span className="logo-icon">⚡</span> Cartly
      </Link>

      <div className="nav-links">
        {user?.role === 'admin' ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/catalog">Catalog</Link>
            <Link to="/products/new">Add Product</Link>
          </>
        ) : (
          <>
            <Link to="/">Home</Link>
            <Link to="/catalog">Shop</Link>
            <Link to="/catalog">Categories</Link>
          </>
        )}
      </div>

      {user?.role !== 'admin' && (
        <div className="nav-search">
          <span className="nav-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search gadgets…"
            onKeyDown={e => e.key === 'Enter' && navigate('/catalog')}
          />
        </div>
      )}

      <div className="nav-right">
        {user ? (
          <>
            {user.role === 'customer' && (
              <>
                <button className="nav-icon-btn" title="Wishlist">♡</button>
                <Link to="/orders" className="nav-icon-btn" style={{ textDecoration: 'none' }} title="Orders">📦</Link>
                <Link to="/cart" className="nav-icon-btn" style={{ textDecoration: 'none', position: 'relative' }} title="Cart">
                  🛒
                  {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                </Link>
              </>
            )}
            <span className="nav-user">{user.name.split(' ')[0]}</span>
            <button className="btn-ghost" onClick={doLogout}>Logout</button>
          </>
        ) : (
          <>
            <button className="nav-icon-btn" title="Wishlist">♡</button>
            <Link to="/cart" className="nav-icon-btn" style={{ textDecoration: 'none', position: 'relative' }} title="Cart">
              🛒
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
            <Link to="/login"><button className="btn-ghost">Sign In</button></Link>
          </>
        )}
      </div>
    </nav>
  );
}
