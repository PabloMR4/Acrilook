import React from 'react';
import Logo from './Logo';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Logo y descripción */}
        <div className="footer-section footer-brand">
          <Logo variant="full" size="large" />
          <p className="footer-tagline">Tu tienda de Pendientes Acrílicos Online</p>
          <p className="footer-description">
            Descubre nuestra exclusiva colección de pendientes acrílicos artesanales.
            Diseños únicos, ligeros y modernos para lucir con estilo en cualquier ocasión.
          </p>
          <div className="footer-social">
            <a href="#" className="social-link" aria-label="Instagram">
              <span>📷</span>
            </a>
            <a href="#" className="social-link" aria-label="Facebook">
              <span>📘</span>
            </a>
            <a href="#" className="social-link" aria-label="Twitter">
              <span>🐦</span>
            </a>
            <a href="#" className="social-link" aria-label="WhatsApp">
              <span>💬</span>
            </a>
          </div>
        </div>

        {/* Información de contacto */}
        <div className="footer-section">
          <h3 className="footer-title">Contacto</h3>
          <ul className="footer-list">
            <li>
              <span className="footer-icon">📧</span>
              <a href="mailto:info@acrilook.es">info@acrilook.es</a>
            </li>
          </ul>
        </div>

        {/* Enlaces rápidos */}
        <div className="footer-section">
          <h3 className="footer-title">Enlaces Rápidos</h3>
          <ul className="footer-list">
            <li><a href="#productos">Productos</a></li>
            <li><a href="#ofertas">Ofertas</a></li>
            <li><a href="#novedades">Novedades</a></li>
            <li><a href="#marcas">Marcas</a></li>
            <li><a href="#sobre-nosotros">Sobre Nosotros</a></li>
          </ul>
        </div>

        {/* Información legal y servicios */}
        <div className="footer-section">
          <h3 className="footer-title">Servicios</h3>
          <ul className="footer-list">
            <li><a href="#envios">Envío Gratis +50€</a></li>
            <li><a href="#devoluciones">Devoluciones 30 días</a></li>
            <li><a href="#garantia">Garantía de calidad</a></li>
            <li><a href="#pago-seguro">Pago seguro</a></li>
            <li><a href="#privacidad">Política de Privacidad</a></li>
          </ul>
        </div>
      </div>

      {/* Línea divisora */}
      <div className="footer-divider"></div>

      {/* Bottom footer */}
      <div className="footer-bottom">
        <p className="footer-copyright">
          © 2024 AcriLook. Todos los derechos reservados.
        </p>
        <div className="footer-payments">
          <span className="payment-icon">💳</span>
          <span className="payment-icon">🏦</span>
          <span className="payment-icon">💰</span>
          <span className="payment-text">Pagos seguros</span>
        </div>
        <div className="footer-badges">
          <span className="badge">✅ Envío Rápido</span>
          <span className="badge">🔒 Compra Segura</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
