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

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 500 ? 0 : 50; // Free shipping over ₹500
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + shipping + tax;

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
      tax: Number(tax),
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
    maxWidth: '32rem',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem',
    borderBottom: '1px solid #E5E7EB'
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #D1D5DB',
    borderRadius: '0.5rem',
    marginBottom: '1rem',
    boxSizing: 'border-box'
  };

  const buttonStyle = {
    width: '100%',
    backgroundColor: loading ? '#9CA3AF' : '#FBBF24',
    color: '#111827',
    padding: '0.75rem',
    borderRadius: '0.5rem',
    border: 'none',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: loading ? 'not-allowed' : 'pointer'
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

  return (
    <div style={modalStyle} onClick={onClose}>
      <div style={contentStyle} onClick={(e) => e.stopPropagation()}>
        <div style={headerStyle}>
          <h2 style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#111827'}}>
            {step === 1 ? 'Checkout Details' : 'Payment'}
          </h2>
          <button 
            style={{background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280'}}
            onClick={onClose}
          >
            <X size={24} />
          </button>
        </div>

        <div style={{padding: '1.5rem'}}>
          {error && (
            <div style={errorStyle}>
              {error}
            </div>
          )}

          {step === 1 ? (
            // Step 1: Customer Details
            <div>
              <div style={{marginBottom: '1.5rem'}}>
                <h3 style={{display: 'flex', alignItems: 'center', marginBottom: '1rem', fontSize: '1.125rem', fontWeight: '600'}}>
                  <User size={20} style={{marginRight: '0.5rem'}} />
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

              <div style={{marginBottom: '1.5rem'}}>
                <h3 style={{display: 'flex', alignItems: 'center', marginBottom: '1rem', fontSize: '1.125rem', fontWeight: '600'}}>
                  <MapPin size={20} style={{marginRight: '0.5rem'}} />
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
              <div style={{marginBottom: '1.5rem'}}>
                <h3 style={{display: 'flex', alignItems: 'center', marginBottom: '1rem', fontSize: '1.125rem', fontWeight: '600'}}>
                  <Package size={20} style={{marginRight: '0.5rem'}} />
                  Order Summary
                </h3>
                {cart.map(item => (
                  <div key={item.id} style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', padding: '0.5rem', backgroundColor: '#F9FAFB', borderRadius: '0.375rem'}}>
                    <span>{item.name} × {item.quantity}</span>
                    <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div style={{borderTop: '1px solid #E5E7EB', paddingTop: '0.5rem', marginTop: '0.5rem'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem'}}>
                    <span>Subtotal:</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem'}}>
                    <span>Shipping:</span>
                    <span>₹{shipping.toFixed(2)}</span>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem'}}>
                    <span>GST (18%):</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.125rem', borderTop: '1px solid #E5E7EB', paddingTop: '0.5rem'}}>
                    <span>Total:</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div style={{display: 'flex', gap: '1rem'}}>
                <button 
                  onClick={() => setStep(1)}
                  style={{
                    flex: 1,
                    backgroundColor: '#F3F4F6',
                    color: '#374151',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Back
                </button>
                <button 
                  onClick={handlePayment}
                  disabled={loading}
                  style={{...buttonStyle, flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'}}
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