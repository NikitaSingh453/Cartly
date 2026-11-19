import { useEffect, useState, useRef } from 'react';
import { api } from '../api';
import { geminiGenerate, geminiChat, aiCacheGet, aiCacheSet } from '../utils/gemini';
import { Sparkles, Send, Loader2, Bot } from 'lucide-react';

export default function Dashboard() {
  const [data, setData]   = useState(null);
  const [cats, setCats]   = useState([]);
  const [error, setError] = useState('');

  // AI states
  const [aiInsights, setAiInsights]         = useState('');
  const [aiInsightsLoading, setAiInsightsLoading] = useState(false);
  const [sentiment, setSentiment]           = useState(null);
  const [sentimentLoading, setSentimentLoading] = useState(false);
  const [adminMsgs, setAdminMsgs]           = useState([]);
  const [adminInput, setAdminInput]         = useState('');
  const [adminLoading, setAdminLoading]     = useState(false);
  const chatBottomRef = useRef(null);

  useEffect(() => {
    Promise.all([api.get('/dashboard'), api.get('/dashboard/categories')])
      .then(([d, c]) => { setData(d); setCats(c); })
      .catch(e => setError(e.message));
  }, []);

  // Auto-load AI insights once dashboard data is ready
  useEffect(() => {
    if (!data) return;

    // 1. Low-stock AI insights (immediate)
    setAiInsightsLoading(true);
    const cachedInsights = aiCacheGet('dash_insights');
    if (cachedInsights) { setAiInsights(cachedInsights); setAiInsightsLoading(false); }
    else {
      api.get('/products?limit=100').then(async d => {
        const products = d.products || [];
        const low = products.filter(p => (p.quantityOnHand ?? 0) <= (p.reorderLevel ?? 10));
        if (low.length === 0) { setAiInsights('All products are adequately stocked. No restocking needed right now.'); return; }
        const list = low.map(p => `• ${p.name}: ${p.quantityOnHand} units (reorder at ${p.reorderLevel})`).join('\n');
        const insight = await geminiGenerate(
          `You are an inventory analyst. These products are running low:\n${list}\n\nProvide 3 concise bullet-point recommendations with urgency levels (🔴 Urgent / 🟡 Soon / 🟢 Watch). Be specific.`
        );
        setAiInsights(insight);
        aiCacheSet('dash_insights', insight);
      }).catch(() => setAiInsights('Could not load AI insights.')).finally(() => setAiInsightsLoading(false));
    }

    // 2. Review sentiment — delayed 4s to avoid rate-limit collision
    if (data.topSellers?.length > 0) {
      setSentimentLoading(true);
      const cachedSentiment = aiCacheGet('dash_sentiment');
      if (cachedSentiment) { setSentiment(cachedSentiment); setSentimentLoading(false); }
      else {
        setTimeout(async () => {
          try {
            const topIds = data.topSellers.slice(0, 3).map(p => p.productId || p.product_id);
            const arrays = await Promise.all(topIds.map(id => api.get(`/products/${id}`).then(p => p.reviews || []).catch(() => [])));
            const all = arrays.flat().filter(r => r.comment || r.title);
            if (all.length === 0) { setSentimentLoading(false); return; }
            const reviewText = all.slice(0, 20).map(r => `${r.rating}/5: "${r.comment || r.title}"`).join('\n');
            const reply = await geminiGenerate(
              `Classify these reviews as positive/neutral/negative and return ONLY valid JSON: {"positive": N, "neutral": N, "negative": N, "summary": "one sentence insight"}.\n\nReviews:\n${reviewText}`,
              { temperature: 0.1, maxOutputTokens: 80 }
            );
            const m = reply.match(/\{[\s\S]*\}/);
            if (m) { const parsed = JSON.parse(m[0]); setSentiment(parsed); aiCacheSet('dash_sentiment', parsed); }
          } catch {} finally { setSentimentLoading(false); }
        }, 4000);
      }
    }
  }, [data?.productCount]);

  useEffect(() => { chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [adminMsgs]);

  const sendAdminChat = async () => {
    if (!adminInput.trim() || adminLoading) return;
    const userMsg = { role: 'user', text: adminInput.trim() };
    setAdminMsgs(m => [...m, userMsg]);
    setAdminInput('');
    setAdminLoading(true);
    const systemInstruction = `You are a business intelligence assistant for Cartly's admin.

Dashboard snapshot:
- Active products: ${data?.productCount}
- Orders today: ${data?.ordersToday}
- Total revenue: ₹${Number(data?.totalRevenue || 0).toLocaleString('en-IN')}
- Low stock count: ${data?.lowStockCount}
- Top sellers: ${data?.topSellers?.map(p => `${p.name} (${p.totalQtySold} sold)`).join(', ')}
- Revenue by category: ${cats.map(c => `${c.categoryName} ₹${Number(c.totalRevenue).toLocaleString('en-IN')}`).join(', ')}

Give concise, data-driven answers. 2-4 sentences max unless more detail is requested.`;
    try {
      const history = [...adminMsgs, userMsg];
      const reply = await geminiChat(history, systemInstruction);
      setAdminMsgs(m => [...m, { role: 'model', text: reply }]);
    } catch (e) {
      setAdminMsgs(m => [...m, { role: 'model', text: `AI error: ${e.message}` }]);
    } finally {
      setAdminLoading(false);
    }
  };

  if (error) return <div className="page-error">{error}</div>;
  if (!data)  return <div className="loading">Loading dashboard…</div>;

  const sentimentTotal = sentiment ? (sentiment.positive + sentiment.neutral + sentiment.negative) || 1 : 1;

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
        {/* Recent Orders */}
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

        {/* Top Sellers */}
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

        {/* Revenue by Category */}
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

        {/* AI Inventory Insights */}
        <div className="card ai-card">
          <h2 className="card-title"><Sparkles size={16} className="ai-icon-title" /> AI Inventory Insights</h2>
          {aiInsightsLoading ? (
            <div className="ai-loading-row"><Loader2 size={16} className="ai-spin" /> Analysing stock levels…</div>
          ) : (
            <p className="ai-insights-text" style={{ whiteSpace: 'pre-line' }}>{aiInsights}</p>
          )}
        </div>

        {/* Review Sentiment */}
        <div className="card ai-card">
          <h2 className="card-title"><Sparkles size={16} className="ai-icon-title" /> Review Sentiment</h2>
          {sentimentLoading ? (
            <div className="ai-loading-row"><Loader2 size={16} className="ai-spin" /> Analysing reviews…</div>
          ) : sentiment ? (
            <>
              <div className="sentiment-bars">
                {[
                  { label: 'Positive', key: 'positive', color: '#22c55e' },
                  { label: 'Neutral',  key: 'neutral',  color: '#f59e0b' },
                  { label: 'Negative', key: 'negative', color: '#ef4444' },
                ].map(({ label, key, color }) => (
                  <div key={key} className="sentiment-row">
                    <span className="sentiment-label">{label}</span>
                    <div className="sentiment-bar-wrap">
                      <div className="sentiment-bar" style={{ width: `${(sentiment[key] / sentimentTotal) * 100}%`, background: color }} />
                    </div>
                    <span className="sentiment-count">{sentiment[key]}</span>
                  </div>
                ))}
              </div>
              {sentiment.summary && <p className="ai-insights-text" style={{ marginTop: '0.75rem' }}>{sentiment.summary}</p>}
            </>
          ) : (
            <p className="ai-insights-text" style={{ color: 'var(--text-muted)' }}>Not enough reviews to analyse yet.</p>
          )}
        </div>

        {/* Admin AI Chatbot */}
        <div className="card ai-card ai-chat-card">
          <h2 className="card-title"><Bot size={16} className="ai-icon-title" /> AI Business Assistant</h2>
          <div className="admin-chat-messages">
            {adminMsgs.length === 0 && (
              <p className="admin-chat-hint">Ask me about sales, inventory, top categories, or business advice.</p>
            )}
            {adminMsgs.map((m, i) => (
              <div key={i} className={`ai-msg ${m.role === 'user' ? 'ai-msg-user' : 'ai-msg-bot'}`}>{m.text}</div>
            ))}
            {adminLoading && <div className="ai-msg ai-msg-bot ai-typing"><span /><span /><span /></div>}
            <div ref={chatBottomRef} />
          </div>
          <div className="ai-chat-input" style={{ marginTop: 'auto' }}>
            <input
              placeholder="Ask a business question…"
              value={adminInput}
              onChange={e => setAdminInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendAdminChat()}
              disabled={adminLoading}
            />
            <button onClick={sendAdminChat} disabled={adminLoading || !adminInput.trim()}>
              {adminLoading ? <Loader2 size={16} className="ai-spin" /> : <Send size={16} />}
            </button>
          </div>
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
