import React from 'react';
import styles from './HeroSection.module.css';

const Hero = () => {
  return (
    <section
      className={styles.hero}
      style={{
        background:
          "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1000 1000\"><defs><radialGradient id=\"bg\" cx=\"50%\" cy=\"50%\" r=\"50%\"><stop offset=\"0%\" style=\"stop-color:%23d4af37;stop-opacity:0.1\"/><stop offset=\"100%\" style=\"stop-color:%23000000;stop-opacity:0.8\"/></radialGradient></defs><rect width=\"1000\" height=\"1000\" fill=\"url(%23bg)\"/></svg>')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className={styles.container}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>Premium Air Fresheners</h1>
          <p className={styles.subtitle}>
            Transform your space with our luxury collection of camphor and wood-infused air fresheners
          </p>
          <a
            href="#products"
            onClick={e => {
              e.preventDefault();
              document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className={styles.ctaButton}
          >
            Explore Collection
          </a>
        </div>
      </div>
  {/* styles moved to HeroSection.module.css */}
    </section>
  );
};

export default Hero;
