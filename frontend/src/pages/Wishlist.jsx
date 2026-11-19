import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { getProductSVG } from '../components/ProductSVG';

const formatINR = (n) => '₹' + Number(n).toLocaleString('en-IN');

export default function Wishlist() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  useEffect(() => {
    const load = () => setItems(JSON.parse(localStorage.getItem('cartly_wishlist') || '[]'));
    load();
    window.addEventListener('storage', load);
    return () => window.removeEventListener('storage', load);
  }, []);

  const remove = (pid) => {
    const next = items.filter((x) => x.product_id !== pid);
    localStorage.setItem('cartly_wishlist', JSON.stringify(next));
    window.dispatchEvent(new Event('storage'));
    setItems(next);
  };

  const addToCart = (item) => {
    const cart = JSON.parse(localStorage.getItem('cartly_cart') || '[]');
    const ex = cart.find((i) => i.product_id === item.product_id);
    if (ex) ex.quantity += 1;
    else cart.push({ product_id: item.product_id, name: item.name, price: item.price, quantity: 1 });
    localStorage.setItem('cartly_cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('storage'));
  };

  if (items.length === 0) {
    return (
      <div className="page" style={{ textAlign: 'center', padding: '5rem 1rem' }}>
        <Heart size={52} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} strokeWidth={1.2} />
        <h2 style={{ color: 'var(--heading)', marginBottom: '.5rem' }}>Your wishlist is empty</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Click the ♡ on any product to save it here.</p>
        <button className="btn" onClick={() => navigate('/catalog')}>Browse Products</button>
      </div>
    );
  }

  return (
    <div className="page">
      <h1 className="page-title" style={{ marginBottom: '1.5rem' }}>
        Wishlist <span style={{ color: 'var(--accent)', fontWeight: 700 }}>({items.length})</span>
      </h1>
      <div className="grid-4">
        {items.map((item) => (
          <article key={item.product_id} className="product-card">
            <div className="product-card-img" style={{ cursor: 'pointer' }}
              onClick={() => navigate(`/products/${item.product_id}`)}>
              <button className="heart" aria-label="Remove from wishlist"
                onClick={(e) => { e.stopPropagation(); remove(item.product_id); }}>
                <Heart size={14} fill="#ff5c8a" color="#ff5c8a" />
              </button>
              <div className="svg-thumb">
                {getProductSVG(item.name, item.category_name, 110)}
              </div>
            </div>
            <h5 style={{ cursor: 'pointer' }} onClick={() => navigate(`/products/${item.product_id}`)}>
              {item.name}
            </h5>
            <div className="product-card-foot">
              <div className="price">{formatINR(item.price)}</div>
              <button className="btn btn-sm" onClick={() => addToCart(item)}>
                <ShoppingCart size={11} /> Add to Cart
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
