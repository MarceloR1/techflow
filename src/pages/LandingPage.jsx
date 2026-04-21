import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, LogIn, Cpu, Smartphone, Headphones, ArrowRight, Zap, Shield, BarChart3, Package, Star, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

const LandingPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/api/products')
            .then(res => setProducts(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const getIcon = (cat) => {
        const category = cat?.toLowerCase() || '';
        if (category.includes('laptop')) return <Cpu size={32} color="var(--primary)" />;
        if (category.includes('smart')) return <Smartphone size={32} color="var(--primary)" />;
        return <Headphones size={32} color="var(--primary)" />;
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };

    const itemVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div style={{ backgroundColor: 'var(--bg-dark)', minHeight: '100vh', scrollBehavior: 'smooth' }}>
            {/* Nav */}
            <motion.nav 
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className="glass" 
                style={{ 
                    margin: '1rem 2.5rem', 
                    padding: '1rem 2.5rem', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    position: 'sticky', 
                    top: '1rem', 
                    zIndex: 1000 
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', padding: '10px', borderRadius: '12px', boxShadow: '0 0 20px rgba(139, 92, 246, 0.4)' }}>
                        <Zap size={24} color="#fff" />
                    </div>
                    <span style={{ fontSize: '1.6rem', fontWeight: 900, letterSpacing: '-1.5px' }}>TechFlow</span>
                </div>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <Link to="/login" className="btn btn-outline" style={{ padding: '0.7rem 1.5rem', fontSize: '0.85rem' }}>Acceso Admin</Link>
                    <Link to="/login" className="btn btn-primary" style={{ padding: '0.7rem 1.8rem', fontSize: '0.85rem' }}>
                        <LogIn size={18} /> Tienda B2C
                    </Link>
                </div>
            </motion.nav>

            {/* Hero */}
            <section style={{ padding: '7rem 2.5rem 5.5rem', textAlign: 'center', position: 'relative' }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                >
                    <div className="tag tag-purple" style={{ marginBottom: '1.5rem', display: 'inline-block' }}>Sistema Híbrido ERP + E-commerce</div>
                    <h1 style={{ fontSize: 'clamp(3.5rem, 8vw, 6rem)', marginBottom: '1.5rem', lineHeight: 0.9 }}>
                        Revoluciona tu <br/> <span style={{ color: 'var(--text-primary)', WebkitTextFillColor: 'var(--text-primary)' }}>Ecosistema Digital.</span>
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.3rem', maxWidth: '800px', margin: '0 auto 3.5rem', lineHeight: 1.6 }}>
                        Automatice su inventario, centralice su contabilidad y abra su tienda virtual premium hoy mismo con TechFlow. La solución integral para el retail moderno.
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
                        <a href="#catalogo" className="btn btn-primary" style={{ fontSize: '1.2rem', padding: '1.3rem 3.5rem' }}>
                            Explorar Catálogo <ArrowRight size={24} />
                        </a>
                        <a href="#ventajas" className="btn btn-outline" style={{ fontSize: '1.2rem', padding: '1.3rem 3rem' }}>
                            Saber Más
                        </a>
                    </div>
                </motion.div>
                
                {/* Visual Blobs */}
                <div style={{ position: 'absolute', top: '5%', left: '15%', width: '450px', height: '450px', background: 'var(--primary)', filter: 'blur(180px)', opacity: 0.08, zIndex: -1 }}></div>
                <div style={{ position: 'absolute', bottom: '0', right: '10%', width: '450px', height: '450px', background: 'var(--secondary)', filter: 'blur(180px)', opacity: 0.08, zIndex: -1 }}></div>
            </section>

            {/* Advantages Section */}
            <section id="ventajas" style={{ padding: '6rem 2.5rem', background: 'rgba(255,255,255,0.01)' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h2 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1rem' }}>¿Por qué TechFlow?</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Diseñado para la eficiencia operativa y el crecimiento comercial.</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
                        {[
                            { title: 'Inventario en Tiempo Real', desc: 'Sincronización instantánea entre su bodega física y la tienda virtual.', icon: <Package size={26} color="var(--primary)" /> },
                            { title: 'IA Specifications', desc: 'Genere fichas técnicas profesionales automáticamente con nuestro motor de IA.', icon: <Cpu size={26} color="var(--primary)" /> },
                            { title: 'Contabilidad Integrada', desc: 'Cada venta genera automáticamente el asiento contable en el libro diario.', icon: <BarChart3 size={26} color="var(--primary)" /> },
                            { title: 'Seguridad de Grado Bancario', desc: 'Protección de datos mediante JWT y encriptación de última generación.', icon: <Shield size={26} color="var(--primary)" /> },
                            { title: 'Experiencia B2C Premium', desc: 'Tienda virtual rápida, intuitiva y optimizada para la conversión.', icon: <ShoppingCart size={26} color="var(--primary)" /> },
                            { title: 'Auditoría de Operaciones', desc: 'Registro histórico (Logs) de cada movimiento crítico en el sistema.', icon: <CheckCircle size={26} color="var(--primary)" /> }
                        ].map((f, i) => (
                            <motion.div 
                                key={i} 
                                whileHover={{ y: -12, borderColor: 'var(--primary)' }} 
                                className="glass" 
                                style={{ padding: '3rem', border: '1px solid rgba(255,255,255,0.05)', transition: 'all 0.3s ease' }}
                            >
                                <div style={{ marginBottom: '2rem', background: 'rgba(139, 92, 246, 0.1)', width: 'fit-content', padding: '15px', borderRadius: '15px' }}>{f.icon}</div>
                                <h3 style={{ fontSize: '1.4rem', marginBottom: '1.2rem', fontWeight: 800 }}>{f.title}</h3>
                                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '1.05rem' }}>{f.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Dynamic Catalog Section */}
            <div id="catalogo" style={{ padding: '8rem 4rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem' }}>
                    <div>
                        <div className="tag tag-blue" style={{ marginBottom: '1rem' }}>Disponibilidad Inmediata</div>
                        <h2 style={{ fontSize: '3.5rem', fontWeight: 900, letterSpacing: '-2px' }}>Catálogo Premium</h2>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', maxWidth: '450px', textAlign: 'right', fontSize: '1.1rem' }}>
                        Hardware seleccionado para las necesidades tecnológicas más exigentes. Todas las especificaciones son validadas por IA.
                    </p>
                </div>
                
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '6rem' }}>
                        <div className="spinner" style={{ display: 'inline-block', width: '60px', height: '60px', border: '6px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite' }}></div>
                        <p style={{ marginTop: '1.5rem', color: 'var(--text-secondary)', fontSize: '1.2rem', fontWeight: 600 }}>Sincronizando Tienda Virtual...</p>
                    </div>
                ) : (
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '3.5rem' }}
                    >
                        {products.map(product => (
                            <motion.div 
                                key={product.id} 
                                variants={itemVariants} 
                                className="glass-card" 
                                style={{ padding: '3rem', display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', overflow: 'hidden' }}
                            >
                                <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '120px', height: '120px', background: 'var(--primary)', filter: 'blur(60px)', opacity: 0.12 }}></div>
                                
                                <div style={{ marginBottom: '2rem', background: 'rgba(255,255,255,0.03)', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '22px', border: '1px solid var(--border)' }}>
                                    {getIcon(product.category)}
                                </div>
                                
                                <div className="tag tag-purple" style={{ width: 'fit-content', marginBottom: '1.2rem' }}>{product.category}</div>
                                <h3 style={{ fontSize: '1.8rem', marginBottom: '1.2rem', fontWeight: 900, letterSpacing: '-0.5px' }}>{product.name}</h3>
                                
                                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '2.5rem', flex: 1, lineHeight: 1.7 }}>
                                    {product.ai_description || 'Especificaciones técnicas detalladas analizadas por nuestro núcleo de IA corporativo.'}
                                </p>
                                
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '2rem', marginTop: 'auto' }}>
                                    <div>
                                        <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 700, letterSpacing: '1px' }}>Precio Final</span>
                                        <span style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--primary)', letterSpacing: '-2px' }}>${product.price}</span>
                                    </div>
                                    <Link to="/login" className="btn btn-primary" style={{ padding: '1rem', borderRadius: '16px', boxShadow: '0 10px 20px rgba(139, 92, 246, 0.4)' }}>
                                        <ShoppingCart size={24} />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>

            {/* Bottom CTA */}
            <section style={{ padding: '6rem 4rem' }}>
                <div className="glass" style={{ padding: '5rem 4rem', textAlign: 'center', background: 'linear-gradient(135deg, rgba(139,92,246,0.1) 0%, rgba(236,72,153,0.05) 100%)', border: '1px solid var(--primary)' }}>
                    <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem', fontWeight: 900 }}>¿Listo para el siguiente nivel de eficiencia?</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '3rem', maxWidth: '750px', margin: '0 auto 3rem' }}>
                        Únase a TechFlow hoy. Gestione su empresa con la misma potencia de las grandes corporaciones pero con la agilidad de una startup.
                    </p>
                    <Link to="/register" className="btn btn-primary" style={{ padding: '1.4rem 5rem', fontSize: '1.2rem', borderRadius: '18px', display: 'inline-flex', boxShadow: '0 15px 30px rgba(139, 92, 246, 0.5)' }}>Empezar Ahora</Link>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ padding: '5rem 4rem 3rem', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '2rem' }}>
                    <Zap size={26} color="var(--primary)" />
                    <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff', letterSpacing: '-1px' }}>TechFlow</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', marginBottom: '2.5rem', color: 'var(--text-secondary)', fontSize: '1rem' }}>
                    <a href="#" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.3s' }}>Términos</a>
                    <a href="#" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.3s' }}>Privacidad</a>
                    <a href="#" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.3s' }}>Documentación</a>
                    <a href="#" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.3s' }}>Soporte</a>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>© 2026 TechFlow Unified Business Ecosystem. Desarrollado con excelencia tecnológica.</p>
            </footer>

            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                html { scroll-behavior: smooth; }
                body { overflow-x: hidden; }
                a:hover { color: var(--primary) !important; }
            `}</style>
        </div>
    );
};

export default LandingPage;
