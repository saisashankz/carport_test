// src/components/Header.js
import React, { useState } from 'react';
import { ShoppingCart, User, Menu, X } from 'lucide-react';

const Header = ({ onLoginClick, cartCount, onCartClick, user, userLoading }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const headerStyle = {
    backgroundColor: 'rgba(15, 20, 25, 0.95)',
    backdropFilter: 'blur(10px)',
    color: 'white',
    position: 'sticky',
    top: 0,
    zIndex: 50,
    borderBottom: '1px solid rgba(245, 158, 11, 0.1)'
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 2rem'
  };

  const flexStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '5rem'
  };

  const logoStyle = {
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#F59E0B',
    letterSpacing: '0.05em',
    textDecoration: 'none'
  };

  const navStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem',
    '@media (max-width: 768px)': {
      display: 'none'
    }
  };

  const navLinkStyle = {
    color: '#ffffff',
    textDecoration: 'none',
    fontWeight: '500',
    transition: 'color 0.3s ease',
    cursor: 'pointer'
  };

  const actionsStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  };

  const buttonStyle = {
    background: 'none',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    padding: '0.75rem',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    borderRadius: '0.5rem',
    transition: 'all 0.3s ease'
  };

  const cartButtonStyle = {
    ...buttonStyle,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    border: '1px solid rgba(245, 158, 11, 0.3)'
  };

  const badgeStyle = {
    position: 'absolute',
    top: '-8px',
    right: '-8px',
    backgroundColor: '#FBBF24',
    color: '#111827',
    fontSize: '0.75rem',
    borderRadius: '50%',
    width: '1.25rem',
    height: '1.25rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600'
  };

  const getUserDisplayText = () => {
    if (userLoading) return '...';
    if (user) {
      const name = user.displayName || user.email.split('@')[0];
      return name.length > 10 ? name.substring(0, 10) + '...' : name;
    }
    return 'Login';
  };

  return (
    <header style={headerStyle}>
      <div style={containerStyle}>
        <div style={flexStyle}>
          {/* Logo */}
          <div style={logoStyle}>
            CARPORE
          </div>

          {/* Navigation */}
          <nav style={navStyle}>
            <a href="#home" style={navLinkStyle} onMouseOver={(e) => e.target.style.color = '#F59E0B'} onMouseOut={(e) => e.target.style.color = '#ffffff'}>
              Home
            </a>
            <a href="#products" style={navLinkStyle} onMouseOver={(e) => e.target.style.color = '#F59E0B'} onMouseOut={(e) => e.target.style.color = '#ffffff'}>
              Products
            </a>
            <a href="#about" style={navLinkStyle} onMouseOver={(e) => e.target.style.color = '#F59E0B'} onMouseOut={(e) => e.target.style.color = '#ffffff'}>
              About
            </a>
            <a href="#contact" style={navLinkStyle} onMouseOver={(e) => e.target.style.color = '#F59E0B'} onMouseOut={(e) => e.target.style.color = '#ffffff'}>
              Contact
            </a>
          </nav>

          {/* Actions */}
          <div style={actionsStyle}>
            {/* User Button */}
            <button 
              style={buttonStyle} 
              onClick={onLoginClick}
              title={user ? `Logged in as ${user.email}` : 'Click to login'}
              onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(245, 158, 11, 0.1)'}
              onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              <User size={20} />
              <span style={{fontSize: '0.875rem', display: window.innerWidth > 640 ? 'block' : 'none'}}>
                {getUserDisplayText()}
              </span>
            </button>

            {/* Cart Button */}
            <button style={cartButtonStyle} onClick={onCartClick}>
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span style={badgeStyle}>
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button 
              style={{...buttonStyle, display: window.innerWidth <= 768 ? 'flex' : 'none'}}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: 'rgba(15, 20, 25, 0.98)',
            backdropFilter: 'blur(10px)',
            padding: '2rem',
            borderTop: '1px solid rgba(245, 158, 11, 0.1)'
          }}>
            <nav style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              alignItems: 'center'
            }}>
              <a href="#home" style={navLinkStyle} onClick={() => setMenuOpen(false)}>Home</a>
              <a href="#products" style={navLinkStyle} onClick={() => setMenuOpen(false)}>Products</a>
              <a href="#about" style={navLinkStyle} onClick={() => setMenuOpen(false)}>About</a>
              <a href="#contact" style={navLinkStyle} onClick={() => setMenuOpen(false)}>Contact</a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;