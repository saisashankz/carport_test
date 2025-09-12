// src/components/AddressModal.js
import React, { useState, useEffect } from 'react';
import { X, MapPin, Save } from 'lucide-react';
import { userService } from '../services/userService';

const AddressModal = ({ isOpen, onClose, userId, addressData = null, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    label: '',
    firstName: '',
    lastName: '',
    phone: '',
    street: '',
    apartment: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    isDefault: false
  });
  const [errors, setErrors] = useState({});

  // Initialize form data when modal opens or addressData changes
  useEffect(() => {
    if (isOpen) {
      if (addressData) {
        // Editing existing address
        setFormData({
          label: addressData.label || '',
          firstName: addressData.firstName || '',
          lastName: addressData.lastName || '',
          phone: addressData.phone || '',
          street: addressData.street || '',
          apartment: addressData.apartment || '',
          city: addressData.city || '',
          state: addressData.state || '',
          pincode: addressData.pincode || '',
          country: addressData.country || 'India',
          isDefault: addressData.isDefault || false
        });
      } else {
        // Adding new address - reset form
        setFormData({
          label: '',
          firstName: '',
          lastName: '',
          phone: '',
          street: '',
          apartment: '',
          city: '',
          state: '',
          pincode: '',
          country: 'India',
          isDefault: false
        });
      }
      setErrors({});
    }
  }, [isOpen, addressData]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.label.trim()) newErrors.label = 'Address label is required';
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.street.trim()) newErrors.street = 'Street address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.pincode.trim()) newErrors.pincode = 'PIN code is required';
    else if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = 'PIN code must be 6 digits';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      let result;
      
      if (addressData) {
        // Update existing address
        result = await userService.updateUserAddress(addressData.id, formData);
      } else {
        // Add new address
        result = await userService.addUserAddress(userId, formData);
      }

      if (result && (result === true || result.success)) {
        onSuccess?.();
        onClose();
        showNotification(
          addressData ? 'Address updated successfully!' : 'Address added successfully!',
          'success'
        );
      } else {
        showNotification('Failed to save address. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Address save error:', error);
      showNotification('An error occurred. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type) => {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed; top: 100px; right: 20px; z-index: 1001;
      background: ${type === 'success' ? '#10B981' : '#EF4444'}; 
      color: white; padding: 1rem 1.5rem;
      border-radius: 0.5rem; box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      font-weight: 600; animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
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
    padding: '1rem'
  };

  const contentStyle = {
    background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95), rgba(26, 26, 26, 0.95))',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    border: '1px solid rgba(212, 175, 55, 0.3)',
    maxWidth: '600px',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
    color: '#ffffff'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '2rem 2rem 1rem',
    borderBottom: '1px solid rgba(212, 175, 55, 0.2)'
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    border: '1px solid rgba(212, 175, 55, 0.3)',
    borderRadius: '12px',
    background: 'rgba(255, 255, 255, 0.05)',
    color: '#ffffff',
    marginBottom: '0.5rem',
    fontSize: '0.95rem',
    boxSizing: 'border-box'
  };

  const errorStyle = {
    color: '#EF4444',
    fontSize: '0.8rem',
    marginBottom: '1rem'
  };

  const labelStyle = {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: '0.9rem',
    marginBottom: '0.5rem',
    display: 'block',
    fontWeight: '500'
  };

  const buttonStyle = {
    background: 'linear-gradient(45deg, #D4AF37, #F4D03F)',
    color: '#000000',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '50px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '1rem'
  };

  const closeButtonStyle = {
    background: 'none',
    border: 'none',
    color: 'rgba(255, 255, 255, 0.7)',
    cursor: 'pointer',
    padding: '0.5rem',
    borderRadius: '50%',
    transition: 'all 0.3s ease'
  };

  return (
    <div style={modalStyle} onClick={onClose}>
      <div style={contentStyle} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={headerStyle}>
          <h2 style={{
            fontSize: '1.8rem',
            fontWeight: '600',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <MapPin size={24} color="#D4AF37" />
            {addressData ? 'Edit Address' : 'Add New Address'}
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

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '2rem' }}>
          {/* Address Label */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Address Label *</label>
            <input
              type="text"
              name="label"
              placeholder="e.g., Home, Office, etc."
              value={formData.label}
              onChange={handleInputChange}
              style={{
                ...inputStyle,
                borderColor: errors.label ? '#EF4444' : 'rgba(212, 175, 55, 0.3)'
              }}
            />
            {errors.label && <div style={errorStyle}>{errors.label}</div>}
          </div>

          {/* Contact Information */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            marginBottom: '1rem'
          }}>
            <div>
              <label style={labelStyle}>First Name *</label>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleInputChange}
                style={{
                  ...inputStyle,
                  borderColor: errors.firstName ? '#EF4444' : 'rgba(212, 175, 55, 0.3)'
                }}
              />
              {errors.firstName && <div style={errorStyle}>{errors.firstName}</div>}
            </div>
            <div>
              <label style={labelStyle}>Last Name *</label>
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleInputChange}
                style={{
                  ...inputStyle,
                  borderColor: errors.lastName ? '#EF4444' : 'rgba(212, 175, 55, 0.3)'
                }}
              />
              {errors.lastName && <div style={errorStyle}>{errors.lastName}</div>}
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Phone Number *</label>
            <input
              type="tel"
              name="phone"
              placeholder="+91 98765 43210"
              value={formData.phone}
              onChange={handleInputChange}
              style={{
                ...inputStyle,
                borderColor: errors.phone ? '#EF4444' : 'rgba(212, 175, 55, 0.3)'
              }}
            />
            {errors.phone && <div style={errorStyle}>{errors.phone}</div>}
          </div>

          {/* Address Information */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Street Address *</label>
            <input
              type="text"
              name="street"
              placeholder="House/Building number, Street name"
              value={formData.street}
              onChange={handleInputChange}
              style={{
                ...inputStyle,
                borderColor: errors.street ? '#EF4444' : 'rgba(212, 175, 55, 0.3)'
              }}
            />
            {errors.street && <div style={errorStyle}>{errors.street}</div>}
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Apartment/Suite (Optional)</label>
            <input
              type="text"
              name="apartment"
              placeholder="Apartment, suite, unit, building, floor, etc."
              value={formData.apartment}
              onChange={handleInputChange}
              style={inputStyle}
            />
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '1rem',
            marginBottom: '1rem'
          }}>
            <div>
              <label style={labelStyle}>City *</label>
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleInputChange}
                style={{
                  ...inputStyle,
                  borderColor: errors.city ? '#EF4444' : 'rgba(212, 175, 55, 0.3)'
                }}
              />
              {errors.city && <div style={errorStyle}>{errors.city}</div>}
            </div>
            <div>
              <label style={labelStyle}>State *</label>
              <input
                type="text"
                name="state"
                placeholder="State"
                value={formData.state}
                onChange={handleInputChange}
                style={{
                  ...inputStyle,
                  borderColor: errors.state ? '#EF4444' : 'rgba(212, 175, 55, 0.3)'
                }}
              />
              {errors.state && <div style={errorStyle}>{errors.state}</div>}
            </div>
            <div>
              <label style={labelStyle}>PIN Code *</label>
              <input
                type="text"
                name="pincode"
                placeholder="123456"
                value={formData.pincode}
                onChange={handleInputChange}
                maxLength={6}
                style={{
                  ...inputStyle,
                  borderColor: errors.pincode ? '#EF4444' : 'rgba(212, 175, 55, 0.3)'
                }}
              />
              {errors.pincode && <div style={errorStyle}>{errors.pincode}</div>}
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={labelStyle}>Country</label>
            <select
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              style={{
                ...inputStyle,
                cursor: 'pointer'
              }}
            >
              <option value="India">India</option>
              <option value="USA">United States</option>
              <option value="UK">United Kingdom</option>
              <option value="Canada">Canada</option>
              <option value="Australia">Australia</option>
            </select>
          </div>

          {/* Default Address Checkbox */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '2rem'
          }}>
            <input
              type="checkbox"
              name="isDefault"
              id="isDefault"
              checked={formData.isDefault}
              onChange={handleInputChange}
              style={{
                width: '18px',
                height: '18px',
                accentColor: '#D4AF37'
              }}
            />
            <label htmlFor="isDefault" style={{
              ...labelStyle,
              marginBottom: 0,
              cursor: 'pointer'
            }}>
              Make this my default address
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              ...buttonStyle,
              width: '100%',
              justifyContent: 'center',
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
            onMouseOver={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(212, 175, 55, 0.4)';
              }
            }}
            onMouseOut={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }
            }}
          >
            <Save size={16} />
            {loading ? 'Saving...' : (addressData ? 'Update Address' : 'Save Address')}
          </button>
        </form>
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default AddressModal;