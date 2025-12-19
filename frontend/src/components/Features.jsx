import React from 'react';
import '../styles/Features.css';

const Features = () => {
  const features = [
    {
      icon: '🪶',
      title: 'JOYAS SÚPER LIGERAS',
      description: 'Nuestros pendientes están fabricados con metacrilato de alta calidad, un material innovador que combina resistencia y ligereza excepcional. Olvídate de la incomodidad: podrás llevarlos todo el día sin sentir peso alguno.',
      color: '#667eea'
    },
    {
      icon: '✨',
      title: 'MATERIALES HIPOALERGÉNICOS',
      description: 'Pensados para pieles sensibles, todos nuestros pendientes utilizan materiales hipoalergénicos certificados. Los cierres y componentes metálicos son de acero inoxidable quirúrgico, garantizando que puedas lucir tus joyas sin preocupaciones ni irritaciones.',
      color: '#764ba2'
    },
    {
      icon: '👐',
      title: 'PRODUCTOS HECHOS A MANO 100%',
      description: 'Cada pendiente es una pieza única elaborada artesanalmente con dedicación y cuidado. Nuestro proceso manual nos permite garantizar la máxima calidad en cada detalle, desde el corte hasta el acabado final, haciendo de cada joya una obra de arte exclusiva.',
      color: '#f093fb'
    }
  ];

  return (
    <section className="features-section">
      <div className="features-container">
        {features.map((feature, index) => (
          <div
            key={index}
            className="feature-card"
            style={{ '--feature-color': feature.color }}
          >
            <div className="feature-icon-wrapper">
              <div className="feature-icon">{feature.icon}</div>
            </div>
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-description">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
