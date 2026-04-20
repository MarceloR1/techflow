import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, ArrowLeft, ShieldCheck } from 'lucide-react';
import axios from 'axios';

const RegisterPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await axios.post('/api/auth/register', formData);
            alert('¡Cuenta creada con éxito! Ahora puedes iniciar sesión.');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || 'Error al registrarse');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <div className="glass-card" style={{ width: '100%', maxWidth: '450px', padding: '3rem' }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', textDecoration: 'none', marginBottom: '2rem', fontSize: '0.9rem' }}>
                    <ArrowLeft size={16} /> Volver al inicio
                </Link>

                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <div style={{ background: 'var(--primary)', width: '60px', height: '60px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 8px 25px rgba(139, 92, 246, 0.4)' }}>
                        <UserPlus size={30} color="#000" />
                    </div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Crea tu cuenta</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Únete a la comunidad de TechFlow</p>
                </div>

                {error && <div className="tag tag-red" style={{ width: '100%', padding: '1rem', marginBottom: '1.5rem', textAlign: 'center' }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="form-group">
                        <label><User size={16} /> Nombre Completo</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Ej. Juan Pérez"
                            required 
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                    </div>

                    <div className="form-group">
                        <label><Mail size={16} /> Correo Electrónico</label>
                        <input 
                            type="email" 
                            className="form-control" 
                            placeholder="tu@correo.com"
                            required 
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                    </div>

                    <div className="form-group">
                        <label><Lock size={16} /> Contraseña</label>
                        <input 
                            type="password" 
                            className="form-control" 
                            placeholder="••••••••"
                            required 
                            minLength="6"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                        />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        <ShieldCheck size={20} color="var(--success)" />
                        Tus datos están protegidos con encriptación de grado bancario.
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={loading} style={{ padding: '1rem', fontSize: '1.1rem', marginTop: '1rem' }}>
                        {loading ? 'Creando cuenta...' : 'Registrarme'}
                    </button>

                    <p style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--text-secondary)' }}>
                        ¿Ya tienes cuenta? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Inicia sesión</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
