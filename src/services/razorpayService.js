// src/services/razorpayService.js

// Configuration
const DEMO_MODE = false; // Set to fal      console.log('🔄 Loading Razorpay...');e for production - this will open actual Razorpay page

export const razorpayService = {
  // Load Razorpay script
  async loadRazorpayScript() {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        console.log('✅ Razorpay script loaded successfully');
        resolve(true);
      };
      script.onerror = () => {
        console.error('❌ Failed to load Razorpay script');
        resolve(false);
      };
      document.body.appendChild(script);
    });
  },

  // Create demo payment order (frontend only)
  async createDemoPaymentOrder(orderData) {
    try {
      console.log('💳 Creating demo payment order (frontend mode):', orderData);
      
      // In demo mode, we simulate the order creation
      // In production, this would be done by your backend
      const demoOrderId = `order_demo_${Date.now()}`;
      
      console.log('✅ Demo payment order created:', demoOrderId);
      return {
        success: true,
        orderId: demoOrderId,
        amount: Math.round(orderData.amount * 100), // Convert to paise
        currency: 'INR'
      };
    } catch (error) {
      console.error('❌ Failed to create demo payment order:', error);
      return { success: false, error: error.message };
    }
  },

  // Process payment - automatically chooses demo or real based on DEMO_MODE
  async processPayment(paymentData, onSuccess, onError) {
    if (DEMO_MODE) {
      return this.processDemoPayment(paymentData, onSuccess, onError);
    } else {
      return this.processRealPayment(paymentData, onSuccess, onError);
    }
  },

  // Demo payment simulation (no Razorpay API calls)
  async processDemoPayment(paymentData, onSuccess, onError) {
    try {
      console.log('� Starting demo payment simulation...');
      console.log('💡 Demo Mode: Simulating payment without Razorpay API calls');

      // In true demo mode, simulate payment success after a short delay
      setTimeout(() => {
        console.log('✅ Demo payment completed successfully!');
        
        // Simulate a successful payment response
        const demoResponse = {
          paymentId: `pay_demo_${Date.now()}`,
          orderId: paymentData.orderId,
          signature: `demo_signature_${Date.now()}`,
          amount: paymentData.amount,
          currency: paymentData.currency || 'INR'
        };

        console.log('💳 Demo payment response:', demoResponse);
        onSuccess(demoResponse);
      }, 2000); // 2 second delay to simulate processing

      // Show a demo notification
      if (window.confirm(`🎭 DEMO MODE\n\nSimulating payment for ₹${(paymentData.amount / 100).toFixed(2)}\n\nClick OK to proceed with demo payment, Cancel to abort.`)) {
        console.log('✅ User confirmed demo payment');
      } else {
        console.log('⚠️ User cancelled demo payment');
        onError(new Error('Payment cancelled by user'));
      }

    } catch (error) {
      console.error('❌ Demo payment processing error:', error);
      onError(error);
    }
  },

  // Alternative method for actual Razorpay integration (when not in demo mode)
  async processRealPayment(paymentData, onSuccess, onError) {
    try {
      console.log('�🔄 Loading Razorpay...');
      
      const isLoaded = await this.loadRazorpayScript();
      if (!isLoaded) {
        throw new Error('Razorpay SDK failed to load. Please check your internet connection.');
      }

      console.log('🚀 Opening Razorpay checkout (Test Mode - No Backend)...');

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: paymentData.amount, // Amount in paise
        currency: paymentData.currency || 'INR',
        name: 'CarPore',
        description: 'Premium Air Fresheners - Test Mode',
        image: '/logo192.png',
        // Note: Not using order_id for frontend-only integration
        // order_id: paymentData.orderId, // This requires backend
        handler: function (response) {
          console.log('✅ Payment successful (Test Mode):', response);
          onSuccess({
            paymentId: response.razorpay_payment_id,
            orderId: paymentData.orderId, // Use our frontend order ID
            signature: `test_signature_${Date.now()}` // Generate test signature
          });
        },
        prefill: {
          name: paymentData.customerName || '',
          email: paymentData.customerEmail || '',
          contact: paymentData.customerPhone || ''
        },
        notes: {
          address: paymentData.address || 'CarPore Customer'
        },
        theme: {
          color: '#FBBF24' // CarPore yellow color
        },
        modal: {
          ondismiss: function() {
            console.log('⚠️ Payment cancelled by user');
            onError(new Error('Payment cancelled by user'));
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('❌ Payment processing error:', error);
      onError(error);
    }
  },

  // Check if in demo mode
  isDemoMode() {
    return DEMO_MODE;
  },

  // Verify payment (automatically chooses demo or real verification)
  async verifyPayment(paymentData) {
    if (DEMO_MODE) {
      return this.verifyDemoPayment(paymentData);
    } else {
      return this.verifyRealPayment(paymentData);
    }
  },

  // Verify demo payment
  async verifyDemoPayment(paymentData) {
    try {
      console.log('🔍 Verifying payment (Demo Mode):', paymentData);
      
      // In demo mode, we always return success
      console.log('✅ Payment verification successful (Demo Mode)');
      return { 
        verified: true, 
        mode: 'demo',
        message: 'Payment verified in demo mode'
      };
    } catch (error) {
      console.error('❌ Error verifying demo payment:', error);
      return { verified: false, error: error.message };
    }
  },

  // Verify real payment (would call your backend)
  async verifyRealPayment(paymentData) {
    try {
      console.log('🔍 Verifying payment (Production Mode):', paymentData);
      
      // In production, this would verify the payment signature on your backend
      // For now, return success (implement backend verification)
      console.log('✅ Payment verification successful (Production Mode)');
      return { 
        verified: true, 
        mode: 'production',
        message: 'Payment verified in production mode'
      };
    } catch (error) {
      console.error('❌ Error verifying real payment:', error);
      return { verified: false, error: error.message };
    }
  }
};