import React from 'react';
import AcrispinDialogue from './AcrispinDialogue';
import AcrispinReactions from './AcrispinReactions';
import AcrispinEyeTracking from './AcrispinEyeTracking';
import '../styles/Acrispin.css';

const Acrispin = ({
  size = 'medium',
  animated = true,
  count,
  showCount = false,
  showDialogue = false,
  dialogueMessage = null,
  dialogueAutoChange = true,
  dialogueInterval = 8000,
  reaction = null,
  eyeTracking = false
}) => {
  const sizeMap = {
    small: 30,
    medium: 50,
    large: 80,
    xlarge: 120
  };

  const dimension = sizeMap[size] || sizeMap.medium;

  // Si está activado el eye tracking, usar ese componente
  if (eyeTracking) {
    return (
      <div className={`acrispin-container ${animated ? 'animated' : ''}`}>
        <AcrispinEyeTracking
          size={size}
          animated={animated}
          showDialogue={showDialogue}
          dialogueMessage={dialogueMessage}
          dialogueAutoChange={dialogueAutoChange}
          dialogueInterval={dialogueInterval}
        />
        {showCount && count !== undefined && (
          <div className="acrispin-count">
            <span className="count-number">{count}</span>
            <span className="count-label">Acrispin</span>
          </div>
        )}
      </div>
    );
  }

  // Si se especifica una reacción, usar el componente de reacciones
  if (reaction) {
    return (
      <div className={`acrispin-container ${animated ? 'animated' : ''}`}>
        {showDialogue && (
          <AcrispinDialogue
            showBubble={showDialogue}
            autoChange={dialogueAutoChange}
            changeInterval={dialogueInterval}
            contextMessage={dialogueMessage}
          />
        )}
        <AcrispinReactions size={size} reaction={reaction} animated={animated} />
        {showCount && count !== undefined && (
          <div className="acrispin-count">
            <span className="count-number">{count}</span>
            <span className="count-label">Acrispin</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`acrispin-container ${animated ? 'animated' : ''}`}>
      {showDialogue && (
        <AcrispinDialogue
          showBubble={showDialogue}
          autoChange={dialogueAutoChange}
          changeInterval={dialogueInterval}
          contextMessage={dialogueMessage}
        />
      )}
      <svg
        width={dimension}
        height={dimension}
        viewBox="0 0 100 120"
        className="acrispin-svg"
      >
        <defs>
          <linearGradient id="acrispinGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#667eea" />
            <stop offset="50%" stopColor="#764ba2" />
            <stop offset="100%" stopColor="#667eea" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Cuerpo de la gota */}
        <path
          d="M 50 10 C 30 10, 20 30, 20 50 C 20 70, 30 90, 50 110 C 70 90, 80 70, 80 50 C 80 30, 70 10, 50 10 Z"
          fill="url(#acrispinGradient)"
          filter="url(#glow)"
          className="acrispin-body"
        />

        {/* Brillo */}
        <ellipse
          cx="38"
          cy="35"
          rx="12"
          ry="18"
          fill="white"
          opacity="0.4"
          className="acrispin-shine"
        />

        {/* Ojo izquierdo */}
        <ellipse
          cx="38"
          cy="50"
          rx="5"
          ry="7"
          fill="white"
          className="acrispin-eye-white"
        />
        <circle
          cx="38"
          cy="52"
          r="3"
          fill="#2d3748"
          className="acrispin-pupil left-pupil"
        />

        {/* Ojo derecho */}
        <ellipse
          cx="62"
          cy="50"
          rx="5"
          ry="7"
          fill="white"
          className="acrispin-eye-white"
        />
        <circle
          cx="62"
          cy="52"
          r="3"
          fill="#2d3748"
          className="acrispin-pupil right-pupil"
        />

        {/* Sonrisa */}
        <path
          d="M 35 65 Q 50 75, 65 65"
          stroke="white"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          className="acrispin-smile"
        />
      </svg>

      {showCount && count !== undefined && (
        <div className="acrispin-count">
          <span className="count-number">{count}</span>
          <span className="count-label">Acrispin</span>
        </div>
      )}
    </div>
  );
};

export default Acrispin;
