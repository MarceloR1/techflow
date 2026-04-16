import React, { useState, useEffect } from 'react';
import { TrendingUp, FileText, Calendar } from 'lucide-react';
import axios from 'axios';

const Accounting = () => {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/api/accounting')
            .then(res => setEntries(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const totalIncome = entries.reduce((sum, entry) => sum + entry.amount, 0);

    return (
        <div>
            <h1>Módulo de Contabilidad</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
                <div className="glass" style={{ padding: '1.5rem', borderLeft: '4px solid var(--success)' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Ingresos Totales (Ventas)</p>
                    <h2 style={{ fontSize: '2.5rem', color: 'var(--success)' }}>${totalIncome.toFixed(2)}</h2>
                </div>
                <div className="glass" style={{ padding: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Asientos Registrados</p>
                    <h2 style={{ fontSize: '2.5rem' }}>{entries.length}</h2>
                </div>
            </div>

            <div className="glass" style={{ padding: '1.5rem' }}>
                <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileText size={20} color="var(--primary)" /> Libro Diario Automático
                </h3>
                
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Fecha</th>
                            <th>Referencia</th>
                            <th>Debe (Ingreso)</th>
                            <th>Tipo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {entries.length === 0 ? (
                            <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>No hay movimientos contables registrados</td></tr>
                        ) : (
                            entries.map(entry => (
                                <tr key={entry.id}>
                                    <td>#{entry.id}</td>
                                    <td><div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Calendar size={14} /> {new Date(entry.date).toLocaleString()}</div></td>
                                    <td style={{ fontWeight: 600 }}>{entry.reference}</td>
                                    <td style={{ color: 'var(--success)', fontWeight: 700 }}>+ ${entry.amount.toFixed(2)}</td>
                                    <td><span className="tag tag-green">Venta</span></td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Accounting;
