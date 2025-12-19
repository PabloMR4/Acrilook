import React from 'react';
import '../styles/Logo.css';

const Logo = ({ variant = 'default', size = 'medium' }) => {
  return (
    <div className={`logo-container logo-${variant} logo-${size}`}>
      <div className="logo-icon">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#667eea" />
              <stop offset="50%" stopColor="#764ba2" />
              <stop offset="100%" stopColor="#f093fb" />
            </linearGradient>
            <linearGradient id="logoGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f093fb" />
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

          {/* Forma principal - Diamante/Cristal */}
          <g className="logo-crystal">
            {/* Capa trasera */}
            <path
              d="M50 10 L80 35 L70 80 L50 90 L30 80 L20 35 Z"
              fill="url(#logoGradient2)"
              opacity="0.3"
              className="crystal-back"
            />

            {/* Facetas del cristal */}
            <path
              d="M50 10 L80 35 L50 50 Z"
              fill="url(#logoGradient)"
              opacity="0.8"
              className="crystal-facet"
            />
            <path
              d="M80 35 L70 80 L50 50 Z"
              fill="url(#logoGradient)"
              opacity="0.6"
              className="crystal-facet"
            />
            <path
              d="M50 50 L70 80 L50 90 Z"
              fill="url(#logoGradient2)"
              opacity="0.7"
              className="crystal-facet"
            />
            <path
              d="M50 90 L30 80 L50 50 Z"
              fill="url(#logoGradient2)"
              opacity="0.6"
              className="crystal-facet"
            />
            <path
              d="M30 80 L20 35 L50 50 Z"
              fill="url(#logoGradient)"
              opacity="0.5"
              className="crystal-facet"
            />
            <path
              d="M20 35 L50 10 L50 50 Z"
              fill="url(#logoGradient)"
              opacity="0.9"
              className="crystal-facet"
            />

            {/* Borde brillante */}
            <path
              d="M50 10 L80 35 L70 80 L50 90 L30 80 L20 35 Z"
              stroke="url(#logoGradient)"
              strokeWidth="2"
              fill="none"
              filter="url(#glow)"
              className="crystal-outline"
            />

            {/* Destello central */}
            <circle cx="50" cy="45" r="8" fill="white" opacity="0.4" className="crystal-shine"/>
            <circle cx="52" cy="43" r="4" fill="white" opacity="0.8" className="crystal-shine-small"/>
          </g>
        </svg>
      </div>

      <div className="logo-text">
        <span className="logo-name">
          <span className="logo-acri">Acri</span>
          <span className="logo-look">Look</span>
        </span>
        {variant === 'full' && (
          <span className="logo-tagline">Premium Acrílicos</span>
        )}
      </div>
    </div>
  );
};

export default Logo;
