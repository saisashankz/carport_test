// src/components/Checkout.js
import React, { useState } from 'react';
import { X, CreditCard, Package, User, MapPin } from 'lucide-react';
import { razorpayService } from '../services/razorpayService';
import { orderService } from '../services/orderService';

const Checkout = ({ cart, onClose, onSuccess, user }) => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Details, 2: Payment
  const [error, setError] = useState('');
  const [customerData, setCustomerData] = useState({
    firstName: user?.displayName?.split(' ')[0] || '',
    lastName: user?.displayName?.split(' ')[1] || '',
    email: user?.email || '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India'
    }
  });

  // Calculate totals (prices are tax-inclusive)
  const subtotal = Math.round(cart.reduce((sum, item) => sum + (Number(item.price) * Number(item.quantity)), 0) * 100) / 100;
  const shipping = subtotal > 500 ? 0 : 50; // Free shipping over ₹500
  const total = Math.round((subtotal + shipping) * 100) / 100;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setCustomerData(prev => ({
        ...prev,
        address: { ...prev.address, [addressField]: value }
      }));
    } else {
      setCustomerData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleProceedToPayment = () => {
    setError('');
    
    // Validate required fields
    if (!customerData.firstName || !customerData.lastName || !customerData.email || !customerData.phone) {
      setError('Please fill in all required customer information fields');
      return;
    }
    if (!customerData.address.street || !customerData.address.city || !customerData.address.state || !customerData.address.pincode) {
      setError('Please fill in all address fields');
      return;
    }
    
    console.log('✅ Validation passed, proceeding to payment');
    setStep(2);
  };

  // Update only the handlePayment function in Checkout.js
  const handlePayment = async () => {
    setLoading(true);
    setError('');
    
    try {
      console.log('🛒 Starting checkout process (Demo Mode)...');
      console.log('📦 Cart items:', cart);
      console.log('👤 Customer data:', customerData);
      
      // Prepare order data
      const orderData = {
        userId: user?.uid || null,
        items: cart.map(item => ({
          productId: item.id || 'unknown',
          productName: item.name || 'Unknown Product',
          productImage: item.image || '',
          quantity: Number(item.quantity) || 1,
          price: Number(item.price) || 0,
          total: Number(item.price * item.quantity) || 0
        })),
        subtotal: Number(subtotal),
        shipping: Number(shipping),
        total: Number(total),
        customer: customerData,
        shippingAddress: customerData.address
      };
      
      console.log('📝 Prepared order data:', orderData);
      
      // Create order in Firebase first
      console.log('💾 Creating order in Firebase...');
      const createdOrder = await orderService.createOrder(orderData);
      
      if (!createdOrder.success) {
        throw new Error(`Order creation failed: ${createdOrder.error}`);
      }
      
      console.log('✅ Order created successfully:', createdOrder.orderNumber);
      
      // Create demo payment order (no backend required)
      console.log('💳 Creating demo payment order...');
      const paymentOrder = await razorpayService.createDemoPaymentOrder({
        amount: total,
        currency: 'INR'
      });
      
      if (!paymentOrder.success) {
        throw new Error(`Payment order creation failed: ${paymentOrder.error}`);
      }
      
      console.log('✅ Demo payment order created:', paymentOrder.orderId);
      
      // Process payment with Razorpay (demo mode)
      console.log('🚀 Opening Razorpay checkout (Demo Mode)...');
      await razorpayService.processPayment(
        {
          orderId: paymentOrder.orderId,
          amount: paymentOrder.amount,
          currency: paymentOrder.currency,
          customerName: `${customerData.firstName} ${customerData.lastName}`,
          customerEmail: customerData.email,
          customerPhone: customerData.phone,
          address: `${customerData.address.street}, ${customerData.address.city}`
        },
        async (paymentResponse) => {
          // Payment successful
          console.log('🎉 Payment successful (Demo Mode):', paymentResponse);
          
          try {
            // Update order with payment details
            await orderService.updateOrderPayment(createdOrder.id, paymentResponse);
            
            alert(`🎉 Order placed successfully! (Demo Mode)
            
Order Number: ${createdOrder.orderNumber}
Payment ID: ${paymentResponse.paymentId}
Total: ₹${total.toFixed(2)}

Note: This is demo mode. In production, real payments would be processed.`);
            
            onSuccess?.(createdOrder);
            onClose();
          } catch (updateError) {
            console.error('❌ Failed to update order payment:', updateError);
            alert('Payment successful but failed to update order. Please contact support.');
          }
        },
        (error) => {
          // Payment failed or cancelled
          console.error('💳 Payment failed:', error);
          setError(`Payment failed: ${error.message}`);
        }
      );
      
    } catch (error) {
      console.error('❌ Checkout error:', error);
      setError(`Checkout failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Styles
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
    maxWidth: '32rem',
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
    fontSize: '1rem',
    marginBottom: '1rem',
    boxSizing: 'border-box',
    background: 'rgba(255, 255, 255, 0.05)',
    color: '#ffffff',
    backdropFilter: 'blur(10px)'
  };

  const buttonStyle = {
    width: '100%',
    background: 'linear-gradient(45deg, #D4AF37, #F4D03F)',
    color: '#000000',
    padding: '0.75rem',
    borderRadius: '50px',
    border: 'none',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: loading ? 'not-allowed' : 'pointer',
    opacity: loading ? 0.7 : 1,
    transition: 'all 0.3s ease'
  };

  const errorStyle = {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    color: '#EF4444',
    padding: '0.75rem 1rem',
    borderRadius: '12px',
    marginBottom: '1rem',
    fontSize: '0.875rem',
    backdropFilter: 'blur(10px)'
  };

  return (
    <div style={modalStyle} onClick={onClose}>
      <div style={contentStyle} onClick={(e) => e.stopPropagation()}>
        <div style={headerStyle}>
          <h2 style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#ffffff'}}>
            {step === 1 ? 'Checkout Details' : 'Payment'}
          </h2>
          <button 
            style={{
              background: 'none', 
              border: 'none', 
              cursor: 'pointer', 
              color: 'rgba(255, 255, 255, 0.7)', 
              padding: '0.5rem', 
              borderRadius: '50%', 
              transition: 'all 0.3s ease'
            }}
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

        <div style={{padding: '2rem'}}>
          {error && (
            <div style={errorStyle}>
              {error}
            </div>
          )}

          {step === 1 ? (
            // Step 1: Customer Details
            <div>
              <div style={{marginBottom: '2rem'}}>
                <h3 style={{
                  display: 'flex', 
                  alignItems: 'center', 
                  marginBottom: '1.5rem', 
                  fontSize: '1.125rem', 
                  fontWeight: '600', 
                  color: '#ffffff'
                }}>
                  <User size={20} style={{marginRight: '0.5rem', color: '#D4AF37'}} />
                  Customer Information
                </h3>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name *"
                    value={customerData.firstName}
                    onChange={handleInputChange}
                    style={inputStyle}
                    required
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name *"
                    value={customerData.lastName}
                    onChange={handleInputChange}
                    style={inputStyle}
                    required
                  />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address *"
                  value={customerData.email}
                  onChange={handleInputChange}
                  style={inputStyle}
                  required
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number *"
                  value={customerData.phone}
                  onChange={handleInputChange}
                  style={inputStyle}
                  required
                />
              </div>

              <div style={{marginBottom: '2rem'}}>
                <h3 style={{
                  display: 'flex', 
                  alignItems: 'center', 
                  marginBottom: '1.5rem', 
                  fontSize: '1.125rem', 
                  fontWeight: '600', 
                  color: '#ffffff'
                }}>
                  <MapPin size={20} style={{marginRight: '0.5rem', color: '#D4AF37'}} />
                  Shipping Address
                </h3>
                <input
                  type="text"
                  name="address.street"
                  placeholder="Street Address *"
                  value={customerData.address.street}
                  onChange={handleInputChange}
                  style={inputStyle}
                  required
                />
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem'}}>
                  <input
                    type="text"
                    name="address.city"
                    placeholder="City *"
                    value={customerData.address.city}
                    onChange={handleInputChange}
                    style={inputStyle}
                    required
                  />
                  <input
                    type="text"
                    name="address.state"
                    placeholder="State *"
                    value={customerData.address.state}
                    onChange={handleInputChange}
                    style={inputStyle}
                    required
                  />
                  <input
                    type="text"
                    name="address.pincode"
                    placeholder="PIN Code *"
                    value={customerData.address.pincode}
                    onChange={handleInputChange}
                    style={inputStyle}
                    required
                  />
                </div>
              </div>

              <button onClick={handleProceedToPayment} style={buttonStyle}>
                Proceed to Payment (₹{total.toFixed(2)})
              </button>
            </div>
          ) : (
            // Step 2: Payment & Order Summary
            <div>
              <div style={{marginBottom: '2rem'}}>
                <h3 style={{
                  display: 'flex', 
                  alignItems: 'center', 
                  marginBottom: '1.5rem', 
                  fontSize: '1.125rem', 
                  fontWeight: '600', 
                  color: '#ffffff'
                }}>
                  <Package size={20} style={{marginRight: '0.5rem', color: '#D4AF37'}} />
                  Order Summary
                </h3>
                {cart.map(item => (
                  <div key={item.id} style={{
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    marginBottom: '0.75rem', 
                    padding: '0.75rem', 
                    backgroundColor: 'rgba(212, 175, 55, 0.1)', 
                    borderRadius: '12px', 
                    border: '1px solid rgba(212, 175, 55, 0.2)'
                  }}>
                    <span style={{color: '#ffffff'}}>{item.name} × {item.quantity}</span>
                    <span style={{color: '#D4AF37', fontWeight: '600'}}>₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div style={{
                  borderTop: '1px solid rgba(212, 175, 55, 0.3)', 
                  paddingTop: '1rem', 
                  marginTop: '1rem'
                }}>
                  <div style={{
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    marginBottom: '0.5rem', 
                    color: 'rgba(255, 255, 255, 0.8)'
                  }}>
                    <span>Subtotal (incl. tax):</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div style={{
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    marginBottom: '0.5rem', 
                    color: 'rgba(255, 255, 255, 0.8)'
                  }}>
                    <span>Shipping:</span>
                    <span>₹{shipping.toFixed(2)}</span>
                  </div>
                  <div style={{
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    fontWeight: 'bold', 
                    fontSize: '1.125rem', 
                    borderTop: '1px solid rgba(212, 175, 55, 0.3)', 
                    paddingTop: '1rem', 
                    color: '#ffffff'
                  }}>
                    <span>Total:</span>
                    <span style={{color: '#D4AF37'}}>₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div style={{display: 'flex', gap: '1rem'}}>
                <button 
                  onClick={() => setStep(1)}
                  style={{
                    flex: 1,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: 'rgba(255, 255, 255, 0.8)',
                    padding: '0.75rem',
                    borderRadius: '50px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                    e.target.style.color = '#ffffff';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.color = 'rgba(255, 255, 255, 0.8)';
                  }}
                >
                  Back
                </button>
                <button 
                  onClick={handlePayment}
                  disabled={loading}
                  style={{
                    ...buttonStyle, 
                    flex: 2, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '0.5rem'
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
                  <CreditCard size={20} />
                  {loading ? 'Processing...' : `Pay ₹${total.toFixed(2)}`}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;