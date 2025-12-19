import React, { useState } from 'react';
import Acrispin from './Acrispin';
import '../styles/FloatingHelp.css';

const FloatingHelp = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleHelp = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="floating-help-container">
      {/* Panel expandido */}
      {isOpen && (
        <>
          <div className="help-overlay" onClick={toggleHelp} />
          <div className="help-panel">
            <div className="help-header">
              <div className="help-header-content">
                <Acrispin size="medium" animated={true} />
                <div className="help-header-text">
                  <h3>¡Hola! Soy Acrispin</h3>
                  <p>¿En qué puedo ayudarte?</p>
                </div>
              </div>
              <button className="help-close-btn" onClick={toggleHelp}>
                ×
              </button>
            </div>

            <div className="help-content">
              <div className="help-section">
                <h4>Contacto Rápido</h4>
                <a href="mailto:info@acrilook.es" className="help-option">
                  <span className="help-icon">📧</span>
                  <div className="help-option-text">
                    <strong>Email</strong>
                    <span>info@acrilook.es</span>
                  </div>
                </a>
              </div>

              <div className="help-section">
                <h4>Información</h4>
                <div className="help-option" onClick={() => {
                  setIsOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}>
                  <span className="help-icon">🛍️</span>
                  <div className="help-option-text">
                    <strong>Ver Productos</strong>
                    <span>Explora nuestra colección</span>
                  </div>
                </div>

                <div className="help-option">
                  <span className="help-icon">💎</span>
                  <div className="help-option-text">
                    <strong>Programa Acrispin</strong>
                    <span>Gana 1 Acrispin por cada €</span>
                  </div>
                </div>

                <div className="help-option">
                  <span className="help-icon">🚚</span>
                  <div className="help-option-text">
                    <strong>Envíos</strong>
                    <span>Gratis en compras +50€</span>
                  </div>
                </div>

                <div className="help-option">
                  <span className="help-icon">↩️</span>
                  <div className="help-option-text">
                    <strong>Devoluciones</strong>
                    <span>30 días de garantía</span>
                  </div>
                </div>
              </div>

              <div className="help-section">
                <h4>Recompensas Acrispin</h4>
                <div className="help-rewards">
                  <div className="reward-item">
                    <span className="reward-points">250</span>
                    <span className="reward-text">5% Descuento</span>
                  </div>
                  <div className="reward-item">
                    <span className="reward-points">400</span>
                    <span className="reward-text">Envío Gratis</span>
                  </div>
                  <div className="reward-item">
                    <span className="reward-points">500</span>
                    <span className="reward-text">10% Descuento</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="help-footer">
              <p>¿Tienes más preguntas? ¡Escríbenos!</p>
            </div>
          </div>
        </>
      )}

      {/* Botón flotante */}
      <button
        className={`help-button ${isOpen ? 'open' : ''}`}
        onClick={toggleHelp}
        aria-label="Ayuda"
      >
        {!isOpen && (
          <>
            <div className="help-button-acrispin">
              <Acrispin size="medium" animated={true} />
            </div>
            <div className="help-button-text">
              <span className="help-question">¿Necesitas ayuda?</span>
            </div>
          </>
        )}
      </button>
    </div>
  );
};

export default FloatingHelp;
