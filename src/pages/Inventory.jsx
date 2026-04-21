import React, { useState, useEffect } from 'react';
import { Package, Plus, Sparkles, RefreshCcw, Settings, Info, Trash2, Box, ChevronRight, X, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useToast } from '../ToastContext';

const Inventory = ({ user }) => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newItem, setNewItem] = useState({ name: '', category_id: '', price: '', stock: '' });
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const { showToast } = useToast();

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
            showToast('Error al cargar datos del almacén', 'error');
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
            showToast('Producto registrado exitosamente', 'success');
            fetchData();
        } catch (err) {
            console.error(err);
            showToast('Falla en el registro de producto', 'error');
        } finally {
            setProcessing(false);
        }
    };

    const handleGenerateSpecs = async (product) => {
        setGenerating(true);
        showToast('Generando parámetros con IA...', 'info');
        try {
            const res = await axios.post('/api/ai/generate-specs', { productName: product.name });
            await axios.post(`/api/products/${product.id}/attributes`, { specs: res.data.specs, user_id: user.id });
            showToast('Especificaciones IA sincronizadas', 'success');
            fetchData();
            setSelectedProduct(null);
        } catch (err) {
            showToast('Falla en la interconexión con IA', 'error');
        } finally {
            setGenerating(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Confirmar purga de registro? Esta acción es irreversible.')) return;
        setProcessing(true);
        try {
            await axios.delete(`/api/products/${id}?user_id=${user.id}`);
            showToast('Registro eliminado satisfactoriamente', 'success');
            fetchData();
        } catch (err) {
            console.error(err);
            showToast('Error al purgar registro', 'error');
        } finally {
            setProcessing(false);
        }
    };

    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 950, marginBottom: '0.5rem', letterSpacing: '-1.5px' }}>Gestión de Inventario</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Control centralizado de existencias y parametrización avanzada.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div className="glass" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Search size={18} color="var(--text-secondary)" />
                        <input type="text" placeholder="Buscar en stock..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', fontSize: '0.9rem', width: '200px' }} />
                    </div>
                    <button onClick={fetchData} className="btn btn-outline" style={{ padding: '0.7rem 1.2rem' }}><RefreshCcw size={18} /></button>
                </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2.5rem', alignItems: 'start' }}>
                <div className="glass" style={{ padding: '2rem', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '10px', borderRadius: '12px' }}><Box size={20} color="var(--primary)" /></div>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Catálogo de Activos</h3>
                        </div>
                        <span className="tag tag-purple">{filteredProducts.length} Productos</span>
                    </div>
                    
                    {loading ? ( <div style={{ textAlign: 'center', padding: '5rem', opacity: 0.5 }}>Cargando datos maestros...</div> ) : (
                        <table style={{ borderSpacing: '0 12px' }}>
                            <thead>
                                <tr style={{ background: 'transparent' }}>
                                    <th style={{ paddingLeft: '0' }}>Producto</th>
                                    <th>Categoría</th>
                                    <th>Precio</th>
                                    <th>Stock</th>
                                    <th>Specs IA</th>
                                    <th style={{ textAlign: 'right' }}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence>
                                    {filteredProducts.map((p, idx) => (
                                        <motion.tr key={p.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.03 }} style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '15px' }}>
                                            <td style={{ padding: '1.2rem', fontWeight: 700, borderTopLeftRadius: '15px', borderBottomLeftRadius: '15px' }}>{p.name}</td>
                                            <td><span className="tag tag-blue" style={{ fontSize: '0.7rem' }}>{p.category}</span></td>
                                            <td style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '1.1rem' }}>${p.price}</td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <div style={{ width: '40px', background: 'rgba(255,255,255,0.05)', height: '6px', borderRadius: '10px', overflow: 'hidden' }}>
                                                        <div style={{ width: `${Math.min(100, (p.stock / 20) * 100)}%`, height: '100%', background: p.stock > 5 ? 'var(--success)' : 'var(--accent)' }}></div>
                                                    </div>
                                                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{p.stock}</span>
                                                </div>
                                            </td>
                                            <td>
                                                {p.attributes && p.attributes.length > 0 ? (
                                                    <button onClick={() => setSelectedProduct(p)} className="btn btn-outline" style={{ padding: '6px 14px', fontSize: '0.75rem', borderRadius: '10px' }}><Info size={14} /> {p.attributes.length} Atributos</button>
                                                ) : ( <span style={{ opacity: 0.3, fontSize: '0.8rem' }}>Sin datos</span> )}
                                            </td>
                                            <td style={{ textAlign: 'right', borderTopRightRadius: '15px', borderBottomRightRadius: '15px', paddingRight: '1.2rem' }}>
                                                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                                    <button onClick={() => handleGenerateSpecs(p)} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.8rem', borderRadius: '10px' }} disabled={generating}>{generating ? '...' : <><Sparkles size={14} /> IA</>}</button>
                                                    <button onClick={() => handleDelete(p.id)} className="btn" style={{ padding: '8px', background: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e', borderRadius: '10px' }} disabled={processing}><Trash2 size={16} /></button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                    <div className="glass" style={{ padding: '2rem', border: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem' }}>
                            <div style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '8px', borderRadius: '10px' }}><Plus size={20} color="var(--primary)" /></div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Nuevo Activo</h3>
                        </div>
                        <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div className="form-group"><label>Nombre del Producto</label><input value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} placeholder="Ej: Monitor 4K" required /></div>
                            <div className="form-group"><label>Categoría</label><select value={newItem.category_id} onChange={e => setNewItem({...newItem, category_id: e.target.value})} required>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}><div className="form-group"><label>Precio ($)</label><input type="number" step="0.01" value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} placeholder="0.00" required /></div><div className="form-group"><label>Stock</label><input type="number" value={newItem.stock} onChange={e => setNewItem({...newItem, stock: e.target.value})} placeholder="0" required /></div></div>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '1rem' }} disabled={processing}>{processing ? 'Sincronizando...' : 'Registrar Producto'}</button>
                        </form>
                    </div>

                    <AnimatePresence>
                        {selectedProduct && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="glass" style={{ padding: '2rem', border: '1px solid var(--primary)', background: 'rgba(139, 92, 246, 0.05)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}><h4 style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Especificaciones IA</h4><button onClick={() => setSelectedProduct(null)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', cursor: 'pointer', borderRadius: '50%', padding: '5px' }}><X size={16} /></button></div>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', fontWeight: 600 }}>{selectedProduct.name}</p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>{selectedProduct.attributes.map((attr, idx) => ( <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}><span style={{ opacity: 0.5, fontWeight: 600 }}>{attr.key}</span><span style={{ fontWeight: 800, color: 'var(--primary)' }}>{attr.value}</span></div> ))}</div>
                                <button onClick={() => handleGenerateSpecs(selectedProduct)} className="btn btn-outline" style={{ width: '100%', marginTop: '1.5rem', justifyContent: 'center', fontSize: '0.8rem' }} disabled={generating}><RefreshCcw size={14} /> Regenerar con IA</button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
};

export default Inventory;
