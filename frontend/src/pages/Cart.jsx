import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../AuthContext';

export default function Cart() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart]       = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [addressId, setAddressId] = useState('');
  const [method, setMethod]   = useState('UPI');
  const [step, setStep]       = useState('cart'); // cart | address | confirm | done
  const [orderId, setOrderId] = useState(null);
  const [error, setError]     = useState('');

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem('cartly_cart') || '[]'));
  }, []);

  useEffect(() => {
    if (user) {
      api.get('/orders') // piggyback: fetch addresses from profile
        .catch(() => {});
      // fetch addresses via a workaround: GET /auth/me would be ideal, but we store them separately
      // For now fetch from orders list to get address_id, else ask user to add
      // Simple: always show a manual address form
    }
  }, [user]);

  const updateQty = (product_id, qty) => {
    if (qty < 1) return removeItem(product_id);
    setCart(c => { const n = c.map(i => i.product_id === product_id ? { ...i, quantity: qty } : i); localStorage.setItem('cartly_cart', JSON.stringify(n)); return n; });
  };
  const removeItem = (product_id) => {
    setCart(c => { const n = c.filter(i => i.product_id !== product_id); localStorage.setItem('cartly_cart', JSON.stringify(n)); return n; });
  };

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  const placeOrder = async () => {
    setError('');
    if (!addressId) { setError('Select a delivery address'); return; }
    try {
      const { order_id } = await api.post('/orders', {
        address_id: parseInt(addressId),
        items: cart.map(i => ({ product_id: i.product_id, quantity: i.quantity })),
      });
      await api.post('/payments', { order_id, method, amount: total });
      localStorage.removeItem('cartly_cart');
      setOrderId(order_id);
      setStep('done');
    } catch (e) {
      setError(e.message);
    }
  };

  if (!user) return (
    <div className="page center-page">
      <h2>Please <a href="/login">sign in</a> to view your cart.</h2>
    </div>
  );

  if (step === 'done') return (
    <div className="page center-page">
      <div className="success-card">
        <div className="success-icon">✓</div>
        <h2>Order Placed!</h2>
        <p>Order <strong>#{orderId}</strong> has been placed and payment recorded.</p>
        <button className="btn-primary" onClick={() => navigate('/orders')}>View Orders</button>
        <button className="btn-secondary" onClick={() => navigate('/catalog')}>Continue Shopping</button>
      </div>
    </div>
  );

  return (
    <div className="page">
      <h1 className="page-title">Your Cart</h1>

      {cart.length === 0 ? (
        <div className="center-page">
          <p>Your cart is empty.</p>
          <button className="btn-primary" onClick={() => navigate('/catalog')}>Browse Products</button>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {cart.map(item => (
              <div key={item.product_id} className="cart-item">
                <div className="cart-item-img">{categoryIcon(item.name)}</div>
                <div className="cart-item-info">
                  <p className="cart-item-name">{item.name}</p>
                  <p className="cart-item-price">₹{Number(item.price).toLocaleString('en-IN')}</p>
                </div>
                <div className="qty-control">
                  <button onClick={() => updateQty(item.product_id, item.quantity - 1)}>−</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQty(item.product_id, item.quantity + 1)}>+</button>
                </div>
                <p className="cart-item-subtotal">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                <button className="remove-btn" onClick={() => removeItem(item.product_id)}>✕</button>
              </div>
            ))}
          </div>

          <div className="cart-sidebar">
            <div className="card">
              <h3>Order Summary</h3>
              <div className="summary-row"><span>Items ({cart.length})</span><span>₹{total.toLocaleString('en-IN')}</span></div>
              <div className="summary-row"><span>Delivery</span><span className="free">FREE</span></div>
              <div className="summary-total"><span>Total</span><span>₹{total.toLocaleString('en-IN')}</span></div>

              <div className="address-section">
                <label><strong>Delivery Address ID</strong></label>
                <input
                  type="number"
                  placeholder="Enter your address ID"
                  value={addressId}
                  onChange={e => setAddressId(e.target.value)}
                />
                <p className="hint">Your address ID is shown in your profile / provided at registration.</p>
              </div>

              <div className="payment-section">
                <label><strong>Payment Method</strong></label>
                <select value={method} onChange={e => setMethod(e.target.value)}>
                  <option value="UPI">UPI</option>
                  <option value="CARD">Credit / Debit Card</option>
                  <option value="NETBANKING">Net Banking</option>
                  <option value="COD">Cash on Delivery</option>
                </select>
              </div>

              {error && <p className="form-error">{error}</p>}
              <button className="btn-primary full-width" onClick={placeOrder}>Place Order</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function categoryIcon(name) {
  if (name.toLowerCase().includes('phone') || name.toLowerCase().includes('iphone') || name.toLowerCase().includes('galaxy s')) return '📱';
  if (name.toLowerCase().includes('book') || name.toLowerCase().includes('laptop') || name.toLowerCase().includes('zenbook') || name.toLowerCase().includes('rog')) return '💻';
  if (name.toLowerCase().includes('watch')) return '⌚';
  if (name.toLowerCase().includes('bud') || name.toLowerCase().includes('airpod') || name.toLowerCase().includes('headphone') || name.toLowerCase().includes('wh-')) return '🎧';
  if (name.toLowerCase().includes('tab') || name.toLowerCase().includes('ipad')) return '📲';
  if (name.toLowerCase().includes('camera') || name.toLowerCase().includes('alpha')) return '📷';
  return '📦';
}
