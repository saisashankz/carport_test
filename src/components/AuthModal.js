// src/components/AuthModal.js
import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
    padding: '1rem'
  };

  const contentStyle = {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    maxWidth: '28rem',
    width: '100%',
    padding: '1.5rem',
    maxHeight: '90vh',
    overflowY: 'auto'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem'
  };

  const titleStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#111827'
  };

  const buttonStyle = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#6B7280'
  };

  const errorStyle = {
    backgroundColor: '#FEE2E2',
    border: '1px solid #FECACA',
    color: '#991B1B',
    padding: '0.75rem',
    borderRadius: '0.375rem',
    marginBottom: '1rem',
    fontSize: '0.875rem'
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #D1D5DB',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    marginBottom: '1rem',
    boxSizing: 'border-box'
  };

  const submitButtonStyle = {
    width: '100%',
    backgroundColor: loading ? '#9CA3AF' : '#FBBF24',
    color: '#111827',
    padding: '0.75rem',
    borderRadius: '0.5rem',
    border: 'none',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: loading ? 'not-allowed' : 'pointer',
    marginTop: '0.5rem'
  };

  const linkStyle = {
    textAlign: 'center',
    marginTop: '1rem',
    fontSize: '0.875rem',
    color: '#6B7280'
  };

  const linkButtonStyle = {
    color: '#FBBF24',
    fontWeight: '600',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'underline'
  };

  return (
    <div style={modalStyle} onClick={onClose}>
      <div style={contentStyle} onClick={(e) => e.stopPropagation()}>
        <div style={headerStyle}>
          <h2 style={titleStyle}>
            {isLogin ? 'Welcome Back!' : 'Join CarPore'}
          </h2>
          <button style={buttonStyle} onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        
        {error && (
          <div style={errorStyle}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem'}}>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required={!isLogin}
                  style={{...inputStyle, marginBottom: 0}}
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required={!isLogin}
                  style={{...inputStyle, marginBottom: 0}}
                />
              </div>
              
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number (Optional)"
                value={formData.phone}
                onChange={handleChange}
                style={inputStyle}
              />
            </>
          )}
          
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          
          <div style={{position: 'relative'}}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{...inputStyle, paddingRight: '2.5rem'}}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '0.75rem',
                top: '0.75rem',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#6B7280'
              }}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            style={submitButtonStyle}
          >
            {loading ? 'Please wait...' : (isLogin ? 'Login to CarPore' : 'Create Account')}
          </button>
        </form>
        
        <div style={linkStyle}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            style={linkButtonStyle}
            onClick={handleToggleMode}
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;