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
    // poll cart changes (same-tab updates)
    const t = setInterval(update, 500);
    return () => { window.removeEventListener('storage', update); clearInterval(t); };
  }, []);

  const doLogout = () => { logout(); navigate('/login'); };

  return (
    <nav className="navbar">
      <Link to={user?.role === 'admin' ? '/dashboard' : '/catalog'} className="nav-logo">
        <span className="logo-icon">⚡</span> Cartly
      </Link>
      <div className="nav-links">
        {user?.role === 'admin' && (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/catalog">Catalog</Link>
            <Link to="/products/new">Add Product</Link>
          </>
        )}
        {user?.role === 'customer' && (
          <>
            <Link to="/catalog">Shop</Link>
            <Link to="/orders">Orders</Link>
            <Link to="/cart" className="cart-link">
              Cart {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
          </>
        )}
      </div>
      <div className="nav-right">
        {user ? (
          <>
            <span className="nav-user">{user.name.split(' ')[0]}</span>
            <button className="btn-ghost" onClick={doLogout}>Logout</button>
          </>
        ) : (
          <Link to="/login"><button className="btn-ghost">Sign In</button></Link>
        )}
      </div>
    </nav>
  );
}
