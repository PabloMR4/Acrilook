import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Acrispin from './Acrispin';
import '../styles/Cart.css';

const Cart = ({ onCheckout }) => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    getSubtotal,
    getShippingCost,
    isFreeShipping,
    isCartOpen,
    setIsCartOpen,
    cuponAplicado,
    descuentoCupon,
    aplicarCupon,
    eliminarCupon,
  } = useCart();

  const { user, isAuthenticated } = useAuth();
  const [codigoCupon, setCodigoCupon] = useState('');
  const [mensajeCupon, setMensajeCupon] = useState('');
  const [cargandoCupon, setCargandoCupon] = useState(false);
  const [acrispinDisponibles, setAcrispinDisponibles] = useState(0);
  const [recompensasDisponibles, setRecompensasDisponibles] = useState([]);
  const [mostrarRecompensas, setMostrarRecompensas] = useState(false);

  const handleAplicarCupon = async () => {
    if (!codigoCupon.trim()) {
      setMensajeCupon('Por favor, ingresa un código promocional');
      return;
    }

    setCargandoCupon(true);
    setMensajeCupon('');

    const resultado = await aplicarCupon(codigoCupon.trim());

    setCargandoCupon(false);

    if (resultado.success) {
      setMensajeCupon('✓ ' + resultado.message);
      setCodigoCupon('');
    } else {
      setMensajeCupon('✗ ' + resultado.message);
    }
  };

  const handleEliminarCupon = () => {
    eliminarCupon();
    setCodigoCupon('');
    setMensajeCupon('');
  };

  // Cargar Acrispin disponibles del usuario
  useEffect(() => {
    const cargarAcrispin = async () => {
      if (isAuthenticated && isCartOpen) {
        try {
          const response = await fetch('/api/clientes/fidelizacion', {
            credentials: 'include'
          });

          if (response.ok) {
            const data = await response.json();
            setAcrispinDisponibles(data.puntos || 0);
          }

          // Cargar recompensas disponibles
          const respRecompensas = await fetch('/api/clientes/recompensas', {
            credentials: 'include'
          });

          if (respRecompensas.ok) {
            const dataRecompensas = await respRecompensas.json();
            setRecompensasDisponibles(dataRecompensas.recompensas || []);
          }
        } catch (error) {
          console.error('Error cargando Acrispin:', error);
        }
      }
    };

    cargarAcrispin();
  }, [isAuthenticated, isCartOpen]);

  const handleCanjearAcrispin = async (recompensaId) => {
    try {
      const response = await fetch('/api/clientes/canjear-recompensa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ recompensaId })
      });

      const data = await response.json();

      if (response.ok) {
        // El cupón se ha creado, ahora aplicarlo automáticamente
        if (data.codigo) {
          const resultado = await aplicarCupon(data.codigo);
          if (resultado.success) {
            setMensajeCupon('✓ Acrispin canjeados correctamente');
            setMostrarRecompensas(false);
            // Recargar Acrispin disponibles
            const respFid = await fetch('/api/clientes/fidelizacion', {
              credentials: 'include'
            });
            if (respFid.ok) {
              const dataFid = await respFid.json();
              setAcrispinDisponibles(dataFid.puntos || 0);
            }
          }
        }
      } else {
        setMensajeCupon('✗ ' + (data.mensaje || 'Error al canjear Acrispin'));
      }
    } catch (error) {
      console.error('Error:', error);
      setMensajeCupon('✗ Error al canjear Acrispin');
    }
  };

  if (!isCartOpen) return null;

  return (
    <>
      <div className="cart-overlay" onClick={() => setIsCartOpen(false)} />
      <div className={`cart-sidebar ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <div className="cart-header-content">
            <h2>Tu Carrito</h2>
            {cartItems.length > 0 && (
              <div className="cart-header-acrispin">
                <Acrispin size="small" animated={true} />
                <span className="cart-items-count">{cartItems.length} {cartItems.length === 1 ? 'producto' : 'productos'}</span>
              </div>
            )}
          </div>
          <button className="close-btn" onClick={() => setIsCartOpen(false)}>
            ×
          </button>
        </div>

        <div className="cart-items">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-cart-acrispin">
                <Acrispin
                  size="xlarge"
                  animated={true}
                  showDialogue={true}
                  dialogueMessage="¡Tu carrito está vacío! 🛍️ ¡Vamos a llenarlo juntos! ✨"
                  dialogueAutoChange={false}
                />
              </div>
              <h3 className="empty-cart-title">¡Uy! Acrispin está solito aquí</h3>
              <p className="empty-cart-message">
                Añade productos y empieza a ganar Acrispin con cada compra
              </p>
              <div className="empty-cart-benefits">
                <div className="benefit-item">
                  <span className="benefit-icon">✨</span>
                  <span>1€ = 1 Acrispin</span>
                </div>
                <div className="benefit-item">
                  <span className="benefit-icon">🎁</span>
                  <span>Canjea por descuentos</span>
                </div>
                <div className="benefit-item">
                  <span className="benefit-icon">🚚</span>
                  <span>Envío gratis disponible</span>
                </div>
              </div>
              <button className="btn-shop-now" onClick={() => setIsCartOpen(false)}>
                ¡Vamos a comprar!
              </button>
            </div>
          ) : (
            cartItems.map((item) => {
              const precioFinal = item.descuento ? item.descuento.precioConDescuento : item.precio;
              // Obtener imagen (variantes con imágenes o fallback a imagen del producto)
              const imagenItem = (item.imagenes && item.imagenes.length > 0)
                ? item.imagenes[0]
                : (item.imagen || 'https://via.placeholder.com/100x100?text=Sin+Imagen');

              return (
                <div key={`${item.id}-${item.varianteId || item.talla}`} className="cart-item">
                  <img src={imagenItem} alt={item.nombre} />
                  <div className="cart-item-details">
                    <h3>{item.nombre}</h3>
                    <p className="cart-item-size">Talla: {item.talla}</p>
                    {item.stockDisponible && (
                      <p className="cart-item-stock">Stock: {item.stockDisponible} unidades</p>
                    )}
                    {item.descuento ? (
                      <div className="cart-item-price-container">
                        <p className="cart-item-price discount">€{precioFinal.toFixed(2)}</p>
                        <p className="cart-item-price-original">€{item.precio.toFixed(2)}</p>
                        <p className="cart-item-discount-badge">-{item.descuento.porcentaje}%</p>
                      </div>
                    ) : (
                      <p className="cart-item-price">€{item.precio.toFixed(2)}</p>
                    )}

                    <div className="quantity-controls">
                      <button onClick={() => updateQuantity(item.id, item.varianteId || 0, item.cantidad - 1)}>
                        −
                      </button>
                      <span>{item.cantidad}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.varianteId || 0, item.cantidad + 1)}
                        disabled={item.stockDisponible && item.cantidad >= item.stockDisponible}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(item.id, item.varianteId || 0)}
                  >
                    🗑
                  </button>
                </div>
              );
            })
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer">
            {/* Sección de Acrispin */}
            {isAuthenticated && acrispinDisponibles > 0 && !cuponAplicado && (
              <div className="acrispin-section">
                <div className="acrispin-header" onClick={() => setMostrarRecompensas(!mostrarRecompensas)}>
                  <div className="acrispin-info">
                    <Acrispin size="small" animated={true} />
                    <span className="acrispin-text">
                      Tienes <strong>{acrispinDisponibles} Acrispin</strong> disponibles
                    </span>
                  </div>
                  <button className="acrispin-toggle">
                    {mostrarRecompensas ? '▼' : '▶'}
                  </button>
                </div>

                {mostrarRecompensas && (
                  <div className="recompensas-lista-cart">
                    {recompensasDisponibles.map(recompensa => (
                      <div
                        key={recompensa.id}
                        className={`recompensa-item-cart ${acrispinDisponibles < recompensa.puntos ? 'disabled' : ''}`}
                      >
                        <div className="recompensa-info-cart">
                          <span className="recompensa-icono">{recompensa.icono}</span>
                          <div>
                            <div className="recompensa-nombre-cart">{recompensa.nombre}</div>
                            <div className="recompensa-costo">
                              <Acrispin size="small" animated={false} />
                              {recompensa.puntos} Acrispin
                            </div>
                          </div>
                        </div>
                        <button
                          className="btn-canjear-cart"
                          onClick={() => handleCanjearAcrispin(recompensa.id)}
                          disabled={acrispinDisponibles < recompensa.puntos}
                        >
                          {acrispinDisponibles < recompensa.puntos ? 'Insuficientes' : 'Canjear'}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Campo de Código Promocional */}
            <div className="cupon-section">
              {!cuponAplicado ? (
                <>
                  <div className="cupon-input-group">
                    <input
                      type="text"
                      className="cupon-input"
                      placeholder="Insertar código promocional"
                      value={codigoCupon}
                      onChange={(e) => setCodigoCupon(e.target.value.toUpperCase())}
                      onKeyPress={(e) => e.key === 'Enter' && handleAplicarCupon()}
                      disabled={cargandoCupon}
                    />
                    <button
                      className="cupon-btn"
                      onClick={handleAplicarCupon}
                      disabled={cargandoCupon}
                    >
                      {cargandoCupon ? 'Validando...' : 'Aplicar'}
                    </button>
                  </div>
                  {mensajeCupon && (
                    <div className={`cupon-mensaje ${mensajeCupon.startsWith('✓') ? 'success' : 'error'}`}>
                      {mensajeCupon}
                    </div>
                  )}
                </>
              ) : (
                <div className="cupon-aplicado">
                  <div className="cupon-info">
                    <span className="cupon-icon">🎟️</span>
                    <div>
                      <div className="cupon-nombre">{cuponAplicado.nombre}</div>
                      <div className="cupon-codigo">Código: {cuponAplicado.codigo}</div>
                    </div>
                  </div>
                  <button className="cupon-eliminar" onClick={handleEliminarCupon}>
                    ✕
                  </button>
                </div>
              )}
            </div>

            <div className="cart-summary">
              <div className="cart-subtotal">
                <span>Subtotal:</span>
                <span>€{getSubtotal().toFixed(2)}</span>
              </div>
              <div className="cart-shipping">
                <span>Envío:</span>
                <span className={isFreeShipping() ? 'free-shipping' : ''}>
                  {isFreeShipping() ? 'GRATIS' : `€${getShippingCost().toFixed(2)}`}
                </span>
              </div>
              {!isFreeShipping() && getSubtotal() > 0 && (
                <div className="shipping-notice">
                  Envío gratis en compras superiores a €50
                </div>
              )}
              {descuentoCupon > 0 && (
                <div className="cart-discount">
                  <span>Descuento cupón:</span>
                  <span className="discount-amount">-€{descuentoCupon.toFixed(2)}</span>
                </div>
              )}
              <div className="cart-total">
                <span>Total:</span>
                <span className="total-amount">€{getCartTotal().toFixed(2)}</span>
              </div>
            </div>
            <button className="checkout-btn" onClick={onCheckout}>
              Proceder al Pago
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
