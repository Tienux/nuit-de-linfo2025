import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/', label: '🏠 Accueil', icon: '🏠' },
    { path: '/nuit-qcm', label: '📝 Quiz NIRD', icon: '📝' },
    { path: '/decathlon', label: '🏃 Décathlon', icon: '🏃' },
    { path: '/presentation', label: '📊 Projet', icon: '📊' },
    { path: '/a-propos', label: 'ℹ️ À propos', icon: 'ℹ️' },
  ];

  const isCurrentPath = (path) => {
    return location.pathname === path;
  };

  return (
    <nav style={{
      position: 'fixed',
      top: '20px',
      left: '20px',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    }}>
      <div 
        className="nes-container is-dark" 
        style={{
          padding: '12px',
          background: '#212529',
          border: '4px solid #495057',
          minWidth: '200px'
        }}
      >
        <h3 style={{
          margin: '0 0 10px 0',
          fontSize: '14px',
          color: '#92cc41',
          textAlign: 'center'
        }}>
           NAVIGATION
        </h3>
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}>
          {menuItems.map((item) => (
            <button
              key={item.path}
              className={`nes-btn ${isCurrentPath(item.path) ? 'is-success' : 'is-primary'}`}
              onClick={() => navigate(item.path)}
              style={{
                fontSize: '12px',
                padding: '6px 10px',
                minHeight: 'auto',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                opacity: isCurrentPath(item.path) ? 1 : 0.9,
                transform: isCurrentPath(item.path) ? 'scale(1.02)' : 'scale(1)',
                transition: 'all 0.2s ease'
              }}
            >
              <span style={{ fontSize: '14px' }}>{item.icon}</span>
              <span>{item.label.split(' ').slice(1).join(' ')}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Bouton pour replier/déplier la navbar */}
      <button
        className="nes-btn is-warning"
        onClick={() => {
          const navbar = document.querySelector('nav > div');
          if (navbar.style.display === 'none') {
            navbar.style.display = 'block';
          } else {
            navbar.style.display = 'none';
          }
        }}
        style={{
          fontSize: '12px',
          padding: '4px 8px',
          minHeight: 'auto',
          alignSelf: 'flex-start'
        }}
      >
        📋
      </button>
    </nav>
  );
};

export default Navbar;