import React, { useState, useEffect } from 'react';
import { UserPlus, Contact, MapPin, Search, Phone } from 'lucide-react';
import axios from 'axios';

const Clients = ({ user }) => {
    const [clients, setClients] = useState([]);
    const [newClient, setNewClient] = useState({ name: '', nit_dni: '', address: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const res = await axios.get('/api/clients');
            setClients(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddClient = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/clients', { ...newClient, userId: user.id });
            setNewClient({ name: '', nit_dni: '', address: '' });
            fetchClients();
        } catch (err) {
            alert('Error al registrar cliente');
        }
    };

    return (
        <div>
            <h1>Cartera de Clientes</h1>

            <div className="glass" style={{ padding: '2rem', marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <UserPlus size={20} color="var(--primary)" /> Registro de Cliente Nuevo
                </h3>
                <form onSubmit={handleAddClient} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', alignItems: 'end' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label>Nombre o Razón Social</label>
                        <input value={newClient.name} onChange={e => setNewClient({...newClient, name: e.target.value})} placeholder="Nombre completo" required />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label>NIT / DNI</label>
                        <input value={newClient.nit_dni} onChange={e => setNewClient({...newClient, nit_dni: e.target.value})} placeholder="ID Fiscal" required />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label>Dirección</label>
                        <input value={newClient.address} onChange={e => setNewClient({...newClient, address: e.target.value})} placeholder="Dirección de entrega" />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center' }}>Registrar</button>
                </form>
            </div>

            <div className="glass" style={{ padding: '1rem' }}>
                <table>
                    <thead>
                        <tr>
                            <th>Cliente</th>
                            <th>NIT / DNI</th>
                            <th>Dirección</th>
                            <th>Vínculo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map(c => (
                            <tr key={c.id}>
                                <td style={{ fontWeight: 600 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '5px', borderRadius: '50%' }}><Contact size={16} color="var(--primary)" /></div>
                                        {c.name}
                                    </div>
                                </td>
                                <td>{c.nit_dni}</td>
                                <td><div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}><MapPin size={14} /> {c.address || 'Hone'}</div></td>
                                <td><span className="tag tag-blue">Cliente Regular</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Clients;
