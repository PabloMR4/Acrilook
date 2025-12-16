import React, { useState, useEffect, useRef } from 'react';
import AcrispinDialogue from './AcrispinDialogue';
import '../styles/AcrispinEyeTracking.css';

/**
 * Acrispin con seguimiento de ojos al cursor
 * Los ojos siguen el movimiento del mouse del usuario
 */
const AcrispinEyeTracking = ({
  size = 'medium',
  animated = true,
  showDialogue = false,
  dialogueMessage = null,
  dialogueAutoChange = true,
  dialogueInterval = 8000
}) => {
  const sizeMap = {
    small: 30,
    medium: 50,
    large: 80,
    xlarge: 120
  };

  const dimension = sizeMap[size] || sizeMap.medium;
  const svgRef = useRef(null);
  const [leftPupilPos, setLeftPupilPos] = useState({ x: 38, y: 52 });
  const [rightPupilPos, setRightPupilPos] = useState({ x: 62, y: 52 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!svgRef.current) return;

      const svgRect = svgRef.current.getBoundingClientRect();
      const svgCenterX = svgRect.left + svgRect.width / 2;
      const svgCenterY = svgRect.top + svgRect.height / 2;

      const mouseX = e.clientX;
      const mouseY = e.clientY;

      // Calcular ángulo y distancia desde el centro del SVG al cursor
      const angle = Math.atan2(mouseY - svgCenterY, mouseX - svgCenterX);
      const distance = Math.min(
        Math.sqrt(Math.pow(mouseX - svgCenterX, 2) + Math.pow(mouseY - svgCenterY, 2)) / 50,
        1
      );

      // Movimiento máximo de las pupilas (en unidades SVG)
      const maxMovement = 2;
      const moveX = Math.cos(angle) * maxMovement * distance;
      const moveY = Math.sin(angle) * maxMovement * distance;

      // Actualizar posiciones de las pupilas
      setLeftPupilPos({
        x: 38 + moveX,
        y: 52 + moveY
      });

      setRightPupilPos({
        x: 62 + moveX,
        y: 52 + moveY
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className={`acrispin-eye-tracking-container ${animated ? 'animated' : ''}`}>
      {showDialogue && (
        <AcrispinDialogue
          showBubble={showDialogue}
          autoChange={dialogueAutoChange}
          changeInterval={dialogueInterval}
          contextMessage={dialogueMessage}
        />
      )}
      <svg
        ref={svgRef}
        width={dimension}
        height={dimension}
        viewBox="0 0 100 120"
        className="acrispin-eye-tracking-svg"
      >
        <defs>
          <linearGradient id="acrispinGradientTracking" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#667eea" />
            <stop offset="50%" stopColor="#764ba2" />
            <stop offset="100%" stopColor="#667eea" />
          </linearGradient>
          <filter id="glowTracking">
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
          fill="url(#acrispinGradientTracking)"
          filter="url(#glowTracking)"
          className="acrispin-body-tracking"
        />

        {/* Brillo */}
        <ellipse
          cx="38"
          cy="35"
          rx="12"
          ry="18"
          fill="white"
          opacity="0.4"
          className="acrispin-shine-tracking"
        />

        {/* Ojo izquierdo */}
        <ellipse
          cx="38"
          cy="50"
          rx="5"
          ry="7"
          fill="white"
          className="acrispin-eye-white-tracking"
        />
        <circle
          cx={leftPupilPos.x}
          cy={leftPupilPos.y}
          r="3"
          fill="#2d3748"
          className="acrispin-pupil-tracking left-pupil-tracking"
        />

        {/* Ojo derecho */}
        <ellipse
          cx="62"
          cy="50"
          rx="5"
          ry="7"
          fill="white"
          className="acrispin-eye-white-tracking"
        />
        <circle
          cx={rightPupilPos.x}
          cy={rightPupilPos.y}
          r="3"
          fill="#2d3748"
          className="acrispin-pupil-tracking right-pupil-tracking"
        />

        {/* Sonrisa */}
        <path
          d="M 35 65 Q 50 75, 65 65"
          stroke="white"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          className="acrispin-smile-tracking"
        />

        {/* Cejas expresivas */}
        <path
          d="M 33 45 Q 38 43, 43 45"
          stroke="white"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          className="acrispin-eyebrow left-eyebrow"
          opacity="0.7"
        />
        <path
          d="M 57 45 Q 62 43, 67 45"
          stroke="white"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          className="acrispin-eyebrow right-eyebrow"
          opacity="0.7"
        />
      </svg>
    </div>
  );
};

export default AcrispinEyeTracking;
