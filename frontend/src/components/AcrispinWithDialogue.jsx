import React, { useState, useEffect } from 'react';
import Acrispin from './Acrispin';
import '../styles/AcrispinWithDialogue.css';

/**
 * Acrispin con burbujas de diálogo incluidas
 * Componente todo-en-uno para mostrar Acrispin hablando
 */
const AcrispinWithDialogue = ({
  size = 'large',
  position = 'bottom-right',
  showOnMount = true,
  contextualMessages = null,
  onClick = null,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(showOnMount);
  const [customMessage, setCustomMessage] = useState(null);

  // Función para mostrar mensaje personalizado temporalmente
  const showCustomMessage = (message, duration = 5000) => {
    setCustomMessage(message);
    setTimeout(() => {
      setCustomMessage(null);
    }, duration);
  };

  // Efecto para mensajes contextuales
  useEffect(() => {
    if (contextualMessages) {
      setCustomMessage(contextualMessages);
    }
  }, [contextualMessages]);

  const handleClick = () => {
    if (onClick) {
      onClick({ showCustomMessage, setIsVisible });
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className={`acrispin-with-dialogue ${position} ${className}`}
      onClick={handleClick}
    >
      <Acrispin
        size={size}
        animated={true}
        showDialogue={true}
        dialogueMessage={customMessage}
        dialogueAutoChange={!customMessage}
        dialogueInterval={8000}
      />
    </div>
  );
};

export default AcrispinWithDialogue;
