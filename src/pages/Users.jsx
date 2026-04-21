import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    UserPlus, Trash2, ShieldCheck, 
    Mail, Lock, User, Search, ShieldAlert, Key
} from 'lucide-react';
import axios from 'axios';
import { useToast } from '../ToastContext';

const Users = ({ user: currentUser }) => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role_id: '' });
    const [processing, setProcessing] = useState(false);
    const { showToast } = useToast();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [uRes, rRes] = await Promise.all([
                axios.get('/api/users'),
                axios.get('/api/roles')
            ]);
            setUsers(uRes.data);
            setRoles(rRes.data);
            if (rRes.data.length > 0) setNewUser(prev => ({ ...prev, role_id: rRes.data[0].id }));
        } catch (err) {
            showToast('Error al sincronizar base de usuarios', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        setProcessing(true);
        try {
            await axios.post('/api/users', { ...newUser, adminId: currentUser.id });
            setNewUser({ name: '', email: '', password: '', role_id: roles[0]?.id || '' });
            setShowAddForm(false);
            showToast('Credenciales generadas exitosamente', 'success');
            fetchData();
        } catch (err) {
            showToast('Falla en la creación de usuario', 'error');
        } finally {
            setProcessing(false);
        }
    };

    const handleDelete = async (id) => {
        if (id === currentUser.id) {
            showToast('Imposible revocar acceso a la identidad activa', 'error');
            return;
        }
        if (!window.confirm('¿Desea revocar permanentemente el acceso a este usuario?')) return;
        
        try {
            await axios.delete(`/api/users/${id}?adminId=${currentUser.id}`);
            showToast('Acceso revocado satisfactoriamente', 'success');
            fetchData();
        } catch (err) {
            showToast('Error en la purga de credenciales', 'error');
        }
    };

    const filteredUsers = users.filter(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.role?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 950, marginBottom: '0.5rem', letterSpacing: '-1.5px' }}>Gestión de Identidades</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Administración de personal autorizado y niveles de privilegio.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div className="glass" style={{ padding: '0.5rem 1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Search size={18} color="var(--text-secondary)" />
                        <input type="text" placeholder="Filtrar por nombre o rango..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', fontSize: '0.9rem', width: '250px' }} />
                    </div>
                    <button onClick={() => setShowAddForm(true)} className="btn btn-primary"><UserPlus size={18} /> Alta de Personal</button>
                </div>
            </div>

            <div className="glass" style={{ padding: '2rem', minHeight: '400px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem' }}>
                    <div style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '10px', borderRadius: '12px' }}><ShieldCheck size={20} color="var(--primary)" /></div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Usuarios del Ecosistema</h3>
                </div>

                {loading ? ( <div style={{ textAlign: 'center', padding: '5rem', opacity: 0.5 }}>Interrogando base de datos...</div> ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre Completo</th>
                                <th>Correo Electrónico</th>
                                <th>Nivel de Acceso</th>
                                <th style={{ textAlign: 'right' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence>
                                {filteredUsers.map((u, idx) => (
                                    <motion.tr key={u.id} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.05 }} className="glass-card" style={{ border: 'none', background: 'rgba(255,255,255,0.015)' }}>
                                        <td style={{ padding: '1.2rem', fontWeight: 700 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>{u.name.substring(0,2).toUpperCase()}</div>
                                                {u.name}
                                            </div>
                                        </td>
                                        <td style={{ color: 'var(--text-secondary)' }}>{u.email}</td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                {u.role === 'Administrador' ? <ShieldAlert size={14} color="var(--secondary)" /> : <Key size={14} color="var(--primary)" />}
                                                <span className={u.role === 'Administrador' ? 'tag tag-purple' : 'tag tag-blue'}>{u.role}</span>
                                            </div>
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            <button onClick={() => handleDelete(u.id)} className="btn" style={{ padding: '8px', background: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e', borderRadius: '10px', marginLeft: 'auto' }} disabled={u.id === currentUser.id}><Trash2 size={16} /></button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                )}
            </div>

            {/* Floating Modal for Add User */}
            <AnimatePresence>
                {showAddForm && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddForm(false)} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 1000 }} />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} style={{ position: 'fixed', top: '50%', left: '50%', x: '-50%', y: '-50%', width: '100%', maxWidth: '500px', zIndex: 1001 }}>
                            <div className="glass" style={{ padding: '3.5rem', border: '1px solid var(--primary)' }}>
                                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                                    <div style={{ background: 'var(--primary)', width: '60px', height: '60px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 10px 25px rgba(139, 92, 246, 0.4)' }}><UserPlus size={30} color="#fff" /></div>
                                    <h2 style={{ fontSize: '1.8rem', fontWeight: 900 }}>Alta de Usuario</h2>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Defina las credenciales y privilegios.</p>
                                </div>
                                <form onSubmit={handleAddUser} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <div className="form-group"><label><User size={14} /> Nombre Completo</label><input value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} placeholder="Ej: Ing. Rodrigo Sosa" required /></div>
                                    <div className="form-group"><label><Mail size={14} /> Correo Corporativo</label><input type="email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} placeholder="nombre@techflow.com" required /></div>
                                    <div className="form-group"><label><Lock size={14} /> Contraseña de Acceso</label><input type="password" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} placeholder="••••••••" required /></div>
                                    <div className="form-group"><label><ShieldCheck size={14} /> Nivel de Privilegio</label><select value={newUser.role_id} onChange={e => setNewUser({...newUser, role_id: e.target.value})}>{roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}</select></div>
                                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}><button type="button" onClick={() => setShowAddForm(false)} className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }}>Cancelar</button><button type="submit" className="btn btn-primary" style={{ flex: 2, justifyContent: 'center' }} disabled={processing}>{processing ? 'Procesando...' : 'Crear Usuario'}</button></div>
                                </form>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Users;
