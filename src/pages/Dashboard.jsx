import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    TrendingUp, Package, Users, Activity, ArrowUpRight, 
    ArrowDownRight, DollarSign, ShoppingBag, Bell, Calendar
} from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
    const [stats, setStats] = useState({ products: 0, sales: 0, income: 0, logs: 0 });
    const [recentLogs, setRecentLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [p, a, l, c] = await Promise.all([
                axios.get('/api/products'),
                axios.get('/api/accounting'),
                axios.get('/api/logs'),
                axios.get('/api/clients')
            ]);
            
            const totalIncome = a.data.reduce((s, e) => s + e.amount, 0);
            
            setStats({
                products: p.data.length,
                sales: a.data.length,
                income: totalIncome,
                clients: c.data.length
            });
            setRecentLogs(l.data.slice(0, 5));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const KpiCard = ({ icon: Icon, title, value, color, delay }) => (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            whileHover={{ y: -5 }}
            className="glass" 
            style={{ padding: '2rem', borderLeft: `5px solid ${color}`, flex: 1 }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div style={{ background: `${color}15`, padding: '12px', borderRadius: '15px', color: color }}>
                    <Icon size={24} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--success)', fontWeight: 800 }}>
                    <ArrowUpRight size={14} /> +8.2%
                </div>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>{title}</p>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 950, letterSpacing: '-1.5px' }}>{value}</h2>
        </motion.div>
    );

    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 950, letterSpacing: '-1.5px', marginBottom: '0.5rem' }}>Panel de Control</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Métricas críticas y salud operativa del sistema TechFlow.</p>
                </div>
                <div className="glass" style={{ padding: '0.8rem 1.5rem', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 800 }}>ESTADO DEL SISTEMA</p>
                        <p style={{ fontSize: '0.9rem', color: 'var(--success)', fontWeight: 800 }}>OPERATIVO / SEGURO</p>
                    </div>
                    <div style={{ width: '10px', height: '10px', background: 'var(--success)', borderRadius: '50%', boxShadow: '0 0 10px var(--success)' }}></div>
                </div>
            </div>

            {/* KPI Grid */}
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
                <KpiCard icon={DollarSign} title="Finanzas" value={`$${stats.income.toFixed(2)}`} color="#10b981" delay={0.1} />
                <KpiCard icon={ShoppingBag} title="Ventas" value={stats.sales} color="#8b5cf6" delay={0.2} />
                <KpiCard icon={Package} title="Logística" value={stats.products} color="#3b82f6" delay={0.3} />
                <KpiCard icon={Users} title="Clientes" value={stats.clients} color="#f43f5e" delay={0.4} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '2.5rem' }}>
                {/* Simulated Chart Placeholder */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="glass" 
                    style={{ padding: '2.5rem', minHeight: '400px', position: 'relative', overflow: 'hidden' }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h3 style={{ fontWeight: 800, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <TrendingUp size={20} color="var(--primary)" /> Tendencia Semanal de Ventas
                        </h3>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button className="tag tag-blue" style={{ cursor: 'pointer' }}>7D</button>
                            <button className="tag" style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>30D</button>
                        </div>
                    </div>

                    <div style={{ height: '280px', display: 'flex', alignItems: 'flex-end', gap: '15px', paddingBottom: '20px' }}>
                        {[40, 60, 45, 90, 65, 85, 75].map((h, i) => (
                            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                                <motion.div 
                                    initial={{ height: 0 }}
                                    animate={{ height: `${h}%` }}
                                    transition={{ delay: 0.6 + (i * 0.1), type: 'spring' }}
                                    style={{ 
                                        width: '100%', 
                                        background: i === 3 ? 'var(--primary)' : 'rgba(139, 92, 246, 0.15)', 
                                        borderRadius: '8px',
                                        boxShadow: i === 3 ? '0 0 20px rgba(139, 92, 246, 0.4)' : 'none'
                                    }}
                                />
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 700 }}>D{i+1}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Recent Activity Sidebar */}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="glass" 
                    style={{ padding: '2.5rem' }}
                >
                    <h3 style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Bell size={20} color="var(--secondary)" /> Actividad Crítica
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {recentLogs.map((log, i) => (
                            <div key={i} style={{ borderLeft: '2px solid var(--border)', paddingLeft: '1.5rem', position: 'relative' }}>
                                <div style={{ position: 'absolute', left: '-5px', top: '0', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)' }}></div>
                                <p style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '2px' }}>{log.user_name}</p>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>{log.action}</p>
                                <p style={{ fontSize: '0.7rem', opacity: 0.5 }}>{new Date(log.timestamp).toLocaleTimeString()}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Dashboard;
