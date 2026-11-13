import { useEffect, useState } from 'react';
import { api } from '../api';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [cats, setCats] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([api.get('/dashboard'), api.get('/dashboard/categories')])
      .then(([d, c]) => { setData(d); setCats(c); })
      .catch(e => setError(e.message));
  }, []);

  if (error) return <div className="page-error">{error}</div>;
  if (!data)  return <div className="loading">Loading dashboard…</div>;

  return (
    <div className="page">
      <h1 className="page-title">Dashboard</h1>

      <div className="stat-grid">
        <StatCard label="Active Products" value={data.productCount}  icon="📦" color="blue" />
        <StatCard label="Orders Today"    value={data.ordersToday}   icon="🛒" color="green" />
        <StatCard label="Total Revenue"   value={`₹${Number(data.totalRevenue).toLocaleString('en-IN')}`} icon="💰" color="purple" />
        <StatCard label="Low Stock"       value={data.lowStockCount} icon="⚠️" color="red" />
      </div>

      <div className="dash-grid">
        <div className="card">
          <h2 className="card-title">Recent Orders</h2>
          <table className="data-table">
            <thead><tr><th>#</th><th>Customer</th><th>Total</th><th>Status</th></tr></thead>
            <tbody>
              {data.recentOrders.map(o => (
                <tr key={o.orderId}>
                  <td>#{o.orderId}</td>
                  <td>{o.customerName}</td>
                  <td>₹{Number(o.total).toLocaleString('en-IN')}</td>
                  <td><span className={`badge badge-${o.status.toLowerCase()}`}>{o.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <h2 className="card-title">Top Sellers</h2>
          <ul className="top-list">
            {data.topSellers.map((p, i) => (
              <li key={p.productId} className="top-item">
                <span className="rank">#{i + 1}</span>
                <span className="top-name">{p.name}</span>
                <span className="units">{p.totalQtySold} sold</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h2 className="card-title">Revenue by Category</h2>
          <ul className="cat-list">
            {cats.map(c => (
              <li key={c.categoryName} className="cat-item">
                <span className="cat-name">{c.categoryName}</span>
                <div className="cat-bar-wrap">
                  <div className="cat-bar" style={{ width: `${Math.min(100, (c.totalRevenue / (cats[0]?.totalRevenue || 1)) * 100)}%` }} />
                </div>
                <span className="cat-rev">₹{Number(c.totalRevenue).toLocaleString('en-IN')}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }) {
  return (
    <div className={`stat-card stat-${color}`}>
      <span className="stat-icon">{icon}</span>
      <div>
        <p className="stat-value">{value}</p>
        <p className="stat-label">{label}</p>
      </div>
    </div>
  );
}
