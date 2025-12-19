import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import MisTickets from './MisTickets';
import Acrispin from './Acrispin';
import '../styles/UserProfile.css';

const UserProfile = ({ onClose }) => {
  const { user, getPerfil, updatePerfil, getPedidos, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [pedidos, setPedidos] = useState([]);
  const [perfil, setPerfil] = useState(null);
  const [fidelizacion, setFidelizacion] = useState(null);
  const [recompensas, setRecompensas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState({
    perfil: false,
    pedidos: false,
    fidelizacion: false,
    recompensas: false
  });
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    provincia: '',
    codigoPostal: '',
    passwordActual: '',
    passwordNueva: '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadInitialData();
  }, []);

  // Cargar solo datos básicos al inicio
  const loadInitialData = async () => {
    setLoading(true);
    try {
      const perfilData = await getPerfil();

      if (perfilData) {
        setPerfil(perfilData);
        setFormData({
          nombre: perfilData.nombre || '',
          telefono: perfilData.telefono || '',
          direccion: perfilData.direccion || '',
          ciudad: perfilData.ciudad || '',
          provincia: perfilData.provincia || '',
          codigoPostal: perfilData.codigoPostal || '',
          passwordActual: '',
          passwordNueva: '',
        });
        setDataLoaded(prev => ({ ...prev, perfil: true }));
      }
    } catch (error) {
      console.error('Error cargando datos iniciales:', error);
    }
    setLoading(false);

    // Cargar datos del Dashboard automáticamente ya que es la vista por defecto
    loadTabData('dashboard');
  };

  // Cargar datos bajo demanda según la pestaña activa
  const loadTabData = async (tab) => {
    try {
      if (tab === 'pedidos' && !dataLoaded.pedidos) {
        const pedidosData = await getPedidos();
        setPedidos(pedidosData);
        setDataLoaded(prev => ({ ...prev, pedidos: true }));
      } else if ((tab === 'dashboard' || tab === 'fidelizacion') && !dataLoaded.fidelizacion) {
        const [fidelizacionData, recompensasData] = await Promise.all([
          fetch('/api/clientes/fidelizacion', {
            credentials: 'include'
          }).then(res => res.json()),
          fetch('/api/clientes/recompensas', {
            credentials: 'include'
          }).then(res => res.json())
        ]);

        setFidelizacion(fidelizacionData);
        setRecompensas(recompensasData.recompensas || []);
        setDataLoaded(prev => ({ ...prev, fidelizacion: true, recompensas: true }));

        // Si estamos en dashboard, también cargar pedidos
        if (tab === 'dashboard' && !dataLoaded.pedidos) {
          const pedidosData = await getPedidos();
          setPedidos(pedidosData);
          setDataLoaded(prev => ({ ...prev, pedidos: true }));
        }
      }
    } catch (error) {
      console.error('Error cargando datos de pestaña:', error);
    }
  };

  // Recargar todos los datos (para después de actualizar perfil)
  const reloadAllData = async () => {
    try {
      const perfilData = await getPerfil();

      if (perfilData) {
        setPerfil(perfilData);
        setFormData(prev => ({
          ...prev,
          nombre: perfilData.nombre || '',
          telefono: perfilData.telefono || '',
          direccion: perfilData.direccion || '',
          ciudad: perfilData.ciudad || '',
          provincia: perfilData.provincia || '',
          codigoPostal: perfilData.codigoPostal || '',
          passwordActual: '',
          passwordNueva: '',
        }));
      }
    } catch (error) {
      console.error('Error recargando datos:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    const result = await updatePerfil(formData);

    if (result.success) {
      setMessage({ type: 'success', text: result.mensaje });
      setEditMode(false);
      reloadAllData();
      setFormData(prev => ({
        ...prev,
        passwordActual: '',
        passwordNueva: '',
      }));
    } else {
      setMessage({ type: 'error', text: result.mensaje });
    }
  };

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  const canjearRecompensa = async (recompensaId) => {
    try {
      const response = await fetch('/api/clientes/canjear-recompensa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ recompensaId })
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.mensaje);
        // Recargar solo datos de fidelización
        const [fidelizacionData, recompensasData] = await Promise.all([
          fetch('/api/clientes/fidelizacion', {
            credentials: 'include'
          }).then(res => res.json()),
          fetch('/api/clientes/recompensas', {
            credentials: 'include'
          }).then(res => res.json())
        ]);
        setFidelizacion(fidelizacionData);
        setRecompensas(recompensasData.recompensas || []);
      } else {
        alert(data.mensaje || 'Error al canjear recompensa');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al canjear recompensa');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEstadoClass = (estado) => {
    switch (estado) {
      case 'Nuevo Pedido':
        return 'estado-nuevo';
      case 'En Proceso':
        return 'estado-proceso';
      case 'Enviado':
        return 'estado-enviado';
      case 'Entregado':
        return 'estado-entregado';
      case 'Cancelado':
        return 'estado-cancelado';
      default:
        return '';
    }
  };

  const getNivelColor = (nivel) => {
    switch (nivel) {
      case 'Diamante':
        return '#b9f2ff';
      case 'Oro':
        return '#ffd700';
      case 'Plata':
        return '#c0c0c0';
      default:
        return '#cd7f32';
    }
  };

  const getNivelIcon = (nivel) => {
    switch (nivel) {
      case 'Diamante':
        return '💎';
      case 'Oro':
        return '🥇';
      case 'Plata':
        return '🥈';
      default:
        return '🥉';
    }
  };

  if (loading) {
    return (
      <div className="profile-modal">
        <div className="profile-overlay" onClick={onClose} />
        <div className="profile-content modern">
          <div className="loading-spinner-modern">
            <div className="spinner-ring"></div>
            <p>Cargando tu dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-modal">
      <div className="profile-overlay" onClick={onClose} />
      <div className="profile-content modern">
        <button className="profile-close-btn modern" onClick={onClose}>
          ✕
        </button>

        {/* Sidebar Navigation */}
        <div className="profile-sidebar">
          <div className="profile-user-card">
            <div className="user-avatar-large">
              {user?.nombre?.charAt(0).toUpperCase()}
            </div>
            <h3>{user?.nombre}</h3>
            <p className="user-email">{user?.email}</p>
            {fidelizacion && (
              <div className="user-level-badge" style={{ background: getNivelColor(fidelizacion.nivel) }}>
                <span className="level-icon">{getNivelIcon(fidelizacion.nivel)}</span>
                <span className="level-name">{fidelizacion.nivel}</span>
              </div>
            )}
          </div>

          <nav className="sidebar-nav">
            <button
              className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('dashboard');
                loadTabData('dashboard');
              }}
            >
              <span className="nav-icon">📊</span>
              <span>Dashboard</span>
            </button>
            <button
              className={`nav-item ${activeTab === 'pedidos' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('pedidos');
                loadTabData('pedidos');
              }}
            >
              <span className="nav-icon">📦</span>
              <span>Mis Pedidos</span>
              {pedidos.length > 0 && <span className="nav-badge">{pedidos.length}</span>}
            </button>
            <button
              className={`nav-item ${activeTab === 'fidelizacion' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('fidelizacion');
                loadTabData('fidelizacion');
              }}
            >
              <span className="nav-icon">
                <Acrispin size="small" animated={false} />
              </span>
              <span>Acrispin</span>
              {fidelizacion && <span className="nav-badge points">{fidelizacion.puntos}</span>}
            </button>
            <button
              className={`nav-item ${activeTab === 'perfil' ? 'active' : ''}`}
              onClick={() => setActiveTab('perfil')}
            >
              <span className="nav-icon">👤</span>
              <span>Mi Perfil</span>
            </button>
            <button
              className={`nav-item ${activeTab === 'tickets' ? 'active' : ''}`}
              onClick={() => setActiveTab('tickets')}
            >
              <span className="nav-icon">🎫</span>
              <span>Soporte</span>
            </button>
          </nav>

          <button onClick={handleLogout} className="btn-logout-sidebar">
            🚪 Cerrar Sesión
          </button>
        </div>

        {/* Main Content */}
        <div className="profile-main-content">
          {activeTab === 'dashboard' && fidelizacion && (
            <div className="dashboard-view">
              <h2 className="section-title">Mi Dashboard</h2>

              <div className="stats-grid">
                <div className="stat-card purple">
                  <div className="stat-icon">
                    <Acrispin size="medium" animated={true} />
                  </div>
                  <div className="stat-content">
                    <div className="stat-value">{fidelizacion.puntos}</div>
                    <div className="stat-label">Acrispin Acumulados</div>
                  </div>
                </div>

                <div className="stat-card blue">
                  <div className="stat-icon">📦</div>
                  <div className="stat-content">
                    <div className="stat-value">{pedidos.length}</div>
                    <div className="stat-label">Total Pedidos</div>
                  </div>
                </div>

                <div className="stat-card green">
                  <div className="stat-icon">💰</div>
                  <div className="stat-content">
                    <div className="stat-value">€{fidelizacion.totalGastado.toFixed(2)}</div>
                    <div className="stat-label">Total Gastado</div>
                  </div>
                </div>

                <div className="stat-card orange">
                  <div className="stat-icon">{getNivelIcon(fidelizacion.nivel)}</div>
                  <div className="stat-content">
                    <div className="stat-value">{fidelizacion.nivel}</div>
                    <div className="stat-label">Nivel Actual</div>
                  </div>
                </div>
              </div>

              {fidelizacion.nivel !== 'Diamante' && (
                <div className="progress-card">
                  <div className="progress-header">
                    <h3>Progreso al siguiente nivel: {fidelizacion.proximoNivel}</h3>
                    <span className="progress-percentage">{Math.round(fidelizacion.progresoNivel)}%</span>
                  </div>
                  <div className="progress-bar-container">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${fidelizacion.progresoNivel}%` }}
                    ></div>
                  </div>
                  <p className="progress-text">
                    Te faltan €{fidelizacion.faltaParaProximo.toFixed(2)} para alcanzar el nivel {fidelizacion.proximoNivel}
                  </p>
                </div>
              )}

              <div className="recent-section">
                <h3>Últimos Pedidos</h3>
                {pedidos.slice(0, 3).map((pedido) => (
                  <div key={pedido.id} className="mini-pedido-card">
                    <div className="mini-pedido-header">
                      <span className="mini-pedido-id">#{pedido.id}</span>
                      <span className={`mini-pedido-estado ${getEstadoClass(pedido.estado)}`}>
                        {pedido.estado}
                      </span>
                    </div>
                    <div className="mini-pedido-content">
                      <span className="mini-pedido-total">€{pedido.total.toFixed(2)}</span>
                      <span className="mini-pedido-fecha">{formatDate(pedido.fecha)}</span>
                    </div>
                  </div>
                ))}
                {pedidos.length === 0 && (
                  <p className="empty-message">No tienes pedidos todavía</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'pedidos' && (
            <div className="pedidos-view">
              <h2 className="section-title">Historial de Pedidos</h2>
              {pedidos.length === 0 ? (
                <div className="empty-state-modern">
                  <div className="empty-icon">📦</div>
                  <h3>No tienes pedidos aún</h3>
                  <p>Cuando realices tu primera compra, aparecerá aquí</p>
                  <button onClick={onClose} className="btn-primary-modern">
                    Explorar Productos
                  </button>
                </div>
              ) : (
                <div className="pedidos-grid">
                  {pedidos.map((pedido) => (
                    <div key={pedido.id} className="pedido-card-modern">
                      <div className="pedido-card-header">
                        <div>
                          <h4>Pedido #{pedido.id}</h4>
                          <p className="pedido-fecha-small">{formatDate(pedido.fecha)}</p>
                        </div>
                        <span className={`pedido-estado-badge ${getEstadoClass(pedido.estado)}`}>
                          {pedido.estado}
                        </span>
                      </div>
                      <div className="pedido-items-modern">
                        {pedido.items.map((item, index) => (
                          <div key={index} className="pedido-item-row">
                            <span className="item-name">
                              {item.nombre} <span className="item-talla">(Talla: {item.talla})</span>
                            </span>
                            <span className="item-quantity">x{item.cantidad}</span>
                            <span className="item-price">€{(item.precio * item.cantidad).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="pedido-total-row">
                        <span className="total-label">Total:</span>
                        <span className="total-amount-modern">€{pedido.total.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'fidelizacion' && fidelizacion && (
            <div className="fidelizacion-view">
              <h2 className="section-title">
                <Acrispin size="large" animated={true} />
                Programa Acrispin
              </h2>

              <div className="fidelizacion-header-card">
                <div className="fidelizacion-points">
                  <div className="points-display">
                    <Acrispin size="xlarge" animated={true} showCount={true} count={fidelizacion.puntos} />
                  </div>
                  <div className="points-info">
                    <p>✨ Gana 1 Acrispin por cada euro que gastes</p>
                    <p>💳 Descuento actual: {fidelizacion.descuentoActual}% en todas tus compras</p>
                  </div>
                </div>
              </div>

              <div className="niveles-info-card">
                <h3>Niveles de Fidelización</h3>
                <div className="niveles-grid">
                  <div className={`nivel-item ${fidelizacion.nivel === 'Bronce' ? 'active' : ''}`}>
                    <span className="nivel-icon-large">🥉</span>
                    <h4>Bronce</h4>
                    <p>€0 - €99</p>
                    <p className="nivel-benefit">Puntos por compra</p>
                  </div>
                  <div className={`nivel-item ${fidelizacion.nivel === 'Plata' ? 'active' : ''}`}>
                    <span className="nivel-icon-large">🥈</span>
                    <h4>Plata</h4>
                    <p>€100 - €249</p>
                    <p className="nivel-benefit">+5% descuento</p>
                  </div>
                  <div className={`nivel-item ${fidelizacion.nivel === 'Oro' ? 'active' : ''}`}>
                    <span className="nivel-icon-large">🥇</span>
                    <h4>Oro</h4>
                    <p>€250 - €499</p>
                    <p className="nivel-benefit">+10% descuento</p>
                  </div>
                  <div className={`nivel-item ${fidelizacion.nivel === 'Diamante' ? 'active' : ''}`}>
                    <span className="nivel-icon-large">💎</span>
                    <h4>Diamante</h4>
                    <p>€500+</p>
                    <p className="nivel-benefit">+15% descuento</p>
                  </div>
                </div>
              </div>

              <h3 className="subsection-title">Recompensas Disponibles</h3>
              <div className="recompensas-grid">
                {recompensas.map((recompensa) => (
                  <div
                    key={recompensa.id}
                    className={`recompensa-card ${fidelizacion.puntos < recompensa.puntos ? 'disabled' : ''}`}
                  >
                    <div className="recompensa-icon">{recompensa.icono}</div>
                    <h4>{recompensa.nombre}</h4>
                    <p className="recompensa-descripcion">{recompensa.descripcion}</p>
                    <div className="recompensa-footer">
                      <span className="recompensa-puntos">
                        <Acrispin size="small" animated={false} />
                        {recompensa.puntos} Acrispin
                      </span>
                      <button
                        className="btn-canjear"
                        onClick={() => canjearRecompensa(recompensa.id)}
                        disabled={fidelizacion.puntos < recompensa.puntos}
                      >
                        {fidelizacion.puntos < recompensa.puntos ? 'Insuficientes' : 'Canjear'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {fidelizacion.puntosHistorial && fidelizacion.puntosHistorial.length > 0 && (
                <div className="historial-puntos">
                  <h3 className="subsection-title">Historial de Acrispin</h3>
                  <div className="historial-list">
                    {fidelizacion.puntosHistorial.slice().reverse().slice(0, 10).map((item, index) => (
                      <div key={index} className="historial-item">
                        <div className="historial-concepto">
                          <span className={item.cantidad > 0 ? 'icon-plus' : 'icon-minus'}>
                            {item.cantidad > 0 ? '+' : ''}
                          </span>
                          <span>{item.concepto}</span>
                        </div>
                        <div className="historial-right">
                          <span className={`historial-puntos ${item.cantidad > 0 ? 'positive' : 'negative'}`}>
                            {item.cantidad > 0 ? '+' : ''}{item.cantidad} <Acrispin size="small" animated={false} />
                          </span>
                          <span className="historial-fecha">
                            {new Date(item.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'perfil' && (
            <div className="perfil-view">
              <div className="perfil-header-row">
                <h2 className="section-title">Mi Perfil</h2>
                {!editMode && (
                  <button onClick={() => setEditMode(true)} className="btn-edit-modern">
                    ✏️ Editar
                  </button>
                )}
              </div>

              {message.text && (
                <div className={`message-modern ${message.type}`}>
                  {message.type === 'success' ? '✅' : '❌'} {message.text}
                </div>
              )}

              {editMode ? (
                <form onSubmit={handleSubmit} className="perfil-form-modern">
                  <div className="form-grid">
                    <div className="form-group-modern">
                      <label htmlFor="nombre">Nombre Completo</label>
                      <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="form-group-modern">
                      <label htmlFor="email">Email</label>
                      <input
                        type="email"
                        value={perfil?.email}
                        disabled
                        className="input-disabled-modern"
                      />
                      <small>El email no se puede modificar</small>
                    </div>

                    <div className="form-group-modern">
                      <label htmlFor="telefono">Teléfono</label>
                      <input
                        type="tel"
                        id="telefono"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="form-group-modern full-width">
                      <label htmlFor="direccion">Dirección</label>
                      <input
                        type="text"
                        id="direccion"
                        name="direccion"
                        value={formData.direccion}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="form-group-modern">
                      <label htmlFor="ciudad">Ciudad</label>
                      <input
                        type="text"
                        id="ciudad"
                        name="ciudad"
                        value={formData.ciudad}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="form-group-modern">
                      <label htmlFor="provincia">Provincia</label>
                      <input
                        type="text"
                        id="provincia"
                        name="provincia"
                        value={formData.provincia}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="form-group-modern">
                      <label htmlFor="codigoPostal">Código Postal</label>
                      <input
                        type="text"
                        id="codigoPostal"
                        name="codigoPostal"
                        value={formData.codigoPostal}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="form-divider-modern">
                    <h4>Cambiar Contraseña (opcional)</h4>
                  </div>

                  <div className="form-grid">
                    <div className="form-group-modern">
                      <label htmlFor="passwordActual">Contraseña Actual</label>
                      <input
                        type="password"
                        id="passwordActual"
                        name="passwordActual"
                        value={formData.passwordActual}
                        onChange={handleChange}
                        autoComplete="current-password"
                      />
                    </div>

                    <div className="form-group-modern">
                      <label htmlFor="passwordNueva">Nueva Contraseña</label>
                      <input
                        type="password"
                        id="passwordNueva"
                        name="passwordNueva"
                        value={formData.passwordNueva}
                        onChange={handleChange}
                        autoComplete="new-password"
                      />
                    </div>
                  </div>

                  <div className="form-actions-modern">
                    <button type="submit" className="btn-save-modern">
                      💾 Guardar Cambios
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditMode(false);
                        setMessage({ type: '', text: '' });
                      }}
                      className="btn-cancel-modern"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              ) : (
                <div className="perfil-info-card">
                  <div className="info-grid">
                    <div className="info-item-modern">
                      <span className="info-icon">👤</span>
                      <div>
                        <span className="info-label">Nombre</span>
                        <span className="info-value">{perfil?.nombre}</span>
                      </div>
                    </div>
                    <div className="info-item-modern">
                      <span className="info-icon">📧</span>
                      <div>
                        <span className="info-label">Email</span>
                        <span className="info-value">{perfil?.email}</span>
                      </div>
                    </div>
                    <div className="info-item-modern">
                      <span className="info-icon">📱</span>
                      <div>
                        <span className="info-label">Teléfono</span>
                        <span className="info-value">{perfil?.telefono || 'No especificado'}</span>
                      </div>
                    </div>
                    <div className="info-item-modern">
                      <span className="info-icon">📍</span>
                      <div>
                        <span className="info-label">Dirección</span>
                        <span className="info-value">{perfil?.direccion || 'No especificada'}</span>
                      </div>
                    </div>
                    <div className="info-item-modern">
                      <span className="info-icon">🏙️</span>
                      <div>
                        <span className="info-label">Ciudad</span>
                        <span className="info-value">{perfil?.ciudad || 'No especificada'}</span>
                      </div>
                    </div>
                    <div className="info-item-modern">
                      <span className="info-icon">🗺️</span>
                      <div>
                        <span className="info-label">Provincia</span>
                        <span className="info-value">{perfil?.provincia || 'No especificada'}</span>
                      </div>
                    </div>
                    <div className="info-item-modern">
                      <span className="info-icon">📮</span>
                      <div>
                        <span className="info-label">Código Postal</span>
                        <span className="info-value">{perfil?.codigoPostal || 'No especificado'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'tickets' && (
            <div className="tickets-view">
              <h2 className="section-title">Mis Tickets de Soporte</h2>
              <MisTickets />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
