import React, { useState } from 'react';
import { ShoppingCart, User, Menu, X, ChevronDown } from 'lucide-react';

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
    textDecoration: 'none',
    cursor: 'pointer', // Add cursor pointer
    transition: 'all 0.3s ease' // Add transition
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

  const userButtonStyle = {
    background: user ? 'rgba(212, 175, 55, 0.1)' : 'none',
    border: user ? '1px solid rgba(212, 175, 55, 0.3)' : 'none',
    color: user ? '#D4AF37' : 'rgba(255, 255, 255, 0.9)',
    cursor: 'pointer',
    padding: user ? '6px 12px' : '8px',
    borderRadius: user ? '25px' : '50%',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.9rem',
    fontWeight: '500',
    minHeight: '40px'
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

  const getUserDisplayInfo = () => {
    if (userLoading) return { name: '...', avatar: '...' };
    if (user) {
      const name = user.displayName || user.email.split('@')[0];
      const firstName = name.split(' ')[0];
      const displayName = firstName.length > 8 ? firstName.substring(0, 8) + '...' : firstName;
      const avatar = user.displayName ? user.displayName.split(' ').map(n => n[0]).join('') : user.email[0].toUpperCase();
      return { name: displayName, avatar };
    }
    return null;
  };

  // Navigation handler function
  const handleNavigation = (sectionId, closeMenu = false) => {
    if (closeMenu) {
      setMenuOpen(false);
    }
    onNavigate?.(sectionId);
  };

  const userInfo = getUserDisplayInfo();

  return (
    <header style={headerStyle}>
      <div style={navContainerStyle}>
        <div style={flexStyle}>
          {/* Logo - Now clickable and navigates to home */}
          <div 
            style={logoStyle}
            onClick={() => handleNavigation('home')}
            onMouseOver={(e) => {
              e.target.style.color = '#F4D03F';
              e.target.style.transform = 'scale(1.05)';
            }}
            onMouseOut={(e) => {
              e.target.style.color = '#D4AF37';
              e.target.style.transform = 'scale(1)';
            }}
          >
            CARPORE
          </div>

          {/* Desktop Navigation */}
          <nav style={{ display: window.innerWidth > 768 ? 'block' : 'none' }}>
            <ul style={navLinksStyle}>
              <li>
                <span 
                  style={navLinkStyle}
                  onClick={() => handleNavigation('home')}
                  onMouseOver={(e) => e.target.style.color = '#D4AF37'}
                  onMouseOut={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.9)'}
                >
                  Home
                </span>
              </li>
              <li>
                <span 
                  style={navLinkStyle}
                  onClick={() => handleNavigation('products')}
                  onMouseOver={(e) => e.target.style.color = '#D4AF37'}
                  onMouseOut={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.9)'}
                >
                  Products
                </span>
              </li>
              <li>
                <span 
                  style={navLinkStyle}
                  onClick={() => handleNavigation('about')}
                  onMouseOver={(e) => e.target.style.color = '#D4AF37'}
                  onMouseOut={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.9)'}
                >
                  About
                </span>
              </li>
              <li>
                <span 
                  style={navLinkStyle}
                  onClick={() => handleNavigation('contact')}
                  onMouseOver={(e) => e.target.style.color = '#D4AF37'}
                  onMouseOut={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.9)'}
                >
                  Contact
                </span>
              </li>
            </ul>
          </nav>

          {/* Actions */}
          <div style={actionsStyle}>
            {/* User Button - Enhanced */}
            <button 
              style={userButtonStyle} 
              onClick={onLoginClick}
              title={user ? `View Dashboard - ${user.email}` : 'Click to login'}
              onMouseOver={(e) => {
                if (!user) {
                  e.target.style.backgroundColor = 'rgba(212, 175, 55, 0.1)';
                  e.target.style.color = '#D4AF37';
                } else {
                  e.target.style.backgroundColor = 'rgba(212, 175, 55, 0.2)';
                  e.target.style.borderColor = 'rgba(212, 175, 55, 0.5)';
                }
              }}
              onMouseOut={(e) => {
                if (!user) {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = 'rgba(255, 255, 255, 0.9)';
                } else {
                  e.target.style.backgroundColor = 'rgba(212, 175, 55, 0.1)';
                  e.target.style.borderColor = 'rgba(212, 175, 55, 0.3)';
                }
              }}
            >
              {user && userInfo ? (
                <>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'linear-gradient(45deg, #D4AF37, #F4D03F)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#000000',
                    fontSize: '0.75rem',
                    fontWeight: '600'
                  }}>
                    {userInfo.avatar}
                  </div>
                  <span style={{ 
                    display: window.innerWidth > 768 ? 'block' : 'none',
                    maxWidth: '80px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {userInfo.name}
                  </span>
                  <ChevronDown size={14} style={{ opacity: 0.7 }} />
                </>
              ) : (
                <>
                  <User size={20} />
                  <span style={{ 
                    display: window.innerWidth > 768 ? 'block' : 'none' 
                  }}>
                    Login
                  </span>
                </>
              )}
            </button>

            {/* Cart Button */}
            <button 
              style={{
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
                justifyContent: 'center',
                minWidth: '44px',
                minHeight: '44px'
              }}
              onClick={onCartClick}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = 'rgba(212, 175, 55, 0.1)';
                e.target.style.color = '#D4AF37';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = 'rgba(255, 255, 255, 0.9)';
              }}
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-6px',
                  backgroundColor: '#D4AF37',
                  color: '#000000',
                  fontSize: '0.75rem',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '600',
                  border: '2px solid rgba(0, 0, 0, 0.8)',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                }}>
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
              <span 
                style={navLinkStyle} 
                onClick={() => handleNavigation('home', true)}
                onMouseOver={(e) => e.target.style.color = '#D4AF37'}
                onMouseOut={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.9)'}
              >
                Home
              </span>
              <span 
                style={navLinkStyle} 
                onClick={() => handleNavigation('products', true)}
                onMouseOver={(e) => e.target.style.color = '#D4AF37'}
                onMouseOut={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.9)'}
              >
                Products
              </span>
              <span 
                style={navLinkStyle} 
                onClick={() => handleNavigation('about', true)}
                onMouseOver={(e) => e.target.style.color = '#D4AF37'}
                onMouseOut={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.9)'}
              >
                About
              </span>
              <span 
                style={navLinkStyle} 
                onClick={() => handleNavigation('contact', true)}
                onMouseOver={(e) => e.target.style.color = '#D4AF37'}
                onMouseOut={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.9)'}
              >
                Contact
              </span>
            </nav>

            {/* User info in mobile menu */}
            {user && (
              <div style={{
                marginTop: '1rem',
                padding: '1rem',
                backgroundColor: 'rgba(212, 175, 55, 0.1)',
                borderRadius: '12px',
                border: '1px solid rgba(212, 175, 55, 0.2)',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'linear-gradient(45deg, #D4AF37, #F4D03F)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#000000',
                  fontSize: '1rem',
                  fontWeight: '600',
                  margin: '0 auto 0.5rem'
                }}>
                  {userInfo?.avatar}
                </div>
                <p style={{
                  color: '#ffffff',
                  fontWeight: '500',
                  marginBottom: '0.25rem'
                }}>
                  {user.displayName || 'User'}
                </p>
                <p style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '0.85rem'
                }}>
                  {user.email}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;