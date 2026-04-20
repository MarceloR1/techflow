import React, { useState, useEffect } from 'react';
import { ShoppingCart, Package, Info, CheckCircle, CreditCard, Trash2, Plus, Minus, Search, Sparkles } from 'lucide-react';
import axios from 'axios';

const CustomerStore = ({ user }) => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showCart, setShowCart] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await axios.get('/api/products');
            setProducts(res.data);
        } catch (err) {
            console.error(err);
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
        // Feedback visual
        const btn = document.getElementById(`add-btn-${product.id}`);
        if(btn) {
            btn.innerHTML = '<span class="tag tag-green">¡Añadido!</span>';
            setTimeout(() => { btn.innerHTML = 'Añadir al Carrito'; }, 1000);
        }
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
    };

    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const handleCheckout = async () => {
        if (cart.length === 0) return;
        setProcessing(true);
        try {
            // Para el cliente, usamos sus datos de usuario
            const checkoutData = {
                client: {
                    name: user.name,
                    nit_dni: 'CONSUMIDOR FINAL', // Opcional: pedirlo en perfil
                    address: 'Compra en Línea'
                },
                items: cart,
                userId: user.id
            };
            
            await axios.post('/api/billing/invoice', checkoutData);
            alert('¡Compra realizada con éxito! Tu pedido ha sido procesado como PAGADO.');
            setCart([]);
            setShowCart(false);
            fetchProducts(); // Refrescar stock
        } catch (err) {
            alert('Error en la compra: ' + (err.response?.data?.error || err.message));
        } finally {
            setProcessing(false);
        }
    };

    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ padding: '2rem' }}>
            {/* Header Tienda */}
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>
                        Bienvenido, <span style={{ color: 'var(--primary)' }}>{user.name}</span>
                    </h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Explora lo último en tecnología de vanguardia.</p>
                </div>
                
                <button 
                    onClick={() => setShowCart(!showCart)}
                    className="glass" 
                    style={{ padding: '1rem 2rem', borderRadius: '15px', position: 'relative', border: '1px solid var(--primary)', cursor: 'pointer' }}
                >
                    <ShoppingCart size={24} color="var(--primary)" />
                    <span style={{ marginLeft: '10px', fontWeight: 700 }}>Carrito</span>
                    {cart.length > 0 && (
                        <div style={{ position: 'absolute', top: '-10px', right: '-10px', background: 'var(--accent)', color: '#fff', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 800 }}>
                            {cart.length}
                        </div>
                    )}
                </button>
            </header>

            {/* Barra de Búsqueda */}
            <div className="glass-card" style={{ marginBottom: '3rem', padding: '0.5rem 1.5rem', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <Search size={20} color="var(--primary)" />
                <input 
                    type="text" 
                    placeholder="Buscar laptops, smartphones, accesorios..." 
                    style={{ background: 'transparent', border: 'none', color: '#fff', width: '100%', padding: '1rem', fontSize: '1.1rem', outline: 'none' }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Grid de Productos */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '5rem' }}>Cargando tecnología...</div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '2rem' }}>
                    {filteredProducts.map(product => (
                        <div key={product.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', transition: 'transform 0.3s' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                <div className="tag tag-purple">{product.category}</div>
                                {product.stock < 5 && product.stock > 0 && <div className="tag tag-red">¡Últimas unidades!</div>}
                            </div>
                            
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>{product.name}</h3>
                            
                            {/* Specs de IA (Subtle) */}
                            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px dashed var(--border)' }}>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Sparkles size={14} color="var(--secondary)" /> Spec Técnica
                                </p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '0.5rem' }}>
                                    {product.attributes?.slice(0, 3).map((attr, i) => (
                                        <span key={i} style={{ fontSize: '0.75rem', opacity: 0.8 }}>• {attr.key}: {attr.value}</span>
                                    ))}
                                </div>
                            </div>

                            <div style={{ marginTop: 'auto' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                    <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)' }}>${product.price}</span>
                                    <span style={{ fontSize: '0.85rem', color: product.stock > 0 ? 'var(--success)' : 'var(--accent)' }}>
                                        {product.stock > 0 ? `${product.stock} disponibles` : 'Agotado'}
                                    </span>
                                </div>
                                
                                <button 
                                    id={`add-btn-${product.id}`}
                                    className="btn btn-primary" 
                                    style={{ width: '100%', justifyContent: 'center' }}
                                    disabled={product.stock === 0}
                                    onClick={() => addToCart(product)}
                                >
                                    Añadir al Carrito
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Sidebar del Carrito (Modal-ish) */}
            {showCart && (
                <div style={{ position: 'fixed', top: 0, right: 0, width: '450px', height: '100vh', background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(15px)', zIndex: 1000, padding: '2.5rem', borderLeft: '1px solid var(--border)', boxShadow: '-10px 0 30px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Tu Carrito</h2>
                        <button onClick={() => setShowCart(false)} className="btn" style={{ padding: '0.5rem' }}><Trash2 size={24} /></button>
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {cart.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '3rem', opacity: 0.5 }}>Tu carrito está vacío.</div>
                        ) : (
                            cart.map(item => (
                                <div key={item.id} className="glass" style={{ padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontWeight: 600 }}>{item.name}</p>
                                        <p style={{ color: 'var(--primary)', fontWeight: 700 }}>${item.price}</p>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <button onClick={() => updateQuantity(item.id, -1)} className="btn" style={{ padding: '0.2rem' }}><Minus size={16} /></button>
                                        <span style={{ fontWeight: 800 }}>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, 1)} className="btn" style={{ padding: '0.2rem' }}><Plus size={16} /></button>
                                    </div>
                                    <button onClick={() => removeFromCart(item.id)} style={{ background: 'transparent', border: 'none', color: 'var(--accent)', cursor: 'pointer' }}><Trash2 size={18} /></button>
                                </div>
                            ))
                        )}
                    </div>

                    <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                            <span style={{ fontSize: '1.2rem' }}>Total estimado:</span>
                            <span style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary)' }}>${cartTotal}</span>
                        </div>
                        <button 
                            className="btn btn-primary" 
                            style={{ width: '100%', padding: '1.2rem', justifyContent: 'center', fontSize: '1.2rem' }}
                            disabled={cart.length === 0 || processing}
                            onClick={handleCheckout}
                        >
                            {processing ? 'Procesando Pago...' : 'Finalizar y Pagar Ahora'}
                        </button>
                        <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '1rem' }}>
                            Pago seguro mediante pasarela TechFlow.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerStore;
