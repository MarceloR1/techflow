import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import { 
  Package, ShoppingCart, User, ClipboardList, TrendingUp, LogOut, LayoutDashboard, Search, Sparkles, Users as UsersIcon, Contact
} from 'lucide-react';
import axios from 'axios';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Inventory from './pages/Inventory';
import Billing from './pages/Billing';
import Accounting from './pages/Accounting';
import Logs from './pages/Logs';
import Users from './pages/Users';
import Clients from './pages/Clients';

const Sidebar = ({ user, handleLogout }) => {
  if (!user || !user.role) {
    console.error("User object is invalid:", user);
    localStorage.removeItem('user');
    window.location.href = '/login';
    return null;
  }

  return (
    <div className="sidebar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '3rem' }}>
        <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', padding: '10px', borderRadius: '14px', boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4)' }}>
          <TrendingUp color="#fff" size={24} />
        </div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.02em', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>TechFlow</h2>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Module: Inventory */}
        <div>
          <label style={{ fontSize: '0.7rem', opacity: 0.5, marginLeft: '1rem', marginBottom: '0.5rem', display: 'block' }}>INVENTARIO</label>
          <Link to="/inventory" className="btn btn-outline" style={{ border: 'none', justifyContent: 'flex-start', color: '#fff' }}>
            <Package size={20} color="var(--primary)" /> Productos
          </Link>
        </div>

        {/* Module: Billing */}
        <div>
          <label style={{ fontSize: '0.7rem', opacity: 0.5, marginLeft: '1rem', marginBottom: '0.5rem', display: 'block' }}>FACTURACIÓN</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <Link to="/billing" className="btn btn-outline" style={{ border: 'none', justifyContent: 'flex-start', color: '#fff' }}>
              <ShoppingCart size={20} color="var(--primary)" /> Nueva Venta
            </Link>
            <Link to="/clients" className="btn btn-outline" style={{ border: 'none', justifyContent: 'flex-start', color: '#fff' }}>
              <Contact size={20} color="var(--primary)" /> Clientes
            </Link>
          </div>
        </div>

        {/* Module: Accounting */}
        {user.role !== 'Vendedor' && (
          <div>
            <label style={{ fontSize: '0.7rem', opacity: 0.5, marginLeft: '1rem', marginBottom: '0.5rem', display: 'block' }}>CONTABILIDAD</label>
            <Link to="/accounting" className="btn btn-outline" style={{ border: 'none', justifyContent: 'flex-start', color: '#fff' }}>
              <TrendingUp size={20} color="var(--primary)" /> Libro Diario
            </Link>
          </div>
        )}

        {/* Module: Security */}
        {user.role === 'Administrador' && (
          <div>
            <label style={{ fontSize: '0.7rem', opacity: 0.5, marginLeft: '1rem', marginBottom: '0.5rem', display: 'block' }}>SEGURIDAD</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <Link to="/users" className="btn btn-outline" style={{ border: 'none', justifyContent: 'flex-start', color: '#fff' }}>
                <UsersIcon size={20} color="var(--primary)" /> Usuarios
              </Link>
              <Link to="/logs" className="btn btn-outline" style={{ border: 'none', justifyContent: 'flex-start', color: '#fff' }}>
                <ClipboardList size={20} color="var(--primary)" /> Bitácora
              </Link>
            </div>
          </div>
        )}
      </nav>

      <div style={{ marginTop: 'auto', background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '20px', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.8rem' }}>
          <div className="tag tag-purple">{user.role}</div>
        </div>
        <p style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff' }}>{user.name || "Usuario"}</p>
        <button onClick={handleLogout} className="btn" style={{ color: 'var(--secondary)', padding: '0.5rem 0', marginTop: '1rem', fontSize: '0.85rem' }}>
          <LogOut size={16} /> Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

const DashboardLayout = ({ children, user, handleLogout }) => {
  if (!user) return <Navigate to="/login" />;
  
  return (
    <div className="dashboard-layout">
      <Sidebar user={user} handleLogout={handleLogout} />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

function App() {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error("Error parsing user from localStorage", e);
      return null;
    }
  });

  const handleLogin = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={user ? <Navigate to="/inventory" /> : <LoginPage onLogin={handleLogin} />} />
        
        <Route path="/inventory" element={
          user ? <DashboardLayout user={user} handleLogout={handleLogout}><Inventory user={user} /></DashboardLayout> : <Navigate to="/login" />
        } />
        
        <Route path="/billing" element={
          user ? <DashboardLayout user={user} handleLogout={handleLogout}><Billing user={user} /></DashboardLayout> : <Navigate to="/login" />
        } />

        <Route path="/clients" element={
          user ? <DashboardLayout user={user} handleLogout={handleLogout}><Clients user={user} /></DashboardLayout> : <Navigate to="/login" />
        } />

        <Route path="/users" element={
          user?.role === 'Administrador' ? <DashboardLayout user={user} handleLogout={handleLogout}><Users user={user} /></DashboardLayout> : <Navigate to="/login" />
        } />

        <Route path="/accounting" element={
          user?.role !== 'Vendedor' ? <DashboardLayout user={user} handleLogout={handleLogout}><Accounting /></DashboardLayout> : <Navigate to="/login" />
        } />

        <Route path="/logs" element={
          user?.role === 'Administrador' ? <DashboardLayout user={user} handleLogout={handleLogout}><Logs /></DashboardLayout> : <Navigate to="/login" />
        } />
      </Routes>
    </Router>
  );
}

export default App;
