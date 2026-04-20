import React, { useState, useEffect } from 'react';
import { ClipboardList, Clock, User, Activity } from 'lucide-react';
import axios from 'axios';

const Logs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/api/logs')
            .then(res => setLogs(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div>
            <h1>Bitácora de Seguridad</h1>

            <div className="glass" style={{ padding: '1.5rem' }}>
                <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Activity size={20} color="var(--primary)" /> Registro de Actividad
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {logs.length === 0 ? (
                        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>No hay registros de actividad</p>
                    ) : (
                        logs.map(log => (
                            <div key={log.id} className="glass-card" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <div style={{ background: 'rgba(0, 242, 255, 0.1)', padding: '8px', borderRadius: '50%' }}>
                                        <User size={18} color="var(--primary)" />
                                    </div>
                                    <div>
                                        <p style={{ fontWeight: 600 }}>{log.user_name}</p>
                                        <p style={{ fontSize: '0.9rem', color: '#fff' }}>{log.action}</p>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <Clock size={12} /> {new Date(log.timestamp).toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Logs;
