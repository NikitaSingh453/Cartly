import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api';

export default function ManageProduct() {
  const { id } = useParams(); // if present, edit mode
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers]   = useState([]);
  const [form, setForm] = useState({
    sku: '', name: '', description: '', price: '', categoryId: '', supplierId: '',
    quantityOnHand: '', reorderLevel: '10', isActive: true,
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
        price: p.price, categoryId: p.categoryId, supplierId: p.supplierId,
        quantityOnHand: p.quantityOnHand, reorderLevel: p.reorderLevel,
        isActive: p.isActive,
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
        await api.put(`/products/${id}`, { ...form, price: parseFloat(form.price), categoryId: parseInt(form.categoryId), supplierId: parseInt(form.supplierId), quantityOnHand: parseInt(form.quantityOnHand), reorderLevel: parseInt(form.reorderLevel) });
        setMsg('Product updated!');
      } else {
        await api.post('/products', { ...form, price: parseFloat(form.price), categoryId: parseInt(form.categoryId), supplierId: parseInt(form.supplierId), quantityOnHand: parseInt(form.quantityOnHand), reorderLevel: parseInt(form.reorderLevel) });
        setMsg('Product created!');
        setForm({ sku: '', name: '', description: '', price: '', categoryId: '', supplierId: '', quantityOnHand: '', reorderLevel: '10', isActive: true });
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
            <select value={form.categoryId} onChange={set('categoryId')} required>
              <option value="">Select category</option>
              {categories.map(c => <option key={c.categoryId} value={c.categoryId}>{c.name}</option>)}
            </select>
          </label>
          <label>Supplier *
            <select value={form.supplierId} onChange={set('supplierId')} required>
              <option value="">Select supplier</option>
              {suppliers.map(s => <option key={s.supplierId} value={s.supplierId}>{s.name}</option>)}
            </select>
          </label>
          <label>Stock Qty
            <input type="number" min="0" value={form.quantityOnHand} onChange={set('quantityOnHand')} />
          </label>
          <label>Reorder Level
            <input type="number" min="0" value={form.reorderLevel} onChange={set('reorderLevel')} />
          </label>
          {id && (
            <label className="checkbox-label">
              <input type="checkbox" checked={form.isActive} onChange={set('isActive')} />
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
