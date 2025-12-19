import React, { useState, useEffect } from 'react';
import '../styles/CookieConsent.css';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Verificar si el usuario ya aceptó las cookies
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
      // Mostrar el banner después de un pequeño delay
      setTimeout(() => {
        setIsVisible(true);
      }, 1000);
    }
  }, []);

  const handleAccept = () => {
    // Guardar la aceptación en localStorage
    localStorage.setItem('cookieConsent', 'accepted');
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setIsVisible(false);
  };

  const handleReject = () => {
    // Guardar el rechazo en localStorage
    localStorage.setItem('cookieConsent', 'rejected');
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <>
      <div className="cookie-overlay" onClick={handleReject} />
      <div className="cookie-consent">
        <div className="cookie-content">
          <div className="cookie-icon">🍪</div>
          <div className="cookie-text">
            <h3>Utilizamos cookies</h3>
            <p>
              Usamos cookies propias y de terceros para mejorar tu experiencia de navegación,
              analizar el tráfico del sitio y personalizar el contenido. Al hacer clic en "Aceptar",
              consientes el uso de todas las cookies.
            </p>
          </div>
        </div>
        <div className="cookie-actions">
          <button className="cookie-btn cookie-btn-reject" onClick={handleReject}>
            Rechazar
          </button>
          <button className="cookie-btn cookie-btn-accept" onClick={handleAccept}>
            Aceptar
          </button>
        </div>
      </div>
    </>
  );
};

export default CookieConsent;
