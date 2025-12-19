import React, { useState, useEffect } from 'react';
import Acrispin from './Acrispin';
import '../styles/FloatingAcrispin.css';

const FloatingAcrispin = () => {
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    // Generar posiciones aleatorias para Acrispins flotantes
    const generatePositions = () => {
      const newPositions = [];
      const count = 3; // Número de Acrispins flotantes

      for (let i = 0; i < count; i++) {
        newPositions.push({
          id: i,
          left: Math.random() * 80 + 10, // Entre 10% y 90%
          animationDelay: Math.random() * 5, // Delay aleatorio
          animationDuration: 15 + Math.random() * 10, // Entre 15 y 25 segundos
          size: Math.random() > 0.5 ? 'medium' : 'small'
        });
      }

      setPositions(newPositions);
    };

    generatePositions();
  }, []);

  return (
    <div className="floating-acrispins-container">
      {positions.map((pos) => (
        <div
          key={pos.id}
          className="floating-acrispin"
          style={{
            left: `${pos.left}%`,
            animationDelay: `${pos.animationDelay}s`,
            animationDuration: `${pos.animationDuration}s`
          }}
        >
          <Acrispin size={pos.size} animated={true} />
        </div>
      ))}
    </div>
  );
};

export default FloatingAcrispin;
