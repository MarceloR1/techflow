import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { 
  Package, ShoppingCart, ClipboardList, TrendingUp, LogOut, LayoutDashboard, 
  Users as UsersIcon, Contact, Store, ChevronRight, Shield, Menu, X, 
  PanelLeftClose, PanelLeftOpen, Bell, Search, User as UserIcon
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

const SidebarLink = ({ to, icon: Icon, children, active, collapsed, onClick }) => (
  <Link to={to} style={{ textDecoration: 'none' }} onClick={onClick}>
    <motion.div 
      whileHover={{ x: collapsed ? 0 : 5, background: 'rgba(255,255,255,0.05)' }}
      style={{ 
        display: 'flex', alignItems: 'center', gap: collapsed ? '0' : '15px', padding: '1rem', 
        justifyContent: collapsed ? 'center' : 'flex-start',
        borderRadius: '16px',
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
      <Icon size={20} color={active ? 'var(--primary)' : 'currentColor'} style={{ minWidth: '20px' }} />
      {!collapsed && (
        <motion.span 
          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
          style={{ fontWeight: active ? 700 : 500, fontSize: '0.9rem', whiteSpace: 'nowrap' }}
        >
          {children}
        </motion.span>
      )}
      {active && !collapsed && <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: 0.5 }} />}
    </motion.div>
  </Link>
);

const Sidebar = ({ user, handleLogout, collapsed, toggleCollapse, mobileOpen, closeMobile }) => {
  const location = useLocation();
  if (!user || !user.role) return null;

  const sidebarContent = (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '3rem', padding: '0 0.5rem', justifyContent: collapsed ? 'center' : 'flex-start' }}>
        <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', minWidth: '42px', height: '42px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(139, 92, 246, 0.4)' }}>
          <TrendingUp color="#fff" size={22} />
        </div>
        {!collapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 950, letterSpacing: '-1px', color: '#fff', margin: 0 }}>TechFlow</h2>
            <span style={{ fontSize: '0.6rem', color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Enterprise OS</span>
          </motion.div>
        )}
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem', flex: 1, overflowY: 'auto', paddingRight: '5px' }}>
        {user.role === 'Cliente' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {!collapsed && <label style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 800, letterSpacing: '1px', marginBottom: '0.4rem', marginLeft: '0.5rem', opacity: 0.5 }}>SISTEMA B2C</label>}
            <SidebarLink to="/store" icon={Store} active={location.pathname === '/store'} collapsed={collapsed} onClick={closeMobile}>Tienda Digital</SidebarLink>
          </div>
        )}

        {user.role !== 'Cliente' && (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {!collapsed && <label style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 800, letterSpacing: '1px', marginBottom: '0.4rem', marginLeft: '0.5rem', opacity: 0.5 }}>VISTA GENERAL</label>}
              <SidebarLink to="/dashboard" icon={LayoutDashboard} active={location.pathname === '/dashboard'} collapsed={collapsed} onClick={closeMobile}>Panel Control</SidebarLink>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {!collapsed && <label style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 800, letterSpacing: '1px', marginBottom: '0.4rem', marginLeft: '0.5rem', opacity: 0.5 }}>OPERACIONES</label>}
              <SidebarLink to="/inventory" icon={Package} active={location.pathname === '/inventory'} collapsed={collapsed} onClick={closeMobile}>Almacén</SidebarLink>
              <SidebarLink to="/billing" icon={ShoppingCart} active={location.pathname === '/billing'} collapsed={collapsed} onClick={closeMobile}>Ventas</SidebarLink>
              <SidebarLink to="/clients" icon={Contact} active={location.pathname === '/clients'} collapsed={collapsed} onClick={closeMobile}>Clientes</SidebarLink>
            </div>
            {['Administrador', 'Auditor'].includes(user.role) && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {!collapsed && <label style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 800, letterSpacing: '1px', marginBottom: '0.4rem', marginLeft: '0.5rem', opacity: 0.5 }}>FINANZAS</label>}
                <SidebarLink to="/accounting" icon={TrendingUp} active={location.pathname === '/accounting'} collapsed={collapsed} onClick={closeMobile}>Contabilidad</SidebarLink>
              </div>
            )}
            {user.role === 'Administrador' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {!collapsed && <label style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 800, letterSpacing: '1px', marginBottom: '0.4rem', marginLeft: '0.5rem', opacity: 0.5 }}>SISTEMA</label>}
                <SidebarLink to="/users" icon={UsersIcon} active={location.pathname === '/users'} collapsed={collapsed} onClick={closeMobile}>Personal</SidebarLink>
                <SidebarLink to="/logs" icon={ClipboardList} active={location.pathname === '/logs'} collapsed={collapsed} onClick={closeMobile}>Auditoría</SidebarLink>
              </div>
            )}
          </>
        )}
      </nav>

      <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {!collapsed ? (
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(139, 92, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Shield size={18} color="var(--primary)" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</p>
                    <p style={{ fontSize: '0.65rem', color: 'var(--primary)', fontWeight: 900, textTransform: 'uppercase' }}>{user.role}</p>
                </div>
                <button onClick={handleLogout} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer' }}>
                    <LogOut size={16} />
                </button>
            </div>
        ) : (
            <button onClick={handleLogout} style={{ width: '100%', padding: '1rem', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', display: 'flex', justifyContent: 'center' }}>
                <LogOut size={20} />
            </button>
        )}
        
        <button 
          className="desktop-only"
          onClick={toggleCollapse} 
          style={{ 
            width: '100%', padding: '0.8rem', borderRadius: '12px', background: 'transparent', 
            border: '1px solid rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' 
          }}
        >
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.div 
        animate={{ width: collapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)' }}
        className="sidebar desktop-only"
        style={{ 
          display: 'flex', flexDirection: 'column', padding: '2rem 1.2rem',
          background: 'rgba(10, 10, 15, 0.8)', backdropFilter: 'blur(30px)', borderRight: '1px solid rgba(255,255,255,0.05)',
          height: '100vh', position: 'relative', zIndex: 100
        }}
      >
        {sidebarContent}
      </motion.div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={closeMobile}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)', zIndex: 1000 }}
            />
            <motion.div 
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{ position: 'fixed', left: 0, top: 0, bottom: 0, width: '280px', background: '#050508', padding: '2rem 1.2rem', display: 'flex', flexDirection: 'column', zIndex: 1001, borderRight: '1px solid var(--border)' }}
            >
                <div style={{ position: 'absolute', right: '15px', top: '15px' }}>
                    <button onClick={closeMobile} style={{ background: 'transparent', border: 'none', color: '#fff' }}><X size={24} /></button>
                </div>
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

const Topbar = ({ user, toggleMobile, currentPath }) => {
    const getPageTitle = (path) => {
        const map = {
            '/dashboard': 'Panel de Control',
            '/inventory': 'Almacén y Stock',
            '/billing': 'Terminal de Ventas',
            '/clients': 'Cartera de Clientes',
            '/accounting': 'Contabilidad Fiscal',
            '/users': 'Gestión de Personal',
            '/logs': 'Auditoría de Seguridad',
            '/store': 'Tienda B2C'
        };
        return map[path] || 'TechFlow';
    };

    return (
        <header className="glass anim-fade-in" style={{ height: 'var(--header-height)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2.5rem', margin: '1.5rem', marginBottom: '0', borderRadius: '24px', zIndex: 50 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <button className="mobile-only" onClick={toggleMobile} style={{ background: 'transparent', border: 'none', color: '#fff', padding: '8px' }}>
                    <Menu size={24} />
                </button>
                <div>
                    <h1 style={{ fontSize: '1.2rem', fontWeight: 900, letterSpacing: '-0.5px' }}>{getPageTitle(currentPath)}</h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.5, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 800 }}>
                        <Shield size={10} /> Sistema Seguro
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <div className="desktop-only" style={{ position: 'relative' }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} />
                    <input type="text" placeholder="Búsqueda global..." style={{ padding: '0.6rem 1rem 0.6rem 2.5rem', fontSize: '0.8rem', width: '240px', background: 'rgba(255,255,255,0.03)' }} />
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', width: '42px', height: '42px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.6)' }}><Bell size={18} /></button>
                    <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '1rem', borderLeft: '1px solid var(--border)' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#fff' }}>{user.name.charAt(0)}</div>
                    </div>
                </div>
            </div>
        </header>
    );
};

const DashboardLayout = ({ children, user, handleLogout }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  if (!user) return <Navigate to="/login" />;
  
  return (
    <div className="dashboard-layout" style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', background: '#050508' }}>
      <Sidebar 
        user={user} 
        handleLogout={handleLogout} 
        collapsed={collapsed} 
        toggleCollapse={() => setCollapsed(!collapsed)}
        mobileOpen={mobileOpen}
        closeMobile={() => setMobileOpen(false)}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Topbar user={user} toggleMobile={() => setMobileOpen(true)} currentPath={location.pathname} />
        <main className="main-content" style={{ flex: 1, overflowY: 'auto', padding: '2.5rem', position: 'relative' }}>
            <AnimatePresence mode="wait">
            <motion.div
                key={location.pathname}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
            >
                {children}
            </motion.div>
            </AnimatePresence>
        </main>
      </div>
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
