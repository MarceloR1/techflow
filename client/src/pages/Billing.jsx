import React, { useState, useEffect } from 'react';
import { ShoppingCart, User, Plus, Trash2, CheckCircle } from 'lucide-react';
import axios from 'axios';

const Billing = ({ user }) => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [client, setClient] = useState({ name: '', nit_dni: '', address: '' });
    const [success, setSuccess] = useState(false);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        axios.get('/api/products').then(res => setProducts(res.data));
    }, [success]);

    const addToCart = (product) => {
        const existing = cart.find(item => item.id === product.id);
        if (existing) {
            setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }
    };

    const removeFromCart = (id) => setCart(cart.filter(item => item.id !== id));

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const handleCheckout = async () => {
        if (!client.name || !client.nit_dni || cart.length === 0) {
            alert('Por favor complete los datos del cliente y agregue productos.');
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
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.details || err.response?.data?.error || err.message;
            alert('Error al generar la factura: ' + msg);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div>
            <h1>Módulo de Facturación</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
                {/* Product Selection */}
                <div>
                    <div className="glass" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                        <h3 style={{ marginBottom: '1rem' }}>Seleccionar Productos</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                            {products.map(p => (
                                <div key={p.id} className="glass-card" style={{ padding: '1rem' }}>
                                    <h4 style={{ fontSize: '1rem' }}>{p.name}</h4>
                                    <p style={{ color: 'var(--primary)', fontWeight: 700 }}>${p.price.toFixed(2)}</p>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Stock: {p.stock}</p>
                                    <button 
                                        onClick={() => addToCart(p)} 
                                        className="btn btn-primary" 
                                        style={{ width: '100%', padding: '0.4rem', marginTop: '0.5rem', fontSize: '0.8rem' }}
                                        disabled={p.stock <= 0}
                                    >
                                        <Plus size={14} /> Agregar
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Checkout Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Client Data */}
                    <div className="glass" style={{ padding: '1.5rem' }}>
                        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}><User size={18} /> Datos del Cliente</h3>
                        <div className="form-group">
                            <label>Nombre / Razón Social</label>
                            <input value={client.name} onChange={e => setClient({...client, name: e.target.value})} placeholder="Nombre completo" />
                        </div>
                        <div className="form-group">
                            <label>NIT / DNI</label>
                            <input value={client.nit_dni} onChange={e => setClient({...client, nit_dni: e.target.value})} placeholder="Identificación fiscal" />
                        </div>
                        <div className="form-group">
                            <label>Dirección</label>
                            <input value={client.address} onChange={e => setClient({...client, address: e.target.value})} placeholder="Opcional" />
                        </div>
                    </div>

                    {/* Cart Summary */}
                    <div className="glass" style={{ padding: '1.5rem' }}>
                        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}><ShoppingCart size={18} /> Resumen de Venta</h3>
                        <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '1rem' }}>
                            {cart.length === 0 ? (
                                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '1rem' }}>Carrito vacío</p>
                            ) : (
                                cart.map(item => (
                                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
                                        <div>
                                            <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>{item.name}</p>
                                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.quantity} x ${item.price}</p>
                                        </div>
                                        <button onClick={() => removeFromCart(item.id)} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer' }}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--primary)' }}>
                            <span>Total:</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                        
                        {success ? (
                            <div className="glass" style={{ background: 'rgba(0, 255, 136, 0.1)', color: 'var(--success)', padding: '1rem', textAlign: 'center', borderRadius: '10px' }}>
                                <CheckCircle size={24} style={{ margin: '0 auto 0.5rem' }} />
                                Factura Generada con Éxito
                            </div>
                        ) : (
                            <button 
                                onClick={handleCheckout} 
                                className="btn btn-primary" 
                                style={{ width: '100%', justifyContent: 'center' }} 
                                disabled={cart.length === 0 || processing}
                            >
                                {processing ? 'Procesando...' : 'Procesar Factura'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Billing;
