import React, { useEffect, useState } from 'react';
import '../styles/Hero.css';

const Hero = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  const scrollToProducts = () => {
    const productsSection = document.querySelector('.featured-section');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero" id="home">
      {/* Fondo animado con elementos flotantes */}
      <div className="hero-background">
        <div className="hero-gradient"></div>
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>
      </div>

      <div className="hero-grid">
        <div className={`hero-content ${visible ? 'visible' : ''}`}>
          {/* Badge superior */}
          <div className="hero-tag">
            <span className="tag-text">
              <span className="tag-emoji">✨</span>
              Colección 2025 - Gana Puntos
            </span>
          </div>

          <h1 className="hero-title">
            Transforma tu Estilo con
            <span className="hero-highlight"> Acrílico</span>
          </h1>

          <p className="hero-description">
            Diseños únicos, ligeros y modernos. Cada compra te hace ganar <strong>Puntos Acrispin</strong> para descuentos exclusivos. ¡1€ = 1 Acrispin!
          </p>

          {/* Features destacados */}
          <div className="hero-features">
            <div className="feature-badge">
              <span className="feature-icon">💎</span>
              <span className="feature-text">Calidad Premium</span>
            </div>
            <div className="feature-badge">
              <span className="feature-icon">🚚</span>
              <span className="feature-text">Envío 24h</span>
            </div>
            <div className="feature-badge">
              <span className="feature-icon">🎁</span>
              <span className="feature-text">Puntos Acrispin</span>
            </div>
          </div>

          <div className="hero-actions">
            <button className="hero-btn primary" onClick={scrollToProducts}>
              Explorar Colección
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
            <button className="hero-btn secondary" onClick={scrollToProducts}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              Ver Productos
            </button>
          </div>

          {/* Stats mejorados */}
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">100+</div>
              <div className="stat-label">Diseños Únicos</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number">500+</div>
              <div className="stat-label">Clientes Felices</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number">100%</div>
              <div className="stat-label">Artesanal</div>
            </div>
          </div>
        </div>

        {/* Visual mejorado con galería de productos */}
        <div className="hero-visual">
          <div className="hero-gallery">
            {/* Tarjeta principal */}
            <div className="gallery-card main-card">
              <div className="card-glow"></div>
              <div className="card-content-new">
                <div className="main-card-icon">💜</div>
                <h3 className="main-card-title">AcriLook</h3>
                <p className="main-card-subtitle">Diseños Únicos</p>
                <div className="card-badge">Nuevo</div>
              </div>
            </div>

            {/* Tarjetas secundarias */}
            <div className="gallery-card secondary-card card-1">
              <div className="mini-card-content">
                <div className="mini-icon">💎</div>
                <div className="mini-text">Calidad Premium</div>
              </div>
            </div>

            <div className="gallery-card secondary-card card-2">
              <div className="mini-card-content">
                <div className="mini-icon">🎨</div>
                <div className="mini-text">100% Artesanal</div>
              </div>
            </div>

            <div className="gallery-card secondary-card card-3">
              <div className="mini-card-content">
                <div className="mini-icon">✨</div>
                <div className="mini-text">Diseño Exclusivo</div>
              </div>
            </div>
          </div>

          {/* Elemento decorativo: círculo de puntos */}
          <div className="hero-decoration">
            <div className="decoration-circle"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
