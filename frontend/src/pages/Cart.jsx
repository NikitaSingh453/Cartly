import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../AuthContext';

const PAYMENT_METHODS = [
  { value: 'UPI',        label: 'UPI',         icon: '⚡' },
  { value: 'CARD',       label: 'Card',         icon: '💳' },
  { value: 'NETBANKING', label: 'Net Banking',  icon: '🏦' },
  { value: 'COD',        label: 'Cash on Delivery', icon: '💵' },
];

export default function Cart() {
  const { user }  = useAuth();
  const navigate  = useNavigate();
  const [cart, setCart]       = useState([]);
  const [addressId, setAddressId] = useState('');
  const [method, setMethod]   = useState('UPI');
  const [step, setStep]       = useState('cart');
  const [orderId, setOrderId] = useState(null);
  const [error, setError]     = useState('');
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem('cartly_cart') || '[]'));
  }, []);

  const updateQty = (product_id, qty) => {
    if (qty < 1) return removeItem(product_id);
    setCart(c => {
      const n = c.map(i => i.product_id === product_id ? { ...i, quantity: qty } : i);
      localStorage.setItem('cartly_cart', JSON.stringify(n));
      return n;
    });
  };

  const removeItem = (product_id) => {
    setCart(c => {
      const n = c.filter(i => i.product_id !== product_id);
      localStorage.setItem('cartly_cart', JSON.stringify(n));
      return n;
    });
  };

  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  const placeOrder = async () => {
    setError('');
    if (!addressId) { setError('Please enter your delivery address ID'); return; }
    setPlacing(true);
    try {
      const { orderId: oid, order_id } = await api.post('/orders', {
        address_id: parseInt(addressId),
        items: cart.map(i => ({ product_id: i.product_id, quantity: i.quantity })),
      });
      const id = oid || order_id;
      await api.post('/payments', { order_id: id, method, amount: subtotal });
      localStorage.removeItem('cartly_cart');
      setOrderId(id);
      setStep('done');
    } catch (e) {
      setError(e.message);
    } finally {
      setPlacing(false);
    }
  };

  if (!user) return (
    <div className="page center-page">
      <div className="empty-state">
        <div className="empty-state-icon">🔒</div>
        <h3>Sign in to view your cart</h3>
        <p>You need to be logged in to access your cart and place orders.</p>
        <Link to="/login"><button className="btn-primary">Sign In</button></Link>
      </div>
    </div>
  );

  if (step === 'done') return (
    <div className="page center-page">
      <div className="success-card">
        <div className="success-icon">✓</div>
        <h2>Order Placed!</h2>
        <p style={{ color: 'var(--text-dim)', fontSize: '.875rem' }}>
          Order <strong>#{orderId}</strong> has been placed and payment recorded successfully.
        </p>
        <button className="btn-primary full-width" onClick={() => navigate('/orders')}>View My Orders</button>
        <button className="btn-secondary full-width" onClick={() => navigate('/catalog')}>Continue Shopping</button>
      </div>
    </div>
  );

  if (cart.length === 0) return (
    <div className="page center-page">
      <div className="empty-state">
        <div className="empty-state-icon">🛒</div>
        <h3>Your cart is empty</h3>
        <p>Looks like you haven't added anything yet.</p>
        <button className="btn-primary" onClick={() => navigate('/catalog')}>Browse Products</button>
      </div>
    </div>
  );

  return (
    <div className="page">
      <h1 className="page-title">Cart <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '1rem' }}>({cart.length} item{cart.length !== 1 ? 's' : ''})</span></h1>

      <div className="cart-layout">
        {/* Items */}
        <div className="cart-items">
          {cart.map(item => (
            <div key={item.product_id} className="cart-item">
              <div className="cart-item-img">{itemIcon(item.name)}</div>
              <div className="cart-item-info">
                <p className="cart-item-name">{item.name}</p>
                <p className="cart-item-price">₹{Number(item.price).toLocaleString('en-IN')} each</p>
              </div>
              <div className="qty-control">
                <button onClick={() => updateQty(item.product_id, item.quantity - 1)}>−</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQty(item.product_id, item.quantity + 1)}>+</button>
              </div>
              <p className="cart-item-subtotal">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
              <button className="remove-btn" onClick={() => removeItem(item.product_id)} title="Remove">✕</button>
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <div className="cart-sidebar">
          {/* Summary */}
          <div className="card">
            <p className="card-title">Order Summary</p>
            <div className="summary-row">
              <span>Subtotal ({cart.length} items)</span>
              <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="summary-row">
              <span>Delivery</span>
              <span className="free">FREE</span>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Delivery */}
          <div className="card">
            <p className="card-title">Delivery Address</p>
            <div className="address-section">
              <input
                type="number"
                placeholder="Enter address ID"
                value={addressId}
                onChange={e => setAddressId(e.target.value)}
              />
              <p className="hint">Your saved address ID (shown in orders / profile)</p>
            </div>
          </div>

          {/* Payment */}
          <div className="card">
            <p className="card-title">Payment Method</p>
            <div className="payment-chips">
              {PAYMENT_METHODS.map(m => (
                <button
                  key={m.value}
                  className={`payment-chip ${method === m.value ? 'selected' : ''}`}
                  onClick={() => setMethod(m.value)}
                >
                  {m.icon} {m.label}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="form-error" style={{ padding: '0 .25rem' }}>{error}</p>}
          <button className="btn-primary full-width" onClick={placeOrder} disabled={placing}>
            {placing ? 'Placing order…' : `Place Order · ₹${subtotal.toLocaleString('en-IN')}`}
          </button>
        </div>
      </div>
    </div>
  );
}

function itemIcon(name) {
  const n = name.toLowerCase();
  if (n.includes('phone') || n.includes('iphone') || n.includes('galaxy s')) return '📱';
  if (n.includes('book') || n.includes('laptop') || n.includes('zenbook') || n.includes('rog')) return '💻';
  if (n.includes('watch')) return '⌚';
  if (n.includes('bud') || n.includes('airpod') || n.includes('headphone') || n.includes('wh-')) return '🎧';
  if (n.includes('tab') || n.includes('ipad')) return '📲';
  if (n.includes('camera') || n.includes('alpha')) return '📷';
  return '📦';
}
