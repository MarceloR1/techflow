import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    ShoppingCart, LogIn, Cpu, Smartphone, Headphones, ArrowRight, Zap, 
    Shield, BarChart3, Package, Star, CheckCircle, Menu, X, Mail, Github, Twitter
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const LandingPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);

        axios.get('/api/products')
            .then(res => setProducts(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));

        return () => window.removeEventListener('scroll', handleScroll);
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
                style={{ 
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    padding: scrolled ? '0.8rem 2.5rem' : '1.5rem 2.5rem',
                    background: scrolled ? 'rgba(10, 10, 15, 0.8)' : 'transparent',
                    backdropFilter: scrolled ? 'blur(20px)' : 'none',
                    borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : 'none',
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    zIndex: 1000,
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', padding: '10px', borderRadius: '12px', boxShadow: '0 0 20px rgba(139, 92, 246, 0.4)' }}>
                        <Zap size={22} color="#fff" />
                    </div>
                    <span style={{ fontSize: '1.5rem', fontWeight: 950, letterSpacing: '-1.5px' }}>TechFlow</span>
                </div>

                <div className="desktop-only" style={{ display: 'flex', gap: '2.5rem', alignItems: 'center', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
                    <a href="#ventajas" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem', transition: 'color 0.3s' }}>Ventajas</a>
                    <a href="#catalogo" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem', transition: 'color 0.3s' }}>Productos</a>
                    <a href="#contacto" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem', transition: 'color 0.3s' }}>Soporte</a>
                </div>

                <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
                    <Link to="/login" className="desktop-only" style={{ color: '#fff', textDecoration: 'none', fontWeight: 800, fontSize: '0.85rem' }}>Login</Link>
                    <Link to="/register" className="btn btn-primary" style={{ padding: scrolled ? '0.6rem 1.4rem' : '0.8rem 1.8rem', fontSize: '0.85rem' }}>
                        Empieza Gratis
                    </Link>
                    <button className="mobile-only" onClick={() => setMobileMenuOpen(true)} style={{ background: 'transparent', border: 'none', color: '#fff' }}>
                        <Menu size={28} />
                    </button>
                </div>
            </motion.nav>

            {/* Mobile Nav Drawer */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setMobileMenuOpen(false)}
                            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 2000 }}
                        />
                        <motion.div 
                            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            style={{ position: 'fixed', right: 0, top: 0, bottom: 0, width: '300px', background: '#0a0a0f', padding: '3rem 2rem', zIndex: 2001, display: 'flex', flexDirection: 'column', borderLeft: '1px solid var(--border)' }}
                        >
                            <button onClick={() => setMobileMenuOpen(false)} style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'transparent', border: 'none', color: '#fff' }}><X size={32} /></button>
                            
                            <div style={{ marginTop: '4rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                <a href="#ventajas" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff', textDecoration: 'none' }}>Ventajas</a>
                                <a href="#catalogo" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff', textDecoration: 'none' }}>Catálogo</a>
                                <a href="#contacto" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff', textDecoration: 'none' }}>Soporte</a>
                                <div style={{ height: '1px', background: 'var(--border)', margin: '1rem 0' }}></div>
                                <Link to="/login" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--primary)', textDecoration: 'none' }}>Acceso Admin</Link>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Hero */}
            <section style={{ padding: '12rem 2.5rem 8rem', textAlign: 'center', position: 'relative' }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                >
                    <div className="tag tag-purple" style={{ marginBottom: '1.5rem', display: 'inline-block' }}>Sistema Híbrido ERP + E-commerce</div>
                    <h1 style={{ fontSize: 'clamp(3.5rem, 8vw, 6.5rem)', marginBottom: '1.8rem', lineHeight: 0.9, fontWeight: 950 }}>
                        Revoluciona tu <br/> <span style={{ color: 'var(--primary)', textShadow: '0 0 40px rgba(139,92,246,0.3)' }}>Ecosistema</span> Digital.
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', maxWidth: '750px', margin: '0 auto 4rem', lineHeight: 1.6 }}>
                        Automatice su inventario, centralice su contabilidad y abra su tienda virtual premium hoy mismo con TechFlow. La solución integral para el retail moderno.
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                        <a href="#catalogo" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1.2rem 3rem' }}>
                            Explorar Catálogo <ArrowRight size={22} />
                        </a>
                        <a href="#ventajas" className="btn btn-outline" style={{ fontSize: '1.1rem', padding: '1.2rem 2.5rem' }}>
                            Saber Más
                        </a>
                    </div>
                </motion.div>
                
                {/* Visual Blobs */}
                <div style={{ position: 'absolute', top: '5%', left: '15%', width: '600px', height: '600px', background: 'var(--primary)', filter: 'blur(200px)', opacity: 0.08, zIndex: -1 }}></div>
                <div style={{ position: 'absolute', bottom: '0', right: '10%', width: '600px', height: '600px', background: 'var(--secondary)', filter: 'blur(200px)', opacity: 0.08, zIndex: -1 }}></div>
            </section>

            {/* Advantages Section */}
            <section id="ventajas" style={{ padding: '8rem 2.5rem', background: 'rgba(255,255,255,0.01)' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                        <h2 style={{ fontSize: '3.5rem', fontWeight: 950, marginBottom: '1.5rem', letterSpacing: '-1.5px' }}>¿Por qué TechFlow?</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>Diseñado para la eficiencia operativa y el crecimiento comercial exponencial.</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem' }}>
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
                                whileHover={{ y: -12, borderColor: 'var(--primary)', background: 'rgba(255,255,255,0.03)' }} 
                                className="glass" 
                                style={{ padding: '3.5rem 3rem', border: '1px solid rgba(255,255,255,0.05)', transition: 'all 0.4s ease-out' }}
                            >
                                <div style={{ marginBottom: '2.5rem', background: 'rgba(139, 92, 246, 0.1)', width: 'fit-content', padding: '18px', borderRadius: '18px' }}>{f.icon}</div>
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: 900 }}>{f.title}</h3>
                                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1.1rem' }}>{f.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Dynamic Catalog Section */}
            <div id="catalogo" style={{ padding: '10rem 4rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '5rem', flexWrap: 'wrap', gap: '2rem' }}>
                    <div>
                        <div className="tag tag-blue" style={{ marginBottom: '1rem' }}>Disponibilidad Inmediata</div>
                        <h2 style={{ fontSize: '4rem', fontWeight: 950, letterSpacing: '-2.5px' }}>Catálogo Premium</h2>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', maxWidth: '450px', fontSize: '1.1rem', lineHeight: 1.7 }}>
                        Hardware seleccionado para las necesidades tecnológicas más exigentes. Todas las especificaciones son validadas por IA.
                    </p>
                </div>
                
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '8rem' }}>
                        <div className="spinner" style={{ display: 'inline-block', width: '60px', height: '60px', border: '6px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite' }}></div>
                        <p style={{ marginTop: '2rem', color: 'var(--text-secondary)', fontSize: '1.2rem', fontWeight: 600 }}>Sincronizando Tienda Virtual...</p>
                    </div>
                ) : (
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '4rem' }}
                    >
                        {products.map(product => (
                            <motion.div 
                                key={product.id} 
                                variants={itemVariants} 
                                className="glass-card" 
                                style={{ padding: '3.5rem 3rem', display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', overflow: 'hidden' }}
                            >
                                <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '150px', height: '150px', background: 'var(--primary)', filter: 'blur(70px)', opacity: 0.15 }}></div>
                                
                                <div style={{ marginBottom: '2.5rem', background: 'rgba(255,255,255,0.03)', width: '90px', height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '24px', border: '1px solid var(--border)' }}>
                                    {getIcon(product.category)}
                                </div>
                                
                                <div className="tag tag-purple" style={{ width: 'fit-content', marginBottom: '1.5rem' }}>{product.category}</div>
                                <h3 style={{ fontSize: '1.9rem', marginBottom: '1.2rem', fontWeight: 900, letterSpacing: '-0.5px' }}>{product.name}</h3>
                                
                                <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginBottom: '3rem', flex: 1, lineHeight: 1.8 }}>
                                    {product.ai_description || 'Especificaciones técnicas detalladas analizadas por nuestro núcleo de IA corporativo.'}
                                </p>
                                
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '2.5rem', marginTop: 'auto' }}>
                                    <div>
                                        <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 800, letterSpacing: '1px' }}>Precio Final</span>
                                        <span style={{ fontSize: '2.5rem', fontWeight: 950, color: 'var(--primary)', letterSpacing: '-2px' }}>${product.price}</span>
                                    </div>
                                    <Link to="/login" className="btn btn-primary" style={{ height: '60px', width: '60px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 25px rgba(139, 92, 246, 0.4)' }}>
                                        <ShoppingCart size={28} />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>

            {/* Bottom CTA */}
            <section style={{ padding: '6rem 4rem' }}>
                <div className="glass" style={{ padding: '6rem 4rem', textAlign: 'center', background: 'linear-gradient(135deg, rgba(139,92,246,0.12) 0%, rgba(5,5,8,1) 100%)', border: '1px solid var(--primary)', borderRadius: '40px' }}>
                    <h2 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', fontWeight: 950, letterSpacing: '-1.5px' }}>¿Listo para el siguiente nivel de eficiencia?</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.3rem', marginBottom: '4rem', maxWidth: '800px', margin: '0 auto 4rem', lineHeight: 1.7 }}>
                        Únase a TechFlow hoy. Gestione su empresa con la misma potencia de las grandes corporaciones pero con la agilidad de una startup.
                    </p>
                    <Link to="/register" className="btn btn-primary" style={{ padding: '1.5rem 6rem', fontSize: '1.3rem', borderRadius: '20px', display: 'inline-flex', boxShadow: '0 20px 40px rgba(139, 92, 246, 0.4)', fontWeight: 900 }}>Empezar Ahora</Link>
                </div>
            </section>

            {/* Footer */}
            <footer id="contacto" style={{ padding: '10rem 4rem 4rem', borderTop: '1px solid var(--border)', background: 'rgba(0,0,0,0.2)' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '6rem', marginBottom: '8rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', padding: '10px', borderRadius: '12px' }}>
                                <Zap size={24} color="#fff" />
                            </div>
                            <span style={{ fontSize: '1.8rem', fontWeight: 950, color: '#fff', letterSpacing: '-1.5px' }}>TechFlow</span>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.7 }}>La plataforma definitiva de gestión empresarial y e-commerce integrada para el futuro digital.</p>
                        <div style={{ display: 'flex', gap: '1.5rem' }}>
                            <Github size={24} style={{ cursor: 'pointer', opacity: 0.5 }} />
                            <Twitter size={24} style={{ cursor: 'pointer', opacity: 0.5 }} />
                            <Mail size={24} style={{ cursor: 'pointer', opacity: 0.5 }} />
                        </div>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px' }}>Soluciones</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', color: 'var(--text-secondary)' }}>
                            <a href="#ventajas" style={{ color: 'inherit', textDecoration: 'none' }}>Gestión de Inventario</a>
                            <a href="#catalogo" style={{ color: 'inherit', textDecoration: 'none' }}>Tienda Publica B2C</a>
                            <a href="#ventajas" style={{ color: 'inherit', textDecoration: 'none' }}>Auditoría y Logs</a>
                            <a href="#ventajas" style={{ color: 'inherit', textDecoration: 'none' }}>Contabilidad Fiscal</a>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px' }}>Soporte</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', color: 'var(--text-secondary)' }}>
                            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Centro de Ayuda</a>
                            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Documentación</a>
                            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Estado del Sistema</a>
                            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Contacto Directo</a>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px' }}>Newsletter</h4>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Reciba actualizaciones técnicas y nuevas funciones mensualmente.</p>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input type="text" placeholder="Email corporativo..." style={{ flex: 1, padding: '0.8rem 1.2rem', background: 'rgba(255,255,255,0.03)' }} />
                            <button className="btn btn-primary" style={{ padding: '0.8rem 1rem' }}><ArrowRight size={20} /></button>
                        </div>
                    </div>
                </div>
                
                <div style={{ paddingTop: '3rem', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', opacity: 0.6 }}>© 2026 TechFlow Unified Business Ecosystem. Desarrollado con los más altos estándares de excelencia tecnológica.</p>
                </div>
            </footer>

            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                html { scroll-behavior: smooth; }
                body { overflow-x: hidden; }
                a:hover { color: var(--primary) !important; }
                input:focus { border-color: var(--primary); outline: none; }
            `}</style>
        </div>
    );
};

export default LandingPage;
