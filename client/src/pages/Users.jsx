import React, { useState, useEffect } from 'react';
import { UserPlus, Shield, Mail, User, Trash2 } from 'lucide-react';
import axios from 'axios';

const Users = ({ user: currentUser }) => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role_id: '' });
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [usersRes, rolesRes] = await Promise.all([
                axios.get('/api/users'),
                axios.get('/api/roles')
            ]);
            setUsers(usersRes.data);
            setRoles(rolesRes.data);
            if (rolesRes.data.length > 0 && !newUser.role_id) {
                setNewUser(prev => ({ ...prev, role_id: rolesRes.data[0].id }));
            }
        } catch (err) {
            console.error(err);
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
            fetchData();
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.details || err.response?.data?.error || err.message;
            alert('Error al crear usuario: ' + msg);
        } finally {
            setProcessing(false);
        }
    };

    const handleDeleteUser = async (id) => {
        if (id === currentUser.id) {
            alert('No puedes eliminarte a ti mismo por seguridad.');
            return;
        }
        if (!window.confirm('¿Estás seguro de eliminar este usuario? Esta acción quedará registrada en la bitácora.')) return;
        setProcessing(true);
        try {
            await axios.delete(`/api/users/${id}?adminId=${currentUser.id}`);
            fetchData();
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.details || err.response?.data?.error || err.message;
            alert('Error al eliminar usuario: ' + msg);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div>
            <h1>Gestión de Usuarios (Relacional)</h1>

            {/* Form */}
            <div className="glass" style={{ padding: '2rem', marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <UserPlus size={20} color="var(--primary)" /> Registrar Nuevo Personal
                </h3>
                <form onSubmit={handleAddUser} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', alignItems: 'end' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label>Nombre Completo</label>
                        <input value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} placeholder="Ej: Juan Perez" required />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label>Correo Electrónico</label>
                        <input type="email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} placeholder="email@techflow.com" required />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label>Contraseña</label>
                        <input type="password" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} required />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label>Rol del Sistema</label>
                        <select value={newUser.role_id} onChange={e => setNewUser({...newUser, role_id: e.target.value})}>
                            {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center' }} disabled={processing}>
                        {processing ? 'Procesando...' : 'Crear Usuario'}
                    </button>
                </form>
            </div>

            {/* List */}
            <div className="glass" style={{ padding: '1rem' }}>
                <table>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Rol</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u.id}>
                                <td style={{ fontWeight: 600 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '5px', borderRadius: '50%' }}><User size={16} /></div>
                                        {u.name}
                                    </div>
                                </td>
                                <td>{u.email}</td>
                                <td><span className={`tag ${u.role === 'Administrador' ? 'tag-purple' : 'tag-blue'}`}>{u.role}</span></td>
                                <td><span className="tag tag-green">Activo</span></td>
                                <td>
                                    <button 
                                        onClick={() => handleDeleteUser(u.id)} 
                                        className="btn" 
                                        style={{ padding: '5px', background: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e' }} 
                                        title="Eliminar Usuario"
                                        disabled={processing}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Users;
