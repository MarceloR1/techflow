import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, ChevronLeft, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useToast } from '../ToastContext';

const RegisterPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { showToast } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await axios.post('/api/auth/register', formData);
            showToast('¡Perfil TechFlow activado con éxito!', 'success');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || 'Error en el protocolo de registro');
            showToast('Error en el registro: ' + (err.response?.data?.error || 'Falla de conexión'), 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ 
            minHeight: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            padding: '2rem',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Decorative Blurs */}
            <div style={{ position: 'absolute', top: '10%', right: '-5%', width: '400px', height: '400px', background: 'var(--secondary)', filter: 'blur(150px)', opacity: 0.1, zIndex: -1 }}></div>
            <div style={{ position: 'absolute', bottom: '5%', left: '-5%', width: '400px', height: '400px', background: 'var(--primary)', filter: 'blur(150px)', opacity: 0.1, zIndex: -1 }}></div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="glass" 
                style={{ 
                    width: '100%', 
                    maxWidth: '500px', 
                    padding: '3.5rem', 
                    borderRadius: '40px',
                    boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.05)'
                }}
            >
                <div style={{ marginBottom: '2.5rem' }}>
                    <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, transition: 'color 0.3s' }} className="hover-primary">
                        <ChevronLeft size={18} /> Inicio
                    </Link>
                </div>

                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <motion.div 
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        style={{ 
                            background: 'linear-gradient(135deg, var(--secondary), var(--primary))', 
                            width: '70px', 
                            height: '70px', 
                            borderRadius: '22px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            margin: '0 auto 1.5rem', 
                            boxShadow: '0 12px 30px rgba(236, 72, 153, 0.3)' 
                        }}
                    >
                        <UserPlus size={32} color="#fff" />
                    </motion.div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 950, marginBottom: '0.8rem', letterSpacing: '-1.5px' }}>Registro B2C</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Tu puerta de acceso a tecnología de vanguardia.</p>
                </div>

                <AnimatePresence>
                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="tag tag-red" 
                            style={{ width: '100%', padding: '1rem', marginBottom: '2rem', textAlign: 'center', fontWeight: 700, borderRadius: '15px' }}
                        >
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="form-group">
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            <User size={16} /> Identidad Nominal
                        </label>
                        <input 
                            type="text" 
                            placeholder="Nombre y Apellido"
                            style={{ padding: '1.2rem', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', fontSize: '1rem' }}
                            required 
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                    </div>

                    <div className="form-group">
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            <Mail size={16} /> Correo Electrónico
                        </label>
                        <input 
                            type="email" 
                            placeholder="canaldeventas@techflow.cl"
                            style={{ padding: '1.2rem', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', fontSize: '1rem' }}
                            required 
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                    </div>

                    <div className="form-group">
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            <Lock size={16} /> Credencial de Acceso
                        </label>
                        <input 
                            type="password" 
                            placeholder="••••••••"
                            style={{ padding: '1.2rem', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', fontSize: '1rem' }}
                            required 
                            minLength="6"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                        />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '1.2rem', background: 'rgba(255,255,255,0.03)', borderRadius: '18px', fontSize: '0.85rem', color: 'var(--text-secondary)', border: '1px dashed rgba(255,255,255,0.1)' }}>
                        <ShieldCheck size={24} color="var(--success)" className="shrink-0" />
                        <p>Infraestructura protegida. Sus datos residen en un entorno con encriptación activa de nivel bancario.</p>
                    </div>

                    <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit" 
                        className="btn btn-primary" 
                        disabled={loading} 
                        style={{ padding: '1.4rem', fontSize: '1.2rem', borderRadius: '20px', fontWeight: 900, boxShadow: '0 15px 35px rgba(139, 92, 246, 0.4)' }}
                    >
                        {loading ? 'Inicializando Perfil...' : 'Comenzar Experiencia'}
                    </motion.button>

                    <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '1rem' }}>
                        ¿Ya formas parte? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 800, textDecoration: 'none' }}>Iniciar Sesión</Link>
                    </p>
                </form>
            </motion.div>
            
            <style>{`
                .hover-primary:hover { color: var(--primary) !important; }
            `}</style>
        </div>
    );
};

export default RegisterPage;
