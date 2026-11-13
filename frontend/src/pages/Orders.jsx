import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../AuthContext';

export default function Orders() {
  const { user }   = useAuth();
  const [orders, setOrders]     = useState([]);
  const [selected, setSelected] = useState(null);
  const [detail, setDetail]     = useState(null);
  const [loading, setLoading]   = useState(true);
  const [cancelMsg, setCancelMsg] = useState('');
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    api.get('/orders').then(setOrders).catch(console.error).finally(() => setLoading(false));
  }, []);

  const loadDetail = async (id) => {
    if (selected === id) return;
    setSelected(id);
    setDetail(null);
    setCancelMsg('');
    try {
      const d = await api.get(`/orders/${id}`);
      setDetail(d);
    } catch (e) {
      console.error(e);
    }
  };

  const cancel = async (id) => {
    setCancelMsg('');
    setCancelling(true);
    try {
      await api.patch(`/orders/${id}/cancel`);
      setCancelMsg('Order cancelled successfully.');
      const [updated, d] = await Promise.all([
        api.get('/orders'),
        api.get(`/orders/${id}`),
      ]);
      setOrders(updated);
      setDetail(d);
    } catch (e) {
      setCancelMsg(e.message);
    } finally {
      setCancelling(false);
    }
  };

  if (!user) return (
    <div className="page center-page">
      <div className="empty-state">
        <div className="empty-state-icon">🔒</div>
        <h3>Sign in to view orders</h3>
        <Link to="/login"><button className="btn-primary">Sign In</button></Link>
      </div>
    </div>
  );

  if (loading) return <div className="loading">Loading orders…</div>;

  if (orders.length === 0) return (
    <div className="page center-page">
      <div className="empty-state">
        <div className="empty-state-icon">📦</div>
        <h3>No orders yet</h3>
        <p>Your order history will appear here after your first purchase.</p>
        <Link to="/catalog"><button className="btn-primary">Start Shopping</button></Link>
      </div>
    </div>
  );

  return (
    <div className="page">
      <h1 className="page-title">My Orders</h1>

      <div className="orders-layout">
        {/* Order list */}
        <div className="orders-list">
          {orders.map(o => (
            <div
              key={o.orderId || o.order_id}
              className={`order-row ${selected === (o.orderId || o.order_id) ? 'active' : ''}`}
              onClick={() => loadDetail(o.orderId || o.order_id)}
            >
              <div>
                <p style={{ fontWeight: 600, fontSize: '.875rem', color: 'var(--heading)' }}>
                  Order #{o.orderId || o.order_id}
                </p>
                <p className="order-date">
                  {new Date(o.orderDate || o.order_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
              <div className="order-right">
                <span className={`badge badge-${(o.status || '').toLowerCase()}`}>{o.status}</span>
                <p style={{ fontSize: '.875rem', fontWeight: 700, color: 'var(--heading)' }}>
                  ₹{Number(o.total).toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Detail panel */}
        <div className="order-detail card">
          {!selected && (
            <div className="empty-state" style={{ padding: '3rem 1rem' }}>
              <div className="empty-state-icon">👈</div>
              <h3>Select an order</h3>
              <p>Click an order on the left to see its details.</p>
            </div>
          )}
          {selected && !detail && <p className="loading">Loading order details…</p>}
          {detail && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                <div>
                  <h2 style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '-.3px' }}>Order #{detail.orderId || detail.order_id}</h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '.78rem', marginTop: '.15rem' }}>
                    {new Date(detail.orderDate || detail.order_date).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                </div>
                <span className={`badge badge-${(detail.status || '').toLowerCase()}`} style={{ fontSize: '.8rem', padding: '4px 12px' }}>
                  {detail.status}
                </span>
              </div>

              <div className="divider" />

              <h4>Items</h4>
              <table className="data-table" style={{ marginBottom: '.5rem' }}>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th style={{ textAlign: 'center' }}>Qty</th>
                    <th style={{ textAlign: 'right' }}>Price</th>
                    <th style={{ textAlign: 'right' }}>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {(detail.items || []).map(i => (
                    <tr key={i.productId || i.product_id}>
                      <td style={{ fontWeight: 500 }}>{i.productName || i.name}</td>
                      <td style={{ textAlign: 'center', color: 'var(--text-muted)' }}>{i.quantity}</td>
                      <td style={{ textAlign: 'right' }}>₹{Number(i.unitPrice || i.unit_price).toLocaleString('en-IN')}</td>
                      <td style={{ textAlign: 'right', fontWeight: 600 }}>
                        ₹{(i.quantity * (i.unitPrice || i.unit_price)).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {detail.address && (
                <>
                  <div className="divider" />
                  <h4>Delivery Address</h4>
                  <p style={{ color: 'var(--text-dim)', fontSize: '.875rem', lineHeight: 1.6 }}>
                    {detail.address.line1}, {detail.address.city}, {detail.address.state} – {detail.address.postalCode || detail.address.postal_code}
                  </p>
                </>
              )}

              {(detail.payments || []).length > 0 && (
                <>
                  <div className="divider" />
                  <h4>Payments</h4>
                  {detail.payments.map(p => (
                    <div key={p.paymentId || p.payment_id} style={{ display: 'flex', alignItems: 'center', gap: '.5rem', fontSize: '.875rem' }}>
                      <span style={{ fontWeight: 500 }}>{p.method}</span>
                      <span style={{ color: 'var(--text-muted)' }}>·</span>
                      <span>₹{Number(p.amount).toLocaleString('en-IN')}</span>
                      <span className={`badge badge-${(p.status || '').toLowerCase()}`}>{p.status}</span>
                    </div>
                  ))}
                </>
              )}

              {['PLACED', 'PAID'].includes(detail.status) && (
                <>
                  <div className="divider" />
                  <button
                    className="btn-danger"
                    onClick={() => cancel(detail.orderId || detail.order_id)}
                    disabled={cancelling}
                    style={{ marginTop: '.25rem' }}
                  >
                    {cancelling ? 'Cancelling…' : 'Cancel Order'}
                  </button>
                </>
              )}

              {cancelMsg && (
                <p className={cancelMsg.includes('success') ? 'form-success' : 'form-error'} style={{ marginTop: '.5rem' }}>
                  {cancelMsg}
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
