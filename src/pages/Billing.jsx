import React, { useState, useEffect } from 'react';
import { ShoppingCart, User, Plus, Trash2, CheckCircle, Search, CreditCard, Receipt, Users, Package, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useToast } from '../App';

const Billing = ({ user }) => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [client, setClient] = useState({ name: '', nit_dni: '', address: '' });
    const [success, setSuccess] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const { showToast } = useToast();

    useEffect(() => {
        axios.get('/api/products').then(res => setProducts(res.data));
    }, [success]);

    const addToCart = (product) => {
        const existing = cart.find(item => item.id === product.id);
        if (existing) {
            setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
            showToast(`${product.name} añadido a la orden`, 'success');
        }
    };

    const removeFromCart = (id) => setCart(cart.filter(item => item.id !== id));

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const handleCheckout = async () => {
        if (!client.name || !client.nit_dni || cart.length === 0) {
            showToast('Complete los datos del cliente y la selección de productos', 'error');
            return;
        }

        setProcessing(true);
        try {
            await axios.post('/api/billing/invoice', {
                client,
                items: cart,
                userId: user.id
            });
            setSuccess(true);
            setCart([]);
            setClient({ name: '', nit_dni: '', address: '' });
            showToast('Orden procesada y facturada correctamente', 'success');
            setTimeout(() => setSuccess(false), 5000);
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.details || err.response?.data?.error || err.message;
            showToast('Error crítico en facturación: ' + msg, 'error');
        } finally {
            setProcessing(false);
        }
    };

    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 950, letterSpacing: '-1.5px', marginBottom: '0.5rem' }}>Terminal de Punto de Venta</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Procesamiento de facturación manual y gestión de órdenes locales.</p>
                </div>
                <div style={{ background: 'var(--glass)', padding: '0.8rem 1.5rem', borderRadius: '15px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Users size={18} color="var(--primary)" />
                    <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Operador: {user.name}</span>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '2.5rem', alignItems: 'start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="glass" style={{ padding: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}><Package size={22} color="var(--primary)" /> Selección de Artículos</h3>
                            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.5rem 1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}><Search size={16} color="var(--text-secondary)" /><input type="text" placeholder="Buscar producto..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', fontSize: '0.9rem' }} /></div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
                            <AnimatePresence>
                                {filteredProducts.map(p => (
                                    <motion.div layout key={p.id} className="glass-card" style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }} whileHover={{ y: -5 }}>
                                        <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '60px', height: '60px', background: 'var(--primary)', filter: 'blur(30px)', opacity: 0.1 }}></div>
                                        <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.5rem' }}>{p.name}</h4><div className="tag tag-blue" style={{ fontSize: '0.65rem', marginBottom: '1rem' }}>{p.category}</div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto' }}><div><span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Precio</span><span style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--primary)' }}>${p.price}</span></div><div style={{ textAlign: 'right' }}><span style={{ fontSize: '0.7rem', color: p.stock > 5 ? 'var(--success)' : 'var(--accent)', fontWeight: 700 }}>Stock: {p.stock}</span><button onClick={() => addToCart(p)} className="btn btn-primary" style={{ padding: '6px', borderRadius: '8px', marginTop: '4px' }} disabled={p.stock <= 0}><Plus size={18} /></button></div></div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                    <div className="glass" style={{ padding: '2rem', border: '1px solid var(--border)' }}>
                        <h3 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.1rem', fontWeight: 800 }}><User size={20} color="var(--primary)" /> Perfil de Facturación</h3>
                        <div className="form-group"><label>Nombre / Razón Social</label><input value={client.name} onChange={e => setClient({...client, name: e.target.value})} placeholder="Ej: Marcela Rodriguez" /></div>
                        <div className="form-group"><label>Identificación (NIT/DNI)</label><input value={client.nit_dni} onChange={e => setClient({...client, nit_dni: e.target.value})} placeholder="Ej: 800234551" /></div>
                        <div className="form-group"><label>Dirección Física</label><input value={client.address} onChange={e => setClient({...client, address: e.target.value})} placeholder="Sede Central, Edif. Tech" /></div>
                    </div>
                    <div className="glass" style={{ padding: '2.5rem', background: 'var(--bg-card)', border: '1px solid var(--primary)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}><h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem', fontWeight: 800 }}><Receipt size={20} color="var(--primary)" /> Resumen de Orden</h3><span className="tag tag-purple">{cart.length} Items</span></div>
                        <div style={{ maxHeight: '250px', overflowY: 'auto', marginBottom: '2rem', paddingRight: '0.5rem' }}>
                            {cart.length === 0 ? ( <div style={{ textAlign: 'center', opacity: 0.3, padding: '2rem' }}><ShoppingCart size={40} style={{ marginBottom: '1rem' }} /><p>Esperando selección...</p></div> ) : ( <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>{cart.map(item => ( <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}><div style={{ flex: 1 }}><p style={{ fontSize: '0.95rem', fontWeight: 700 }}>{item.name}</p><p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.quantity} x ${item.price}</p></div><div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><span style={{ fontWeight: 900, color: 'var(--primary)', background: 'rgba(139, 92, 246, 0.1)', padding: '4px 8px', borderRadius: '8px' }}>${(item.quantity * item.price).toFixed(2)}</span><button onClick={() => removeFromCart(item.id)} style={{ background: 'transparent', border: 'none', color: '#f43f5e', cursor: 'pointer', padding: '5px' }}><Trash2 size={16} /></button></div></div> ))}</div> )}
                        </div>
                        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '2rem', marginBottom: '2rem' }}><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}><div><span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Total a Pagar</span><span style={{ fontSize: '0.9rem', color: 'var(--success)' }}>Incluye impuestos de ley</span></div><span style={{ fontSize: '2.8rem', fontWeight: 950, color: 'var(--primary)', letterSpacing: '-2px' }}>${total.toFixed(2)}</span></div></div>
                        <AnimatePresence>
                            {success ? (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)', padding: '1.5rem', textAlign: 'center', borderRadius: '15px', border: '1px solid var(--success)' }}><CheckCircle size={28} style={{ margin: '0 auto 0.8rem' }} /><p style={{ fontWeight: 800 }}>¡Venta Transaccionada!</p><p style={{ fontSize: '0.8rem', opacity: 0.8 }}>Factura sincronizada y stock actualizado.</p></motion.div>
                            ) : (
                                <motion.button whileHover={{ scale: 1.02, boxShadow: '0 10px 25px rgba(139, 92, 246, 0.4)' }} whileTap={{ scale: 0.98 }} onClick={handleCheckout} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '1.3rem', borderRadius: '18px', fontSize: '1.1rem', fontWeight: 800 }} disabled={cart.length === 0 || processing}>{processing ? 'Generando Asientos...' : <><CreditCard size={20} /> Procesar Factura</>}</motion.button>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Billing;
