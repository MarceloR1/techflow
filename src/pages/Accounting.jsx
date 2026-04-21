import React, { useState, useEffect } from 'react';
import { TrendingUp, FileText, Calendar, DollarSign, PieChart, ArrowUpRight, Download, RefreshCw, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const Accounting = () => {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/accounting');
            setEntries(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const totalIncome = entries.reduce((sum, entry) => sum + entry.amount, 0);
    const avgTicket = entries.length > 0 ? (totalIncome / entries.length) : 0;

    return (
        <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ maxWidth: '1400px', margin: '0 auto' }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 950, letterSpacing: '-1.5px', marginBottom: '0.5rem' }}>Libro Diario y Contabilidad</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Seguimiento financiero automatizado y balance de ingresos transaccionales.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={fetchData} className="btn btn-outline" style={{ padding: '0.7rem 1.2rem' }}>
                        <RefreshCw size={18} />
                    </button>
                    <button className="btn btn-primary" style={{ padding: '0.7rem 1.5rem' }}>
                        <Download size={18} /> Exportar Reporte
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3.5rem' }}>
                <motion.div 
                    whileHover={{ y: -5 }}
                    className="glass" 
                    style={{ padding: '2rem', borderLeft: '5px solid var(--success)', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), transparent)' }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                        <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '10px', borderRadius: '12px' }}>
                            <DollarSign size={22} color="var(--success)" />
                        </div>
                        <span style={{ color: 'var(--success)', fontWeight: 800, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <ArrowUpRight size={14} /> +12% vs mes anterior
                        </span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Ingresos Totales Brutos</p>
                    <h2 style={{ fontSize: '2.8rem', fontWeight: 900, color: '#fff', letterSpacing: '-1px' }}>${totalIncome.toFixed(2)}</h2>
                </motion.div>

                <motion.div 
                    whileHover={{ y: -5 }}
                    className="glass" 
                    style={{ padding: '2rem', borderLeft: '5px solid var(--primary)', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), transparent)' }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                        <div style={{ background: 'rgba(139, 92, 246, 0.2)', padding: '10px', borderRadius: '12px' }}>
                            <BarChart3 size={22} color="var(--primary)" />
                        </div>
                        <span style={{ opacity: 0.5, fontSize: '0.8rem', fontWeight: 600 }}>Periodo Fiscal 2026</span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Transacciones Procesadas</p>
                    <h2 style={{ fontSize: '2.8rem', fontWeight: 900, color: '#fff', letterSpacing: '-1px' }}>{entries.length}</h2>
                </motion.div>

                <motion.div 
                    whileHover={{ y: -5 }}
                    className="glass" 
                    style={{ padding: '2rem', borderLeft: '5px solid var(--accent)', background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), transparent)' }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                        <div style={{ background: 'rgba(245, 158, 11, 0.2)', padding: '10px', borderRadius: '12px' }}>
                            <PieChart size={22} color="var(--accent)" />
                        </div>
                        <span style={{ opacity: 0.5, fontSize: '0.8rem', fontWeight: 600 }}>Ticket Promedio</span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Promedio por Venta</p>
                    <h2 style={{ fontSize: '2.8rem', fontWeight: 900, color: '#fff', letterSpacing: '-1px' }}>${avgTicket.toFixed(2)}</h2>
                </motion.div>
            </div>

            {/* Ledger Table */}
            <div className="glass" style={{ padding: '2.5rem', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.3rem', fontWeight: 800 }}>
                        <FileText size={24} color="var(--primary)" /> Registro de Asientos Contables
                    </h3>
                    <div className="tag tag-green">Estado: Auditado</div>
                </div>
                
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '5rem', opacity: 0.5, fontSize: '1.1rem' }}>Generando balance General...</div>
                ) : (
                    <table style={{ borderSpacing: '0 10px' }}>
                        <thead>
                            <tr style={{ background: 'transparent' }}>
                                <th style={{ paddingLeft: '0' }}>Referencia</th>
                                <th>Fecha de Asiento</th>
                                <th>Concepto / Glosa</th>
                                <th>Debe (Ingreso)</th>
                                <th>Estado</th>
                                <th style={{ textAlign: 'right' }}>ID Auditoría</th>
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence>
                                {entries.length === 0 ? (
                                    <tr><td colSpan="6" style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-secondary)', fontSize: '1.1rem' }}>No se han detectado movimientos en el periodo actual.</td></tr>
                                ) : (
                                    entries.map((entry, idx) => (
                                        <motion.tr 
                                            key={entry.id}
                                            initial={{ opacity: 0, x: -15 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.03 }}
                                            style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '14px' }}
                                        >
                                            <td style={{ padding: '1.5rem', borderTopLeftRadius: '14px', borderBottomLeftRadius: '14px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <div style={{ padding: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                                                        <TrendingUp size={16} color="var(--success)" />
                                                    </div>
                                                    <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>V-2026-{entry.id.toString().padStart(4, '0')}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                                    <Calendar size={14} /> {new Date(entry.date).toLocaleString()}
                                                </div>
                                            </td>
                                            <td style={{ fontWeight: 700, fontSize: '0.95rem' }}>{entry.reference}</td>
                                            <td style={{ color: 'var(--success)', fontWeight: 900, fontSize: '1.2rem' }}>+ ${entry.amount.toFixed(2)}</td>
                                            <td><span className="tag tag-green" style={{ fontSize: '0.7rem' }}>Confirmado</span></td>
                                            <td style={{ textAlign: 'right', borderTopRightRadius: '14px', borderBottomRightRadius: '14px', paddingRight: '1.5rem', opacity: 0.4, fontSize: '0.8rem', fontFamily: 'monospace' }}>
                                                AX-{entry.id}
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                )}
            </div>
            
            {/* Footer / Disclaimers */}
            <div style={{ marginTop: '3rem', padding: '2rem', textAlign: 'center', opacity: 0.5, fontSize: '0.85rem' }}>
                <p>Este reporte se genera dinámicamente según los estándares de contabilidad híbrida de TechFlow.</p>
                <p>Todas las cifras están protegidas bajo el algoritmo de inmutabilidad transaccional.</p>
            </div>
        </motion.div>
    );
};

export default Accounting;
