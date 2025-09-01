import React from 'react';
import { Star, Heart, ShoppingCart } from 'lucide-react';

const ProductCard = ({ product, onAddToCart, onViewProduct }) => {
  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  };

  const imageContainerStyle = {
    position: 'relative',
    height: '12rem',
    overflow: 'hidden'
  };

  const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  };

  const categoryBadgeStyle = {
    position: 'absolute',
    top: '0.75rem',
    left: '0.75rem',
    backgroundColor: '#FBBF24',
    color: '#111827',
    padding: '0.25rem 0.5rem',
    borderRadius: '0.25rem',
    fontSize: '0.875rem',
    fontWeight: '600'
  };

  const contentStyle = {
    padding: '1.5rem'
  };

  const titleStyle = {
    fontWeight: 'bold',
    fontSize: '1.125rem',
    marginBottom: '0.5rem',
    color: '#111827'
  };

  const scentStyle = {
    color: '#6B7280',
    fontSize: '0.875rem',
    marginBottom: '0.75rem'
  };

  const descriptionStyle = {
    color: '#6B7280',
    fontSize: '0.875rem',
    marginBottom: '1rem'
  };

  const bottomStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const priceStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#FBBF24'
  };

  const buttonStyle = {
    backgroundColor: '#FBBF24',
    color: '#111827',
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    border: 'none',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'background-color 0.3s ease'
  };

  const ratingStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '0.75rem',
    gap: '0.5rem'
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    onAddToCart(product);
  };

  return (
    <div style={cardStyle}>
      <div style={imageContainerStyle}>
        <img 
          src={product.images?.[0]?.src || '/images/placeholder.jpg'}
          alt={product.name}
          style={imageStyle}
          onClick={() => onViewProduct(product)}
        />
        {product.category && (
          <div style={categoryBadgeStyle}>
            {product.category}
          </div>
        )}
      </div>
      
      <div style={contentStyle}>
        <h3 style={titleStyle} onClick={() => onViewProduct(product)}>
          {product.name}
        </h3>
        
        {product.scent && (
          <p style={scentStyle}>{product.scent} Scent</p>
        )}
        
        {product.rating && (
          <div style={ratingStyle}>
            <div style={{display: 'flex'}}>
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={16}
                  fill={i < Math.floor(product.rating) ? '#FBBF24' : '#D1D5DB'}
                  color={i < Math.floor(product.rating) ? '#FBBF24' : '#D1D5DB'}
                />
              ))}
            </div>
            {product.reviewCount && (
              <span style={{fontSize: '0.875rem', color: '#6B7280'}}>({product.reviewCount})</span>
            )}
          </div>
        )}
        
        {product.description && (
          <p style={descriptionStyle}>{product.description}</p>
        )}
        
        <div style={bottomStyle}>
          <span style={priceStyle}>₹{product.price}</span>
          <button style={buttonStyle} onClick={handleAddToCart}>
            <ShoppingCart size={16} />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;