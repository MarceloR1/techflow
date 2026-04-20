import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, ArrowRight, ShieldCheck, UserPlus } from 'lucide-react';
import axios from 'axios';

const LoginPage = ({ onLogin }) => {
    const [email, setEmail] = useState('admin@techflow.com');
    const [password, setPassword] = useState('admin123'); // Preset for demo
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
            
            // Redirección inteligente por rol
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
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '1rem' }}>
            <div className="glass" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ background: 'rgba(0, 242, 255, 0.1)', width: '60px', height: '60px', borderRadius: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 1rem' }}>
                        <ShieldCheck size={32} color="var(--primary)" />
                    </div>
                    <h1>Acceso Sistema</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Tienda de Tecnología TechFlow</p>
                </div>

                {error && <div style={{ background: 'rgba(255, 0, 122, 0.1)', color: 'var(--accent)', padding: '0.8rem', borderRadius: '10px', marginBottom: '1rem', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label><User size={14} /> Correo Electrónico</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label><Lock size={14} /> Contraseña</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', justifyContent: 'center' }} disabled={loading}>
                        {loading ? 'Validando...' : 'Entrar al Sistema'} <ArrowRight size={20} />
                    </button>
                    
                    <div style={{ marginTop: '2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                            ¿No tienes cuenta? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Regístrate gratis</Link>
                        </p>
                        <div style={{ height: '1px', background: 'var(--border)', margin: '0.5rem 0' }}></div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', opacity: 0.6 }}>Demo Staff: admin@techflow.com / admin123</p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
