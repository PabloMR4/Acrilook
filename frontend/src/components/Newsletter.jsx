import React, { useState } from 'react';
import '../styles/Newsletter.css';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      setMessage({ type: 'error', text: 'Por favor, introduce un email válido' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('http://localhost:3002/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: 'success',
          text: `¡Bienvenido! Tu código de descuento ${data.codigo} ha sido enviado a tu email.`
        });
        setEmail('');
      } else {
        setMessage({ type: 'error', text: data.message || 'Error al suscribirse' });
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage({ type: 'error', text: 'Error de conexión. Inténtalo de nuevo.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="newsletter-section">
      <div className="newsletter-container">
        <div className="newsletter-content">
          <div className="newsletter-icon">
            <span>💎</span>
          </div>
          <div className="newsletter-text">
            <h2 className="newsletter-title">¡Suscríbete y Ahorra!</h2>
            <p className="newsletter-description">
              Recibe un <strong>10% de descuento</strong> en tu primera compra al suscribirte a nuestro newsletter
            </p>
          </div>
          <form className="newsletter-form" onSubmit={handleSubmit}>
            <div className="newsletter-input-wrapper">
              <input
                type="email"
                className="newsletter-input"
                placeholder="Tu correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
              <button
                type="submit"
                className="newsletter-button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-small"></span>
                    Enviando...
                  </>
                ) : (
                  <>
                    <span>Suscríbete</span>
                    <span className="button-arrow">→</span>
                  </>
                )}
              </button>
            </div>
            {message.text && (
              <div className={`newsletter-message ${message.type}`}>
                {message.type === 'success' ? '✅' : '❌'} {message.text}
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
