import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from './Hero';
import Features from './Features';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';
import Acrispin from './Acrispin';
import { obtenerProductos } from '../services/api';
import '../styles/Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const data = await obtenerProductos();
      setProductos(data);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Obtener productos destacados
  const getProductosDestacados = () => {
    return productos.filter(p => p.destacado).slice(0, 4); // Máximo 4 productos destacados
  };

  const productosDestacados = getProductosDestacados();

  if (loading) {
    return (
      <>
        <Hero />
        <div className="loading-home">
          <div className="spinner"></div>
          <p>Cargando productos...</p>
        </div>
        <Features />
      </>
    );
  }

  return (
    <>
      <Hero />

      {/* Sección de Productos Destacados */}
      {productosDestacados.length > 0 && (
        <section className="featured-section">
          <div className="section-container">
            <div className="section-header-home">
              <span className="section-tag">Lo Mejor</span>
              <h2 className="section-title-home">Pendientes Destacados</h2>
              <p className="section-description-home">
                Nuestra selección exclusiva de pendientes acrílicos
              </p>
            </div>

            <div className="featured-grid">
              {productosDestacados.map((producto) => (
                <div key={producto.id} className="featured-item">
                  <ProductCard
                    producto={producto}
                    onProductClick={() => setSelectedProduct(producto)}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Features />

      {/* Acrispin con burbujas de diálogo y seguimiento de ojos */}
      <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
        <Acrispin
          size="large"
          animated={true}
          eyeTracking={true}
          showDialogue={true}
          dialogueAutoChange={true}
        />
      </div>

      {/* Modal de Producto */}
      {selectedProduct && (
        <ProductModal
          producto={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  );
};

export default Home;
