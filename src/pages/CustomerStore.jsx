import React, { useState, useEffect } from 'react';
import { ShoppingCart, Package, Info, CheckCircle, CreditCard, Trash2, Plus, Minus, Search, Sparkles, X, ShoppingBag, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useToast } from '../ToastContext';

const CustomerStore = ({ user }) => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showCart, setShowCart] = useState(false);
    const { showToast } = useToast();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await axios.get('/api/products');
            setProducts(res.data);
        } catch (err) {
            console.error(err);
            showToast('Falla al sincronizar catálogo', 'error');
        } finally {
            setLoading(false);
        }
    };

    const addToCart = (product) => {
        const existing = cart.find(item => item.id === product.id);
        if (existing) {
            setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }
        showToast(`${product.name} agregado a tu selección`, 'success');
        setShowCart(true);
    };

    const updateQuantity = (id, delta) => {
        setCart(cart.map(item => {
            if (item.id === id) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const removeFromCart = (id) => {
        setCart(cart.filter(item => item.id !== id));
        showToast('Producto eliminado del carrito', 'info');
    };

    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const handleCheckout = async () => {
        if (cart.length === 0) return;
        setProcessing(true);
        try {
            const checkoutData = {
                client: {
                    name: user.name,
                    nit_dni: 'CONSUMIDOR FINAL',
                    address: 'Compra en Línea'
                },
                items: cart,
                userId: user.id
            };
            
            await axios.post('/api/billing/invoice', checkoutData);
            showToast('¡Compra realizada con éxito! Tu pedido está en proceso.', 'success');
            setCart([]);
            setShowCart(false);
            fetchProducts();
        } catch (err) {
            showToast('Error en la transacción: ' + (err.response?.data?.error || err.message), 'error');
        } finally {
            setProcessing(false);
        }
    };

    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ padding: '1rem', maxWidth: '1400px', margin: '0 auto' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <motion.div initial={{ x: -25, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                    <h1 style={{ fontSize: '3rem', fontWeight: 950, marginBottom: '0.6rem', letterSpacing: '-1.5px', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Selección <span style={{ background: 'linear-gradient(to right, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>TechFlow</span></h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem' }}>Hola, {user.name}. Las mejores ofertas en hardware premium.</p>
                </motion.div>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowCart(true)} className="glass" style={{ padding: '1.2rem 2.2rem', borderRadius: '20px', position: 'relative', border: '1px solid var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 10px 25px rgba(139, 92, 246, 0.2)' }}>
                    <ShoppingCart size={24} color="var(--primary)" /><span style={{ fontWeight: 800, fontSize: '1.1rem' }}>Mi Carrito</span>
                    {cart.length > 0 && ( <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ position: 'absolute', top: '-12px', right: '-12px', background: 'var(--secondary)', color: '#fff', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 900, boxShadow: '0 4px 15px rgba(236, 72, 153, 0.5)' }}>{cart.length}</motion.div> )}
                </motion.button>
            </header>

            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="glass-card" style={{ marginBottom: '3.5rem', padding: '0.6rem 2rem', display: 'flex', alignItems: 'center', gap: '18px' }}><Search size={24} color="var(--primary)" /><input type="text" placeholder="Busca el futuro: laptops, componentes, smartphones..." style={{ background: 'transparent', border: 'none', color: '#fff', width: '100%', padding: '1.3rem', fontSize: '1.3rem', outline: 'none' }} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></motion.div>

            {loading ? ( <div style={{ textAlign: 'center', padding: '10rem', fontSize: '1.5rem', fontWeight: 700, opacity: 0.4 }}>SINCRONIZANDO CATÁLOGO...</div> ) : (
                <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '3rem' }}>
                    {filteredProducts.map((product, idx) => (
                        <motion.div layout initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} key={product.id} className="glass-card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}><div className="tag tag-purple" style={{ padding: '0.6rem 1.2rem', borderRadius: '12px' }}>{product.category}</div>{product.stock < 5 && product.stock > 0 && <span className="tag tag-blue" style={{ color: '#f87171', background: 'rgba(248, 113, 113, 0.1)', borderColor: 'rgba(248, 113, 113, 0.2)' }}>¡Stock Crítico!</span>}</div>
                            <h3 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '1.2rem', letterSpacing: '-0.8px' }}>{product.name}</h3>
                            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '20px', marginBottom: '2.5rem', border: '1px solid rgba(255,255,255,0.05)' }}><p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 800 }}><Sparkles size={16} color="var(--secondary)" /> Análisis Digital</p><div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>{product.attributes?.length > 0 ? product.attributes.slice(0, 3).map((attr, i) => ( <div key={i} style={{ fontSize: '0.85rem', background: 'rgba(255,255,255,0.06)', padding: '6px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}><span style={{ opacity: 0.5, fontWeight: 600 }}>{attr.key}</span>: <span style={{ fontWeight: 700 }}>{attr.value}</span></div> )) : <span style={{ fontSize: '0.9rem', opacity: 0.4, fontStyle: 'italic' }}>Optimizando especificaciones técnicas...</span>}</div></div>
                            <div style={{ marginTop: 'auto' }}><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}><div><span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '1px' }}>Precio Sugerido</span><span style={{ fontSize: '2.6rem', fontWeight: 950, color: 'var(--primary)', letterSpacing: '-2px' }}>${product.price}</span></div><span style={{ fontSize: '0.95rem', color: product.stock > 0 ? 'var(--success)' : 'var(--accent)', fontWeight: 800, background: 'rgba(255,255,255,0.03)', padding: '8px 16px', borderRadius: '12px' }}>{product.stock > 0 ? `${product.stock} unidades` : 'Agotado'}</span></div><motion.button whileHover={{ scale: 1.03, boxShadow: '0 15px 30px rgba(139, 92, 246, 0.4)' }} whileTap={{ scale: 0.97 }} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '1.2rem', borderRadius: '18px', fontSize: '1.1rem' }} disabled={product.stock === 0} onClick={() => addToCart(product)}><Plus size={22} /> Añadir al Carrito</motion.button></div>
                        </motion.div>
                    ))}
                </motion.div>
            )}

            <AnimatePresence>
                {showCart && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCart(false)} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', zIndex: 999 }} />
                        <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 28, stiffness: 220 }} style={{ position: 'fixed', top: 20, right: 20, bottom: 20, width: '500px', background: 'var(--glass)', backdropFilter: 'blur(30px)', zIndex: 1000, padding: '3rem', borderRadius: '35px', border: '1px solid var(--border)', boxShadow: '-15px 0 60px rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3.5rem' }}><div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}><div style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', padding: '10px', borderRadius: '12px' }}><ShoppingBag size={24} color="#fff" /></div><h2 style={{ fontSize: '2rem', fontWeight: 950, letterSpacing: '-1.5px' }}>Bolsa de Compra</h2></div><motion.button whileHover={{ rotate: 90, background: 'rgba(255,255,255,0.1)' }} onClick={() => setShowCart(false)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', cursor: 'pointer', width: '45px', height: '45px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }} ><X size={24} /></motion.button></div>
                            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.8rem' }}>
                                {cart.length === 0 ? ( <div style={{ textAlign: 'center', padding: '6rem 0', opacity: 0.3 }}><ShoppingCart size={64} style={{ marginBottom: '1.5rem', opacity: 0.1 }} /><p style={{ fontSize: '1.2rem' }}>Tu carrito está esperando tecnología.</p></div> ) : ( <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>{cart.map(item => ( <motion.div layout key={item.id} className="glass" style={{ padding: '1.5rem', display: 'flex', gap: '1.5rem', alignItems: 'center', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px' }}><div style={{ flex: 1 }}><p style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.4rem' }}>{item.name}</p><p style={{ color: 'var(--primary)', fontWeight: 900, fontSize: '1.2rem' }}>${item.price}</p></div><div style={{ display: 'flex', alignItems: 'center', gap: '15px', background: 'rgba(0,0,0,0.3)', padding: '8px 16px', borderRadius: '15px' }}><button onClick={() => updateQuantity(item.id, -1)} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}><Minus size={16} /></button><span style={{ fontWeight: 900, minWidth: '25px', textAlign: 'center', fontSize: '1.1rem' }}>{item.quantity}</span><button onClick={() => updateQuantity(item.id, 1)} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}><Plus size={16} /></button></div><button onClick={() => removeFromCart(item.id)} style={{ background: 'rgba(239, 68, 68, 0.1)', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '10px', borderRadius: '12px', transition: 'all 0.3s' }}><Trash2 size={20} /></button></motion.div> ))}</div> )}
                            </div>
                            <div style={{ marginTop: '2.5rem', paddingTop: '3rem', borderTop: '1px solid var(--border)' }}><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}><div><span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Total de Inversión</span><div style={{ fontSize: '1.1rem', color: 'var(--success)', fontWeight: 600, marginTop: '4px' }}>Envío Prioritario Bonificado</div></div><span style={{ fontSize: '3rem', fontWeight: 950, color: 'var(--primary)', letterSpacing: '-3px' }}>${cartTotal}</span></div><motion.button whileHover={{ scale: 1.02, filter: 'brightness(1.1)' }} whileTap={{ scale: 0.98 }} className="btn btn-primary" style={{ width: '100%', padding: '1.5rem', justifyContent: 'center', fontSize: '1.4rem', borderRadius: '24px', fontWeight: 900, boxShadow: '0 15px 40px rgba(139, 92, 246, 0.5)' }} disabled={cart.length === 0 || processing} onClick={handleCheckout} > {processing ? 'PROTEGIENDO TRANSACCIÓN...' : 'FINALIZAR Y PAGAR'} </motion.button><div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '2rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}><Shield size={16} color="var(--success)" /> Conexión Cifrada SSL | TechFlow Security Suite</div></div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CustomerStore;
