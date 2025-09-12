import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import ProductCard from './components/ProductCard';
import AuthModal from './components/AuthModal';
import CartModal from './components/CartModal';
import Checkout from './components/Checkout';
import UserDashboard from './components/UserDashboard';
import { testFirebaseConnection } from './firebase';
import { productService } from './services/productService';
import { authService } from './services/authService';
import { Shield, Award, Clock, Star, Mail } from 'lucide-react';
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
  
  // Cart and Checkout state
  const [cartModalOpen, setCartModalOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  
  // User Dashboard state
  const [userDashboardOpen, setUserDashboardOpen] = useState(false);

  // Newsletter state
  const [email, setEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState('');

  // Test Firebase connection and load products
  useEffect(() => {
    console.log('Initializing CarPore...');
    
    try {
      const isConnected = testFirebaseConnection();
      if (isConnected) {
        setFirebaseStatus('connected');
        loadProducts();
      } else {
        setFirebaseStatus('failed');
        console.log('Firebase connection failed');
      }
    } catch (error) {
      console.error('Firebase connection error:', error);
      setFirebaseStatus('error');
    }
  }, []);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange((user) => {
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
      
    } catch (error) {
      console.error('Failed to load products:', error);
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
    
    // Show notification
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed; top: 100px; right: 20px; z-index: 1000;
      background: #10B981; color: white; padding: 1rem 1.5rem;
      border-radius: 0.5rem; box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      font-weight: 600; animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = `${product.name} added to cart!`;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 3000);
  };

  const handleLoginClick = () => {
    if (user) {
      // If user is logged in, show dashboard
      setUserDashboardOpen(true);
    } else {
      setAuthModalOpen(true);
    }
  };

  const handleDashboardLogout = async () => {
    await authService.logout();
    setUserDashboardOpen(false);
    
    // Show logout notification
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed; top: 100px; right: 20px; z-index: 1000;
      background: #EF4444; color: white; padding: 1rem 1.5rem;
      border-radius: 0.5rem; box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      font-weight: 600; animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = 'Successfully logged out!';
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 3000);
  };

  const handleCartClick = () => {
    setCartModalOpen(true);
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    
    setCart(prev => 
      prev.map(item =>
        item.id === productId 
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const handleRemoveItem = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const handleProceedToCheckout = () => {
    if (!user) {
      setCartModalOpen(false);
      alert('Please login to proceed to checkout');
      setAuthModalOpen(true);
      return;
    }
    
    setCartModalOpen(false);
    setCheckoutOpen(true);
  };

  const handleAuthSuccess = (user) => {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed; top: 100px; right: 20px; z-index: 1000;
      background: #FBBF24; color: #111827; padding: 1rem 1.5rem;
      border-radius: 0.5rem; box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      font-weight: 600;
    `;
    notification.textContent = `Welcome ${user.displayName || user.email}!`;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 3000);
  };

  const handleCheckoutSuccess = (order) => {
    console.log('Order completed:', order);
    setCart([]);
    
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
      z-index: 1000; 
      background: linear-gradient(135deg, rgba(0, 0, 0, 0.95), rgba(26, 26, 26, 0.95));
      backdrop-filter: blur(20px);
      border: 1px solid rgba(212, 175, 55, 0.4);
      border-radius: 20px;
      padding: 2.5rem; 
      text-align: center;
      max-width: 450px; width: 90%;
      color: #ffffff;
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
    `;
    notification.innerHTML = `
      <div style="
        width: 80px; height: 80px; 
        background: linear-gradient(45deg, #D4AF37, #F4D03F);
        border-radius: 50%; 
        display: flex; align-items: center; justify-content: center;
        margin: 0 auto 1.5rem; font-size: 2rem;
      ">🎉</div>
      <h3 style="color: #D4AF37; margin-bottom: 1rem; font-size: 1.5rem; font-weight: 600;">
        Order Placed Successfully!
      </h3>
      <p style="margin-bottom: 1rem; color: rgba(255, 255, 255, 0.8); line-height: 1.6;">
        Thank you for your purchase! Your order has been confirmed.
      </p>
      <div style="
        background: rgba(212, 175, 55, 0.1); 
        border: 1px solid rgba(212, 175, 55, 0.3);
        border-radius: 12px; padding: 1rem; margin-bottom: 1.5rem;
      ">
        <p style="margin-bottom: 0.5rem; font-weight: 600; color: #ffffff;">
          Order Number: <span style="color: #D4AF37;">${order.orderNumber}</span>
        </p>
        <p style="font-size: 0.9rem; color: rgba(255, 255, 255, 0.7);">
          You will receive a confirmation email shortly
        </p>
      </div>
      <button onclick="this.parentElement.remove()" 
              style="
                background: linear-gradient(45deg, #D4AF37, #F4D03F);
                color: #000000; border: none; 
                padding: 0.75rem 2rem; border-radius: 50px; 
                font-weight: 600; cursor: pointer; font-size: 1rem;
                transition: all 0.3s ease;
              "
              onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px rgba(212, 175, 55, 0.4)';"
              onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';">
        Continue Shopping
      </button>
    `;
    document.body.appendChild(notification);
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setNewsletterStatus('Thank you for subscribing!');
      setEmail('');
      setTimeout(() => setNewsletterStatus(''), 3000);
    }
  };

  const handleExploreClick = () => {
    document.getElementById('why-choose')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToSection = (sectionId) => {
  if (sectionId === 'home' || sectionId === 'top') {
    // Scroll to top of page
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  } else {
    // Scroll to specific section
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
};

  const getCartCount = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getCartTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  // Sample data for sections
  const features = [
    {
      icon: <Shield size={32} />,
      title: "100% Natural Ingredients",
      description: "Our air fresheners are crafted with only the finest natural essential oils and organic extracts for a pure and safe experience."
    },
    {
      icon: <Award size={32} />,
      title: "Premium Quality Guarantee",
      description: "Every product undergoes rigorous quality testing to meet our luxury standards. We stand behind our promise with a 30-day satisfaction guarantee."
    },
    {
      icon: <Clock size={32} />,
      title: "Long-Lasting Performance",
      description: "Advanced time-release technology ensures your favorite scents last up to 60 days, delivering consistent fragrance throughout."
    }
  ];

  const testimonials = [
    {
      name: "Ragam Jay",
      rating: 5,
      text: "AuraCampfit has completely transformed how I approach home fragrance for my clients. The quality is unmatched and the scents are so sophisticated. My clients always ask about what makes their spaces smell like their favorite boutique!"
    },
    {
      name: "B Rohit",
      rating: 5,
      text: "We've been using AuraCampfit products in our hotel for over three months. The consistency and longevity of their fragrances is exceptional. Guests frequently complement our hotel's unique scent."
    },
    {
      name: "Sindhu D",
      rating: 5,
      text: "I'm extremely particular about scents, and AuraCampfit is the only brand I trust. The Vanilla is not a cloyouly-sweet scent - it creates such a warm, welcoming atmosphere in our home. Worth every penny!"
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: `
        radial-gradient(ellipse at center, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.05) 30%, transparent 70%),
        radial-gradient(ellipse at center, #1a1a1a 0%, #0d0d0d 70%, #000000 100%)
      `,
      color: '#ffffff'
    }}>
      <Header 
        cartCount={getCartCount()}
        onCartClick={handleCartClick}
        onLoginClick={handleLoginClick}
        user={user}
        userLoading={userLoading}
        onNavigate={scrollToSection}
      />

      {/* Hero Section */}
      <HeroSection />

      {/* Why Choose CarPore Section */}
      <section id="why-choose" style={{
        padding: '6rem 0',
        backgroundColor: 'transparent',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: '600',
            marginBottom: '1rem',
            color: '#ffffff'
          }}>
            Why Choose <span style={{color: '#D4AF37'}}>Carpore</span>
          </h2>
          <p style={{
            fontSize: '1.125rem',
            color: 'rgba(255, 255, 255, 0.8)',
            marginBottom: '4rem',
            maxWidth: '600px',
            margin: '0 auto 4rem'
          }}>
            Experience the difference that premium quality and exceptional service makes in luxury home fragrance.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '3rem',
            marginTop: '3rem'
          }}>
            {features.map((feature, index) => (
              <div key={index} style={{
                padding: '2rem',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  backgroundColor: '#D4AF37',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem',
                  color: '#000000'
                }}>
                  {feature.icon}
                </div>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  marginBottom: '1rem',
                  color: '#ffffff'
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  lineHeight: '1.6'
                }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section id="featured-products" style={{
        padding: '6rem 0',
        backgroundColor: 'transparent',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: '600',
            marginBottom: '1rem',
            color: '#ffffff'
          }}>
            Featured <span style={{color: '#D4AF37'}}>Products</span>
          </h2>
          <p style={{
            fontSize: '1.125rem',
            color: 'rgba(255, 255, 255, 0.8)',
            marginBottom: '3rem',
            maxWidth: '600px',
            margin: '0 auto 3rem'
          }}>
            Discover our handpicked selection of premium air fresheners, each crafted with meticulous attention to detail.
          </p>

          <button 
            onClick={() => scrollToSection('products')}
            style={{
              background: 'linear-gradient(45deg, #D4AF37, #F4D03F)',
              color: '#000000',
              border: 'none',
              padding: '0.75rem 2rem',
              fontSize: '1rem',
              fontWeight: '600',
              borderRadius: '50px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              marginBottom: '4rem'
            }}
          >
            View All Products
          </button>
        </div>
      </section>

      {/* All Products Section */}
      <section id="products" style={{ 
        padding: '6rem 0',
        backgroundColor: 'transparent',
        color: '#ffffff'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: '600',
            marginBottom: '3rem',
            textAlign: 'center',
            color: '#ffffff'
          }}>
            All Products
          </h2>

          {productsLoading ? (
            <div style={{textAlign: 'center', padding: '4rem 2rem'}}>
              <div style={{
                width: '3rem',
                height: '3rem',
                border: '4px solid #e5e5e5',
                borderTop: '4px solid #D4AF37',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 2rem'
              }}></div>
              <h3 style={{fontSize: '1.5rem', marginBottom: '1rem', color: '#D4AF37'}}>Loading Products...</h3>
              <p style={{color: 'rgba(255,255,255,0.8)'}}>Please wait while we fetch our latest collection</p>
              <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
          ) : productsError ? (
            <div style={{textAlign: 'center', padding: '4rem 2rem'}}>
              <div style={{
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#EF4444',
                padding: '2rem',
                borderRadius: '1rem',
                maxWidth: '500px',
                margin: '0 auto'
              }}>
                <h3 style={{marginBottom: '1rem'}}>Unable to Load Products</h3>
                <p style={{marginBottom: '1.5rem'}}>{productsError}</p>
                <button 
                  onClick={loadProducts}
                  style={{
                    backgroundColor: '#D4AF37',
                    color: '#000000',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '50px',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Retry Loading
                </button>
              </div>
            </div>
          ) : products.length === 0 ? (
            <div style={{textAlign: 'center', color: 'rgba(255,255,255,0.7)', padding: '4rem 2rem'}}>
              <h3 style={{fontSize: '1.5rem', marginBottom: '1rem', color: '#D4AF37'}}>No Products Available</h3>
              <p>We're currently updating our inventory. Please check back soon!</p>
            </div>
          ) : (
            <div style={{
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
              gap: '2rem',
              padding: '2rem 0'
            }}>
              {products.map(product => (
                <div
                  key={product.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '20px',
                    padding: '1.5rem',
                    border: '1px solid rgba(212, 175, 55, 0.2)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-10px)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(212, 175, 55, 0.2)';
                    e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
                    e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.2)';
                  }}
                >
                  {/* Floating glow effect */}
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

                  {/* Product Image */}
                  <div style={{
                    position: 'relative',
                    height: '200px',
                    borderRadius: '15px',
                    overflow: 'hidden',
                    marginBottom: '1.5rem',
                    background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(212, 175, 55, 0.05))'
                  }}>
                    <img 
                      src={product.images?.[0]?.src || '/images/placeholder.jpg'}
                      alt={product.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '15px'
                      }}
                    />
                    {product.category && (
                      <div style={{
                        position: 'absolute',
                        top: '1rem',
                        left: '1rem',
                        backgroundColor: 'rgba(212, 175, 55, 0.9)',
                        color: '#000000',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        backdropFilter: 'blur(10px)'
                      }}>
                        {product.category}
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div style={{ position: 'relative', zIndex: 2 }}>
                    <h3 style={{
                      fontSize: '1.25rem',
                      fontWeight: '600',
                      marginBottom: '0.5rem',
                      color: '#ffffff'
                    }}>
                      {product.name}
                    </h3>
                    
                    {product.scent && (
                      <p style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '0.9rem',
                        marginBottom: '0.75rem'
                      }}>
                        {product.scent} Scent
                      </p>
                    )}
                    
                    {product.rating && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '1rem'
                      }}>
                        <div style={{ display: 'flex' }}>
                          {[...Array(5)].map((_, i) => (
                            <span key={i} style={{
                              color: i < Math.floor(product.rating) ? '#D4AF37' : 'rgba(255,255,255,0.3)',
                              fontSize: '1rem'
                            }}>
                              ★
                            </span>
                          ))}
                        </div>
                        {product.reviewCount && (
                          <span style={{
                            fontSize: '0.85rem',
                            color: 'rgba(255, 255, 255, 0.6)'
                          }}>
                            ({product.reviewCount})
                          </span>
                        )}
                      </div>
                    )}
                    
                    {product.description && (
                      <p style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '0.9rem',
                        lineHeight: '1.4',
                        marginBottom: '1.5rem'
                      }}>
                        {product.description}
                      </p>
                    )}
                    
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        color: '#D4AF37'
                      }}>
                        ₹{product.price}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                        style={{
                          background: 'linear-gradient(45deg, #D4AF37, #F4D03F)',
                          color: '#000000',
                          padding: '0.75rem 1.5rem',
                          borderRadius: '25px',
                          border: 'none',
                          fontWeight: '600',
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                          transition: 'all 0.3s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}
                        onMouseOver={(e) => {
                          e.target.style.transform = 'scale(1.05)';
                          e.target.style.boxShadow = '0 5px 15px rgba(212, 175, 55, 0.4)';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.transform = 'scale(1)';
                          e.target.style.boxShadow = 'none';
                        }}
                      >
                        🛒 Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Cart Summary */}
          {cart.length > 0 && (
            <div style={{
              marginTop: '4rem',
              padding: '2rem',
              backgroundColor: 'rgba(212, 175, 55, 0.08)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              borderRadius: '20px',
              textAlign: 'center',
              maxWidth: '500px',
              margin: '4rem auto 0'
            }}>
              <h3 style={{color: '#D4AF37', marginBottom: '1rem', fontSize: '1.5rem'}}>
                🛒 Cart Summary
              </h3>
              <div style={{marginBottom: '1.5rem'}}>
                <p style={{fontSize: '1.125rem', marginBottom: '0.5rem', color: '#fff'}}>
                  {getCartCount()} {getCartCount() === 1 ? 'item' : 'items'}
                </p>
                <p style={{fontSize: '2rem', fontWeight: 'bold', color: '#D4AF37'}}>
                  ₹{getCartTotal().toFixed(2)}
                </p>
              </div>
              <button
                onClick={handleProceedToCheckout}
                style={{
                  background: 'linear-gradient(45deg, #D4AF37, #F4D03F)',
                  color: '#000000',
                  padding: '1rem 2rem',
                  borderRadius: '50px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '1.125rem',
                  width: '100%',
                  transition: 'transform 0.2s ease'
                }}
                onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
              >
                Proceed to Checkout →
              </button>
            </div>
          )}
        </div>
      </section>

      {/* About CarPore Section */}
      <section id="about" style={{
        padding: '6rem 0',
        backgroundColor: 'transparent'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: '600',
            marginBottom: '3rem',
            textAlign: 'center',
            color: '#ffffff'
          }}>
            About <span style={{color: '#D4AF37'}}>CarPore</span>
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '4rem',
            alignItems: 'start'
          }}>
            <div>
              <h3 style={{
                color: '#D4AF37',
                fontSize: '1.5rem',
                marginBottom: '1rem'
              }}>
                Our Story
              </h3>
              <p style={{
                color: 'rgba(255, 255, 255, 0.8)',
                lineHeight: '1.6',
                marginBottom: '2rem'
              }}>
                Founded by fragrance enthusiasts, CarPore began with a simple vision to bring luxury home fragrance to beautiful as they are effective. We believe that scent is a powerful part of your environment, and our products are designed to enhance your everyday living with a lasting impression.
              </p>

              <h4 style={{ color: '#ffffff', marginBottom: '1rem' }}>Our Values</h4>
              <ul style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.8' }}>
                <li> 100% natural, non-toxic ingredients</li>
                <li> Premium quality and craftsmanship</li>
                <li> Eco-friendly and sustainable practices</li>
                <li> Customer satisfaction guaranteed</li>
              </ul>
            </div>

            <div>
              <h3 style={{
                color: '#D4AF37',
                fontSize: '1.5rem',
                marginBottom: '1rem'
              }}>
                Why Choose Us?
              </h3>
              <ul style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.8', marginBottom: '2rem' }}>
                <li> Unique, sophisticated scents</li>
                <li> Long-lasting performance up to 60 days</li>
                <li> Premium packaging and presentation</li>
                <li> Elegant, modern designs</li>
                <li> Trusted by thousands of happy customers</li>
              </ul>

              <h4 style={{ color: '#ffffff', marginBottom: '1rem' }}>Contact</h4>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Have questions or want to collaborate?<br />
                Email us at <span style={{ color: '#D4AF37' }}>customersupport@carpore.com</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section style={{
        padding: '6rem 0',
        backgroundColor: 'transparent'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: '600',
            marginBottom: '1rem',
            textAlign: 'center',
            color: '#ffffff'
          }}>
            What Our <span style={{color: '#D4AF37'}}>Customers Say</span>
          </h2>
          <p style={{
            fontSize: '1.125rem',
            color: 'rgba(255, 255, 255, 0.8)',
            marginBottom: '4rem',
            textAlign: 'center'
          }}>
            Join thousands of satisfied customers who have elevated their spaces with our premium fragrances.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '2rem',
            marginBottom: '3rem'
          }}>
            {testimonials.map((testimonial, index) => (
              <div key={index} style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                padding: '2rem',
                borderRadius: '1rem',
                border: '1px solid rgba(212, 175, 55, 0.1)'
              }}>
                <div style={{
                  display: 'flex',
                  marginBottom: '1rem'
                }}>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="#D4AF37" color="#D4AF37" />
                  ))}
                </div>
                <p style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontStyle: 'italic',
                  lineHeight: '1.6',
                  marginBottom: '1.5rem'
                }}>
                  "{testimonial.text}"
                </p>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#D4AF37',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#000000',
                    fontWeight: '600'
                  }}>
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <span style={{ color: '#ffffff', fontWeight: '600' }}>
                    {testimonial.name}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div style={{
            textAlign: 'center',
            padding: '2rem',
            backgroundColor: 'rgba(212, 175, 55, 0.1)',
            borderRadius: '1rem',
            border: '1px solid rgba(212, 175, 55, 0.2)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '0.5rem'
            }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} fill="#D4AF37" color="#D4AF37" />
              ))}
            </div>
            <span style={{
              color: '#ffffff',
              fontWeight: '600',
              fontSize: '1.125rem'
            }}>
              4.9/5 from 2,500+ reviews
            </span>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section id="contact" style={{
        padding: '4rem 0',
        background: 'linear-gradient(135deg, #D4AF37, #F4D03F)',
        color: '#000000',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: '#000000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 2rem'
          }}>
            <Mail color="#D4AF37" size={28} />
          </div>

          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: '600',
            marginBottom: '1rem'
          }}>
            Stay Updated with Exclusive Offers
          </h2>
          
          <p style={{
            fontSize: '1.125rem',
            marginBottom: '2.5rem',
            opacity: 0.8,
            maxWidth: '500px',
            margin: '0 auto 2.5rem'
          }}>
            Be the first to know about new fragrance collections, special deals, and exclusive member perks.
          </p>

          <form onSubmit={handleNewsletterSubmit} style={{
            display: 'flex',
            maxWidth: '500px',
            margin: '0 auto',
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                flex: '1',
                minWidth: '250px',
                padding: '1rem 1.5rem',
                border: 'none',
                borderRadius: '50px',
                fontSize: '1rem',
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                color: '#000000'
              }}
            />
            <button
              type="submit"
              style={{
                background: '#000000',
                color: '#D4AF37',
                border: 'none',
                padding: '1rem 2rem',
                borderRadius: '50px',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '1rem',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#1a1a1a';
              }}
              onMouseOut={(e) => {
                e.target.style.background = '#000000';
              }}
            >
              Subscribe →
            </button>
          </form>

          {newsletterStatus && (
            <p style={{
              marginTop: '1rem',
              color: '#000000',
              fontWeight: '600'
            }}>
              {newsletterStatus}
            </p>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#0d1117',
        color: '#ffffff',
        padding: '3rem 0 1rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '3rem',
            marginBottom: '2rem'
          }}>
            {/* Brand Section */}
            <div>
              <h3 style={{
                color: '#D4AF37',
                fontSize: '1.8rem',
                fontWeight: '700',
                marginBottom: '1rem',
                letterSpacing: '0.1em'
              }}>
                CARPORE
              </h3>
              <p style={{
                color: 'rgba(255, 255, 255, 0.8)',
                lineHeight: '1.6',
                marginBottom: '1.5rem'
              }}>
                Transform your spaces with premium luxury air fresheners crafted from the finest natural ingredients. Our mission is elevating everyday living with sophisticated scents.
              </p>
              <div style={{
                display: 'flex',
                gap: '1rem'
              }}>
                <span style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(212, 175, 55, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#D4AF37';
                  e.target.style.color = '#000000';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = 'rgba(212, 175, 55, 0.1)';
                  e.target.style.color = '#ffffff';
                }}>
                  f
                </span>
                <span style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(212, 175, 55, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#D4AF37';
                  e.target.style.color = '#000000';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = 'rgba(212, 175, 55, 0.1)';
                  e.target.style.color = '#ffffff';
                }}>
                  @
                </span>
                <span style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(212, 175, 55, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#D4AF37';
                  e.target.style.color = '#000000';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = 'rgba(212, 175, 55, 0.1)';
                  e.target.style.color = '#ffffff';
                }}>
                  in
                </span>
              </div>
            </div>

            {/* Contact Section */}
            <div>
              <h4 style={{
                color: '#ffffff',
                fontSize: '1.2rem',
                marginBottom: '1rem'
              }}>
                Contact Us
              </h4>
              <div style={{
                color: 'rgba(255, 255, 255, 0.8)',
                lineHeight: '1.8'
              }}>
                <p style={{ marginBottom: '0.5rem' }}>
                  📍 Carpore Industries, Pithapuram, Andhra Pradesh, 533450.
                </p>
                <p style={{ marginBottom: '0.5rem' }}>
                  📞 +91 96669 22228
                </p>
                <p style={{ marginBottom: '0.5rem' }}>
                  ✉️  customersupport@carpore.com
                </p>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <p style={{
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '0.875rem'
            }}>
              © 2024 CarPore. All rights reserved.
            </p>
            <div style={{
              display: 'flex',
              gap: '2rem',
              flexWrap: 'wrap'
            }}>
              <span style={{
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'color 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.color = '#D4AF37'}
              onMouseOut={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.6)'}>
                Privacy Policy
              </span>
              <span style={{
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'color 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.color = '#D4AF37'}
              onMouseOut={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.6)'}>
                Terms of Service
              </span>
              <span style={{
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'color 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.color = '#D4AF37'}
              onMouseOut={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.6)'}>
                Cookie Policy
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Cart Modal */}
      <CartModal 
        isOpen={cartModalOpen}
        onClose={() => setCartModalOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={handleProceedToCheckout}
      />

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

      {/* User Dashboard Modal */}
      <UserDashboard 
        isOpen={userDashboardOpen}
        onClose={() => setUserDashboardOpen(false)}
        user={user}
        onLogout={handleDashboardLogout}
      />

      {/* Scroll animations */}
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        html {
          scroll-behavior: smooth;
        }
        
        section {
          scroll-margin-top: 100px;
        }
      `}</style>
    </div>
  );
}

export default App;