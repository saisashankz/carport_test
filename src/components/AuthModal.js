// src/components/AuthModal.js - CarPore Themed
import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff, User, Mail, Lock, Phone, UserPlus } from 'lucide-react';
import { authService } from '../services/authService';

const AuthModal = ({ isOpen, onClose, onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: ''
  });

  // Reset modal to login state whenever it opens
  useEffect(() => {
    if (isOpen) {
      console.log('🔄 Auth modal opened - resetting to login state');
      setIsLogin(true);
      setShowPassword(false);
      setLoading(false);
      setError('');
      setFormData({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phone: ''
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const result = await authService.login(formData.email, formData.password);
        if (result.success) {
          console.log('✅ Login successful');
          onSuccess?.(result.user);
          onClose();
        } else {
          setError(result.error);
        }
      } else {
        const result = await authService.register(formData.email, formData.password, {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone
        });
        if (result.success) {
          console.log('✅ Registration successful');
          onSuccess?.(result.user);
          onClose();
        } else {
          setError(result.error);
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleToggleMode = () => {
    console.log(`🔄 Switching to ${isLogin ? 'registration' : 'login'} mode`);
    setIsLogin(!isLogin);
    setError('');
    setFormData({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phone: ''
    });
  };

  const modalStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '1rem',
    backdropFilter: 'blur(10px)'
  };

  const contentStyle = {
    background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95), rgba(26, 26, 26, 0.95))',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    border: '1px solid rgba(212, 175, 55, 0.3)',
    maxWidth: '450px',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
    color: '#ffffff',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
    position: 'relative',
    overflow: 'hidden'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '2rem 2rem 1rem',
    borderBottom: '1px solid rgba(212, 175, 55, 0.2)',
    position: 'relative'
  };

  const titleStyle = {
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  };

  const closeButtonStyle = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'rgba(255, 255, 255, 0.7)',
    padding: '0.5rem',
    borderRadius: '50%',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const errorStyle = {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    color: '#EF4444',
    padding: '1rem',
    borderRadius: '12px',
    marginBottom: '1.5rem',
    fontSize: '0.9rem',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  };

  const inputGroupStyle = {
    position: 'relative',
    marginBottom: '1.5rem'
  };

  const inputStyle = {
    width: '100%',
    padding: '1rem 1rem 1rem 3rem',
    border: '1px solid rgba(212, 175, 55, 0.3)',
    borderRadius: '12px',
    fontSize: '1rem',
    boxSizing: 'border-box',
    background: 'rgba(255, 255, 255, 0.05)',
    color: '#ffffff',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)'
  };

  const iconStyle = {
    position: 'absolute',
    left: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'rgba(212, 175, 55, 0.7)',
    zIndex: 1
  };

  const submitButtonStyle = {
    width: '100%',
    background: loading 
      ? 'rgba(212, 175, 55, 0.5)' 
      : 'linear-gradient(45deg, #D4AF37, #F4D03F)',
    color: loading ? 'rgba(255, 255, 255, 0.7)' : '#000000',
    padding: '1rem',
    borderRadius: '50px',
    border: 'none',
    fontSize: '1.1rem',
    fontWeight: '600',
    cursor: loading ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    marginBottom: '1.5rem',
    boxShadow: loading ? 'none' : '0 4px 15px rgba(212, 175, 55, 0.3)'
  };

  const toggleButtonStyle = {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(212, 175, 55, 0.3)',
    color: '#D4AF37',
    padding: '0.75rem 1.5rem',
    borderRadius: '50px',
    fontSize: '0.95rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    width: '100%',
    backdropFilter: 'blur(10px)'
  };

  const passwordToggleStyle = {
    position: 'absolute',
    right: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'rgba(212, 175, 55, 0.7)',
    padding: '0.25rem',
    borderRadius: '4px',
    transition: 'all 0.3s ease'
  };

  return (
    <div style={modalStyle} onClick={onClose}>
      <div style={contentStyle} onClick={(e) => e.stopPropagation()}>
        {/* Glow Effect */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 70%)',
          opacity: 0.5,
          pointerEvents: 'none'
        }}></div>

        <div style={headerStyle}>
          <h2 style={titleStyle}>
            {isLogin ? (
              <>
                <User size={24} color="#D4AF37" />
                Welcome Back
              </>
            ) : (
              <>
                <UserPlus size={24} color="#D4AF37" />
                Join CarPore
              </>
            )}
          </h2>
          <button 
            style={closeButtonStyle} 
            onClick={onClose}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = 'rgba(212, 175, 55, 0.1)';
              e.target.style.color = '#D4AF37';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = 'rgba(255, 255, 255, 0.7)';
            }}
          >
            <X size={24} />
          </button>
        </div>
        
        <div style={{ padding: '2rem' }}>
          <p style={{
            textAlign: 'center',
            color: 'rgba(255, 255, 255, 0.8)',
            marginBottom: '2rem',
            fontSize: '0.95rem'
          }}>
            {isLogin 
              ? 'Sign in to access your account and manage your orders'
              : 'Create your account and start your premium fragrance journey'
            }
          </p>

          {error && (
            <div style={errorStyle}>
              <div style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                backgroundColor: '#EF4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontSize: '0.7rem',
                fontWeight: 'bold'
              }}>
                !
              </div>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <div style={{
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  gap: '1rem', 
                  marginBottom: '1.5rem'
                }}>
                  <div style={inputGroupStyle}>
                    <User size={18} style={{...iconStyle, left: '0.75rem'}} />
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={handleChange}
                      required={!isLogin}
                      style={{...inputStyle, padding: '1rem 1rem 1rem 2.5rem'}}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'rgba(212, 175, 55, 0.6)';
                        e.target.style.boxShadow = '0 0 0 3px rgba(212, 175, 55, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(212, 175, 55, 0.3)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                  <div style={inputGroupStyle}>
                    <User size={18} style={{...iconStyle, left: '0.75rem'}} />
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleChange}
                      required={!isLogin}
                      style={{...inputStyle, padding: '1rem 1rem 1rem 2.5rem'}}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'rgba(212, 175, 55, 0.6)';
                        e.target.style.boxShadow = '0 0 0 3px rgba(212, 175, 55, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(212, 175, 55, 0.3)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                </div>
                
                <div style={inputGroupStyle}>
                  <Phone size={18} style={iconStyle} />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number (Optional)"
                    value={formData.phone}
                    onChange={handleChange}
                    style={inputStyle}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'rgba(212, 175, 55, 0.6)';
                      e.target.style.boxShadow = '0 0 0 3px rgba(212, 175, 55, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(212, 175, 55, 0.3)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </>
            )}
            
            <div style={inputGroupStyle}>
              <Mail size={18} style={iconStyle} />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(212, 175, 55, 0.6)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(212, 175, 55, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(212, 175, 55, 0.3)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
            
            <div style={inputGroupStyle}>
              <Lock size={18} style={iconStyle} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                style={{...inputStyle, paddingRight: '3rem'}}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(212, 175, 55, 0.6)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(212, 175, 55, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(212, 175, 55, 0.3)';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={passwordToggleStyle}
                onMouseOver={(e) => {
                  e.target.style.color = '#D4AF37';
                  e.target.style.backgroundColor = 'rgba(212, 175, 55, 0.1)';
                }}
                onMouseOut={(e) => {
                  e.target.style.color = 'rgba(212, 175, 55, 0.7)';
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              style={submitButtonStyle}
              onMouseOver={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(212, 175, 55, 0.4)';
                }
              }}
              onMouseOut={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(212, 175, 55, 0.3)';
                }
              }}
            >
              {loading ? (
                <>
                  <div style={{
                    width: '18px',
                    height: '18px',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderTop: '2px solid rgba(255, 255, 255, 0.8)',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  Please wait...
                </>
              ) : (
                <>
                  {isLogin ? <User size={18} /> : <UserPlus size={18} />}
                  {isLogin ? 'Sign In to CarPore' : 'Create Account'}
                </>
              )}
            </button>
          </form>
          
          <div style={{ textAlign: 'center' }}>
            <p style={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '0.9rem',
              marginBottom: '1rem'
            }}>
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </p>
            <button
              style={toggleButtonStyle}
              onClick={handleToggleMode}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = 'rgba(212, 175, 55, 0.1)';
                e.target.style.borderColor = 'rgba(212, 175, 55, 0.5)';
                e.target.style.color = '#F4D03F';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                e.target.style.borderColor = 'rgba(212, 175, 55, 0.3)';
                e.target.style.color = '#D4AF37';
              }}
            >
              {isLogin ? 'Create New Account' : 'Sign In Instead'}
            </button>
          </div>

          {/* Trust Indicators */}
          <div style={{
            marginTop: '2rem',
            padding: '1.5rem',
            backgroundColor: 'rgba(212, 175, 55, 0.05)',
            borderRadius: '12px',
            border: '1px solid rgba(212, 175, 55, 0.2)',
            textAlign: 'center'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              marginBottom: '0.5rem'
            }}>
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: '#10B981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontSize: '0.7rem',
                fontWeight: 'bold'
              }}>
                ✓
              </div>
              <span style={{
                color: '#10B981',
                fontSize: '0.85rem',
                fontWeight: '600'
              }}>
                Secure & Encrypted
              </span>
            </div>
            <p style={{
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '0.8rem',
              lineHeight: '1.4'
            }}>
              Your data is protected with industry-standard encryption
            </p>
          </div>
        </div>

        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default AuthModal;