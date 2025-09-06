// src/services/razorpayService.js

// Configuration - SET TO FALSE FOR LIVE PAYMENTS
const DEMO_MODE = false; // Set to false for production

export const razorpayService = {
  // Load Razorpay script
  async loadRazorpayScript() {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        console.log('Razorpay script loaded successfully');
        resolve(true);
      };
      script.onerror = () => {
        console.error('Failed to load Razorpay script');
        resolve(false);
      };
      document.body.appendChild(script);
    });
  },

  // Create payment order (frontend only - no backend required)
  async createDemoPaymentOrder(orderData) {
    try {
      console.log('Creating payment order:', orderData);
      
      // Generate a frontend order ID
      const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      return {
        success: true,
        orderId: orderId,
        amount: Math.round(orderData.amount * 100), // Convert to paise
        currency: 'INR'
      };
    } catch (error) {
      console.error('Failed to create payment order:', error);
      return { success: false, error: error.message };
    }
  },

  // Process payment - works with live Razorpay keys
  async processPayment(paymentData, onSuccess, onError) {
    if (DEMO_MODE) {
      return this.processDemoPayment(paymentData, onSuccess, onError);
    } else {
      return this.processLivePayment(paymentData, onSuccess, onError);
    }
  },

  // Demo payment simulation (for testing)
  async processDemoPayment(paymentData, onSuccess, onError) {
    try {
      console.log('Starting demo payment simulation...');

      if (window.confirm(`🎭 DEMO MODE\n\nSimulating payment for ₹${(paymentData.amount / 100).toFixed(2)}\n\nClick OK to proceed with demo payment, Cancel to abort.`)) {
        setTimeout(() => {
          const demoResponse = {
            paymentId: `pay_demo_${Date.now()}`,
            orderId: paymentData.orderId,
            signature: `demo_signature_${Date.now()}`,
            amount: paymentData.amount,
            currency: paymentData.currency || 'INR'
          };
          onSuccess(demoResponse);
        }, 2000);
      } else {
        onError(new Error('Payment cancelled by user'));
      }
    } catch (error) {
      console.error('Demo payment processing error:', error);
      onError(error);
    }
  },

  // Live payment processing with Razorpay
  async processLivePayment(paymentData, onSuccess, onError) {
    try {
      console.log('Processing live payment...');
      
      // Check if Razorpay key is configured
      if (!process.env.REACT_APP_RAZORPAY_KEY_ID) {
        throw new Error('Razorpay key not configured. Please add REACT_APP_RAZORPAY_KEY_ID to your environment variables.');
      }

      const isLoaded = await this.loadRazorpayScript();
      if (!isLoaded) {
        throw new Error('Razorpay SDK failed to load. Please check your internet connection.');
      }

      console.log('Opening Razorpay checkout...');

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: paymentData.amount, // Amount in paise
        currency: paymentData.currency || 'INR',
        name: 'CarPore',
        description: 'Premium Air Fresheners',
        image: '/logo192.png',
        handler: function (response) {
          console.log('Payment successful:', response);
          onSuccess({
            paymentId: response.razorpay_payment_id,
            orderId: paymentData.orderId,
            signature: response.razorpay_signature || `sig_${Date.now()}` // Fallback for frontend-only
          });
        },
        prefill: {
          name: paymentData.customerName || '',
          email: paymentData.customerEmail || '',
          contact: paymentData.customerPhone || ''
        },
        notes: {
          address: paymentData.address || 'CarPore Customer',
          order_type: 'air_freshener'
        },
        theme: {
          color: '#FBBF24' // CarPore yellow color
        },
        modal: {
          ondismiss: function() {
            console.log('Payment cancelled by user');
            onError(new Error('Payment cancelled by user'));
          }
        },
        retry: {
          enabled: true,
          max_count: 3
        },
        timeout: 300, // 5 minutes
        remember_customer: false
      };

      const rzp = new window.Razorpay(options);
      
      // Handle payment failures
      rzp.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error);
        onError(new Error(`Payment failed: ${response.error.description}`));
      });

      rzp.open();
    } catch (error) {
      console.error('Payment processing error:', error);
      onError(error);
    }
  },

  // Check if in demo mode
  isDemoMode() {
    return DEMO_MODE;
  },

  // Simple payment verification for frontend-only setup
  async verifyPayment(paymentData) {
    try {
      console.log('Verifying payment:', paymentData);
      
      if (DEMO_MODE) {
        console.log('Payment verification successful (Demo Mode)');
        return { 
          verified: true, 
          mode: 'demo',
          message: 'Payment verified in demo mode'
        };
      }

      // For production without backend, we'll trust Razorpay's response
      // In a full production setup, you'd verify the signature on your backend
      if (paymentData.paymentId && paymentData.orderId) {
        console.log('Payment verification successful (Frontend Mode)');
        return { 
          verified: true, 
          mode: 'frontend',
          message: 'Payment processed successfully'
        };
      } else {
        return { 
          verified: false, 
          error: 'Missing payment or order ID'
        };
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      return { verified: false, error: error.message };
    }
  },

  // Get payment status message for UI
  getPaymentStatusMessage() {
    if (DEMO_MODE) {
      return {
        type: 'warning',
        message: 'Demo Mode: No real payments will be processed'
      };
    } else if (!process.env.REACT_APP_RAZORPAY_KEY_ID) {
      return {
        type: 'error',
        message: 'Payment system not configured'
      };
    } else {
      return {
        type: 'success',
        message: 'Payment system ready'
      };
    }
  }
};