import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api';

export default function ManageProduct() {
  const { id } = useParams(); // if present, edit mode
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers]   = useState([]);
  const [form, setForm] = useState({
    sku: '', name: '', description: '', price: '', category_id: '', supplier_id: '',
    quantity_on_hand: '', reorder_level: '10', is_active: true,
  });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([api.get('/categories'), api.get('/suppliers')])
      .then(([cats, sups]) => { setCategories(cats); setSuppliers(sups); })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (id) {
      api.get(`/products/${id}`).then(p => setForm({
        sku: p.sku, name: p.name, description: p.description || '',
        price: p.price, category_id: p.category_id, supplier_id: p.supplier_id,
        quantity_on_hand: p.quantity_on_hand, reorder_level: p.reorder_level,
        is_active: p.is_active,
      })).catch(console.error);
    }
  }, [id]);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setMsg('');
    setLoading(true);
    try {
      if (id) {
        await api.put(`/products/${id}`, { ...form, price: parseFloat(form.price), category_id: parseInt(form.category_id), supplier_id: parseInt(form.supplier_id), quantity_on_hand: parseInt(form.quantity_on_hand), reorder_level: parseInt(form.reorder_level) });
        setMsg('Product updated!');
      } else {
        await api.post('/products', { ...form, price: parseFloat(form.price), category_id: parseInt(form.category_id), supplier_id: parseInt(form.supplier_id), quantity_on_hand: parseInt(form.quantity_on_hand), reorder_level: parseInt(form.reorder_level) });
        setMsg('Product created!');
        setForm({ sku: '', name: '', description: '', price: '', category_id: '', supplier_id: '', quantity_on_hand: '', reorder_level: '10', is_active: true });
      }
    } catch (err) {
      setMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <button className="back-btn" onClick={() => navigate('/catalog')}>← Back</button>
      <h1 className="page-title">{id ? 'Edit Product' : 'Add New Product'}</h1>

      <form onSubmit={submit} className="manage-form card">
        <div className="form-grid">
          <label>SKU *
            <input value={form.sku} onChange={set('sku')} required disabled={!!id} placeholder="e.g. APL-IP16-256" />
          </label>
          <label>Product Name *
            <input value={form.name} onChange={set('name')} required placeholder="e.g. Apple iPhone 16" />
          </label>
          <label>Price (₹) *
            <input type="number" min="0" step="0.01" value={form.price} onChange={set('price')} required />
          </label>
          <label>Category *
            <select value={form.category_id} onChange={set('category_id')} required>
              <option value="">Select category</option>
              {categories.map(c => <option key={c.category_id} value={c.category_id}>{c.name}</option>)}
            </select>
          </label>
          <label>Supplier *
            <select value={form.supplier_id} onChange={set('supplier_id')} required>
              <option value="">Select supplier</option>
              {suppliers.map(s => <option key={s.supplier_id} value={s.supplier_id}>{s.name}</option>)}
            </select>
          </label>
          <label>Stock Qty
            <input type="number" min="0" value={form.quantity_on_hand} onChange={set('quantity_on_hand')} />
          </label>
          <label>Reorder Level
            <input type="number" min="0" value={form.reorder_level} onChange={set('reorder_level')} />
          </label>
          {id && (
            <label className="checkbox-label">
              <input type="checkbox" checked={form.is_active} onChange={set('is_active')} />
              Active
            </label>
          )}
        </div>
        <label>Description
          <textarea rows={3} value={form.description} onChange={set('description')} placeholder="Product description…" />
        </label>
        {msg && <p className={msg.includes('!') ? 'form-success' : 'form-error'}>{msg}</p>}
        <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Saving…' : id ? 'Update Product' : 'Create Product'}</button>
      </form>
    </div>
  );
}
