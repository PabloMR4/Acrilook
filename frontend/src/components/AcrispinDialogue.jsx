import React, { useState, useEffect } from 'react';
import '../styles/AcrispinDialogue.css';

const AcrispinDialogue = ({
  showBubble = true,
  autoChange = true,
  changeInterval = 8000,
  contextMessage = null
}) => {
  const [currentMessage, setCurrentMessage] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  // Banco de mensajes organizados por categoría
  const messages = {
    greetings: [
      '¡Hola! ¿Buscas algo brillante? ✨',
      '¡Bienvenido a AcriLook! 👋',
      '¡Qué alegría verte por aquí! 💜',
      'Hey, ¡explora nuestros productos! 🌟',
      '¡Hola! Soy Acrispin, tu guía acrílico 😊'
    ],

    morningGreetings: [
      '¡Buenos días! ☀️ ¿Empezamos con brillo?',
      '¡Buen día! El acrílico brilla más por la mañana 🌅',
      '¡Buenos días! ¿Café y acrílico? ☕✨'
    ],

    afternoonGreetings: [
      '¡Buenas tardes! 🌤️ ¿Qué te parece este brillo?',
      '¡Hola! La tarde perfecta para comprar acrílico 🌆',
      '¡Buenas tardes! ¿Navegando con estilo? 😎'
    ],

    eveningGreetings: [
      '¡Buenas noches! 🌙 El acrílico brilla incluso de noche',
      '¡Hola nocturno! 🌃 ¿Compras tarde? ¡Me encanta!',
      'Buenas noches, ¡el brillo nunca duerme! ⭐'
    ],

    tips: [
      '💡 Tip: El acrílico es 10 veces más resistente que el vidrio',
      '🎨 ¿Sabías? El acrílico es 100% reciclable',
      '✨ El acrílico transmite más luz que el vidrio ordinario',
      '🌟 El acrílico es perfecto para interiores y exteriores',
      '💎 El acrílico mantiene su transparencia durante años',
      '🔧 El acrílico es fácil de limpiar, solo agua y jabón',
      '🏆 El acrílico es el material preferido para diseño moderno',
      '🌈 Puedes encontrar acrílico en múltiples colores y acabados'
    ],

    jokes: [
      '¿Por qué el acrílico es tan popular? ¡Porque es transparente en sus intenciones! 😄',
      'Soy una gota de acrílico... ¡y me veo genial! 💧✨',
      '¿Qué tiene el acrílico que no tiene el vidrio? ¡Mi aprobación! 😎',
      'El acrílico y yo tenemos algo en común: ¡somos brillantes! 🌟',
      '¿Vidrio o acrílico? La respuesta es clara... ¡y transparente! 😉',
      'No me rompas el corazón... usa acrílico, no vidrio 💜',
      '¿Por qué confiar en el acrílico? ¡Porque lo ves venir! 👀'
    ],

    phrases: [
      '¡Cada producto cuenta una historia! 📖',
      'Tu hogar merece brillar ✨',
      'Diseño que enamora 💜',
      'Calidad cristalina, resistencia única 💎',
      '¡Haz que tu espacio destaque! 🌟',
      'Del diseño a tu hogar 🏡',
      'Innovación transparente 🔮',
      'Acrílico que transforma espacios ✨',
      '¿Necesitas ayuda? ¡Estoy aquí! 🤗',
      '¡Explora nuestra colección! 🎨'
    ],

    shopping: [
      '¿Ya revisaste el carrito? 🛒',
      '¡Los descuentos están al caer! 🎁',
      'Envío gratis en compras superiores... ¡mira las ofertas! 📦',
      '¿Tienes dudas? ¡Pregúntame! 💬',
      '¡Agrega favoritos a tu carrito! ❤️'
    ],

    motivation: [
      '¡Gran elección! 👍',
      '¡Eso es! Sigue navegando 🚀',
      '¡Te veo con buen gusto! 😊',
      '¡Excelente decisión! 🌟',
      'Me gusta tu estilo 😎'
    ]
  };

  // Función para obtener saludo según hora del día
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      return messages.morningGreetings[Math.floor(Math.random() * messages.morningGreetings.length)];
    } else if (hour >= 12 && hour < 20) {
      return messages.afternoonGreetings[Math.floor(Math.random() * messages.afternoonGreetings.length)];
    } else {
      return messages.eveningGreetings[Math.floor(Math.random() * messages.eveningGreetings.length)];
    }
  };

  // Función para obtener mensaje aleatorio de todas las categorías
  const getRandomMessage = () => {
    // Si hay un mensaje contextual, usarlo
    if (contextMessage) {
      return contextMessage;
    }

    // Probabilidades de cada tipo de mensaje
    const rand = Math.random();

    if (rand < 0.15) {
      return getTimeBasedGreeting();
    } else if (rand < 0.30) {
      return messages.greetings[Math.floor(Math.random() * messages.greetings.length)];
    } else if (rand < 0.50) {
      return messages.tips[Math.floor(Math.random() * messages.tips.length)];
    } else if (rand < 0.65) {
      return messages.jokes[Math.floor(Math.random() * messages.jokes.length)];
    } else if (rand < 0.85) {
      return messages.phrases[Math.floor(Math.random() * messages.phrases.length)];
    } else if (rand < 0.95) {
      return messages.shopping[Math.floor(Math.random() * messages.shopping.length)];
    } else {
      return messages.motivation[Math.floor(Math.random() * messages.motivation.length)];
    }
  };

  // Efecto para mostrar mensaje inicial
  useEffect(() => {
    if (showBubble) {
      // Pequeño delay antes de mostrar el primer mensaje
      const initialTimeout = setTimeout(() => {
        setCurrentMessage(getRandomMessage());
        setIsVisible(true);
      }, 1000);

      return () => clearTimeout(initialTimeout);
    }
  }, [showBubble]);

  // Efecto para cambiar mensajes automáticamente
  useEffect(() => {
    if (autoChange && isVisible && showBubble) {
      const interval = setInterval(() => {
        // Fade out
        setIsVisible(false);

        // Cambiar mensaje y fade in
        setTimeout(() => {
          setCurrentMessage(getRandomMessage());
          setIsVisible(true);
        }, 500);
      }, changeInterval);

      return () => clearInterval(interval);
    }
  }, [autoChange, changeInterval, isVisible, showBubble]);

  // Actualizar mensaje si cambia el contexto
  useEffect(() => {
    if (contextMessage) {
      setCurrentMessage(contextMessage);
      setIsVisible(true);
    }
  }, [contextMessage]);

  if (!showBubble || !currentMessage) return null;

  return (
    <div className={`acrispin-dialogue-bubble ${isVisible ? 'visible' : ''}`}>
      <div className="bubble-content">
        {currentMessage}
      </div>
      <div className="bubble-tail"></div>
    </div>
  );
};

export default AcrispinDialogue;
