// src/components/CartModal.js
import React from 'react';
import { X, Plus, Minus, ShoppingCart, Trash2 } from 'lucide-react';

const CartModal = ({ isOpen, onClose, cart, onUpdateQuantity, onRemoveItem, onProceedToCheckout }) => {
  if (!isOpen) return null;

  const getCartTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  const modalStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '1rem'
  };

  const contentStyle = {
    background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.9), rgba(26, 26, 26, 0.9))',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    border: '1px solid rgba(212, 175, 55, 0.3)',
    maxWidth: '600px',
    width: '100%',
    maxHeight: '80vh',
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

  const closeButtonStyle = {
    background: 'none',
    border: 'none',
    color: 'rgba(255, 255, 255, 0.7)',
    cursor: 'pointer',
    padding: '0.5rem',
    borderRadius: '50%',
    transition: 'all 0.3s ease'
  };

  const itemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1.5rem 2rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
  };

  const quantityButtonStyle = {
    background: 'rgba(212, 175, 55, 0.2)',
    border: '1px solid rgba(212, 175, 55, 0.4)',
    color: '#D4AF37',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  };

  const checkoutButtonStyle = {
    background: 'linear-gradient(45deg, #D4AF37, #F4D03F)',
    color: '#000000',
    border: 'none',
    padding: '1rem 2rem',
    borderRadius: '50px',
    fontWeight: '600',
    fontSize: '1.125rem',
    cursor: 'pointer',
    width: '100%',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem'
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
            <ShoppingCart size={24} color="#D4AF37" />
            Your Cart ({getCartCount()})
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

        {/* Cart Items */}
        <div style={{ minHeight: '200px' }}>
          {cart.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '3rem 2rem',
              color: 'rgba(255, 255, 255, 0.7)'
            }}>
              <ShoppingCart size={48} color="rgba(212, 175, 55, 0.5)" style={{ marginBottom: '1rem' }} />
              <h3 style={{ marginBottom: '0.5rem', color: '#D4AF37' }}>Your cart is empty</h3>
              <p>Add some amazing products to get started!</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} style={itemStyle}>
                {/* Product Image */}
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  backgroundColor: 'rgba(212, 175, 55, 0.1)'
                }}>
                  <img 
                    src={item.images?.[0]?.src || '/images/placeholder.jpg'}
                    alt={item.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </div>

                {/* Product Info */}
                <div style={{ flex: 1 }}>
                  <h4 style={{
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    marginBottom: '0.25rem',
                    color: '#ffffff'
                  }}>
                    {item.name}
                  </h4>
                  {item.scent && (
                    <p style={{
                      fontSize: '0.9rem',
                      color: 'rgba(255, 255, 255, 0.6)',
                      marginBottom: '0.5rem'
                    }}>
                      {item.scent} Scent
                    </p>
                  )}
                  <p style={{
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    color: '#D4AF37'
                  }}>
                    ₹{item.price}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  <button
                    style={quantityButtonStyle}
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = 'rgba(212, 175, 55, 0.3)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = 'rgba(212, 175, 55, 0.2)';
                    }}
                  >
                    <Minus size={16} />
                  </button>
                  
                  <span style={{
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    minWidth: '30px',
                    textAlign: 'center',
                    color: '#ffffff'
                  }}>
                    {item.quantity}
                  </span>
                  
                  <button
                    style={quantityButtonStyle}
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = 'rgba(212, 175, 55, 0.3)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = 'rgba(212, 175, 55, 0.2)';
                    }}
                  >
                    <Plus size={16} />
                  </button>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => onRemoveItem(item.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'rgba(239, 68, 68, 0.8)',
                    cursor: 'pointer',
                    padding: '0.5rem',
                    borderRadius: '50%',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                    e.target.style.color = '#EF4444';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = 'rgba(239, 68, 68, 0.8)';
                  }}
                >
                  <Trash2 size={18} />
                </button>

                {/* Item Total */}
                <div style={{
                  minWidth: '80px',
                  textAlign: 'right'
                }}>
                  <p style={{
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    color: '#ffffff'
                  }}>
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div style={{
            padding: '2rem',
            borderTop: '1px solid rgba(212, 175, 55, 0.2)'
          }}>
            {/* Cart Summary */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem',
              padding: '1rem',
              backgroundColor: 'rgba(212, 175, 55, 0.1)',
              borderRadius: '12px',
              border: '1px solid rgba(212, 175, 55, 0.2)'
            }}>
              <span style={{
                fontSize: '1.2rem',
                fontWeight: '600',
                color: '#ffffff'
              }}>
                Total ({getCartCount()} items)
              </span>
              <span style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#D4AF37'
              }}>
                ₹{getCartTotal().toFixed(2)}
              </span>
            </div>

            {/* Checkout Button */}
            <button
              onClick={onProceedToCheckout}
              style={checkoutButtonStyle}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(212, 175, 55, 0.4)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              Proceed to Checkout →
            </button>

            <p style={{
              textAlign: 'center',
              marginTop: '1rem',
              fontSize: '0.9rem',
              color: 'rgba(255, 255, 255, 0.6)'
            }}>
              Free shipping on orders over ₹500
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;