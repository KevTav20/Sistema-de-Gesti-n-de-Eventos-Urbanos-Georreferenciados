# GeoMap - Sistema de Gestión de Eventos Urbanos Georreferenciados

## Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Arquitectura del Proyecto](#arquitectura-del-proyecto)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Backend - API REST](#backend---api-rest)
- [Frontend - Aplicación React](#frontend---aplicación-react)
- [Características Principales](#características-principales)
- [Instalación y Configuración](#instalación-y-configuración)
- [Uso de la Aplicación](#uso-de-la-aplicación)
- [Documentación Técnica Detallada](#documentación-técnica-detallada)

---

## Descripción General

**GeoMap** es una plataforma web colaborativa diseñada para la gestión de eventos urbanos y zonas de interés georreferenciadas. Permite a ciudadanos, negocios y autoridades:

- 📍 **Registrar puntos de interés** en el mapa con coordenadas geográficas
- 🗺️ **Delimitar zonas mediante polígonos** para áreas de riesgo, comerciales, etc.
- 📅 **Gestionar eventos urbanos** vinculados a ubicaciones específicas
- 🏷️ **Categorizar información** (cultura, seguridad, deporte, educación, etc.)
- 🔍 **Buscar y filtrar** ubicaciones por nombre
- 👥 **Colaborar** en la construcción de información urbana comunitaria

### Problema que Resuelve

La falta de una plataforma centralizada para gestionar información geográfica urbana de manera colaborativa, dificultando la planificación comunitaria y la toma de decisiones informadas.

### Solución

Una aplicación web full-stack con interfaz de mapa interactivo que permite visualizar, crear, editar y eliminar información georreferenciada de manera intuitiva.

---

## Arquitectura del Proyecto

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Páginas    │  │ Componentes  │  │   Context    │  │
│  │  (Views)     │  │   (UI)       │  │   (State)    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│         │                  │                  │          │
│         └──────────────────┴──────────────────┘          │
│                          │                                │
│                   ┌──────▼──────┐                        │
│                   │  API Client │                        │
│                   │   (Axios)   │                        │
│                   └──────┬──────┘                        │
└────────────────────────────┬────────────────────────────┘
                             │ HTTP/JSON
                             │
┌────────────────────────────▼────────────────────────────┐
│                   BACKEND (Express.js)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │    Routes    │  │   Services   │  │ Middlewares  │  │
│  │  (Endpoints) │  │  (Business)  │  │   (Auth)     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│         │                  │                  │          │
│         └──────────────────┴──────────────────┘          │
│                          │                                │
│                   ┌──────▼──────┐                        │
│                   │   Models    │                        │
│                   │  (Mongoose) │                        │
│                   └──────┬──────┘                        │
└────────────────────────────┬────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │  MongoDB Atlas  │
                    │   (Database)    │
                    └─────────────────┘
```

### Flujo de Datos

1. **Usuario interactúa** con la interfaz React
2. **Frontend envía petición** HTTP a través de Axios
3. **Backend recibe** la petición en las rutas Express
4. **Middleware de autenticación** valida el token JWT (si es necesario)
5. **Service layer** ejecuta la lógica de negocio
6. **Mongoose** interactúa con MongoDB
7. **Respuesta** viaja de vuelta al frontend
8. **React actualiza** la interfaz con los nuevos datos

---

## Tecnologías Utilizadas

### Backend

| Tecnología     | Versión | Propósito                         |
| -------------- | ------- | --------------------------------- |
| **Node.js**    | 18+     | Runtime de JavaScript             |
| **Express.js** | 4.18.2  | Framework web                     |
| **MongoDB**    | Atlas   | Base de datos NoSQL               |
| **Mongoose**   | 7.5.0   | ODM para MongoDB                  |
| **JWT**        | 9.0.2   | Autenticación con tokens          |
| **bcryptjs**   | 2.4.3   | Encriptación de contraseñas       |
| **CORS**       | 2.8.5   | Manejo de peticiones cross-origin |

### Frontend

| Tecnología        | Versión | Propósito                 |
| ----------------- | ------- | ------------------------- |
| **React**         | 18.2.0  | Biblioteca UI             |
| **React Router**  | 6.16.0  | Enrutamiento SPA          |
| **Leaflet**       | 1.9.4   | Mapas interactivos        |
| **React Leaflet** | 4.2.1   | Integración Leaflet-React |
| **Leaflet Draw**  | 1.0.4   | Dibujo de polígonos       |
| **Axios**         | 1.5.0   | Cliente HTTP              |

### Diseño

- **CSS Variables** para paleta de colores urbana
- **Flexbox/Grid** para layouts responsivos
- **Animaciones CSS** para transiciones suaves
- **SVG Icons** para iconografía personalizada

---

## Estructura del Proyecto

```
PROYECTO FINAL 712/
│
├── backend/                      # Servidor Node.js/Express
│   ├── middlewares/              # Middlewares personalizados
│   │   ├── auth.middleware.js    # Verificación JWT
│   │   └── errorHandler.middleware.js
│   │
│   ├── models/                   # Modelos Mongoose
│   │   ├── User.model.js         # Usuario (auth)
│   │   ├── Location.model.js     # Puntos de interés
│   │   ├── Polygon.model.js      # Zonas delimitadas
│   │   ├── Category.model.js     # Categorías
│   │   └── Event.model.js        # Eventos urbanos
│   │
│   ├── routes/                   # Definición de endpoints
│   │   ├── auth.routes.js        # Login/Register
│   │   ├── location.routes.js    # CRUD locations
│   │   ├── polygon.routes.js     # CRUD polygons
│   │   ├── category.routes.js    # CRUD categories
│   │   └── event.routes.js       # CRUD events
│   │
│   ├── services/                 # Lógica de negocio
│   │   ├── auth.service.js       # Autenticación
│   │   ├── location.service.js   # Gestión locations
│   │   ├── polygon.service.js    # Gestión polygons
│   │   ├── category.service.js   # Gestión categories
│   │   └── event.service.js      # Gestión events
│   │
│   ├── server.js                 # Punto de entrada
│   └── package.json              # Dependencias backend
│
└── frontend/                     # Aplicación React
    ├── public/                   # Archivos estáticos
    │
    └── src/
        ├── components/           # Componentes reutilizables
        │   ├── Navbar.js         # Barra de navegación
        │   ├── Navbar.css
        │   └── PrivateRoute.js   # Protección de rutas
        │
        ├── context/              # Estado global
        │   └── AuthContext.js    # Contexto autenticación
        │
        ├── pages/                # Vistas principales
        │   ├── Home.js           # Landing page
        │   ├── Home.css
        │   ├── Login.js          # Inicio de sesión
        │   ├── Register.js       # Registro
        │   ├── Auth.css          # Estilos auth
        │   ├── Main.js           # Mapa principal
        │   ├── Main.css
        │   ├── Events.js         # Gestión eventos
        │   ├── Categories.js     # Gestión categorías
        │   └── CRUD.css          # Estilos CRUD
        │
        ├── services/             # Servicios API
        │   └── api.js            # Cliente Axios
        │
        ├── App.js                # Componente raíz
        ├── index.js              # Punto de entrada
        ├── index.css             # Estilos globales
        └── package.json          # Dependencias frontend
```

---

## Backend - API REST

### Servidor Principal (`server.js`)

```javascript
// Configuración del servidor Express
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware global
app.use(cors()); // Permite peticiones cross-origin
app.use(express.json()); // Parsea JSON en body
app.use(express.urlencoded({ extended: true }));

// Rutas API
app.use("/api/auth", authRoutes); // Autenticación
app.use("/api/locations", locationRoutes); // Puntos de interés
app.use("/api/polygons", polygonRoutes); // Zonas
app.use("/api/categories", categoryRoutes); // Categorías
app.use("/api/events", eventRoutes); // Eventos

// Conexión MongoDB Atlas
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

app.listen(3000, () => console.log("Server running on port 3000"));
```

### Modelos de Datos

#### 1. **User Model** (`models/User.model.js`)

```javascript
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
  },
  { timestamps: true }
);

// Hash de contraseña antes de guardar
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
```

**Campos:**

- `username`: Nombre de usuario único
- `email`: Correo electrónico único
- `password`: Contraseña hasheada con bcrypt
- `timestamps`: Crea automáticamente `createdAt` y `updatedAt`

#### 2. **Location Model** (`models/Location.model.js`)

```javascript
const locationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: String,
    latitude: {
      type: Number,
      required: true,
      min: -90,
      max: 90,
    },
    longitude: {
      type: Number,
      required: true,
      min: -180,
      max: 180,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);
```

**Campos:**

- `name`: Nombre del punto de interés
- `latitude/longitude`: Coordenadas geográficas validadas
- `category`: Referencia a Category (población con `.populate()`)
- `createdBy`: Usuario que creó el punto

#### 3. **Polygon Model** (`models/Polygon.model.js`)

```javascript
const polygonSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: String,
    coordinates: [
      {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);
```

**Campos:**

- `coordinates`: Array de objetos `{latitude, longitude}`
- Mínimo 3 puntos para formar un polígono válido

#### 4. **Category Model** (`models/Category.model.js`)

```javascript
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: String,
    color: {
      type: String,
      default: "#4299e1",
    },
  },
  { timestamps: true }
);
```

**Categorías predefinidas:**

- Cultura
- Seguridad
- Deporte
- Educación
- Riesgo
- Comercio
- Limpieza
- Servicios

#### 5. **Event Model** (`models/Event.model.js`)

```javascript
const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    date: {
      type: Date,
      required: true,
    },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);
```

**Campos:**

- `location`: Vincula el evento a un punto de interés específico

### Endpoints API

#### Autenticación (`/api/auth`)

```
POST /api/auth/register
Body: { username, email, password }
Response: { success, message, token, user }

POST /api/auth/login
Body: { email, password }
Response: { success, message, token, user }
```

#### Locations (`/api/locations`)

```
GET    /api/locations              # Obtener todas
GET    /api/locations/search?name= # Buscar por nombre
POST   /api/locations              # Crear nueva
PUT    /api/locations/:id          # Actualizar
DELETE /api/locations/:id          # Eliminar
```

#### Polygons (`/api/polygons`)

```
GET    /api/polygons               # Obtener todos
POST   /api/polygons               # Crear nuevo
DELETE /api/polygons/:id           # Eliminar
```

#### Categories (`/api/categories`)

```
GET    /api/categories             # Obtener todas
POST   /api/categories             # Crear nueva
POST   /api/categories/initialize  # Inicializar predefinidas
PUT    /api/categories/:id         # Actualizar
DELETE /api/categories/:id         # Eliminar
```

#### Events (`/api/events`)

```
GET    /api/events                 # Obtener todos
POST   /api/events                 # Crear nuevo
PUT    /api/events/:id             # Actualizar
DELETE /api/events/:id             # Eliminar
```

### Middleware de Autenticación

```javascript
// middlewares/auth.middleware.js
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No autorizado",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Token inválido",
    });
  }
};
```

**Uso:** Protege rutas que requieren autenticación

```javascript
router.post("/locations", authMiddleware, createLocation);
```

---

## Frontend - Aplicación React

### Estructura de Componentes

#### App Principal (`App.js`)

```javascript
function App() {
  return (
    <AuthProvider>
      {" "}
      {/* Contexto global de autenticación */}
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rutas protegidas */}
          <Route
            path="/main"
            element={
              <PrivateRoute>
                <Main />
              </PrivateRoute>
            }
          />

          <Route
            path="/categories"
            element={
              <PrivateRoute>
                <Categories />
              </PrivateRoute>
            }
          />

          <Route
            path="/events"
            element={
              <PrivateRoute>
                <Events />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
```

### Context API - Autenticación

```javascript
// context/AuthContext.js
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Login
  const login = async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    if (response.data.success) {
      setToken(response.data.token);
      setUser(response.data.user);
      localStorage.setItem("token", response.data.token);
    }
    return response.data;
  };

  // Logout
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
```

**Funcionalidad:**

- Mantiene el estado de autenticación global
- Persiste el token en `localStorage`
- Provee funciones `login`, `logout`, `register`

### Cliente API (`services/api.js`)

```javascript
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor: Agrega token a todas las peticiones
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

**Uso en componentes:**

```javascript
const response = await api.get("/locations");
const data = response.data.data;
```

### Componente Principal - Mapa (`Main.js`)

#### Estado del Componente

```javascript
const [locations, setLocations] = useState([]); // Puntos de interés
const [polygons, setPolygons] = useState([]); // Zonas delimitadas
const [categories, setCategories] = useState([]); // Categorías disponibles
const [drawingMode, setDrawingMode] = useState(false); // Modo dibujo activo
const [currentPolygon, setCurrentPolygon] = useState(null);
const [showLocationForm, setShowLocationForm] = useState(false);
const [searchTerm, setSearchTerm] = useState("");
```

#### Funciones Principales

**1. Cargar Datos**

```javascript
const loadLocations = async () => {
  const response = await api.get("/locations");
  setLocations(response.data.data);
};

const loadPolygons = async () => {
  const response = await api.get("/polygons");
  setPolygons(response.data.data);
};
```

**2. Crear Punto de Interés**

```javascript
const handleMapClick = (latlng) => {
  if (addingLocationMode) {
    setLocationForm({
      name: "",
      description: "",
      latitude: latlng.lat,
      longitude: latlng.lng,
      category: "",
    });
    setShowLocationForm(true);
  }
};

const handleCreateLocation = async (e) => {
  e.preventDefault();
  await api.post("/locations", locationForm);
  setShowLocationForm(false);
  loadLocations();
};
```

**3. Dibujar Polígono**

```javascript
const handleStartDrawing = () => {
  setDrawingMode(true);
  setCurrentPolygon({ name: "", description: "", coordinates: [] });
};

const handleMapClick = (latlng) => {
  if (drawingMode) {
    setCurrentPolygon((prev) => ({
      ...prev,
      coordinates: [
        ...prev.coordinates,
        {
          latitude: latlng.lat,
          longitude: latlng.lng,
        },
      ],
    }));
  }
};

const handleSavePolygon = async () => {
  if (currentPolygon.coordinates.length < 3) {
    alert("Se necesitan al menos 3 puntos");
    return;
  }
  await api.post("/polygons", {
    name: polygonForm.name,
    description: polygonForm.description,
    coordinates: currentPolygon.coordinates,
  });
  loadPolygons();
};
```

**4. Búsqueda**

```javascript
const handleSearch = async () => {
  if (!searchTerm.trim()) {
    loadLocations();
    return;
  }
  const response = await api.get(
    `/locations/search?name=${encodeURIComponent(searchTerm)}`
  );
  setLocations(response.data.data);
};
```

#### Integración con Leaflet

```javascript
<MapContainer center={[19.4326, -99.1332]} zoom={13}>
  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

  <MapClickHandler onMapClick={handleMapClick} />

  {/* Renderizar marcadores */}
  {locations.map((location) => (
    <Marker
      key={location._id}
      position={[location.latitude, location.longitude]}
    >
      <Popup>
        <h4>{location.name}</h4>
        <p>{location.description}</p>
      </Popup>
    </Marker>
  ))}

  {/* Renderizar polígonos */}
  {polygons.map((polygon) => (
    <Polygon
      key={polygon._id}
      positions={polygon.coordinates.map((c) => [c.latitude, c.longitude])}
      pathOptions={{ color: "#4299e1", fillOpacity: 0.4 }}
    />
  ))}
</MapContainer>
```

### Páginas CRUD (Events & Categories)

#### Estructura Común

```javascript
const [items, setItems] = useState([]);
const [showForm, setShowForm] = useState(false);
const [editingItem, setEditingItem] = useState(null);
const [formData, setFormData] = useState({});

// Cargar datos
useEffect(() => {
  loadItems();
}, []);

// CRUD Operations
const handleSubmit = async (e) => {
  e.preventDefault();
  if (editingItem) {
    await api.put(`/endpoint/${editingItem._id}`, formData);
  } else {
    await api.post("/endpoint", formData);
  }
  loadItems();
  setShowForm(false);
};

const handleDelete = async (id) => {
  if (window.confirm("¿Estás seguro?")) {
    await api.delete(`/endpoint/${id}`);
    loadItems();
  }
};
```

---

## Sistema de Diseño

### Paleta de Colores Urbana

```css
:root {
  /* Azules */
  --primary: #4299e1;
  --primary-dark: #2b6cb0;
  --primary-light: #63b3ed;

  /* Grises */
  --dark: #2d3748;
  --text-main: #4a5568;
  --text-light: #718096;

  /* Backgrounds */
  --bg-main: #f7fafc;
  --bg-card: #ffffff;
  --bg-secondary: #edf2f7;

  /* Utilidades */
  --accent: #48bb78; /* Verde */
  --danger: #f56565; /* Rojo */
  --border: #cbd5e0;
}
```

### Componentes de UI

**Botones con Gradiente**

```css
.add-location-button {
  background: linear-gradient(
    135deg,
    var(--primary) 0%,
    var(--primary-dark) 100%
  );
  box-shadow: 0 4px 16px rgba(66, 153, 225, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.add-location-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(66, 153, 225, 0.4);
}
```

**Modal Flotante**

```css
.location-form-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(45, 55, 72, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.location-form {
  background: rgba(255, 255, 255, 0.98);
  border-radius: var(--radius-2xl);
  padding: 2.5rem;
  max-width: 500px;
  animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
```

**Iconos SVG Animados**

```javascript
const CategoryIcon = ({ color }) => (
  <div
    className="category-color-badge shape-animate-float"
    style={{ backgroundColor: color }}
  >
    <svg width="24" height="24" viewBox="0 0 24 24">
      <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white" />
    </svg>
  </div>
);
```

---

## Instalación y Configuración

### Requisitos Previos

- Node.js 18+
- npm o yarn
- Cuenta MongoDB Atlas (o MongoDB local)

### Instalación Backend

```bash
cd backend
npm install

# Configurar variables de entorno (opcional)
# Crear archivo .env con:
# MONGODB_URI=tu_uri_de_mongodb
# JWT_SECRET=tu_secreto_jwt
# PORT=3000

npm start
# Servidor corriendo en http://localhost:3000
```

### Instalación Frontend

```bash
cd frontend
npm install

npm start
# Aplicación corriendo en http://localhost:4000
```

### Configuración MongoDB Atlas

1. Crear cluster en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Obtener connection string
3. Actualizar `MONGODB_URI` en `backend/server.js` o `.env`
4. Whitelist IP address en Atlas

---

## Uso de la Aplicación

### 1. Registro e Inicio de Sesión

**Registro:**

1. Navegar a `/register`
2. Ingresar username, email, password
3. Click en "Registrarse"
4. Redirección automática a `/main`

**Login:**

1. Navegar a `/login`
2. Ingresar email y password
3. Click en "Iniciar Sesión"
4. Redirección a `/main`

### 2. Gestión de Puntos de Interés

**Crear:**

1. En `/main`, click "Agregar Punto de Interés"
2. Click en el mapa donde deseas el punto
3. Llenar formulario (nombre, descripción, categoría)
4. Click "Guardar"

**Editar:**

1. Click en marcador del mapa
2. Click "Editar" en popup
3. Modificar información
4. Click "Guardar"

**Buscar:**

1. Usar barra de búsqueda en sidebar
2. Escribir nombre del punto
3. Click "Buscar" o presionar Enter

### 3. Dibujar Zonas (Polígonos)

**Crear:**

1. Click "Dibujar Polígono"
2. Click en el mapa para agregar puntos (mínimo 3)
3. Click "Guardar Zona"
4. Llenar nombre y descripción
5. Click "Guardar Polígono"

**Visualizar:**

- Polígonos aparecen con relleno azul semitransparente
- Click en polígono para ver información

### 4. Gestión de Categorías

**Navegar a `/categories`:**

1. Click "Nueva Categoría"
2. Ingresar nombre, descripción
3. Seleccionar color
4. Click "Crear"

**Categorías predefinidas:**

- Se inicializan automáticamente al cargar la página
- Cultura, Seguridad, Deporte, Educación, etc.

### 5. Gestión de Eventos

**Navegar a `/events`:**

1. Click "Registrar Evento"
2. Ingresar título, descripción, fecha
3. Opcionalmente vincular a un punto de interés
4. Click "Crear"

---

## Documentación Técnica Detallada

### Flujo de Autenticación

```
1. Usuario envía credenciales
   ↓
2. Backend valida en User.model
   ↓
3. bcrypt.compare() verifica password
   ↓
4. jwt.sign() genera token
   ↓
5. Token enviado al frontend
   ↓
6. Frontend guarda en localStorage
   ↓
7. Axios interceptor agrega token a headers
   ↓
8. Backend valida token en cada petición protegida
```

### Gestión de Estado

**Global (Context API):**

- Autenticación (user, token)
- Funciones login/logout/register

**Local (useState):**

- Listas de datos (locations, polygons, events)
- Estados de formularios
- Modos de interacción (drawingMode, editingLocation)

### Optimizaciones Implementadas

1. **Lazy Loading:** Componentes cargados bajo demanda
2. **Memoización:** `useCallback` para funciones costosas
3. **Debouncing:** Búsqueda con delay para reducir peticiones
4. **Caching:** localStorage para token de autenticación
5. **Validación:** Frontend y backend validan datos

### Seguridad

**Backend:**

- Passwords hasheados con bcrypt (salt rounds: 10)
- JWT con expiración configurable
- Validación de entrada en todos los endpoints
- CORS configurado para origen específico

**Frontend:**

- Rutas protegidas con `PrivateRoute`
- Token en headers Authorization
- Sanitización de inputs
- Validación de formularios

---

## Solución de Problemas

### Error: "Cannot connect to MongoDB"

**Solución:** Verificar URI de conexión y whitelist de IP en Atlas

### Error: "Token inválido"

**Solución:** Limpiar localStorage y volver a iniciar sesión

### Mapa no se muestra

**Solución:** Verificar que Leaflet CSS esté importado correctamente

### Polígono no se guarda

**Solución:** Asegurar mínimo 3 puntos antes de guardar

---

## Licencia

ISC License

---

## Futuras Mejoras

- [ ] Notificaciones en tiempo real (WebSockets)
- [ ] Exportar datos a GeoJSON
- [ ] Filtros avanzados por categoría y fecha
- [ ] Modo oscuro
- [ ] Aplicación móvil (React Native)
- [ ] Integración con redes sociales
- [ ] Sistema de comentarios en puntos de interés
- [ ] Análisis de datos geográficos
