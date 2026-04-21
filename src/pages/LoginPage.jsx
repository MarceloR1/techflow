import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, ArrowRight, ShieldCheck, Zap, Mail, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const LoginPage = ({ onLogin }) => {
    const [email, setEmail] = useState('admin@techflow.com');
    const [password, setPassword] = useState('admin123');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await axios.post('/api/auth/login', { email, password });
            const userData = res.data.user;
            onLogin(userData);
            
            if (userData.role === 'Cliente') {
                navigate('/store');
            } else {
                navigate('/inventory');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '100vh', 
            padding: '2rem',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Decorative Elements */}
            <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '40%', height: '40%', background: 'var(--primary)', filter: 'blur(150px)', opacity: 0.1, zIndex: -1 }}></div>
            <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '40%', height: '40%', background: 'var(--secondary)', filter: 'blur(150px)', opacity: 0.1, zIndex: -1 }}></div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass" 
                style={{ 
                    width: '100%', 
                    maxWidth: '450px', 
                    padding: '3.5rem', 
                    borderRadius: '40px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                    border: '1px solid rgba(255, 255, 255, 0.05)'
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <motion.div 
                        initial={{ rotate: -10, scale: 0.8 }}
                        animate={{ rotate: 0, scale: 1 }}
                        transition={{ type: 'spring', damping: 12 }}
                        style={{ 
                            background: 'linear-gradient(135deg, var(--primary), var(--secondary))', 
                            width: '70px', 
                            height: '70px', 
                            borderRadius: '20px', 
                            display: 'flex', 
                            justifyContent: 'center', 
                            alignItems: 'center', 
                            margin: '0 auto 1.5rem',
                            boxShadow: '0 10px 20px rgba(139, 92, 246, 0.3)'
                        }}
                    >
                        <Zap size={36} color="#fff" />
                    </motion.div>
                    <h1 style={{ fontSize: '2.4rem', fontWeight: 900, letterSpacing: '-1.5px', marginBottom: '0.6rem' }}>Identificación</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>Acceso Centralizado TechFlow</p>
                </div>

                <AnimatePresence>
                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            style={{ 
                                background: 'rgba(239, 68, 68, 0.1)', 
                                color: '#f87171', 
                                padding: '1rem', 
                                borderRadius: '15px', 
                                marginBottom: '2rem', 
                                fontSize: '0.9rem', 
                                textAlign: 'center',
                                border: '1px solid rgba(239, 68, 68, 0.2)'
                            }}
                        >
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
                    <div className="form-group">
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            <Mail size={14} /> Correo Electrónico
                        </label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            style={{ padding: '1.2rem', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)' }}
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            <Lock size={14} /> Credencial de Acceso
                        </label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            style={{ padding: '1.2rem', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)' }}
                            required 
                        />
                    </div>
                    
                    <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit" 
                        className="btn btn-primary" 
                        style={{ 
                            width: '100%', 
                            marginTop: '1rem', 
                            justifyContent: 'center', 
                            padding: '1.3rem', 
                            borderRadius: '18px',
                            fontSize: '1.1rem',
                            boxShadow: '0 15px 30px rgba(139, 92, 246, 0.4)'
                        }} 
                        disabled={loading}
                    >
                        {loading ? 'Autenticando...' : 'Acceder al Ecosistema'} <ArrowRight size={20} />
                    </motion.button>
                    
                    <div style={{ marginTop: '2.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                            ¿Primer ingreso? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 800, textDecoration: 'none' }}>Solicitar Cuenta</Link>
                        </p>
                        <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', width: '60%', margin: '0 auto' }}></div>
                        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.05)' }}>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', opacity: 0.7 }}>DEMO STAFF: admin@techflow.com / admin123</p>
                        </div>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default LoginPage;
