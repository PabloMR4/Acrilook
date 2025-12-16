import React from 'react';
import '../styles/AcrispinReactions.css';

/**
 * Acrispin con diferentes expresiones faciales
 * Tipos de reacciones: happy, excited, love, thinking, surprised, sad, wink, sleeping
 */
const AcrispinReactions = ({ size = 'medium', reaction = 'happy', animated = true }) => {
  const sizeMap = {
    small: 30,
    medium: 50,
    large: 80,
    xlarge: 120
  };

  const dimension = sizeMap[size] || sizeMap.medium;

  // Configuraciones de ojos según la reacción
  const eyeConfigs = {
    happy: {
      leftEye: { cx: 38, cy: 50, rx: 5, ry: 7 },
      rightEye: { cx: 62, cy: 50, rx: 5, ry: 7 },
      leftPupil: { cx: 38, cy: 52, r: 3 },
      rightPupil: { cx: 62, cy: 52, r: 3 },
      smile: 'M 35 65 Q 50 75, 65 65',
      animation: 'blink'
    },
    excited: {
      leftEye: { cx: 38, cy: 48, rx: 6, ry: 9 },
      rightEye: { cx: 62, cy: 48, rx: 6, ry: 9 },
      leftPupil: { cx: 38, cy: 50, r: 4 },
      rightPupil: { cx: 62, cy: 50, r: 4 },
      smile: 'M 32 65 Q 50 80, 68 65',
      animation: 'excited'
    },
    love: {
      leftEye: { cx: 38, cy: 50, rx: 5, ry: 7 },
      rightEye: { cx: 62, cy: 50, rx: 5, ry: 7 },
      leftPupil: { cx: 38, cy: 52, r: 3 },
      rightPupil: { cx: 62, cy: 52, r: 3 },
      smile: 'M 35 65 Q 50 75, 65 65',
      hearts: true,
      animation: 'love'
    },
    thinking: {
      leftEye: { cx: 40, cy: 48, rx: 5, ry: 7 },
      rightEye: { cx: 60, cy: 52, rx: 5, ry: 7 },
      leftPupil: { cx: 42, cy: 48, r: 3 },
      rightPupil: { cx: 58, cy: 52, r: 3 },
      smile: 'M 40 68 Q 45 70, 50 68',
      animation: 'thinking'
    },
    surprised: {
      leftEye: { cx: 38, cy: 48, rx: 7, ry: 9 },
      rightEye: { cx: 62, cy: 48, rx: 7, ry: 9 },
      leftPupil: { cx: 38, cy: 50, r: 5 },
      rightPupil: { cx: 62, cy: 50, r: 5 },
      smile: 'M 45 65 Q 50 72, 55 65',
      mouthOpen: true,
      animation: 'surprised'
    },
    sad: {
      leftEye: { cx: 38, cy: 52, rx: 5, ry: 7 },
      rightEye: { cx: 62, cy: 52, rx: 5, ry: 7 },
      leftPupil: { cx: 38, cy: 54, r: 3 },
      rightPupil: { cx: 62, cy: 54, r: 3 },
      smile: 'M 35 72 Q 50 65, 65 72',
      tear: true,
      animation: 'sad'
    },
    wink: {
      leftEye: { cx: 38, cy: 50, rx: 5, ry: 1 },
      rightEye: { cx: 62, cy: 50, rx: 5, ry: 7 },
      leftPupil: null,
      rightPupil: { cx: 62, cy: 52, r: 3 },
      smile: 'M 35 65 Q 50 75, 65 65',
      animation: 'wink'
    },
    sleeping: {
      leftEye: { cx: 38, cy: 52, rx: 5, ry: 1 },
      rightEye: { cx: 62, cy: 52, rx: 5, ry: 1 },
      leftPupil: null,
      rightPupil: null,
      smile: 'M 40 68 Q 50 70, 60 68',
      zzz: true,
      animation: 'sleeping'
    }
  };

  const config = eyeConfigs[reaction] || eyeConfigs.happy;

  return (
    <div className={`acrispin-reactions-container ${animated ? 'animated' : ''} reaction-${reaction}`}>
      <svg
        width={dimension}
        height={dimension}
        viewBox="0 0 100 120"
        className="acrispin-svg"
      >
        <defs>
          <linearGradient id={`acrispinGradient-${reaction}`} x1="0%" y1="0%" x2="0%" y2="100%">
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
          fill={`url(#acrispinGradient-${reaction})`}
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
          cx={config.leftEye.cx}
          cy={config.leftEye.cy}
          rx={config.leftEye.rx}
          ry={config.leftEye.ry}
          fill="white"
          className="acrispin-eye-white left-eye"
        />
        {config.leftPupil && (
          <circle
            cx={config.leftPupil.cx}
            cy={config.leftPupil.cy}
            r={config.leftPupil.r}
            fill="#2d3748"
            className="acrispin-pupil left-pupil"
          />
        )}

        {/* Ojo derecho */}
        <ellipse
          cx={config.rightEye.cx}
          cy={config.rightEye.cy}
          rx={config.rightEye.rx}
          ry={config.rightEye.ry}
          fill="white"
          className="acrispin-eye-white right-eye"
        />
        {config.rightPupil && (
          <circle
            cx={config.rightPupil.cx}
            cy={config.rightPupil.cy}
            r={config.rightPupil.r}
            fill="#2d3748"
            className="acrispin-pupil right-pupil"
          />
        )}

        {/* Sonrisa/Boca */}
        <path
          d={config.smile}
          stroke="white"
          strokeWidth="3"
          fill={config.mouthOpen ? "rgba(45, 55, 72, 0.3)" : "none"}
          strokeLinecap="round"
          className="acrispin-smile"
        />

        {/* Corazones (para reacción love) */}
        {config.hearts && (
          <g className="hearts">
            <text x="25" y="35" fontSize="12" fill="#ff69b4" className="heart heart-1">❤</text>
            <text x="70" y="30" fontSize="10" fill="#ff69b4" className="heart heart-2">❤</text>
            <text x="15" y="70" fontSize="8" fill="#ff69b4" className="heart heart-3">❤</text>
          </g>
        )}

        {/* Lágrima (para reacción sad) */}
        {config.tear && (
          <ellipse
            cx="65"
            cy="60"
            rx="3"
            ry="5"
            fill="#4facfe"
            opacity="0.7"
            className="tear"
          />
        )}

        {/* ZZZ (para reacción sleeping) */}
        {config.zzz && (
          <g className="zzz">
            <text x="70" y="35" fontSize="12" fill="white" opacity="0.8" className="z z-1">Z</text>
            <text x="75" y="25" fontSize="10" fill="white" opacity="0.6" className="z z-2">Z</text>
            <text x="80" y="18" fontSize="8" fill="white" opacity="0.4" className="z z-3">Z</text>
          </g>
        )}
      </svg>
    </div>
  );
};

export default AcrispinReactions;
