import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { crearPedido } from '../services/api';
import StripeCheckout from './StripeCheckout';
import PayPalCheckout from './PayPalCheckout';
import Acrispin from './Acrispin';
import '../styles/Checkout.css';

const Checkout = ({ onClose }) => {
  const { cartItems, getCartTotal, getSubtotal, getShippingCost, isFreeShipping, clearCart, cuponAplicado, descuentoCupon } = useCart();
  const { isAuthenticated, user, getPerfil } = useAuth();
  const [step, setStep] = useState(1); // 1: Datos, 2: Pago, 3: Confirmación
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    provincia: '',
    codigoPostal: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [descuentoPedido, setDescuentoPedido] = useState(null);
  const [descuentos, setDescuentos] = useState([]);
  const [pedidoId, setPedidoId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('stripe'); // stripe, paypal, klarna

  // Cargar datos del usuario si está autenticado
  useEffect(() => {
    const loadUserData = async () => {
      if (isAuthenticated) {
        const perfil = await getPerfil();
        if (perfil) {
          setFormData({
            nombre: perfil.nombre || '',
            email: perfil.email || '',
            telefono: perfil.telefono || '',
            direccion: perfil.direccion || '',
            ciudad: perfil.ciudad || '',
            provincia: perfil.provincia || '',
            codigoPostal: perfil.codigoPostal || '',
          });
        }
      }
    };
    loadUserData();
  }, [isAuthenticated, getPerfil]);

  // Cargar descuentos al montar el componente
  useEffect(() => {
    const fetchDescuentos = async () => {
      try {
        const response = await fetch('/api/descuentos');
        const data = await response.json();
        setDescuentos(data);
      } catch (error) {
        console.error('Error al cargar descuentos:', error);
      }
    };
    fetchDescuentos();
  }, []);

  // Calcular descuento aplicable basado en el monto del pedido
  useEffect(() => {
    const calcularDescuentoPedido = () => {
      const subtotal = getSubtotal();
      const ahora = new Date();

      const descuentosAplicables = descuentos.filter(descuento => {
        if (!descuento.activo || descuento.tipo !== 'pedido') return false;
        if (descuento.fechaInicio && new Date(descuento.fechaInicio) > ahora) return false;
        if (descuento.fechaFin && new Date(descuento.fechaFin) < ahora) return false;
        if (!descuento.montoMinimo || subtotal < descuento.montoMinimo) return false;
        return true;
      });

      if (descuentosAplicables.length === 0) {
        setDescuentoPedido(null);
        return;
      }

      const mejorDescuento = descuentosAplicables.reduce((max, desc) => {
        if (desc.montoMinimo > (max.montoMinimo || 0)) return desc;
        if (desc.montoMinimo < (max.montoMinimo || 0)) return max;
        return (desc.porcentaje || 0) > (max.porcentaje || 0) ? desc : max;
      });

      setDescuentoPedido(mejorDescuento);
    };

    if (descuentos.length > 0) {
      calcularDescuentoPedido();
    }
  }, [descuentos, cartItems, getSubtotal]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const calcularTotalFinal = () => {
    const subtotal = getSubtotal();
    let total = subtotal;

    // Aplicar descuento de cupón del carrito (si existe)
    if (descuentoCupon > 0) {
      total = total - descuentoCupon;
    }

    // Aplicar descuento de pedido si existe
    if (descuentoPedido && descuentoPedido.tipoBeneficio === 'descuento') {
      const descuento = total * (descuentoPedido.porcentaje / 100);
      total = total - descuento;
    }

    // Calcular costo de envío
    // Envío gratis si: 1) Ya cumple el mínimo (€50+) o 2) Hay descuento de envío gratis del pedido
    const envioGratis = isFreeShipping() || (descuentoPedido && descuentoPedido.tipoBeneficio === 'envio_gratis');
    const costoEnvio = envioGratis ? 0 : getShippingCost();

    total += costoEnvio;

    return Math.max(0, total); // No permitir totales negativos
  };

  const handleContinueToPago = (e) => {
    e.preventDefault();
    setError('');

    // Validar datos
    if (!formData.nombre || !formData.email || !formData.direccion || !formData.ciudad) {
      setError('Por favor completa todos los campos requeridos');
      return;
    }

    setStep(2);
  };

  const handlePaymentSuccess = async (paymentId) => {
    setLoading(true);
    setError('');

    try {
      const pedidoData = {
        items: cartItems.map(item => ({
          id: item.id,
          nombre: item.nombre,
          precio: item.precio,
          cantidad: item.cantidad,
          talla: item.talla,
          descuento: item.descuento || null,
        })),
        total: calcularTotalFinal(),
        cliente: formData,
        paymentMethod: paymentMethod,
        paymentIntentId: paymentMethod === 'stripe' || paymentMethod === 'klarna' ? paymentId : null,
        paypalOrderId: paymentMethod === 'paypal' ? paymentId : null,
        cuponAplicado: cuponAplicado ? {
          id: cuponAplicado.id,
          codigo: cuponAplicado.codigo,
          nombre: cuponAplicado.nombre,
          descuento: descuentoCupon
        } : null,
        descuentoPedido: descuentoPedido ? {
          id: descuentoPedido.id,
          nombre: descuentoPedido.nombre,
          tipoBeneficio: descuentoPedido.tipoBeneficio,
          porcentaje: descuentoPedido.porcentaje || 0,
          montoMinimo: descuentoPedido.montoMinimo
        } : null,
      };

      const pedido = await crearPedido(pedidoData);
      setPedidoId(pedido.id);
      setSuccess(true);
      clearCart();

      setTimeout(() => {
        onClose();
      }, 5000);
    } catch (err) {
      setError('Error al procesar el pedido. Por favor, contacta con soporte.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentError = (errorMsg) => {
    setError(errorMsg);
  };

  if (success) {
    return (
      <div className="checkout-modal">
        <div className="checkout-overlay" onClick={onClose} />
        <div className="checkout-content success-message">
          <div className="success-celebration">
            <Acrispin
              size="xlarge"
              animated={true}
              showDialogue={true}
              dialogueMessage="¡Pedido completado! 🎉 ¡Gracias por tu compra! 💜"
              dialogueAutoChange={false}
            />
          </div>
          <div className="success-icon">✓</div>
          <h2>¡Pedido Realizado!</h2>
          <p>Tu pedido ha sido procesado correctamente.</p>
          <p className="order-number">Número de pedido: #{pedidoId}</p>
          <p className="order-email">
            Recibirás un email de confirmación en: {formData.email}
          </p>
          <button onClick={onClose} className="close-success-btn">
            Continuar Comprando
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-modal">
      <div className="checkout-overlay" onClick={onClose} />
      <div className="checkout-content">
        <button className="checkout-close-btn" onClick={onClose}>
          ×
        </button>

        <h2>Finalizar Compra</h2>

        {/* Indicador de pasos */}
        <div className="checkout-steps">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-label">Datos</div>
          </div>
          <div className="step-divider"></div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-label">Pago</div>
          </div>
        </div>

        {/* Resumen siempre visible */}
        <div className="checkout-summary">
          <h3>Resumen del Pedido</h3>
          <div className="summary-items">
            {cartItems.map((item) => {
              const precioFinal = item.descuento ? item.descuento.precioConDescuento : item.precio;
              return (
                <div key={`${item.id}-${item.talla}`} className="summary-item">
                  <span>
                    {item.nombre} (Talla: {item.talla}) x {item.cantidad}
                  </span>
                  <span>€{(precioFinal * item.cantidad).toFixed(2)}</span>
                </div>
              );
            })}
          </div>
          <div className="summary-subtotal">
            <span>Subtotal:</span>
            <span>€{getSubtotal().toFixed(2)}</span>
          </div>
          {descuentoCupon > 0 && cuponAplicado && (
            <div className="summary-discount">
              <span>✓ Cupón: {cuponAplicado.codigo}</span>
              <span style={{ color: '#4caf50' }}>
                -€{descuentoCupon.toFixed(2)}
              </span>
            </div>
          )}
          {descuentoPedido && descuentoPedido.tipoBeneficio === 'descuento' && (
            <div className="summary-discount">
              <span>✓ {descuentoPedido.nombre} (-{descuentoPedido.porcentaje}%)</span>
              <span style={{ color: '#4caf50' }}>
                -€{((getSubtotal() - descuentoCupon) * (descuentoPedido.porcentaje / 100)).toFixed(2)}
              </span>
            </div>
          )}
          <div className="summary-shipping">
            <span>Envío:</span>
            <span style={{ color: (isFreeShipping() || (descuentoPedido && descuentoPedido.tipoBeneficio === 'envio_gratis')) ? '#4caf50' : 'inherit' }}>
              {(isFreeShipping() || (descuentoPedido && descuentoPedido.tipoBeneficio === 'envio_gratis'))
                ? 'GRATIS'
                : `€${getShippingCost().toFixed(2)}`}
            </span>
          </div>
          {descuentoPedido && descuentoPedido.tipoBeneficio === 'envio_gratis' && (
            <div className="summary-discount">
              <span>✓ {descuentoPedido.nombre}</span>
              <span style={{ color: '#4caf50' }}>Envío Gratis</span>
            </div>
          )}
          {!isFreeShipping() && !descuentoPedido && getSubtotal() > 0 && (
            <div className="shipping-promo-notice">
              Envío gratis en compras superiores a €50
            </div>
          )}
          <div className="summary-total">
            <span>Total:</span>
            <span className="total-price">€{calcularTotalFinal().toFixed(2)}</span>
          </div>
        </div>

        {/* Paso 1: Datos de envío */}
        {step === 1 && (
          <form onSubmit={handleContinueToPago} className="checkout-form">
            <h3>Información de Envío</h3>

            {isAuthenticated && (
              <div className="info-notice">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4M12 8h.01" />
                </svg>
                Hemos cargado tus datos guardados. Puedes modificarlos si es necesario.
              </div>
            )}

            {!isAuthenticated && (
              <div className="guest-notice">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4M12 8h.01" />
                </svg>
                <div className="guest-notice-content">
                  <p className="guest-notice-title">¿Sabías que puedes crear una cuenta?</p>
                  <p className="guest-notice-text">
                    Regístrate para guardar tu información, hacer pedidos más rápido y ver tu historial de compras.
                  </p>
                </div>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="nombre">Nombre Completo *</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="telefono">Teléfono *</label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="direccion">Dirección *</label>
              <input
                type="text"
                id="direccion"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="ciudad">Ciudad *</label>
                <input
                  type="text"
                  id="ciudad"
                  name="ciudad"
                  value={formData.ciudad}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="provincia">Provincia *</label>
                <input
                  type="text"
                  id="provincia"
                  name="provincia"
                  value={formData.provincia}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="codigoPostal">Código Postal *</label>
              <input
                type="text"
                id="codigoPostal"
                name="codigoPostal"
                value={formData.codigoPostal}
                onChange={handleChange}
                required
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button
              type="submit"
              className="submit-order-btn"
            >
              Continuar al Pago
            </button>
          </form>
        )}

        {/* Paso 2: Selección de método de pago */}
        {step === 2 && (
          <div className="payment-section">
            <h3>Método de Pago</h3>

            <button
              onClick={() => setStep(1)}
              className="btn-back"
            >
              ← Volver a datos de envío
            </button>

            {/* Selector de métodos de pago */}
            <div className="payment-methods">
              <button
                className={`payment-method-btn ${paymentMethod === 'stripe' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('stripe')}
              >
                <div className="payment-method-icon">
                  <svg width="40" height="24" viewBox="0 0 60 25" fill="none">
                    <rect width="60" height="25" rx="4" fill={paymentMethod === 'stripe' ? '#635BFF' : '#E0E0E0'}/>
                    <text x="30" y="16" fontSize="10" fill="white" textAnchor="middle" fontWeight="bold">
                      CARD
                    </text>
                  </svg>
                </div>
                <div className="payment-method-info">
                  <div className="payment-method-name">Tarjeta de Crédito/Débito</div>
                  <div className="payment-method-description">Visa, Mastercard, Amex</div>
                </div>
              </button>

              <button
                className={`payment-method-btn ${paymentMethod === 'paypal' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('paypal')}
              >
                <div className="payment-method-icon">
                  <svg width="40" height="24" viewBox="0 0 124 33" fill="none">
                    <path d="M46.211 6.749h-6.839a.95.95 0 0 0-.939.802l-2.766 17.537a.57.57 0 0 0 .564.658h3.265a.95.95 0 0 0 .939-.803l.746-4.73a.95.95 0 0 1 .938-.803h2.165c4.505 0 7.105-2.18 7.784-6.5.306-1.89.013-3.375-.872-4.415-.972-1.142-2.696-1.746-4.985-1.746zM47 13.154c-.374 2.454-2.249 2.454-4.062 2.454h-1.032l.724-4.583a.57.57 0 0 1 .563-.481h.473c1.235 0 2.4 0 3.002.704.359.42.469 1.044.332 1.906zM66.654 13.075h-3.275a.57.57 0 0 0-.563.481l-.145.916-.229-.332c-.709-1.029-2.29-1.373-3.868-1.373-3.619 0-6.71 2.741-7.312 6.586-.313 1.918.132 3.752 1.22 5.031.998 1.176 2.426 1.666 4.125 1.666 2.916 0 4.533-1.875 4.533-1.875l-.146.91a.57.57 0 0 0 .562.66h2.95a.95.95 0 0 0 .939-.803l1.77-11.209a.568.568 0 0 0-.561-.658zm-4.565 6.374c-.316 1.871-1.801 3.127-3.695 3.127-.951 0-1.711-.305-2.199-.883-.484-.574-.668-1.391-.514-2.301.295-1.855 1.805-3.152 3.67-3.152.93 0 1.686.309 2.184.892.499.589.697 1.411.554 2.317zM84.096 13.075h-3.291a.954.954 0 0 0-.787.417l-4.539 6.686-1.924-6.425a.953.953 0 0 0-.912-.678h-3.234a.57.57 0 0 0-.541.754l3.625 10.638-3.408 4.811a.57.57 0 0 0 .465.9h3.287a.949.949 0 0 0 .781-.408l10.946-15.8a.57.57 0 0 0-.468-.895z" fill={paymentMethod === 'paypal' ? '#003087' : '#999'}/>
                    <path d="M94.992 6.749h-6.84a.95.95 0 0 0-.938.802l-2.766 17.537a.569.569 0 0 0 .562.658h3.51a.665.665 0 0 0 .656-.562l.785-4.971a.95.95 0 0 1 .938-.803h2.164c4.506 0 7.105-2.18 7.785-6.5.307-1.89.012-3.375-.873-4.415-.971-1.142-2.694-1.746-4.983-1.746zm.789 6.405c-.373 2.454-2.248 2.454-4.062 2.454h-1.031l.725-4.583a.568.568 0 0 1 .562-.481h.473c1.234 0 2.4 0 3.002.704.359.42.468 1.044.331 1.906zM115.434 13.075h-3.273a.567.567 0 0 0-.562.481l-.145.916-.23-.332c-.709-1.029-2.289-1.373-3.867-1.373-3.619 0-6.709 2.741-7.311 6.586-.312 1.918.131 3.752 1.219 5.031 1 1.176 2.426 1.666 4.125 1.666 2.916 0 4.533-1.875 4.533-1.875l-.146.91a.57.57 0 0 0 .564.66h2.949a.95.95 0 0 0 .938-.803l1.771-11.209a.571.571 0 0 0-.565-.658zm-4.565 6.374c-.314 1.871-1.801 3.127-3.695 3.127-.949 0-1.711-.305-2.199-.883-.484-.574-.666-1.391-.514-2.301.297-1.855 1.805-3.152 3.67-3.152.93 0 1.686.309 2.184.892.501.589.699 1.411.554 2.317z" fill={paymentMethod === 'paypal' ? '#009CDE' : '#999'}/>
                  </svg>
                </div>
                <div className="payment-method-info">
                  <div className="payment-method-name">PayPal</div>
                  <div className="payment-method-description">Pago rápido y seguro</div>
                </div>
              </button>

              <button
                className={`payment-method-btn ${paymentMethod === 'klarna' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('klarna')}
              >
                <div className="payment-method-icon">
                  <svg width="40" height="24" viewBox="0 0 100 30" fill="none">
                    <rect width="100" height="30" rx="4" fill={paymentMethod === 'klarna' ? '#FFB3C7' : '#E0E0E0'}/>
                    <text x="50" y="19" fontSize="12" fill="#000" textAnchor="middle" fontWeight="bold">
                      Klarna
                    </text>
                  </svg>
                </div>
                <div className="payment-method-info">
                  <div className="payment-method-name">Klarna</div>
                  <div className="payment-method-description">Paga en 3 plazos sin intereses</div>
                </div>
              </button>
            </div>

            {/* Componente de pago según método seleccionado */}
            <div className="payment-component">
              {paymentMethod === 'stripe' && (
                <StripeCheckout
                  amount={calcularTotalFinal()}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              )}

              {paymentMethod === 'paypal' && (
                <PayPalCheckout
                  amount={calcularTotalFinal()}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              )}

              {paymentMethod === 'klarna' && (
                <div className="klarna-info">
                  <div className="info-box">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 16v-4M12 8h.01" />
                    </svg>
                    <p>
                      <strong>Paga con Klarna:</strong> Divide tu compra en 3 pagos sin intereses.
                      Klarna se procesa a través de Stripe de forma segura.
                    </p>
                  </div>
                  <StripeCheckout
                    amount={calcularTotalFinal()}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />
                </div>
              )}
            </div>

            {error && <div className="error-message" style={{ marginTop: '20px' }}>{error}</div>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
