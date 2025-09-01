import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import AuthModal from './components/AuthModal';
import Checkout from './components/Checkout';
import { testFirebaseConnection } from './firebase';
import { productService } from './services/productService';
import { authService } from './services/authService';
import './App.css';

function App() {
  const [cart, setCart] = useState([]);
  const [firebaseStatus, setFirebaseStatus] = useState('testing');
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(null);
  
  // Authentication state
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  
  // Checkout state
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  // Test Firebase connection and load products
  useEffect(() => {
    console.log('Testing Firebase connection...');
    
    console.log('Environment variables check:', {
      apiKey: process.env.REACT_APP_FIREBASE_API_KEY ? 'Set' : 'Missing',
      projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID ? 'Set' : 'Missing',
      authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN ? 'Set' : 'Missing',
      razorpayKey: process.env.REACT_APP_RAZORPAY_KEY_ID ? 'Set' : 'Missing'
    });

    try {
      const isConnected = testFirebaseConnection();
      if (isConnected) {
        setFirebaseStatus('connected');
        console.log('✅ Firebase connection successful');
        loadProducts();
      } else {
        setFirebaseStatus('failed');
        console.log('❌ Firebase connection failed');
      }
    } catch (error) {
      console.error('❌ Firebase connection error:', error);
      setFirebaseStatus('error');
    }
  }, []);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange((user) => {
      console.log('👤 Auth state changed:', user ? `Logged in as ${user.email}` : 'Logged out');
      setUser(user);
      setUserLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Load products from Firebase
  const loadProducts = async () => {
    try {
      setProductsLoading(true);
      setProductsError(null);
      
      const fetchedProducts = await productService.getProducts();
      setProducts(fetchedProducts);
      
      console.log('📦 Products loaded successfully:', fetchedProducts.length);
    } catch (error) {
      console.error('❌ Failed to load products:', error);
      setProductsError(error.message);
    } finally {
      setProductsLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    alert(`${product.name} added to cart!`);
  };

  const handleLoginClick = () => {
    if (user) {
      // User is logged in, show logout option
      if (window.confirm(`Logout from ${user.email}?`)) {
        authService.logout();
      }
    } else {
      // User is not logged in, show login modal
      setAuthModalOpen(true);
    }
  };

  const handleCartClick = () => {
    if (cart.length === 0) {
      alert('Your cart is empty! Add some products first.');
      return;
    }
    
    if (!user) {
      alert('Please login to proceed to checkout');
      setAuthModalOpen(true);
      return;
    }
    
    console.log('🛒 Opening checkout with cart:', cart);
    setCheckoutOpen(true);
  };

  const handleAuthSuccess = (user) => {
    console.log('🎉 Authentication successful:', user.email);
    alert(`Welcome ${user.displayName || user.email}!`);
  };

  const handleCheckoutSuccess = (order) => {
    console.log('🎉 Checkout successful:', order);
    setCart([]); // Clear cart after successful order
    alert(`Order placed successfully!\nOrder Number: ${order.orderNumber}`);
  };

  const getCartCount = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getCartTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getStatusColor = () => {
    switch (firebaseStatus) {
      case 'connected': return '#10B981';
      case 'testing': return '#F59E0B';
      case 'failed': 
      case 'error': 
      default: return '#EF4444';
    }
  };

  const getStatusText = () => {
    switch (firebaseStatus) {
      case 'connected': return '✅ Connected';
      case 'testing': return '🔄 Testing...';
      case 'failed': return '❌ Failed';
      case 'error': return '❌ Error';
      default: return '❓ Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header 
        cartCount={getCartCount()}
        onCartClick={handleCartClick}
        onLoginClick={handleLoginClick}
        user={user}
        userLoading={userLoading}
      />

      {/* Firebase Status Indicator */}
      <div style={{
        position: 'fixed',
        top: '80px',
        right: '20px',
        background: getStatusColor(),
        color: 'white',
        padding: '0.5rem 1rem',
        borderRadius: '0.5rem',
        fontSize: '0.875rem',
        zIndex: 50,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        Firebase: {getStatusText()}
      </div>

      {/* User Status Indicator */}
      {!userLoading && (
        <div style={{
          position: 'fixed',
          top: '120px',
          right: '20px',
          background: user ? '#10B981' : '#6B7280',
          color: 'white',
          padding: '0.5rem 1rem',
          borderRadius: '0.5rem',
          fontSize: '0.875rem',
          zIndex: 50,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          User: {user ? `✅ ${user.email}` : '❌ Not logged in'}
        </div>
      )}

      {/* Payment Status Indicator */}
      <div style={{
        position: 'fixed',
        top: '160px',
        right: '20px',
        background: process.env.REACT_APP_RAZORPAY_KEY_ID ? '#10B981' : '#EF4444',
        color: 'white',
        padding: '0.5rem 1rem',
        borderRadius: '0.5rem',
        fontSize: '0.875rem',
        zIndex: 50,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        Razorpay: {process.env.REACT_APP_RAZORPAY_KEY_ID ? '✅ Ready' : '❌ Not configured'}
      </div>

      <main className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-white text-center mb-4">
            Premium <span style={{color: '#FBBF24'}}>Air Fresheners</span>
          </h1>
          
          <p className="text-center text-gray-300 mb-12">
            Transform your space with luxury camphor and wood-infused scents
          </p>

          {/* Products Section */}
          {productsLoading ? (
            <div style={{textAlign: 'center', color: 'white', padding: '2rem'}}>
              <div style={{
                width: '2rem',
                height: '2rem',
                border: '4px solid #374151',
                borderTop: '4px solid #FBBF24',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 1rem'
              }}></div>
              <p>Loading products from Firebase...</p>
              <style>{`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          ) : productsError ? (
            <div style={{textAlign: 'center', color: '#EF4444', padding: '2rem'}}>
              <p>❌ Error loading products: {productsError}</p>
              <button 
                onClick={loadProducts}
                style={{
                  marginTop: '1rem',
                  backgroundColor: '#FBBF24',
                  color: '#111827',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Try Again
              </button>
            </div>
          ) : products.length === 0 ? (
            <div style={{textAlign: 'center', color: '#9CA3AF', padding: '2rem'}}>
              <p>📦 No products found in database</p>
            </div>
          ) : (
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem'}}>
              {products.map(product => (
                <ProductCard 
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onViewProduct={(p) => alert(`Viewing: ${p.name}`)}
                />
              ))}
            </div>
          )}

          {/* Cart Summary */}
          {cart.length > 0 && (
            <div style={{
              marginTop: '3rem',
              padding: '1rem',
              backgroundColor: '#1F2937',
              borderRadius: '0.5rem',
              color: 'white',
              textAlign: 'center'
            }}>
              <h3 style={{color: '#FBBF24', marginBottom: '0.5rem'}}>Cart Summary</h3>
              <p>{getCartCount()} items • Total: ₹{getCartTotal().toFixed(2)}</p>
              <button
                onClick={handleCartClick}
                style={{
                  marginTop: '1rem',
                  backgroundColor: '#FBBF24',
                  color: '#111827',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Proceed to Checkout
              </button>
            </div>
          )}

          {/* Debug Info */}
          <div style={{
            marginTop: '3rem',
            padding: '1rem',
            backgroundColor: '#1F2937',
            borderRadius: '0.5rem',
            color: 'white',
            fontSize: '0.875rem'
          }}>
            <h3 style={{color: '#FBBF24', marginBottom: '0.5rem'}}>Debug Info:</h3>
            <p>Firebase Status: {firebaseStatus}</p>
            <p>Products Loaded: {products.length}</p>
            <p>User Status: {user ? `Logged in as ${user.email}` : 'Not logged in'}</p>
            <p>Cart Items: {getCartCount()}</p>
            <p>Cart Total: ₹{getCartTotal().toFixed(2)}</p>
            <p>Razorpay Key: {process.env.REACT_APP_RAZORPAY_KEY_ID ? 'Configured' : 'Missing'}</p>
          </div>
        </div>
      </main>

      {/* Authentication Modal */}
      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* Checkout Modal */}
      {checkoutOpen && (
        <Checkout
          cart={cart}
          onClose={() => setCheckoutOpen(false)}
          onSuccess={handleCheckoutSuccess}
          user={user}
        />
      )}
    </div>
  );
}

export default App;