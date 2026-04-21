import React, { useState, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info as InfoIcon, X } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

const Toast = ({ message, type, onClose }) => {
  const icons = {
    success: <CheckCircle size={20} color="var(--success)" />,
    error: <AlertCircle size={20} color="#f87171" />,
    info: <InfoIcon size={20} color="var(--primary)" />
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      style={{
        position: 'fixed', bottom: '30px', right: '30px', zIndex: 9999,
        background: 'rgba(15, 15, 20, 0.9)', backdropFilter: 'blur(15px)',
        border: '1px solid rgba(255, 255, 255, 0.1)', padding: '1.2rem 1.8rem',
        borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '15px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)', minWidth: '320px'
      }}
    >
      <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '12px' }}>
        {icons[type] || icons.info}
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>{message}</p>
      </div>
      <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer' }}>
        <X size={18} />
      </button>
      <motion.div 
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: 4, ease: 'linear' }}
        style={{ position: 'absolute', bottom: 0, left: 0, height: '3px', background: 'var(--primary)', borderBottomLeftRadius: '20px' }}
      />
    </motion.div>
  );
};

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <AnimatePresence>
        {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </ToastContext.Provider>
  );
};
