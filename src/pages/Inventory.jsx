import React, { useState, useEffect } from 'react';
import { Package, Plus, Sparkles, RefreshCcw, Settings, Info, Trash2 } from 'lucide-react';
import axios from 'axios';

const Inventory = ({ user }) => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newItem, setNewItem] = useState({ name: '', category_id: '', price: '', stock: '' });
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [generating, setGenerating] = useState(false); // Specific for AI

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [prodRes, catRes] = await Promise.all([
                axios.get('/api/products'),
                axios.get('/api/categories')
            ]);
            setProducts(prodRes.data);
            setCategories(catRes.data);
            if (catRes.data.length > 0 && !newItem.category_id) {
                setNewItem(prev => ({ ...prev, category_id: catRes.data[0].id }));
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        setProcessing(true);
        try {
            await axios.post('/api/products', { ...newItem, user_id: user.id });
            setNewItem({ name: '', category_id: categories[0]?.id || '', price: '', stock: '' });
            fetchData();
        } catch (err) {
            console.error(err);
            alert('Error al agregar producto');
        } finally {
            setProcessing(false);
        }
    };

    const handleGenerateSpecs = async (product) => {
        setGenerating(true);
        try {
            const res = await axios.post('/api/ai/generate-specs', { productName: product.name });
            await axios.post(`/api/products/${product.id}/attributes`, { specs: res.data.specs, user_id: user.id });
            fetchData();
            setSelectedProduct(null);
        } catch (err) {
            alert('Error con la IA');
        } finally {
            setGenerating(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Estás seguro de eliminar este producto? Esta acción no se puede deshacer.')) return;
        setProcessing(true);
        try {
            await axios.delete(`/api/products/${id}?user_id=${user.id}`);
            fetchData();
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.details || err.response?.data?.error || err.message;
            alert('Error al eliminar producto: ' + msg);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div>
            <h1>Gestión de Inventario (Normalizado)</h1>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
                <div className="glass" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3>📦 Catálogo de Productos</h3>
                        <button onClick={fetchData} className="btn"><RefreshCcw size={16} /> Refrescar</button>
                    </div>
                    
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Categoría</th>
                                <th>Precio</th>
                                <th>Stock</th>
                                <th>Spec IA</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(p => (
                                <tr key={p.id}>
                                    <td style={{ fontWeight: 600 }}>{p.name}</td>
                                    <td><span className="tag tag-blue">{p.category}</span></td>
                                    <td style={{ color: 'var(--primary)', fontWeight: 'bold' }}>${p.price}</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: p.stock > 5 ? '#10b981' : '#f43f5e' }}></span>
                                            {p.stock} uds
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '4px' }}>
                                            {p.attributes && p.attributes.length > 0 ? (
                                                <button onClick={() => setSelectedProduct(p)} className="btn" style={{ padding: '4px 8px', fontSize: '0.7rem', background: 'rgba(0, 242, 255, 0.1)' }}>
                                                    <Info size={12} /> Ver {p.attributes.length}
                                                </button>
                                            ) : (
                                                <span style={{ opacity: 0.4, fontSize: '0.8rem' }}>Sin specs</span>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button onClick={() => handleGenerateSpecs(p)} className="btn btn-primary" style={{ padding: '5px 10px', fontSize: '0.8rem' }} disabled={generating}>
                                                <Sparkles size={14} /> AI Specs
                                            </button>
                                            <button onClick={() => handleDelete(p.id)} className="btn" style={{ padding: '5px 10px', background: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e' }} disabled={processing}>
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="glass" style={{ padding: '1.5rem' }}>
                        <h3 style={{ marginBottom: '1.5rem' }}><Plus size={20} color="var(--primary)" /> Nuevo Producto</h3>
                        <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div className="form-group">
                                <label>Nombre</label>
                                <input value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} required />
                            </div>
                            <div className="form-group">
                                <label>Categoría</label>
                                <select value={newItem.category_id} onChange={e => setNewItem({...newItem, category_id: e.target.value})} required>
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Precio ($)</label>
                                <input type="number" step="0.01" value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} required />
                            </div>
                            <div className="form-group">
                                <label>Stock Inicial</label>
                                <input type="number" value={newItem.stock} onChange={e => setNewItem({...newItem, stock: e.target.value})} required />
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={processing}>
                                {processing ? 'Guardando...' : 'Guardar'}
                            </button>
                        </form>
                    </div>

                    {selectedProduct && (
                        <div className="glass" style={{ padding: '1.5rem', border: '1px solid var(--primary)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <h4 style={{ color: 'var(--primary)' }}>Especificaciones</h4>
                                <button onClick={() => setSelectedProduct(null)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>×</button>
                            </div>
                            <p style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: '1rem' }}>{selectedProduct.name}</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {selectedProduct.attributes.map((attr, idx) => (
                                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', padding: '8px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                                        <span style={{ opacity: 0.5 }}>{attr.key}</span>
                                        <span style={{ fontWeight: 600 }}>{attr.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Inventory;
