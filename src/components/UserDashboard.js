// src/components/UserDashboard.js
import React, { useState, useEffect } from 'react';
import { 
  X, User, Package, Heart, Settings, LogOut, 
  MapPin, Phone, Mail, Calendar, Star, 
  CreditCard, Shield, Bell, Edit2, Save,
  Trash2, Eye, Download, Repeat
} from 'lucide-react';
import { authService } from '../services/authService';
import { orderService } from '../services/orderService';
import { userService } from '../services/userService';

const UserDashboard = ({ isOpen, onClose, user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (isOpen && user) {
      loadUserData();
    }
  }, [isOpen, user]);

  const loadUserData = async () => {
    setLoading(true);
    try {
      // Load user profile
      const profileData = await authService.getCurrentUserData();
      setUserProfile(profileData);
      setEditForm(profileData || {});

      // Load user orders
      const userOrders = await orderService.getUserOrders(user.uid);
      setOrders(userOrders);

      // Load other user data
      await Promise.all([
        loadWishlist(),
        loadAddresses(),
        loadNotifications()
      ]);
    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadWishlist = async () => {
    try {
      const wishlistData = await userService.getUserWishlist(user.uid);
      setWishlist(wishlistData);
    } catch (error) {
      console.error('Failed to load wishlist:', error);
    }
  };

  const loadAddresses = async () => {
    try {
      const addressData = await userService.getUserAddresses(user.uid);
      setAddresses(addressData);
    } catch (error) {
      console.error('Failed to load addresses:', error);
    }
  };

  const loadNotifications = async () => {
    try {
      const notificationData = await userService.getUserNotifications(user.uid);
      setNotifications(notificationData);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  };

  const handleProfileUpdate = async () => {
    setLoading(true);
    try {
      const success = await userService.updateUserProfile(user.uid, editForm);
      if (success) {
        setUserProfile(editForm);
        setEditingProfile(false);
        showNotification('Profile updated successfully!', 'success');
      } else {
        showNotification('Failed to update profile', 'error');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      showNotification('Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      await authService.logout();
      onLogout();
      onClose();
    }
  };

  const showNotification = (message, type) => {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed; top: 100px; right: 20px; z-index: 1000;
      background: ${type === 'success' ? '#10B981' : '#EF4444'}; 
      color: white; padding: 1rem 1.5rem;
      border-radius: 0.5rem; box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      font-weight: 600; animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  };

  if (!isOpen) return null;

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
    maxWidth: '1000px',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
    color: '#ffffff',
    display: 'flex'
  };

  const sidebarStyle = {
    width: '280px',
    padding: '2rem 1.5rem',
    borderRight: '1px solid rgba(212, 175, 55, 0.2)',
    backgroundColor: 'rgba(212, 175, 55, 0.05)'
  };

  const mainContentStyle = {
    flex: 1,
    padding: '2rem'
  };

  const tabButtonStyle = (active) => ({
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem',
    marginBottom: '0.5rem',
    border: 'none',
    borderRadius: '12px',
    background: active ? 'rgba(212, 175, 55, 0.2)' : 'transparent',
    color: active ? '#D4AF37' : 'rgba(255, 255, 255, 0.8)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textAlign: 'left',
    fontSize: '0.95rem',
    fontWeight: active ? '600' : '400'
  });

  const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    border: '1px solid rgba(212, 175, 55, 0.3)',
    borderRadius: '12px',
    background: 'rgba(255, 255, 255, 0.05)',
    color: '#ffffff',
    marginBottom: '1rem',
    fontSize: '0.95rem'
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
    gap: '0.5rem'
  };

  const renderProfileTab = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: '600', color: '#ffffff' }}>Profile Settings</h2>
        <button
          onClick={() => setEditingProfile(!editingProfile)}
          style={{
            ...buttonStyle,
            background: editingProfile ? 'rgba(255, 255, 255, 0.1)' : 'linear-gradient(45deg, #D4AF37, #F4D03F)'
          }}
        >
          {editingProfile ? <X size={16} /> : <Edit2 size={16} />}
          {editingProfile ? 'Cancel' : 'Edit'}
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        gap: '2rem',
        alignItems: 'start'
      }}>
        {/* Profile Picture */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'linear-gradient(45deg, #D4AF37, #F4D03F)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.5rem',
            fontWeight: '600',
            color: '#000000',
            marginBottom: '1rem'
          }}>
            {userProfile?.firstName?.[0] || user?.email?.[0] || 'U'}
          </div>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem' }}>
            Member since {userProfile?.createdAt ? new Date(userProfile.createdAt.toDate()).toLocaleDateString() : 'N/A'}
          </p>
        </div>

        {/* Profile Form */}
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'block' }}>
                First Name
              </label>
              <input
                type="text"
                value={editingProfile ? editForm.firstName || '' : userProfile?.firstName || ''}
                onChange={(e) => editingProfile && setEditForm({...editForm, firstName: e.target.value})}
                readOnly={!editingProfile}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'block' }}>
                Last Name
              </label>
              <input
                type="text"
                value={editingProfile ? editForm.lastName || '' : userProfile?.lastName || ''}
                onChange={(e) => editingProfile && setEditForm({...editForm, lastName: e.target.value})}
                readOnly={!editingProfile}
                style={inputStyle}
              />
            </div>
          </div>

          <div>
            <label style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'block' }}>
              Email Address
            </label>
            <input
              type="email"
              value={user?.email || ''}
              readOnly
              style={{...inputStyle, opacity: 0.7}}
            />
            <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.8rem', marginTop: '-0.5rem', marginBottom: '1rem' }}>
              Email cannot be changed
            </p>
          </div>

          <div>
            <label style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'block' }}>
              Phone Number
            </label>
            <input
              type="tel"
              value={editingProfile ? editForm.phone || '' : userProfile?.phone || ''}
              onChange={(e) => editingProfile && setEditForm({...editForm, phone: e.target.value})}
              readOnly={!editingProfile}
              style={inputStyle}
            />
          </div>

          {editingProfile && (
            <button
              onClick={handleProfileUpdate}
              disabled={loading}
              style={{...buttonStyle, marginTop: '1rem'}}
            >
              <Save size={16} />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const renderOrdersTab = () => (
    <div>
      <h2 style={{ fontSize: '1.8rem', fontWeight: '600', marginBottom: '2rem', color: '#ffffff' }}>Order History</h2>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(212, 175, 55, 0.3)',
            borderTop: '3px solid #D4AF37',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Loading orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          backgroundColor: 'rgba(212, 175, 55, 0.05)',
          borderRadius: '12px',
          border: '1px solid rgba(212, 175, 55, 0.2)'
        }}>
          <Package size={64} color="rgba(212, 175, 55, 0.5)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ color: '#D4AF37', marginBottom: '0.5rem' }}>No Orders Yet</h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Start shopping to see your orders here!
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {orders.map(order => (
            <div key={order.id} style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              border: '1px solid rgba(212, 175, 55, 0.2)',
              padding: '1.5rem',
              transition: 'all 0.3s ease'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '1rem'
              }}>
                <div>
                  <h4 style={{ color: '#D4AF37', fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                    Order #{order.orderNumber}
                  </h4>
                  <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
                    Placed on {order.createdAt ? new Date(order.createdAt.toDate()).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    backgroundColor: order.status === 'confirmed' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(251, 191, 36, 0.2)',
                    color: order.status === 'confirmed' ? '#10B981' : '#FBBF24',
                    border: `1px solid ${order.status === 'confirmed' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(251, 191, 36, 0.3)'}`
                  }}>
                    {order.status.toUpperCase()}
                  </span>
                  <span style={{
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    color: '#D4AF37'
                  }}>
                    ₹{order.total?.toFixed(2) || '0.00'}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div style={{ marginBottom: '1rem' }}>
                {order.items?.map((item, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '0.75rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: '8px',
                    marginBottom: '0.5rem'
                  }}>
                    <div style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(212, 175, 55, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      📦
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ color: '#ffffff', fontWeight: '500', marginBottom: '0.25rem' }}>
                        {item.productName}
                      </p>
                      <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.85rem' }}>
                        Qty: {item.quantity} × ₹{item.price}
                      </p>
                    </div>
                    <span style={{ color: '#D4AF37', fontWeight: '600' }}>
                      ₹{(item.quantity * item.price).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Order Actions */}
              <div style={{
                display: 'flex',
                gap: '1rem',
                paddingTop: '1rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <button style={{
                  ...buttonStyle,
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  padding: '0.5rem 1rem'
                }}>
                  <Eye size={14} />
                  View Details
                </button>
                <button style={{
                  ...buttonStyle,
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  padding: '0.5rem 1rem'
                }}>
                  <Download size={14} />
                  Invoice
                </button>
                {order.status === 'confirmed' && (
                  <button style={{
                    ...buttonStyle,
                    fontSize: '0.85rem',
                    padding: '0.5rem 1rem'
                  }}>
                    <Repeat size={14} />
                    Reorder
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderWishlistTab = () => (
    <div>
      <h2 style={{ fontSize: '1.8rem', fontWeight: '600', marginBottom: '2rem', color: '#ffffff' }}>My Wishlist</h2>
      
      {wishlist.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          backgroundColor: 'rgba(212, 175, 55, 0.05)',
          borderRadius: '12px',
          border: '1px solid rgba(212, 175, 55, 0.2)'
        }}>
          <Heart size={64} color="rgba(212, 175, 55, 0.5)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ color: '#D4AF37', marginBottom: '0.5rem' }}>Your Wishlist is Empty</h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Save your favorite products to buy them later!
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {wishlist.map(item => (
            <div key={item.id} style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              border: '1px solid rgba(212, 175, 55, 0.2)',
              overflow: 'hidden',
              transition: 'all 0.3s ease'
            }}>
              <div style={{
                height: '150px',
                backgroundColor: 'rgba(212, 175, 55, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                📦
              </div>
              <div style={{ padding: '1rem' }}>
                <h4 style={{ color: '#ffffff', marginBottom: '0.5rem' }}>{item.name}</h4>
                <p style={{ color: '#D4AF37', fontWeight: '600', marginBottom: '1rem' }}>₹{item.price}</p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button style={{
                    ...buttonStyle,
                    flex: 1,
                    fontSize: '0.85rem',
                    padding: '0.5rem'
                  }}>
                    Add to Cart
                  </button>
                  <button style={{
                    background: 'rgba(239, 68, 68, 0.2)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#EF4444',
                    padding: '0.5rem',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderAddressesTab = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: '600', color: '#ffffff' }}>Saved Addresses</h2>
        <button style={buttonStyle}>
          <MapPin size={16} />
          Add New Address
        </button>
      </div>

      {addresses.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          backgroundColor: 'rgba(212, 175, 55, 0.05)',
          borderRadius: '12px',
          border: '1px solid rgba(212, 175, 55, 0.2)'
        }}>
          <MapPin size={64} color="rgba(212, 175, 55, 0.5)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ color: '#D4AF37', marginBottom: '0.5rem' }}>No Saved Addresses</h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Add your addresses for faster checkout!
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {addresses.map(address => (
            <div key={address.id} style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              border: '1px solid rgba(212, 175, 55, 0.2)',
              padding: '1.5rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h4 style={{ color: '#D4AF37', marginBottom: '0.5rem' }}>{address.label}</h4>
                  <p style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.5' }}>
                    {address.street}<br />
                    {address.city}, {address.state} {address.pincode}<br />
                    {address.country}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    color: '#ffffff',
                    padding: '0.5rem',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}>
                    <Edit2 size={16} />
                  </button>
                  <button style={{
                    background: 'rgba(239, 68, 68, 0.2)',
                    border: 'none',
                    color: '#EF4444',
                    padding: '0.5rem',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderNotificationsTab = () => (
    <div>
      <h2 style={{ fontSize: '1.8rem', fontWeight: '600', marginBottom: '2rem', color: '#ffffff' }}>Notifications</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {notifications.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            backgroundColor: 'rgba(212, 175, 55, 0.05)',
            borderRadius: '12px',
            border: '1px solid rgba(212, 175, 55, 0.2)'
          }}>
            <Bell size={64} color="rgba(212, 175, 55, 0.5)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ color: '#D4AF37', marginBottom: '0.5rem' }}>No New Notifications</h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              We'll notify you about orders, offers, and updates!
            </p>
          </div>
        ) : (
          notifications.map(notification => (
            <div key={notification.id} style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              border: '1px solid rgba(212, 175, 55, 0.2)',
              padding: '1.5rem',
              opacity: notification.read ? 0.7 : 1
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h4 style={{ color: '#ffffff', marginBottom: '0.5rem' }}>{notification.title}</h4>
                  <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '0.5rem' }}>
                    {notification.message}
                  </p>
                  <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.85rem' }}>
                    {notification.createdAt ? new Date(notification.createdAt.toDate()).toLocaleString() : ''}
                  </p>
                </div>
                {!notification.read && (
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#D4AF37'
                  }}></div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div style={modalStyle} onClick={onClose}>
      <div style={contentStyle} onClick={(e) => e.stopPropagation()}>
        {/* Sidebar */}
        <div style={sidebarStyle}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(45deg, #D4AF37, #F4D03F)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8rem',
              fontWeight: '600',
              color: '#000000',
              margin: '0 auto 1rem'
            }}>
              {userProfile?.firstName?.[0] || user?.email?.[0] || 'U'}
            </div>
            <h3 style={{ color: '#ffffff', marginBottom: '0.25rem' }}>
              {userProfile?.firstName && userProfile?.lastName 
                ? `${userProfile.firstName} ${userProfile.lastName}`
                : user?.displayName || 'User'
              }
            </h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem' }}>
              {user?.email}
            </p>
          </div>

          <nav style={{ marginBottom: '2rem' }}>
            <button 
              style={tabButtonStyle(activeTab === 'profile')}
              onClick={() => setActiveTab('profile')}
            >
              <User size={20} />
              Profile
            </button>
            <button 
              style={tabButtonStyle(activeTab === 'orders')}
              onClick={() => setActiveTab('orders')}
            >
              <Package size={20} />
              Orders
            </button>
            <button 
              style={tabButtonStyle(activeTab === 'wishlist')}
              onClick={() => setActiveTab('wishlist')}
            >
              <Heart size={20} />
              Wishlist
            </button>
            <button 
              style={tabButtonStyle(activeTab === 'addresses')}
              onClick={() => setActiveTab('addresses')}
            >
              <MapPin size={20} />
              Addresses
            </button>
            <button 
              style={tabButtonStyle(activeTab === 'notifications')}
              onClick={() => setActiveTab('notifications')}
            >
              <Bell size={20} />
              Notifications
              {notifications.filter(n => !n.read).length > 0 && (
                <span style={{
                  backgroundColor: '#EF4444',
                  color: '#ffffff',
                  fontSize: '0.7rem',
                  padding: '0.15rem 0.4rem',
                  borderRadius: '10px',
                  marginLeft: 'auto'
                }}>
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </button>
          </nav>

          <button 
            onClick={handleLogout}
            style={{
              ...tabButtonStyle(false),
              color: '#EF4444',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              marginTop: 'auto'
            }}
          >
            <LogOut size={20} />
            Logout
          </button>

          <button 
            onClick={onClose}
            style={{
              ...tabButtonStyle(false),
              marginTop: '0.5rem'
            }}
          >
            <X size={20} />
            Close
          </button>
        </div>

        {/* Main Content */}
        <div style={mainContentStyle}>
          {activeTab === 'profile' && renderProfileTab()}
          {activeTab === 'orders' && renderOrdersTab()}
          {activeTab === 'wishlist' && renderWishlistTab()}
          {activeTab === 'addresses' && renderAddressesTab()}
          {activeTab === 'notifications' && renderNotificationsTab()}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default UserDashboard;