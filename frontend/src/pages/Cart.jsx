import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { api } from '../api';
import { useAuth } from '../AuthContext';
import StripeCheckout from '../components/StripeCheckout';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

const PAYMENT_METHODS = [
  { value: 'UPI',        label: 'UPI',              icon: '⚡' },
  { value: 'CARD',       label: 'Card',             icon: '💳' },
  { value: 'NETBANKING', label: 'Net Banking',       icon: '🏦' },
  { value: 'COD',        label: 'Cash on Delivery', icon: '💵' },
];

const EMPTY_FORM = { line1: '', city: '', state: '', postalCode: '' };

export default function Cart() {
  const { user }  = useAuth();
  const navigate  = useNavigate();
  const [cart, setCart]           = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [showForm, setShowForm]   = useState(false);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [savingAddr, setSavingAddr] = useState(false);
  const [method, setMethod]       = useState('UPI');
  const [step, setStep]           = useState('cart');
  const [orderId, setOrderId]     = useState(null);
  const [stripeClientSecret, setStripeClientSecret] = useState('');
  const [error, setError]         = useState('');
  const [placing, setPlacing]     = useState(false);

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem('cartly_cart') || '[]'));
  }, []);

  useEffect(() => {
    if (!user) return;
    api.get('/addresses')
      .then(data => {
        setAddresses(data);
        if (data.length > 0) setSelectedId(data[0].addressId);
        else setShowForm(true);
      })
      .catch(() => setShowForm(true));
  }, [user]);

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

  const saveAddress = async () => {
    if (!form.line1 || !form.city || !form.state || !form.postalCode) {
      setError('Please fill in all address fields');
      return;
    }
    setSavingAddr(true);
    setError('');
    try {
      const saved = await api.post('/addresses', form);
      setAddresses(prev => [...prev, saved]);
      setSelectedId(saved.addressId);
      setShowForm(false);
      setForm(EMPTY_FORM);
    } catch (e) {
      setError(e.message);
    } finally {
      setSavingAddr(false);
    }
  };

  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  const placeOrder = async () => {
    setError('');
    if (!selectedId) { setError('Please select or add a delivery address'); return; }
    setPlacing(true);
    try {
      const { orderId: id } = await api.post('/orders', {
        addressId: selectedId,
        items: cart.map(i => ({ productId: i.product_id, quantity: i.quantity })),
      });
      if (method === 'CARD') {
        const { clientSecret } = await api.post('/payments/create-intent', { amount: subtotal });
        setOrderId(id);
        setStripeClientSecret(clientSecret);
        setStep('stripe');
      } else {
        await api.post('/payments', { orderId: id, method, amount: subtotal });
        localStorage.removeItem('cartly_cart');
        window.dispatchEvent(new Event('storage'));
        setOrderId(id);
        setStep('done');
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setPlacing(false);
    }
  };

  const onStripeSuccess = () => {
    localStorage.removeItem('cartly_cart');
    window.dispatchEvent(new Event('storage'));
    setStep('done');
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

  if (step === 'stripe') return (
    <div className="page center-page">
      <div className="success-card" style={{ maxWidth: 480 }}>
        <h2 style={{ marginBottom: '1.25rem' }}>Complete Payment</h2>
        <div className="summary-row" style={{ marginBottom: '1rem' }}>
          <span>Order #{orderId}</span>
          <span style={{ fontWeight: 700 }}>₹{subtotal.toLocaleString('en-IN')}</span>
        </div>
        <Elements stripe={stripePromise}>
          <StripeCheckout
            clientSecret={stripeClientSecret}
            orderId={orderId}
            amount={subtotal}
            onSuccess={onStripeSuccess}
            onError={(msg) => setError(msg)}
          />
        </Elements>
        {error && <p className="form-error" style={{ marginTop: '.75rem' }}>{error}</p>}
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

          {/* Delivery Address */}
          <div className="card">
            <p className="card-title">Delivery Address</p>

            {addresses.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem', marginBottom: '.75rem' }}>
                {addresses.map(addr => (
                  <label
                    key={addr.addressId}
                    style={{
                      display: 'flex', alignItems: 'flex-start', gap: '.6rem', cursor: 'pointer',
                      padding: '.6rem .75rem', borderRadius: 8,
                      border: `1.5px solid ${selectedId === addr.addressId ? 'var(--primary)' : 'var(--border)'}`,
                      background: selectedId === addr.addressId ? 'var(--primary-light, #f0f4ff)' : 'transparent',
                    }}
                  >
                    <input
                      type="radio"
                      name="address"
                      value={addr.addressId}
                      checked={selectedId === addr.addressId}
                      onChange={() => { setSelectedId(addr.addressId); setShowForm(false); }}
                      style={{ marginTop: 3, accentColor: 'var(--primary)' }}
                    />
                    <span style={{ fontSize: '.83rem', lineHeight: 1.4 }}>
                      {addr.line1}, {addr.city}, {addr.state} – {addr.postalCode}
                      {addr.isDefault && <span style={{ marginLeft: '.4rem', fontSize: '.72rem', color: 'var(--primary)', fontWeight: 600 }}>Default</span>}
                    </span>
                  </label>
                ))}
              </div>
            )}

            {!showForm ? (
              <button
                className="btn-secondary"
                style={{ width: '100%', fontSize: '.8rem' }}
                onClick={() => { setShowForm(true); setSelectedId(null); }}
              >
                + Add new address
              </button>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
                <input
                  placeholder="Street / Flat / Building *"
                  value={form.line1}
                  onChange={e => setForm(f => ({ ...f, line1: e.target.value }))}
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.5rem' }}>
                  <input
                    placeholder="City *"
                    value={form.city}
                    onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                  />
                  <input
                    placeholder="State *"
                    value={form.state}
                    onChange={e => setForm(f => ({ ...f, state: e.target.value }))}
                  />
                </div>
                <input
                  placeholder="PIN Code *"
                  value={form.postalCode}
                  onChange={e => setForm(f => ({ ...f, postalCode: e.target.value }))}
                  maxLength={6}
                />
                <div style={{ display: 'flex', gap: '.5rem', marginTop: '.25rem' }}>
                  <button className="btn-primary" style={{ flex: 1, fontSize: '.8rem' }} onClick={saveAddress} disabled={savingAddr}>
                    {savingAddr ? 'Saving…' : 'Save Address'}
                  </button>
                  {addresses.length > 0 && (
                    <button className="btn-secondary" style={{ fontSize: '.8rem' }} onClick={() => { setShowForm(false); setSelectedId(addresses[0].addressId); }}>
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            )}
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
          <button className="btn-primary full-width" onClick={placeOrder} disabled={placing || showForm}>
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
