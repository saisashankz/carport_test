// src/components/Header.js
import React, { useState } from 'react';
import { ShoppingCart, User, Menu, X } from 'lucide-react';

const Header = ({ onLoginClick, cartCount, onCartClick, user, userLoading, onNavigate }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const headerStyle = {
    position: 'fixed',
    top: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 1000,
    width: '90%',
    maxWidth: '1000px'
  };

  const navContainerStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    backdropFilter: 'blur(20px)',
    borderRadius: '60px',
    padding: '12px 24px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
  };

  const flexStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '2rem'
  };

  const logoStyle = {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#D4AF37',
    letterSpacing: '0.1em',
    textDecoration: 'none'
  };

  const navLinksStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem',
    listStyle: 'none',
    margin: 0,
    padding: 0
  };

  const navLinkStyle = {
    color: 'rgba(255, 255, 255, 0.9)',
    textDecoration: 'none',
    fontSize: '0.95rem',
    fontWeight: '500',
    transition: 'color 0.3s ease',
    cursor: 'pointer'
  };

  const actionsStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  };

  const iconButtonStyle = {
    background: 'none',
    border: 'none',
    color: 'rgba(255, 255, 255, 0.9)',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '50%',
    transition: 'all 0.3s ease',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const cartButtonStyle = {
    ...iconButtonStyle,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    border: '1px solid rgba(212, 175, 55, 0.3)'
  };

  const badgeStyle = {
    position: 'absolute',
    top: '-4px',
    right: '-4px',
    backgroundColor: '#D4AF37',
    color: '#000000',
    fontSize: '0.7rem',
    borderRadius: '50%',
    width: '18px',
    height: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
    border: '2px solid rgba(0, 0, 0, 0.8)'
  };

  const mobileMenuStyle = {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    marginTop: '10px',
    padding: '1.5rem',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
  };

  const mobileNavStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    alignItems: 'center'
  };

  const getUserDisplayText = () => {
    if (userLoading) return '...';
    if (user) {
      const name = user.displayName || user.email.split('@')[0];
      return name.length > 10 ? name.substring(0, 10) + '...' : name;
    }
    return null; // Don't show text, just icon
  };

  return (
    <header style={headerStyle}>
      <div style={navContainerStyle}>
        <div style={flexStyle}>
          {/* Logo */}
          <div style={logoStyle}>
            CARPORE
          </div>

          {/* Desktop Navigation */}
          <nav style={{ display: window.innerWidth > 768 ? 'block' : 'none' }}>
            <ul style={navLinksStyle}>
              <li>
                <a 
                  href="#home" 
                  style={navLinkStyle}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate?.('home');
                  }}
                  onMouseOver={(e) => e.target.style.color = '#D4AF37'}
                  onMouseOut={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.9)'}
                >
                  Home
                </a>
              </li>
              <li>
                <a 
                  href="#products" 
                  style={navLinkStyle}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate?.('products');
                  }}
                  onMouseOver={(e) => e.target.style.color = '#D4AF37'}
                  onMouseOut={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.9)'}
                >
                  Products
                </a>
              </li>
              <li>
                <a 
                  href="#about" 
                  style={navLinkStyle}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate?.('about');
                  }}
                  onMouseOver={(e) => e.target.style.color = '#D4AF37'}
                  onMouseOut={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.9)'}
                >
                  About
                </a>
              </li>
              <li>
                <a 
                  href="#contact" 
                  style={navLinkStyle}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate?.('contact');
                  }}
                  onMouseOver={(e) => e.target.style.color = '#D4AF37'}
                  onMouseOut={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.9)'}
                >
                  Contact
                </a>
              </li>
            </ul>
          </nav>

          {/* Actions */}
          <div style={actionsStyle}>
            {/* User Button */}
            <button 
              style={iconButtonStyle} 
              onClick={onLoginClick}
              title={user ? `Logged in as ${user.email}` : 'Click to login'}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = 'rgba(212, 175, 55, 0.1)';
                e.target.style.color = '#D4AF37';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = 'rgba(255, 255, 255, 0.9)';
              }}
            >
              <User size={20} />
            </button>

            {/* Cart Button */}
            <button 
              style={cartButtonStyle} 
              onClick={onCartClick}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = 'rgba(212, 175, 55, 0.2)';
                e.target.style.borderColor = 'rgba(212, 175, 55, 0.5)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'rgba(212, 175, 55, 0.1)';
                e.target.style.borderColor = 'rgba(212, 175, 55, 0.3)';
              }}
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span style={badgeStyle}>
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button 
              style={{
                ...iconButtonStyle, 
                display: window.innerWidth <= 768 ? 'flex' : 'none'
              }}
              onClick={() => setMenuOpen(!menuOpen)}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = 'rgba(212, 175, 55, 0.1)';
                e.target.style.color = '#D4AF37';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = 'rgba(255, 255, 255, 0.9)';
              }}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div style={mobileMenuStyle}>
            <nav style={mobileNavStyle}>
              <a 
                href="#home" 
                style={navLinkStyle} 
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate?.('home');
                  setMenuOpen(false);
                }}
                onMouseOver={(e) => e.target.style.color = '#D4AF37'}
                onMouseOut={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.9)'}
              >
                Home
              </a>
              <a 
                href="#products" 
                style={navLinkStyle} 
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate?.('products');
                  setMenuOpen(false);
                }}
                onMouseOver={(e) => e.target.style.color = '#D4AF37'}
                onMouseOut={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.9)'}
              >
                Products
              </a>
              <a 
                href="#about" 
                style={navLinkStyle} 
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate?.('about');
                  setMenuOpen(false);
                }}
                onMouseOver={(e) => e.target.style.color = '#D4AF37'}
                onMouseOut={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.9)'}
              >
                About
              </a>
              <a 
                href="#contact" 
                style={navLinkStyle} 
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate?.('contact');
                  setMenuOpen(false);
                }}
                onMouseOver={(e) => e.target.style.color = '#D4AF37'}
                onMouseOut={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.9)'}
              >
                Contact
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;