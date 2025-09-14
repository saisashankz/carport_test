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
import { Shield, Award, Clock, Star, Mail, ChevronDown } from 'lucide-react';
import './styles/App.css';

function App() {
  const [cart, setCart] = useState([]);
  const [firebaseStatus, setFirebaseStatus] = useState('testing');
  
  // Separate state for categories and fragrances
  const [categories, setCategories] = useState([]);
  const [fragrances, setFragrances] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [fragrancesLoading, setFragrancesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState(null);
  const [fragrancesError, setFragrancesError] = useState(null);
  
  // Selected fragrances for each category
  const [selectedFragrances, setSelectedFragrances] = useState({});
  
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

  // Test Firebase connection and load data
  useEffect(() => {
    console.log('Initializing CarPore...');
    
    try {
      const isConnected = testFirebaseConnection();
      if (isConnected) {
        setFirebaseStatus('connected');
        loadCategories();
        loadAllFragrances();
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

  // Load categories from Firebase
  
  const loadCategories = async () => {
    try {
      setCategoriesLoading(true);
      setCategoriesError(null);
      
      const fetchedCategories = await productService.getProductCategories();
      
      // DEBUG: Log the fetched categories to console
      console.log('🔍 DEBUG: Fetched categories:', fetchedCategories);
      console.log('🔍 DEBUG: Categories length:', fetchedCategories.length);
      
      // Check each category structure
      fetchedCategories.forEach((category, index) => {
        console.log(`🔍 DEBUG: Category ${index + 1}:`, {
          id: category.id,
          name: category.name,
          description: category.description,
          fragrances: category.fragrances,
          fragrancesCount: category.fragrances ? category.fragrances.length : 0
        });
        
        if (category.fragrances && Array.isArray(category.fragrances)) {
          console.log(`🔍 DEBUG: Category "${category.name}" fragrances:`, category.fragrances);
        } else {
          console.log(`❌ DEBUG: Category "${category.name}" has NO fragrances or invalid structure`);
        }
      });
      
      setCategories(fetchedCategories);
      
      // Initialize selected fragrances with first fragrance of each category
      const initialSelected = {};
      fetchedCategories.forEach(category => {
        if (category.fragrances && category.fragrances.length > 0) {
          initialSelected[category.id] = category.fragrances[0];
          console.log(`🔍 DEBUG: Setting initial fragrance for ${category.name}:`, category.fragrances[0]);
        } else {
          console.log(`❌ DEBUG: No fragrances found for category: ${category.name}`);
        }
      });
      
      console.log('🔍 DEBUG: Initial selected fragrances:', initialSelected);
      setSelectedFragrances(initialSelected);
      
    } catch (error) {
      console.error('❌ DEBUG: Failed to load categories:', error);
      setCategoriesError(error.message);
    } finally {
      setCategoriesLoading(false);
    }
  };


  // Load all fragrances from Firebase
  const loadAllFragrances = async () => {
    try {
      setFragrancesLoading(true);
      setFragrancesError(null);
      
      // Get all fragrances from all categories
      const allFragrances = [];
      
      // Try to get fragrances from Firebase
      const loadAllFragrances = async () => {
    try {
      setFragrancesLoading(true);
      setFragrancesError(null);
      
      console.log('🔍 DEBUG: Starting to load all fragrances...');
      
      // Get all fragrances from all categories
      const allFragrances = [];
      
      // Try to get fragrances from Firebase
      const fetchedCategories = await productService.getProductCategories();
      console.log('🔍 DEBUG: Fetched categories for fragrances:', fetchedCategories);
      
      fetchedCategories.forEach(category => {
        console.log(`🔍 DEBUG: Processing category "${category.name}" for fragrances...`);
        
        if (category.fragrances && Array.isArray(category.fragrances)) {
          console.log(`🔍 DEBUG: Found ${category.fragrances.length} fragrances in category "${category.name}"`);
          
          category.fragrances.forEach(fragrance => {
            const fragranceProduct = {
              ...fragrance,
              categoryName: category.name,
              categoryId: category.id,
              categoryImage: category.image,
              // Create a product-like object
              id: `${category.id}-${fragrance.id}`,
              name: fragrance.name,
              price: fragrance.price,
              description: fragrance.description,
              category: category.name,
              scent: fragrance.name,
              images: [{ src: category.image || '/images/placeholder.jpg' }],
              rating: fragrance.rating || 4.8,
              reviewCount: fragrance.reviewCount || Math.floor(Math.random() * 50) + 20,
              status: 'active'
            };
            
            allFragrances.push(fragranceProduct);
            console.log(`🔍 DEBUG: Added fragrance product:`, fragranceProduct);
          });
        } else {
          console.log(`❌ DEBUG: Category "${category.name}" has no fragrances or invalid structure`);
        }
      });
      
      console.log('🔍 DEBUG: Total fragrances created:', allFragrances.length);
      console.log('🔍 DEBUG: All fragrances:', allFragrances);
      
      setFragrances(allFragrances);
      
    } catch (error) {
      console.error('❌ DEBUG: Failed to load fragrances:', error);
      setFragrancesError(error.message);
    } finally {
      setFragrancesLoading(false);
    }
  };
      
      setFragrances(allFragrances);
      
    } catch (error) {
      console.error('Failed to load fragrances:', error);
      setFragrancesError(error.message);
    } finally {
      setFragrancesLoading(false);
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

  const handleFragranceSelect = (categoryId, fragrance) => {
    setSelectedFragrances(prev => ({
      ...prev,
      [categoryId]: fragrance
    }));
  };

  const handleAddCategoryProductToCart = (category) => {
    const selectedFragrance = selectedFragrances[category.id];
    if (!selectedFragrance) return;

    const product = {
      id: `${category.id}-${selectedFragrance.id}`,
      name: `${category.name} - ${selectedFragrance.name}`,
      price: selectedFragrance.price,
      description: selectedFragrance.description,
      category: category.name,
      scent: selectedFragrance.name,
      images: [{ src: category.image || '/images/placeholder.jpg' }],
      rating: selectedFragrance.rating || 4.8,
      reviewCount: selectedFragrance.reviewCount || Math.floor(Math.random() * 50) + 20
    };

    handleAddToCart(product);
  };

  const handleLoginClick = () => {
    if (user) {
      setUserDashboardOpen(true);
    } else {
      setAuthModalOpen(true);
    }
  };

  const handleDashboardLogout = async () => {
    await authService.logout();
    setUserDashboardOpen(false);
    
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

  const scrollToSection = (sectionId) => {
    if (sectionId === 'home' || sectionId === 'top') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
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
    <div className="app-container">
      <Header 
        cartCount={getCartCount()}
        onCartClick={handleCartClick}
        onLoginClick={handleLoginClick}
        user={user}
        userLoading={userLoading}
        onNavigate={scrollToSection}
      />

      <HeroSection />

      {/* Why Choose CarPore Section */}
      <section id="why-choose" className="section section-center">
        <div className="container">
          <h2 className="section-title">
            Why Choose <span className="section-title-accent">Carpore</span>
          </h2>
          <p className="section-subtitle">
            Experience the difference that premium quality and exceptional service makes in luxury home fragrance.
          </p>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">
                  {feature.icon}
                </div>
                <h3 className="feature-title">
                  {feature.title}
                </h3>
                <p className="feature-description">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section - Categories with Fragrance Dropdowns */}
      <section id="featured-products" className="section section-center">
        <div className="container">
          <h2 className="section-title">
            Featured <span className="section-title-accent">Categories</span>
          </h2>
          <p className="section-subtitle">
            Choose from our premium categories and select your favorite fragrance.
          </p>

          {categoriesLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <h3 className="loading-title">Loading Categories...</h3>
            </div>
          ) : categoriesError ? (
            <div className="error-container">
              <div className="error-box">
                <h3 className="error-title">Unable to Load Categories</h3>
                <p className="error-message">{categoriesError}</p>
                <button className="retry-button" onClick={loadCategories}>
                  Retry Loading
                </button>
              </div>
            </div>
          ) : categories.length === 0 ? (
            <div className="empty-container">
              <h3 className="empty-title">No Categories Available</h3>
              <p>We're currently updating our inventory. Please check back soon!</p>
            </div>
          ) : (
            <div className="categories-grid">
              {categories.map(category => (
                <div key={category.id} className="category-card">
                  <div className="category-image">
                    <img 
                      src={category.image || '/images/placeholder.jpg'}
                      alt={category.name}
                    />
                  </div>

                  <div className="category-info">
                    <h3 className="category-title">
                      {category.name}
                    </h3>
                    
                    <p className="category-description">
                      {category.description}
                    </p>
                  </div>

                  {category.fragrances && category.fragrances.length > 0 && (
                    <div className="fragrance-dropdown-container">
                      <label className="fragrance-dropdown-label">
                        Select Fragrance:
                      </label>
                      <div className="fragrance-dropdown-wrapper">
                        <select
                          className="fragrance-dropdown"
                          value={selectedFragrances[category.id]?.id || ''}
                          onChange={(e) => {
                            const selectedFragrance = category.fragrances.find(f => f.id === e.target.value);
                            if (selectedFragrance) {
                              handleFragranceSelect(category.id, selectedFragrance);
                            }
                          }}
                        >
                          {category.fragrances.map(fragrance => (
                            <option 
                              key={fragrance.id} 
                              value={fragrance.id}
                            >
                              {fragrance.name} - ₹{fragrance.price}
                            </option>
                          ))}
                        </select>
                        <ChevronDown size={20} className="dropdown-icon" />
                      </div>
                    </div>
                  )}

                  {selectedFragrances[category.id] && (
                    <div className="selected-fragrance-details">
                      <p className="selected-fragrance-description">
                        {selectedFragrances[category.id].description}
                      </p>
                      <p className="selected-fragrance-price">
                        ₹{selectedFragrances[category.id].price}
                      </p>
                    </div>
                  )}
                  
                  <button
                    className={`btn btn-primary btn-full-width ${!selectedFragrances[category.id] ? 'btn-disabled' : ''}`}
                    onClick={() => handleAddCategoryProductToCart(category)}
                    disabled={!selectedFragrances[category.id]}
                  >
                    🛒 Add to Cart
                  </button>
                </div>
              ))}
            </div>
          )}

          <button className="btn-secondary" onClick={() => scrollToSection('products')}>
            View All Fragrances
          </button>
        </div>
      </section>

      {/* All Products Section - Individual Fragrances */}
      <section id="products" className="section">
        <div className="container">
          <h2 className="section-title section-center">
            All Fragrances
          </h2>

          {fragrancesLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <h3 className="loading-title">Loading Fragrances...</h3>
              <p className="loading-subtitle">Please wait while we fetch our complete collection</p>
            </div>
          ) : fragrancesError ? (
            <div className="error-container">
              <div className="error-box">
                <h3 className="error-title">Unable to Load Fragrances</h3>
                <p className="error-message">{fragrancesError}</p>
                <button className="retry-button" onClick={loadAllFragrances}>
                  Retry Loading
                </button>
              </div>
            </div>
          ) : fragrances.length === 0 ? (
            <div className="empty-container">
              <h3 className="empty-title">No Fragrances Available</h3>
              <p>We're currently updating our fragrance collection. Please check back soon!</p>
            </div>
          ) : (
            <div className="fragrances-grid">
              {fragrances.map(fragrance => (
                <div key={fragrance.id} className="fragrance-card">
                  <div className="fragrance-card-glow"></div>

                  <div className="fragrance-image">
                    <img 
                      src={fragrance.images?.[0]?.src || '/images/placeholder.jpg'}
                      alt={fragrance.name}
                    />
                    {fragrance.category && (
                      <div className="fragrance-category-badge">
                        {fragrance.category}
                      </div>
                    )}
                  </div>

                  <div className="fragrance-info">
                    <h3 className="fragrance-title">
                      {fragrance.name}
                    </h3>
                    
                    {fragrance.scent && (
                      <p className="fragrance-scent">
                        {fragrance.scent} Fragrance
                      </p>
                    )}
                    
                    {fragrance.rating && (
                      <div className="fragrance-rating">
                        <div className="fragrance-stars">
                          {[...Array(5)].map((_, i) => (
                            <span 
                              key={i} 
                              className={`fragrance-star ${i < Math.floor(fragrance.rating) ? 'fragrance-star-filled' : 'fragrance-star-empty'}`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        {fragrance.reviewCount && (
                          <span className="fragrance-review-count">
                            ({fragrance.reviewCount})
                          </span>
                        )}
                      </div>
                    )}
                    
                    {fragrance.description && (
                      <p className="fragrance-description">
                        {fragrance.description}
                      </p>
                    )}
                    
                    <div className="fragrance-footer">
                      <span className="fragrance-price">
                        ₹{fragrance.price}
                      </span>
                      <button
                        className="btn btn-primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(fragrance);
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

          {cart.length > 0 && (
            <div className="cart-summary">
              <h3 className="cart-summary-title">
                🛒 Cart Summary
              </h3>
              <div className="cart-summary-details">
                <p className="cart-summary-count">
                  {getCartCount()} {getCartCount() === 1 ? 'item' : 'items'}
                </p>
                <p className="cart-summary-total">
                  ₹{getCartTotal().toFixed(2)}
                </p>
              </div>
              <button
                className="cart-summary-button"
                onClick={handleProceedToCheckout}
              >
                Proceed to Checkout →
              </button>
            </div>
          )}
        </div>
      </section>

      {/* About CarPore Section */}
      <section id="about" className="section">
        <div className="container">
          <h2 className="section-title section-center">
            About <span className="section-title-accent">CarPore</span>
          </h2>

          <div className="about-grid">
            <div>
              <h3 className="about-section-title">
                Our Story
              </h3>
              <p className="about-text">
                Founded by fragrance enthusiasts, CarPore began with a simple vision to bring luxury home fragrance to beautiful as they are effective. We believe that scent is a powerful part of your environment, and our products are designed to enhance your everyday living with a lasting impression.
              </p>

              <h4 className="about-subtitle">Our Values</h4>
              <ul className="about-list">
                <li> 100% natural, non-toxic ingredients</li>
                <li> Premium quality and craftsmanship</li>
                <li> Eco-friendly and sustainable practices</li>
                <li> Customer satisfaction guaranteed</li>
              </ul>
            </div>

            <div>
              <h3 className="about-section-title">
                Why Choose Us?
              </h3>
              <ul className="about-list">
                <li> Unique, sophisticated scents</li>
                <li> Long-lasting performance up to 60 days</li>
                <li> Premium packaging and presentation</li>
                <li> Elegant, modern designs</li>
                <li> Trusted by thousands of happy customers</li>
              </ul>

              <h4 className="about-subtitle">Contact</h4>
              <p className="about-contact">
                Have questions or want to collaborate?<br />
                Email us at <span className="about-contact-email">customersupport@carpore.com</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section">
        <div className="container">
          <h2 className="section-title section-center">
            What Our <span className="section-title-accent">Customers Say</span>
          </h2>
          <p className="section-subtitle">
            Join thousands of satisfied customers who have elevated their spaces with our premium fragrances.
          </p>

          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-stars">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="#D4AF37" color="#D4AF37" />
                  ))}
                </div>
                <p className="testimonial-text">
                  "{testimonial.text}"
                </p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <span className="testimonial-name">
                    {testimonial.name}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="testimonials-summary">
            <div className="testimonials-summary-stars">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} fill="#D4AF37" color="#D4AF37" />
              ))}
            </div>
            <span className="testimonials-summary-text">
              4.9/5 from 2,500+ reviews
            </span>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section id="contact" className="newsletter-section">
        <div className="newsletter-container">
          <div className="newsletter-icon">
            <Mail color="#D4AF37" size={28} />
          </div>

          <h2 className="newsletter-title">
            Stay Updated with Exclusive Offers
          </h2>
          
          <p className="newsletter-subtitle">
            Be the first to know about new fragrance collections, special deals, and exclusive member perks.
          </p>

          <form onSubmit={handleNewsletterSubmit} className="newsletter-form">
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="newsletter-input"
            />
            <button type="submit" className="newsletter-button">
              Subscribe →
            </button>
          </form>

          {newsletterStatus && (
            <p className="newsletter-status">
              {newsletterStatus}
            </p>
          )}
        </div>
      </section>
      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div>
              <h3 className="footer-brand-title">
                CARPORE
              </h3>
              <p className="footer-brand-description">
                Transform your spaces with premium luxury air fresheners crafted from the finest natural ingredients. Our mission is elevating everyday living with sophisticated scents.
              </p>
              <div className="footer-social">
                <span className="footer-social-icon">f</span>
                <span className="footer-social-icon">@</span>
                <span className="footer-social-icon">in</span>
              </div>
            </div>

            <div>
              <h4 className="footer-contact-title">
                Contact Us
              </h4>
              <div className="footer-contact-info">
                <p>📍 Carpore Industries, Pithapuram, Andhra Pradesh, 533450.</p>
                <p>📞 +91 96669 22228</p>
                <p>✉️  customersupport@carpore.com</p>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p className="footer-copyright">
              © 2024 CarPore. All rights reserved.
            </p>
            <div className="footer-links">
              <span className="footer-link">Privacy Policy</span>
              <span className="footer-link">Terms of Service</span>
              <span className="footer-link">Cookie Policy</span>
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
    </div>
  );
}

export default App;