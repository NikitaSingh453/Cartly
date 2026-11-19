import { useState, useEffect, useRef } from 'react';
import { Bot, X, Send, Sparkles, Loader2 } from 'lucide-react';
import { geminiChat } from '../utils/gemini';
import { api } from '../api';

function buildSystemInstruction(products, cart) {
  const catalog = products.slice(0, 20)
    .map((p) => `${p.name} ₹${p.price} (${p.categoryName || p.category_name || ''})`)
    .join(', ');
  const cartItems = cart.length ? cart.map((i) => `${i.name}×${i.quantity}`).join(', ') : 'empty';
  return `You are Cartly's AI shopping assistant. Be concise (2-3 sentences max). Products: ${catalog}. User cart: ${cartItems}. Always use ₹ for prices.`;
}

const QUICK_PROMPTS = [
  'Best laptop under ₹1 lakh?',
  'Compare AirPods vs Sony headphones',
  'What\'s trending in Audio?',
];

export default function AIChatWidget() {
  const [open, setOpen]       = useState(false);
  const [input, setInput]     = useState('');
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [messages, setMessages] = useState([
    { role: 'model', text: 'Hi! I\'m Cartly\'s AI assistant 🛍️ Ask me anything about our products or get personalised recommendations.', initial: true },
  ]);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  useEffect(() => {
    if (open && products.length === 0) {
      api.get('/products?limit=50').then((d) => setProducts(d.products || [])).catch(() => {});
    }
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput('');
    const userMsg = { role: 'user', text: msg };
    setMessages((m) => [...m, userMsg]);
    setLoading(true);
    try {
      const cart = JSON.parse(localStorage.getItem('cartly_cart') || '[]');
      const history = [...messages, userMsg];
      const reply = await geminiChat(history, buildSystemInstruction(products, cart));
      setMessages((m) => [...m, { role: 'model', text: reply }]);
    } catch (e) {
      const isHighDemand = e.message?.toLowerCase().includes('high demand') || e.message?.includes('503');
      setMessages((m) => [...m, { role: 'model', text: isHighDemand ? 'Gemini is busy right now — please try again in a few seconds.' : `Sorry, I couldn't connect. (${e.message})` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button className={`ai-fab${open ? ' ai-fab-open' : ''}`} onClick={() => setOpen((o) => !o)} aria-label="AI Assistant">
        {open ? <X size={22} /> : <Sparkles size={22} />}
      </button>

      {open && (
        <div className="ai-chat-panel">
          <div className="ai-chat-header">
            <Bot size={16} />
            <span>Cartly AI</span>
            <span className="ai-online-dot" />
            <button className="ai-close-btn" onClick={() => setOpen(false)}><X size={15} /></button>
          </div>

          <div className="ai-chat-messages">
            {messages.map((m, i) => (
              <div key={i} className={`ai-msg ${m.role === 'user' ? 'ai-msg-user' : 'ai-msg-bot'}`}>
                {m.text}
              </div>
            ))}
            {loading && (
              <div className="ai-msg ai-msg-bot ai-typing">
                <span /><span /><span />
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {messages.length <= 1 && (
            <div className="ai-quick-prompts">
              {QUICK_PROMPTS.map((q) => (
                <button key={q} className="ai-quick-btn" onClick={() => send(q)}>{q}</button>
              ))}
            </div>
          )}

          <div className="ai-chat-input">
            <input
              ref={inputRef}
              placeholder="Ask me anything…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              disabled={loading}
            />
            <button onClick={() => send()} disabled={loading || !input.trim()}>
              {loading ? <Loader2 size={16} className="ai-spin" /> : <Send size={16} />}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
