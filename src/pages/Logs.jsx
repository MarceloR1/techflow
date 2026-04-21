import React, { useState, useEffect } from 'react';
import { ClipboardList, Clock, User, Activity, Search, ShieldCheck, Filter, Zap, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const Logs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/logs');
            setLogs(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getActionTag = (action) => {
        const act = action.toLowerCase();
        if (act.includes('elimin') || act.includes('borr')) return 'tag-red';
        if (act.includes('crea') || act.includes('registr') || act.includes('nuev')) return 'tag-blue';
        if (act.includes('venta') || act.includes('factur')) return 'tag-green';
        return 'tag-purple';
    };

    const getIcon = (action) => {
        const act = action.toLowerCase();
        if (act.includes('elimin')) return <AlertCircle size={16} color="#f43f5e" />;
        if (act.includes('venta')) return <Zap size={16} color="#10b981" />;
        return <Activity size={16} color="var(--primary)" />;
    };

    const filteredLogs = logs.filter(l => 
        l.user_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        l.action.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ maxWidth: '1200px', margin: '0 auto' }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 950, letterSpacing: '-1.5px', marginBottom: '0.5rem' }}>Bitácora de Auditoría</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Registro inmutable de actividades y operaciones de seguridad del sistema.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div className="glass" style={{ padding: '0.6rem 1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Search size={18} color="var(--text-secondary)" />
                        <input 
                            type="text" 
                            placeholder="Filtrar por usuario o acción..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', fontSize: '0.9rem', width: '220px' }}
                        />
                    </div>
                </div>
            </div>

            <div className="glass" style={{ padding: '2.5rem', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.2rem', fontWeight: 800 }}>
                        <ShieldCheck size={24} color="var(--primary)" /> Historial Operativo
                    </h3>
                    <span className="tag tag-blue" style={{ fontSize: '0.7rem' }}>Sincronizado: Real-time</span>
                </div>
                
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '5rem', opacity: 0.5 }}>Reconstruyendo secuencia de eventos...</div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <AnimatePresence>
                            {filteredLogs.length === 0 ? (
                                <motion.p 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 0.5 }}
                                    style={{ textAlign: 'center', padding: '4rem' }}
                                >
                                    No se encontraron registros coincidentes.
                                </motion.p>
                            ) : (
                                filteredLogs.map((log, idx) => (
                                    <motion.div 
                                        key={log.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.02 }}
                                        className="glass-card" 
                                        style={{ 
                                            padding: '1.5rem', 
                                            display: 'flex', 
                                            justifyContent: 'space-between', 
                                            alignItems: 'center', 
                                            background: 'rgba(255,255,255,0.02)',
                                            border: '1px solid rgba(255,255,255,0.03)',
                                            borderRadius: '18px'
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                            <div style={{ 
                                                background: 'rgba(255,255,255,0.05)', 
                                                width: '50px', 
                                                height: '50px', 
                                                borderRadius: '50%', 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                justifyContent: 'center',
                                                border: '1px solid rgba(255,255,255,0.05)'
                                            }}>
                                                <User size={22} color="var(--primary)" />
                                            </div>
                                            <div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                                                    <p style={{ fontWeight: 800, fontSize: '1.05rem' }}>{log.user_name}</p>
                                                    <span className={`tag ${getActionTag(log.action)}`} style={{ fontSize: '0.65rem', padding: '3px 8px' }}>
                                                        {log.action.split(' ')[0]}
                                                    </span>
                                                </div>
                                                <p style={{ fontSize: '0.95rem', color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    {getIcon(log.action)} {log.action}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, background: 'rgba(0,0,0,0.2)', padding: '8px 15px', borderRadius: '12px' }}>
                                                <Clock size={14} /> {new Date(log.timestamp).toLocaleString()}
                                            </div>
                                            <p style={{ fontSize: '0.65rem', opacity: 0.3, marginTop: '8px', fontFamily: 'monospace' }}>LOG_ID: {log.id.toString().padStart(6, '0')}</p>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </div>
            
            <div style={{ marginTop: '3rem', padding: '2rem', textAlign: 'center', opacity: 0.4 }}>
                <p style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <ShieldCheck size={14} /> Los registros de TechFlow son persistentes y están protegidos contra manipulación.
                </p>
            </div>
            
            <style>{`
                .tag-red { background: rgba(244, 63, 94, 0.1); color: #fb7185; border: 1px solid rgba(244, 63, 94, 0.2); }
            `}</style>
        </motion.div>
    );
};

export default Logs;
