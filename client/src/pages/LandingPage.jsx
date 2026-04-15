import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Cpu, Smartphone, Headphones, ArrowRight } from 'lucide-react';
import axios from 'axios';

const LandingPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:5000/api/products')
            .then(res => setProducts(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const getIcon = (cat) => {
        if (cat === 'Laptop') return <Cpu size={24} color="var(--primary)" />;
        if (cat === 'Smartphone') return <Smartphone size={24} color="var(--primary)" />;
        return <Headphones size={24} color="var(--primary)" />;
    };

    return (
        <div style={{ paddingBottom: '5rem' }}>
            {/* Nav */}
            <nav className="glass" style={{ margin: '1rem 2rem', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: '1rem', zIndex: 100 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ background: 'var(--primary)', padding: '5px', borderRadius: '8px' }}><Cpu size={20} color="#000" /></div>
                    <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>TechFlow</span>
                </div>
                <Link to="/login" className="btn btn-primary" style={{ padding: '0.5rem 1.2rem' }}>
                    <User size={18} /> Iniciar Sesión
                </Link>
            </nav>

            {/* Hero */}
            <section style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>Tecnología del Futuro, <br/> Hoy.</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
                    Explora nuestra selección de dispositivos premium con descripciones técnicas generadas por Inteligencia Artificial.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                    <a href="#catalogo" className="btn btn-primary">Ver Catálogo <ArrowRight size={20} /></a>
                </div>
            </section>

            {/* Catalog */}
            <div id="catalogo" style={{ padding: '2rem 5rem' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Nuestros Productos</h2>
                
                {loading ? (
                    <p>Cargando productos...</p>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                        {products.map(product => (
                            <div key={product.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ marginBottom: '1rem' }}>{getIcon(product.category)}</div>
                                <div className="tag tag-blue" style={{ width: 'fit-content', marginBottom: '0.5rem' }}>{product.category}</div>
                                <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>{product.name}</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', flex: 1 }}>
                                    {product.ai_description || 'Descripción técnica pendiente de IA...'}
                                </p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                                    <span style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--primary)' }}>${product.price}</span>
                                    <span style={{ fontSize: '0.8rem', color: product.stock > 0 ? 'var(--success)' : 'var(--accent)' }}>
                                        {product.stock} en stock
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LandingPage;
