import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../AuthContext';

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders]   = useState([]);
  const [selected, setSelected] = useState(null);
  const [detail, setDetail]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelMsg, setCancelMsg] = useState('');

  useEffect(() => {
    api.get('/orders').then(setOrders).catch(console.error).finally(() => setLoading(false));
  }, []);

  const loadDetail = async (id) => {
    setSelected(id);
    setDetail(null);
    const d = await api.get(`/orders/${id}`);
    setDetail(d);
  };

  const cancel = async (id) => {
    setCancelMsg('');
    try {
      await api.patch(`/orders/${id}/cancel`);
      setCancelMsg('Order cancelled.');
      const updated = await api.get('/orders');
      setOrders(updated);
      if (selected === id) {
        const d = await api.get(`/orders/${id}`);
        setDetail(d);
      }
    } catch (e) {
      setCancelMsg(e.message);
    }
  };

  if (!user) return <div className="page center-page"><p><a href="/login">Sign in</a> to view orders.</p></div>;
  if (loading) return <div className="loading">Loading…</div>;

  return (
    <div className="page">
      <h1 className="page-title">My Orders</h1>
      {orders.length === 0 ? (
        <div className="center-page">
          <p>No orders yet.</p>
          <Link to="/catalog"><button className="btn-primary">Start Shopping</button></Link>
        </div>
      ) : (
        <div className="orders-layout">
          <div className="orders-list">
            {orders.map(o => (
              <div
                key={o.order_id}
                className={`order-row ${selected === o.order_id ? 'active' : ''}`}
                onClick={() => loadDetail(o.order_id)}
              >
                <div>
                  <strong>Order #{o.order_id}</strong>
                  <p className="order-date">{new Date(o.order_date).toLocaleDateString('en-IN')}</p>
                </div>
                <div className="order-right">
                  <span className={`badge badge-${o.status.toLowerCase()}`}>{o.status}</span>
                  <p>₹{Number(o.total).toLocaleString('en-IN')}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="order-detail card">
            {!selected && <p className="empty">Select an order to view details.</p>}
            {selected && !detail && <p className="loading">Loading…</p>}
            {detail && (
              <>
                <h2>Order #{detail.order_id}</h2>
                <p><span className={`badge badge-${detail.status.toLowerCase()}`}>{detail.status}</span></p>

                <h4>Items</h4>
                <table className="data-table">
                  <thead><tr><th>Product</th><th>Qty</th><th>Price</th><th>Subtotal</th></tr></thead>
                  <tbody>
                    {detail.items.map(i => (
                      <tr key={i.product_id}>
                        <td>{i.name}</td>
                        <td>{i.quantity}</td>
                        <td>₹{Number(i.unit_price).toLocaleString('en-IN')}</td>
                        <td>₹{(i.quantity * i.unit_price).toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <h4>Delivery to</h4>
                <p>{detail.line1}, {detail.city}, {detail.state} – {detail.postal_code}</p>

                <h4>Payments</h4>
                {detail.payments.length === 0 ? <p>No payment recorded.</p> : detail.payments.map(p => (
                  <p key={p.payment_id}>{p.method} · ₹{Number(p.amount).toLocaleString('en-IN')} · <span className={`badge badge-${p.status.toLowerCase()}`}>{p.status}</span></p>
                ))}

                {['PLACED', 'PAID'].includes(detail.status) && (
                  <button className="btn-danger" onClick={() => cancel(detail.order_id)}>Cancel Order</button>
                )}
                {cancelMsg && <p className="form-error">{cancelMsg}</p>}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
