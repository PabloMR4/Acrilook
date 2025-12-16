# 🎭 Guía de Acrispin - Mascota Oficial de AcriLook

¡Acrispin ahora tiene vida propia con burbujas de diálogo interactivas, expresiones faciales y seguimiento de ojos!

## 🌟 Nuevas Funcionalidades Implementadas

✅ **Burbujas de diálogo** - Mensajes contextuales y aleatorios
✅ **8 Expresiones faciales** - happy, excited, love, thinking, surprised, sad, wink, sleeping
✅ **Seguimiento de ojos** - Los ojos siguen el cursor del usuario
✅ **Integrado en la app** - Carrito vacío, checkout exitoso, productos con descuento
✅ **Totalmente personalizable** - Tamaños, mensajes, reacciones y más

## 📦 Componentes Disponibles

### 1. `Acrispin` - Componente Base
El personaje básico de Acrispin con animaciones.

```jsx
import Acrispin from './components/Acrispin';

// Uso básico
<Acrispin size="medium" animated={true} />

// Con burbuja de diálogo
<Acrispin
  size="large"
  animated={true}
  showDialogue={true}
  dialogueAutoChange={true}
  dialogueInterval={8000}
/>

// Con mensaje personalizado
<Acrispin
  size="large"
  showDialogue={true}
  dialogueMessage="¡Bienvenido a AcriLook!"
  dialogueAutoChange={false}
/>
```

**Props:**
- `size`: 'small' | 'medium' | 'large' | 'xlarge'
- `animated`: boolean (animaciones del personaje)
- `showDialogue`: boolean (mostrar burbujas)
- `dialogueMessage`: string (mensaje personalizado)
- `dialogueAutoChange`: boolean (cambiar mensajes automáticamente)
- `dialogueInterval`: number (milisegundos entre cambios)
- `reaction`: 'happy' | 'excited' | 'love' | 'thinking' | 'surprised' | 'sad' | 'wink' | 'sleeping' (expresión facial)
- `eyeTracking`: boolean (activar seguimiento de ojos con el cursor)

---

### 2. `AcrispinDialogue` - Burbujas de Diálogo
Componente de burbujas reutilizable.

```jsx
import AcrispinDialogue from './components/AcrispinDialogue';

<AcrispinDialogue
  showBubble={true}
  autoChange={true}
  changeInterval={8000}
  contextMessage="¡Oferta especial!" // Opcional
/>
```

**Características:**
- ✅ Mensajes aleatorios de 7 categorías diferentes
- ✅ Saludos según hora del día (mañana, tarde, noche)
- ✅ Tips sobre acrílico
- ✅ Chistes relacionados con la marca
- ✅ Frases motivacionales
- ✅ Mensajes de compra
- ✅ Animaciones suaves con fade in/out

---

### 3. `AcrispinWithDialogue` - Componente Todo-en-Uno
Acrispin completo listo para usar.

```jsx
import AcrispinWithDialogue from './components/AcrispinWithDialogue';

// Acrispin flotante en esquina
<AcrispinWithDialogue
  position="bottom-right"
  size="large"
/>

// Con mensaje contextual
<AcrispinWithDialogue
  position="top-left"
  contextualMessages="¡Descuento del 20%!"
/>

// Con click handler
<AcrispinWithDialogue
  onClick={({ showCustomMessage }) => {
    showCustomMessage('¡Gracias por hacer click! 💜', 3000);
  }}
/>
```

**Props:**
- `size`: 'small' | 'medium' | 'large' | 'xlarge'
- `position`: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center' | 'static'
- `showOnMount`: boolean (visible al cargar)
- `contextualMessages`: string (mensaje específico)
- `onClick`: function (manejador de clicks)
- `className`: string (clases CSS adicionales)

---

### 4. `AcrispinReactions` - Sistema de Expresiones Faciales
Acrispin con 8 expresiones faciales diferentes para transmitir emociones.

```jsx
import Acrispin from './components/Acrispin';

// Acrispin feliz (por defecto)
<Acrispin reaction="happy" />

// Acrispin emocionado (rebotando)
<Acrispin reaction="excited" size="large" />

// Acrispin enamorado (con corazones)
<Acrispin reaction="love" size="medium" />

// Acrispin pensando
<Acrispin reaction="thinking" />

// Acrispin sorprendido
<Acrispin reaction="surprised" />

// Acrispin triste (con lágrima)
<Acrispin reaction="sad" />

// Acrispin guiñando el ojo
<Acrispin reaction="wink" />

// Acrispin durmiendo (con ZZZ)
<Acrispin reaction="sleeping" />

// Con diálogo y reacción
<Acrispin
  reaction="love"
  showDialogue={true}
  dialogueMessage="¡Me encanta este producto! 💜"
/>
```

**Reacciones disponibles:**
- `happy` - Feliz con sonrisa (parpadea)
- `excited` - Emocionado (rebota con energía)
- `love` - Enamorado (corazones flotantes)
- `thinking` - Pensativo (ojos mirando alrededor)
- `surprised` - Sorprendido (ojos grandes, temblor)
- `sad` - Triste (lágrima cayendo)
- `wink` - Guiño (ojo cerrado)
- `sleeping` - Durmiendo (ZZZ flotantes)

Cada reacción tiene animaciones únicas y expresiones faciales específicas.

---

### 5. `AcrispinEyeTracking` - Seguimiento de Ojos
Acrispin que sigue el cursor del usuario con los ojos, creando una experiencia interactiva única.

```jsx
import Acrispin from './components/Acrispin';

// Acrispin con seguimiento de ojos
<Acrispin
  eyeTracking={true}
  size="large"
  animated={true}
/>

// Con seguimiento de ojos y diálogo
<Acrispin
  eyeTracking={true}
  showDialogue={true}
  dialogueAutoChange={true}
  size="xlarge"
/>

// Flotante con seguimiento
<div style={{ position: 'fixed', bottom: '20px', right: '20px' }}>
  <Acrispin
    eyeTracking={true}
    showDialogue={true}
    dialogueMessage="¡Te estoy observando! 👀"
  />
</div>
```

**Características:**
- Las pupilas siguen el movimiento del cursor en tiempo real
- Animación suave y natural de los ojos
- Incluye cejas expresivas que se mueven
- Compatible con burbujas de diálogo
- Hover effect: pupilas se agrandan al pasar el cursor

**Nota:** El eye tracking consume recursos, úsalo con moderación (1-2 instancias máximo por página).

---

## 🎨 Ejemplos de Uso

### Ejemplo 1: Acrispin en la página de inicio
```jsx
// En Home.jsx
import AcrispinWithDialogue from './components/AcrispinWithDialogue';

function Home() {
  return (
    <div>
      {/* Tu contenido */}

      <AcrispinWithDialogue
        position="bottom-right"
        size="large"
      />
    </div>
  );
}
```

### Ejemplo 2: Mensaje cuando se agrega al carrito
```jsx
// En ProductCard.jsx
import { useState } from 'react';
import AcrispinWithDialogue from './components/AcrispinWithDialogue';

function ProductCard() {
  const [acrispinMessage, setAcrispinMessage] = useState(null);

  const handleAddToCart = () => {
    // Lógica de agregar al carrito
    setAcrispinMessage('¡Excelente elección! 🛒✨');

    setTimeout(() => {
      setAcrispinMessage(null);
    }, 3000);
  };

  return (
    <div>
      <button onClick={handleAddToCart}>Agregar al Carrito</button>

      <AcrispinWithDialogue
        position="static"
        contextualMessages={acrispinMessage}
      />
    </div>
  );
}
```

### Ejemplo 3: Acrispin en el carrito vacío
```jsx
// En Cart.jsx
import Acrispin from './components/Acrispin';

function Cart({ items }) {
  if (items.length === 0) {
    return (
      <div className="empty-cart">
        <Acrispin
          size="xlarge"
          animated={true}
          showDialogue={true}
          dialogueMessage="¡Tu carrito está vacío! ¿Exploramos juntos? 🛍️"
          dialogueAutoChange={false}
        />
      </div>
    );
  }

  // Carrito con productos...
}
```

### Ejemplo 4: Celebración al completar compra
```jsx
// En Checkout.jsx
import { useState } from 'react';
import Acrispin from './components/Acrispin';

function Checkout() {
  const [orderCompleted, setOrderCompleted] = useState(false);

  const handleCompleteOrder = () => {
    // Lógica de compra
    setOrderCompleted(true);
  };

  return (
    <div>
      {orderCompleted && (
        <div className="order-success">
          <Acrispin
            size="xlarge"
            animated={true}
            showDialogue={true}
            dialogueMessage="¡Pedido completado! 🎉 ¡Gracias por tu compra!"
          />
        </div>
      )}
    </div>
  );
}
```

### Ejemplo 5: Asistente flotante interactivo
```jsx
// En App.jsx
import { useState } from 'react';
import AcrispinWithDialogue from './components/AcrispinWithDialogue';

function App() {
  const handleAcrispinClick = ({ showCustomMessage }) => {
    const messages = [
      '¿Necesitas ayuda? 🤔',
      '¡Estoy aquí para ti! 💜',
      '¿Buscas algo en particular? 🔍',
      '¡Explora nuestros productos! ✨'
    ];

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    showCustomMessage(randomMessage, 4000);
  };

  return (
    <div>
      {/* Tu app */}

      <AcrispinWithDialogue
        position="bottom-right"
        size="large"
        onClick={handleAcrispinClick}
      />
    </div>
  );
}
```

### Ejemplo 6: Acrispin en diferentes páginas
```jsx
// Contexto según página
import { useLocation } from 'react-router-dom';
import AcrispinWithDialogue from './components/AcrispinWithDialogue';

function PageAcrispin() {
  const location = useLocation();

  const getContextMessage = () => {
    switch(location.pathname) {
      case '/':
        return '¡Bienvenido a AcriLook! 👋';
      case '/cart':
        return '¿Listo para finalizar tu compra? 🛒';
      case '/contact':
        return '¿En qué puedo ayudarte? 💬';
      default:
        return null; // Usa mensajes aleatorios
    }
  };

  return (
    <AcrispinWithDialogue
      position="bottom-right"
      contextualMessages={getContextMessage()}
    />
  );
}
```

### Ejemplo 7: Usando Reacciones según contexto
```jsx
// Diferentes reacciones según la acción del usuario
import { useState } from 'react';
import Acrispin from './components/Acrispin';

function ProductInteraction() {
  const [reaction, setReaction] = useState('happy');
  const [message, setMessage] = useState('');

  const handleAddToCart = () => {
    setReaction('excited');
    setMessage('¡Agregado al carrito! 🎉');
  };

  const handleAddToFavorites = () => {
    setReaction('love');
    setMessage('¡Añadido a favoritos! 💜');
  };

  const handleOutOfStock = () => {
    setReaction('sad');
    setMessage('Agotado... volverá pronto 😢');
  };

  const handleThinking = () => {
    setReaction('thinking');
    setMessage('¿Necesitas ayuda para decidir? 🤔');
  };

  return (
    <div>
      <Acrispin
        reaction={reaction}
        showDialogue={true}
        dialogueMessage={message}
        size="large"
      />

      <button onClick={handleAddToCart}>Agregar al carrito</button>
      <button onClick={handleAddToFavorites}>Favoritos</button>
      <button onClick={handleOutOfStock}>Sin stock</button>
      <button onClick={handleThinking}>Indeciso</button>
    </div>
  );
}
```

### Ejemplo 8: Eye Tracking en Landing Page
```jsx
// Acrispin con seguimiento de ojos en la página principal
import Acrispin from './components/Acrispin';

function LandingPage() {
  return (
    <div>
      <header>
        <h1>Bienvenido a AcriLook</h1>
      </header>

      {/* Acrispin siguiendo el cursor */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 1000
      }}>
        <Acrispin
          eyeTracking={true}
          showDialogue={true}
          dialogueAutoChange={true}
          size="large"
          animated={true}
        />
      </div>
    </div>
  );
}
```

### Ejemplo 9: Combinando Reacciones con Descuentos
```jsx
// En ProductCard.jsx con descuentos
import Acrispin from './components/Acrispin';

function ProductCardWithDiscount({ product }) {
  if (product.hasDiscount) {
    return (
      <div className="product-card">
        <img src={product.image} alt={product.name} />

        {/* Acrispin emocionado mostrando el descuento */}
        <div className="discount-acrispin">
          <Acrispin
            reaction="excited"
            size="small"
            showDialogue={true}
            dialogueMessage={`¡${product.discount}% OFF! 🎁`}
            dialogueAutoChange={false}
          />
        </div>

        <h3>{product.name}</h3>
        <p className="price">${product.price}</p>
      </div>
    );
  }

  return <NormalProductCard product={product} />;
}
```

### Ejemplo 10: Sistema de Feedback Emocional
```jsx
// Acrispin reaccionando a las acciones del usuario
import { useState, useEffect } from 'react';
import Acrispin from './components/Acrispin';

function EmotionalFeedback() {
  const [reaction, setReaction] = useState('happy');
  const [message, setMessage] = useState('');

  // Reaccionar a eventos del usuario
  const handleUserAction = (action) => {
    switch(action) {
      case 'purchase_success':
        setReaction('excited');
        setMessage('¡Compra exitosa! 🎉');
        break;
      case 'added_favorite':
        setReaction('love');
        setMessage('¡Me encanta tu elección! 💜');
        break;
      case 'cart_empty':
        setReaction('sad');
        setMessage('El carrito está vacío 😢');
        break;
      case 'browsing':
        setReaction('thinking');
        setMessage('¿Te ayudo a encontrar algo? 🤔');
        break;
      case 'surprise_offer':
        setReaction('surprised');
        setMessage('¡Oferta especial para ti! 😲');
        break;
      case 'waiting':
        setReaction('sleeping');
        setMessage('Despiértame si necesitas algo... 💤');
        break;
      default:
        setReaction('happy');
        setMessage('¡Hola! 😊');
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '20px', left: '20px' }}>
      <Acrispin
        reaction={reaction}
        showDialogue={true}
        dialogueMessage={message}
        size="large"
        animated={true}
      />
    </div>
  );
}
```

---

## 🎯 Casos de Uso Recomendados

### ✅ Implementación Recomendada

1. **Página de inicio**: Saludo y guía para nuevos usuarios
2. **Carrito vacío**: Mensaje motivacional para explorar productos
3. **Checkout exitoso**: Celebración y agradecimiento
4. **Productos en oferta**: Resaltar descuentos especiales
5. **Ayuda contextual**: Asistente flotante interactivo
6. **Páginas de error**: Mensaje amigable y guía de navegación

### 💡 Mensajes Contextuales

```jsx
// Cuando se aplica un cupón
<Acrispin dialogueMessage="¡Cupón aplicado! 🎁 ¡Qué ahorro!" />

// En página de contacto
<Acrispin dialogueMessage="¿Dudas? ¡Estamos para ayudarte! 📧" />

// En productos agotados
<Acrispin dialogueMessage="¡Pronto volverá! Suscríbete para saber cuando 📬" />

// En envío gratis alcanzado
<Acrispin dialogueMessage="¡Envío gratis desbloqueado! 🚚✨" />
```

---

## 🎨 Personalización de Estilos

### Modificar colores de la burbuja
```css
/* En AcrispinDialogue.css */
.acrispin-dialogue-bubble {
  background: linear-gradient(135deg, #TU_COLOR_1, #TU_COLOR_2);
}
```

### Ajustar posición
```css
/* En AcrispinWithDialogue.css */
.acrispin-with-dialogue.bottom-right {
  bottom: 80px; /* Más arriba si tienes botón flotante */
  right: 20px;
}
```

### Cambiar velocidad de animaciones
```jsx
<Acrispin
  dialogueInterval={5000} // Cambiar cada 5 segundos
/>
```

---

## 📝 Banco de Mensajes

Puedes editar los mensajes en `AcrispinDialogue.jsx`:

```jsx
const messages = {
  greetings: [...], // Saludos generales
  morningGreetings: [...], // Buenos días
  afternoonGreetings: [...], // Buenas tardes
  eveningGreetings: [...], // Buenas noches
  tips: [...], // Tips sobre acrílico
  jokes: [...], // Chistes y frases divertidas
  phrases: [...], // Frases de marca
  shopping: [...], // Mensajes de compra
  motivation: [...] // Motivacionales
};
```

### Agregar nuevos mensajes
```jsx
tips: [
  ...mensajesExistentes,
  '🌟 Nuevo tip: El acrílico es perfecto para muebles modernos'
]
```

---

## 🚀 Funcionalidades Implementadas ✅

- [✅] **Sistema de reacciones** - 8 expresiones faciales diferentes (happy, excited, love, thinking, surprised, sad, wink, sleeping)
- [✅] **Seguimiento del cursor con los ojos** - Interacción en tiempo real
- [✅] **Burbujas de diálogo** - Mensajes contextuales y aleatorios
- [✅] **Integrado en la app** - Carrito vacío, checkout exitoso, productos con descuento, página principal

## 🎯 Próximas Mejoras Sugeridas

- [ ] Integración con chatbot (asistente virtual completo)
- [ ] Sistema de logros y colección de Acrispins
- [ ] Stickers descargables (WhatsApp, Telegram)
- [ ] Acrispin temático (navidad, halloween, eventos especiales)
- [ ] Modo oscuro de Acrispin
- [ ] Sonidos al interactuar con Acrispin
- [ ] Animación de caminar/moverse por la pantalla

---

## ❓ Preguntas Frecuentes

**P: ¿Puedo tener varios Acrispins en la misma página?**
R: Sí, pero recomendamos máximo 2 para no saturar al usuario.

**P: ¿Cómo desactivo el cambio automático de mensajes?**
R: Usa `dialogueAutoChange={false}` y proporciona un `dialogueMessage` fijo.

**P: ¿Puedo cambiar los mensajes dinámicamente?**
R: Sí, actualiza la prop `dialogueMessage` o `contextualMessages` según el estado.

**P: ¿Funciona en móvil?**
R: Sí, todos los componentes son responsive.

---

¡Acrispin está listo para dar vida a tu marca! 💜✨
