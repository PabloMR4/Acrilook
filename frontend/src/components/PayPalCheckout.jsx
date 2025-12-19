import React, { useEffect, useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import '../styles/PayPalCheckout.css';

const PayPalCheckout = ({ amount, onSuccess, onError }) => {
  const [clientId, setClientId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayPalConfig = async () => {
      try {
        const response = await fetch('/api/paypal/config');
        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        setClientId(data.clientId);
      } catch (error) {
        console.error('Error loading PayPal config:', error);
        onError('Error al cargar configuración de PayPal');
      } finally {
        setLoading(false);
      }
    };

    fetchPayPalConfig();
  }, [onError]);

  const createOrder = async () => {
    try {
      const response = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount, currency: 'EUR' }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      return data.orderID;
    } catch (error) {
      console.error('Error creating PayPal order:', error);
      onError('Error al crear la orden de PayPal');
      throw error;
    }
  };

  const onApprove = async (data) => {
    try {
      const response = await fetch('/api/paypal/capture-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderID: data.orderID }),
      });

      const details = await response.json();

      if (!details.success) {
        throw new Error('Error al capturar el pago');
      }

      // Pasar el orderID de PayPal al componente padre
      onSuccess(details.orderID);
    } catch (error) {
      console.error('Error capturing PayPal payment:', error);
      onError('Error al procesar el pago de PayPal');
    }
  };

  const onPayPalError = (err) => {
    console.error('PayPal error:', err);
    onError('Error en el proceso de pago de PayPal');
  };

  if (loading || !clientId) {
    return (
      <div className="paypal-loading">
        <div className="loading-spinner"></div>
        <p>Cargando PayPal...</p>
      </div>
    );
  }

  return (
    <div className="paypal-checkout-container">
      <div className="payment-total">
        <span>Total a pagar:</span>
        <span className="total-amount">€{amount.toFixed(2)}</span>
      </div>

      <PayPalScriptProvider
        options={{
          clientId: clientId,
          currency: 'EUR',
          intent: 'capture',
        }}
      >
        <PayPalButtons
          style={{
            layout: 'vertical',
            color: 'gold',
            shape: 'rect',
            label: 'paypal',
          }}
          createOrder={createOrder}
          onApprove={onApprove}
          onError={onPayPalError}
        />
      </PayPalScriptProvider>

      <div className="paypal-secure-badge">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        Pago seguro con PayPal
      </div>
    </div>
  );
};

export default PayPalCheckout;
