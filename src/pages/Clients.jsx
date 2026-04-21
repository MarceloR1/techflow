import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Users, UserPlus, Search, Mail, MapPin, 
    CreditCard, Phone, Filter, ChevronRight, Contact, 
    MoreHorizontal, TrendingUp, Building2, Briefcase
} from 'lucide-react';
import axios from 'axios';
import { useToast } from '../App';

const Clients = ({ user }) => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { showToast } = useToast();

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const res = await axios.get('/api/clients');
            setClients(res.data);
        } catch (err) {
            showToast('Error al conectar con la base de clientes', 'error');
        } finally {
            setLoading(false);
        }
    };

    const filteredClients = clients.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.nit_dni.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 950, marginBottom: '0.5rem', letterSpacing: '-1.5px' }}>Cartera de Clientes</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Gestión estratégica de relaciones comerciales y perfiles corporativos.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div className="glass" style={{ padding: '0.5rem 1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Search size={18} color="var(--text-secondary)" />
                        <input type="text" placeholder="Filtrar por razon social o NIT..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', fontSize: '0.9rem', width: '250px' }} />
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
                {[
                    { label: 'Clientes Totales', value: clients.length, icon: Users, color: 'var(--primary)' },
                    { label: 'Crecimiento Mes', value: '+12%', icon: TrendingUp, color: 'var(--success)' },
                    { label: 'Sector Retail', value: '45%', icon: Building2, color: 'var(--secondary)' },
                    { label: 'Sector Enterprise', value: '55%', icon: Briefcase, color: 'var(--accent)' }
                ].map((stat, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass" style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '60px', height: '60px', background: stat.color, filter: 'blur(35px)', opacity: 0.1 }}></div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
                            <div style={{ background: `${stat.color}15`, padding: '8px', borderRadius: '10px' }}>
                                <stat.icon size={18} color={stat.color} />
                            </div>
                            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>{stat.label}</span>
                        </div>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 900 }}>{stat.value}</h2>
                    </motion.div>
                ))}
            </div>

            <div className="glass" style={{ padding: '2rem', minHeight: '400px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '10px', borderRadius: '12px' }}><Contact size={20} color="var(--primary)" /></div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Directorio Maestro</h3>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={fetchClients} className="btn" style={{ background: 'rgba(255,255,255,0.02)', padding: '8px 15px', fontSize: '0.8rem' }}><Filter size={14} /> Refinar Vista</button>
                    </div>
                </div>

                {loading ? ( <div style={{ textAlign: 'center', padding: '5rem', opacity: 0.5 }}>Interrogando base de datos corporativa...</div> ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                        <AnimatePresence>
                            {filteredClients.map((c, idx) => (
                                <motion.div key={c.id} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.05 }} className="glass-card" style={{ padding: '1.8rem', position: 'relative' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                        <div style={{ width: '45px', height: '45px', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Building2 size={20} color="var(--primary)" />
                                        </div>
                                        <button style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><MoreHorizontal size={18} /></button>
                                    </div>

                                    <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>{c.name}</h4>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
                                        <CreditCard size={14} color="var(--text-secondary)" />
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>NIT: {c.nit_dni}</span>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <MapPin size={14} color="var(--primary)" />
                                            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.address}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <Mail size={14} color="var(--primary)" />
                                            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>comunicacion@cliente.cl</span>
                                        </div>
                                    </div>

                                    <button className="btn btn-outline" style={{ width: '100%', marginTop: '2rem', justifyContent: 'center', fontSize: '0.8rem', borderRadius: '10px' }}>Ver Auditoría <ChevronRight size={14} /></button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default Clients;
