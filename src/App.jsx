import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { 
  Package, ShoppingCart, ClipboardList, TrendingUp, LogOut, LayoutDashboard, Users as UsersIcon, Contact, Store, ChevronRight, Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

// Context
import { ToastProvider } from './ToastContext';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Billing from './pages/Billing';
import Accounting from './pages/Accounting';
import Logs from './pages/Logs';
import Users from './pages/Users';
import Clients from './pages/Clients';
import CustomerStore from './pages/CustomerStore';

// --- COMPONENTS ---

const SidebarLink = ({ to, icon: Icon, children, active }) => (
  <Link to={to} style={{ textDecoration: 'none' }}>
    <motion.div 
      whileHover={{ x: 5, background: 'rgba(255,255,255,0.05)' }}
      style={{ 
        display: 'flex', alignItems: 'center', gap: '15px', padding: '1rem 1.5rem', borderRadius: '16px',
        color: active ? '#fff' : 'rgba(255,255,255,0.5)',
        background: active ? 'rgba(139, 92, 246, 0.15)' : 'transparent',
        border: active ? '1px solid rgba(139, 92, 246, 0.2)' : '1px solid transparent',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative', overflow: 'hidden'
      }}
    >
      {active && (
        <motion.div 
          layoutId="sidebar-active"
          style={{ position: 'absolute', left: 0, top: '20%', bottom: '20%', width: '4px', background: 'var(--primary)', borderRadius: '0 4px 4px 0', boxShadow: '0 0 15px var(--primary)' }}
        />
      )}
      <Icon size={20} color={active ? 'var(--primary)' : 'currentColor'} />
      <span style={{ fontWeight: active ? 700 : 500, fontSize: '0.95rem' }}>{children}</span>
      {active && <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: 0.5 }} />}
    </motion.div>
  </Link>
);

const Sidebar = ({ user, handleLogout }) => {
  const location = useLocation();
  if (!user || !user.role) return null;

  return (
    <motion.div 
      initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="sidebar"
      style={{ 
        display: 'flex', flexDirection: 'column', padding: '2.5rem 1.5rem',
        background: 'rgba(10, 10, 15, 0.8)', backdropFilter: 'blur(20px)', borderRight: '1px solid rgba(255,255,255,0.05)', width: '320px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '4rem', paddingLeft: '1rem' }}>
        <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', width: '45px', height: '45px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(139, 92, 246, 0.4)' }}>
          <TrendingUp color="#fff" size={24} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 950, letterSpacing: '-1px', color: '#fff' }}>TechFlow</h2>
          <span style={{ fontSize: '0.65rem', color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px' }}>Enterprise OS</span>
        </div>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '2rem', flex: 1 }}>
        {user.role === 'Cliente' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 800, letterSpacing: '1.5px', marginBottom: '0.5rem', marginLeft: '1rem' }}>SISTEMA B2C</label>
            <SidebarLink to="/store" icon={Store} active={location.pathname === '/store'}>Tienda Digital</SidebarLink>
          </div>
        )}

        {user.role !== 'Cliente' && (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 800, letterSpacing: '1.5px', marginBottom: '0.5rem', marginLeft: '1rem' }}>VISTA GENERAL</label>
              <SidebarLink to="/dashboard" icon={LayoutDashboard} active={location.pathname === '/dashboard'}>Panel Control</SidebarLink>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 800, letterSpacing: '1.5px', marginBottom: '0.5rem', marginLeft: '1rem' }}>OPERACIONES</label>
              <SidebarLink to="/inventory" icon={Package} active={location.pathname === '/inventory'}>Almacén y Stock</SidebarLink>
              <SidebarLink to="/billing" icon={ShoppingCart} active={location.pathname === '/billing'}>Terminal Venta</SidebarLink>
              <SidebarLink to="/clients" icon={Contact} active={location.pathname === '/clients'}>Cartera Clientes</SidebarLink>
            </div>
            {['Administrador', 'Auditor'].includes(user.role) && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 800, letterSpacing: '1.5px', marginBottom: '0.5rem', marginLeft: '1rem' }}>FINANZAS</label>
                <SidebarLink to="/accounting" icon={TrendingUp} active={location.pathname === '/accounting'}>Libro Diario</SidebarLink>
              </div>
            )}
            {user.role === 'Administrador' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 800, letterSpacing: '1.5px', marginBottom: '0.5rem', marginLeft: '1rem' }}>ADMINISTRACIÓN</label>
                <SidebarLink to="/users" icon={UsersIcon} active={location.pathname === '/users'}>Personal</SidebarLink>
                <SidebarLink to="/logs" icon={ClipboardList} active={location.pathname === '/logs'}>Auditoría</SidebarLink>
              </div>
            )}
          </>
        )}
      </nav>

      <div style={{ marginTop: 'auto', background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
            <Shield size={20} color="var(--primary)" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: '0.9rem', fontWeight: 800, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</p>
            <p style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 900, textTransform: 'uppercase' }}>{user.role}</p>
          </div>
        </div>
        <motion.button whileHover={{ background: 'rgba(244, 63, 94, 0.1)', color: '#fb7185' }} onClick={handleLogout} style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', transition: 'all 0.3s' }}>
          <LogOut size={16} /> Salida Segura
        </motion.button>
      </div>
    </motion.div>
  );
};

const DashboardLayout = ({ children, user, handleLogout }) => {
  if (!user) return <Navigate to="/login" />;
  
  return (
    <div className="dashboard-layout" style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', background: '#050508' }}>
      <Sidebar user={user} handleLogout={handleLogout} />
      <main className="main-content" style={{ flex: 1, overflowY: 'auto', padding: '3rem', position: 'relative' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={window.location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

function App() {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) { return null; }
  });

  const handleLogin = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const RoleBasedRedirect = () => {
    if (!user) return <Navigate to="/login" />;
    return user.role === 'Cliente' ? <Navigate to="/store" /> : <Navigate to="/dashboard" />;
  };

  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={user ? <RoleBasedRedirect /> : <LoginPage onLogin={handleLogin} />} />
          <Route path="/register" element={user ? <RoleBasedRedirect /> : <RegisterPage />} />
          
          <Route path="/dashboard" element={user && user.role !== 'Cliente' ? <DashboardLayout user={user} handleLogout={handleLogout}><Dashboard /></DashboardLayout> : <RoleBasedRedirect />} />
          <Route path="/inventory" element={user && user.role !== 'Cliente' ? <DashboardLayout user={user} handleLogout={handleLogout}><Inventory user={user} /></DashboardLayout> : <RoleBasedRedirect />} />
          <Route path="/store" element={user && user.role === 'Cliente' ? <DashboardLayout user={user} handleLogout={handleLogout}><CustomerStore user={user} /></DashboardLayout> : <RoleBasedRedirect />} />
          <Route path="/billing" element={user && user.role !== 'Cliente' ? <DashboardLayout user={user} handleLogout={handleLogout}><Billing user={user} /></DashboardLayout> : <RoleBasedRedirect />} />
          <Route path="/clients" element={user && user.role !== 'Cliente' ? <DashboardLayout user={user} handleLogout={handleLogout}><Clients user={user} /></DashboardLayout> : <RoleBasedRedirect />} />
          <Route path="/users" element={user?.role === 'Administrador' ? <DashboardLayout user={user} handleLogout={handleLogout}><Users user={user} /></DashboardLayout> : <RoleBasedRedirect />} />
          <Route path="/accounting" element={['Administrador', 'Auditor'].includes(user?.role) ? <DashboardLayout user={user} handleLogout={handleLogout}><Accounting /></DashboardLayout> : <RoleBasedRedirect />} />
          <Route path="/logs" element={user?.role === 'Administrador' ? <DashboardLayout user={user} handleLogout={handleLogout}><Logs /></DashboardLayout> : <RoleBasedRedirect />} />
          <Route path="*" element={<RoleBasedRedirect />} />
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;
