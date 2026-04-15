import React, { useState, useEffect } from 'react';
import { UserPlus, Shield, Mail, User, Trash2 } from 'lucide-react';
import axios from 'axios';

const Users = ({ user: currentUser }) => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role_id: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [usersRes, rolesRes] = await Promise.all([
                axios.get('http://localhost:5000/api/users'),
                axios.get('http://localhost:5000/api/roles')
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
        try {
            await axios.post('http://localhost:5000/api/users', { ...newUser, adminId: currentUser.id });
            setNewUser({ name: '', email: '', password: '', role_id: roles[0]?.id || '' });
            fetchData();
        } catch (err) {
            alert('Error al crear usuario');
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
                    <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center' }}>Crear Usuario</button>
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
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Users;
