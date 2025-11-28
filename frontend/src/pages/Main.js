import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polygon as LeafletPolygon, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import Navbar from '../components/Navbar';
import api from '../services/api';
import './Main.css';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const MapClickHandler = ({ onMapClick, drawingMode, addingLocationMode }) => {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng);
    },
  });
  return null;
};

const MapController = ({ mapRef }) => {
  const map = useMap();
  useEffect(() => {
    if (mapRef) {
      mapRef.current = map;
    }
  }, [map, mapRef]);
  return null;
};

const Main = () => {
  const [locations, setLocations] = useState([]);
  const [polygons, setPolygons] = useState([]);
  const [editingLocation, setEditingLocation] = useState(null);
  const [showLocationForm, setShowLocationForm] = useState(false);
  const [locationForm, setLocationForm] = useState({ name: '', description: '', latitude: 0, longitude: 0, category: '' });
  const [drawingMode, setDrawingMode] = useState(false);
  const [currentPolygon, setCurrentPolygon] = useState(null);
  const [showPolygonForm, setShowPolygonForm] = useState(false);
  const [polygonForm, setPolygonForm] = useState({ name: '', description: '' });
  const [categories, setCategories] = useState([]);
  const [addingLocationMode, setAddingLocationMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const mapRef = useRef(null);

  useEffect(() => {
    loadLocations();
    loadPolygons();
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data.data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadLocations = async () => {
    try {
      const response = await api.get('/locations');
      setLocations(response.data.data);
    } catch (error) {
      console.error('Error loading locations:', error);
    }
  };

  const loadPolygons = async () => {
    try {
      const response = await api.get('/polygons');
      setPolygons(response.data.data);
    } catch (error) {
      console.error('Error loading polygons:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadLocations();
      return;
    }
    try {
      const response = await api.get(`/locations/search?name=${encodeURIComponent(searchTerm)}`);
      setLocations(response.data.data);
    } catch (error) {
      console.error('Error searching locations:', error);
      alert('Error al buscar ubicaciones');
    }
  };

  const handleMapClick = (latlng) => {
    if (drawingMode) {
      setCurrentPolygon(prev => ({
        ...prev,
        coordinates: [...(prev?.coordinates || []), { latitude: latlng.lat, longitude: latlng.lng }]
      }));
    } else if (addingLocationMode) {
      setLocationForm({
        name: '',
        description: '',
        latitude: latlng.lat,
        longitude: latlng.lng,
        category: ''
      });
      setShowLocationForm(true);
      setAddingLocationMode(false);
    }
  };

  const handleCreateLocation = async (e) => {
    e.preventDefault();
    try {
      const formData = { ...locationForm };
      if (!formData.category) {
        delete formData.category;
      }
      const response = await api.post('/locations', formData);
      if (response.data.success) {
        setShowLocationForm(false);
        setLocationForm({ name: '', description: '', latitude: 0, longitude: 0, category: '' });
        await loadLocations(); // Asegurar que se recargue
      }
    } catch (error) {
      console.error('Error creating location:', error);
      alert(error.response?.data?.message || 'Error al crear punto de interés');
    }
  };

  const handleUpdateLocation = async (locationId, updatedData) => {
    try {
      await api.put(`/locations/${locationId}`, updatedData);
      loadLocations();
      setEditingLocation(null);
    } catch (error) {
      console.error('Error updating location:', error);
      alert('Error al actualizar ubicación');
    }
  };

  const handleDeleteLocation = async (locationId) => {
    if (window.confirm('¿Estás seguro de eliminar esta ubicación?')) {
      try {
        await api.delete(`/locations/${locationId}`);
        loadLocations();
      } catch (error) {
        console.error('Error deleting location:', error);
        alert('Error al eliminar ubicación');
      }
    }
  };


  const handleStartDrawing = () => {
    setDrawingMode(true);
    setAddingLocationMode(false);
    setCurrentPolygon({ name: '', description: '', coordinates: [] });
  };

  const handleStartAddingLocation = () => {
    setAddingLocationMode(true);
    setDrawingMode(false);
  };

  const handleSavePolygon = async (e) => {
    e.preventDefault();
    if (!currentPolygon || currentPolygon.coordinates.length < 3) {
      alert('Se necesitan al menos 3 puntos para crear un polígono');
      return;
    }

    if (!polygonForm.name.trim()) {
      alert('El nombre del polígono es requerido');
      return;
    }

    try {
      await api.post('/polygons', {
        name: polygonForm.name,
        description: polygonForm.description,
        coordinates: currentPolygon.coordinates
      });
      setDrawingMode(false);
      setAddingLocationMode(false);
      setCurrentPolygon(null);
      setShowPolygonForm(false);
      setPolygonForm({ name: '', description: '' });
      loadPolygons();
    } catch (error) {
      console.error('Error creating polygon:', error);
      alert('Error al crear polígono');
    }
  };

  const handleShowPolygonForm = () => {
    if (!currentPolygon || currentPolygon.coordinates.length < 3) {
      alert('Se necesitan al menos 3 puntos para crear un polígono');
      return;
    }
    setShowPolygonForm(true);
  };

  const handleDeletePolygon = async (polygonId) => {
    if (window.confirm('¿Estás seguro de eliminar este polígono?')) {
      try {
        await api.delete(`/polygons/${polygonId}`);
        loadPolygons();
      } catch (error) {
        console.error('Error deleting polygon:', error);
        alert('Error al eliminar polígono');
      }
    }
  };

  const handleCancelDrawing = () => {
    setDrawingMode(false);
    setAddingLocationMode(false);
    setCurrentPolygon(null);
    setShowPolygonForm(false);
    setPolygonForm({ name: '', description: '' });
  };

  const handleCenterOnPolygon = (polygon) => {
    if (polygon.coordinates && polygon.coordinates.length > 0 && mapRef.current) {
      const centerLat = polygon.coordinates.reduce((sum, coord) => sum + coord.latitude, 0) / polygon.coordinates.length;
      const centerLng = polygon.coordinates.reduce((sum, coord) => sum + coord.longitude, 0) / polygon.coordinates.length;
      mapRef.current.setView([centerLat, centerLng], 15);
    }
  };

  return (
    <div className="main-container">
      <Navbar />
      <div className="main-content">
        <div className="sidebar">
          <div className="locations-table-section">
            <h3>Puntos de Interés</h3>
            <button
              onClick={handleStartAddingLocation}
              className="add-location-button"
              disabled={drawingMode || addingLocationMode}
              title={addingLocationMode ? 'Haz clic en el mapa para agregar un punto' : 'Activa el modo para agregar puntos de interés en el mapa'}
            >
              {addingLocationMode ? 'Modo activo - Haz clic en el mapa' : 'Agregar Punto de Interés'}
            </button>

            <div className="search-container" style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                placeholder="Buscar por nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                style={{ padding: '0.5rem', flex: 1, borderRadius: '4px', border: '1px solid #ddd' }}
              />
              <button
                onClick={handleSearch}
                style={{ padding: '0.5rem 1rem', background: '#4a5568', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Buscar
              </button>
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    loadLocations();
                  }}
                  style={{ padding: '0.5rem', background: '#e2e8f0', color: '#4a5568', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  title="Limpiar búsqueda"
                >
                  Limpiar
                </button>
              )}
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Categoría</th>
                    <th>Latitud</th>
                    <th>Longitud</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {locations && locations.length > 0 ? (
                    locations.map((location) => (
                      <tr key={location._id}>
                        <td><strong>{location.name}</strong></td>
                        <td>{location.description || '-'}</td>
                        <td>{location.category ? <span style={{ color: location.category.color || '#667eea' }}>{location.category.name}</span> : '-'}</td>
                        <td>{location.latitude ? location.latitude.toFixed(6) : '-'}</td>
                        <td>{location.longitude ? location.longitude.toFixed(6) : '-'}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <button
                              onClick={() => setEditingLocation(location._id)}
                              className="edit-button-small"
                              title="Editar punto de interés"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDeleteLocation(location._id)}
                              className="delete-button-small"
                              title="Eliminar punto de interés"
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
                        No hay puntos de interés registrados. Presiona el botón para agregar uno.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="polygons-table-section">
            <h3>Zonas de Interés</h3>
            {!drawingMode ? (
              <button onClick={handleStartDrawing} className="draw-button">
                Dibujar Polígono
              </button>
            ) : (
              <div>
                <p><strong>Modo dibujo activo</strong></p>
                <p>Haz clic en el mapa para agregar puntos y delimitar la zona de interés.</p>
                <p><strong>Puntos agregados: {currentPolygon?.coordinates.length || 0}</strong></p>
                {currentPolygon && currentPolygon.coordinates.length >= 3 && (
                  <p style={{ color: 'green', fontWeight: 'bold' }}>Mínimo de puntos alcanzado (mínimo 3)</p>
                )}
                {currentPolygon && currentPolygon.coordinates.length < 3 && (
                  <p style={{ color: '#f39c12', fontWeight: 'bold' }}>Necesitas al menos 3 puntos</p>
                )}
                <div className="drawing-buttons">
                  <button onClick={handleShowPolygonForm} className="save-button" disabled={!currentPolygon || currentPolygon.coordinates.length < 3}>
                    Guardar Zona
                  </button>
                  <button onClick={handleCancelDrawing} className="cancel-button">
                    Cancelar
                  </button>
                </div>
              </div>
            )}
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Puntos</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {polygons && polygons.length > 0 ? (
                    polygons.map((polygon) => (
                      <tr key={polygon._id}>
                        <td><strong>{polygon.name}</strong></td>
                        <td>{polygon.description || '-'}</td>
                        <td>{polygon.coordinates ? polygon.coordinates.length : 0}</td>
                        <td>
                          <button
                            onClick={() => handleDeletePolygon(polygon._id)}
                            className="delete-button-small"
                            title="Eliminar zona de interés"
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
                        No hay zonas de interés registradas. Presiona "Dibujar Polígono" para crear una.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className={`map-container ${drawingMode ? 'drawing-mode' : ''} ${addingLocationMode ? 'adding-location-mode' : ''}`}>
          {showLocationForm && (
            <div className="location-form-overlay">
              <div className="location-form">
                <h3>Registrar Punto de Interés</h3>
                <form onSubmit={handleCreateLocation}>
                  <input
                    type="text"
                    placeholder="Nombre del punto de interés"
                    value={locationForm.name}
                    onChange={(e) => setLocationForm({ ...locationForm, name: e.target.value })}
                    required
                  />
                  <textarea
                    placeholder="Descripción"
                    value={locationForm.description}
                    onChange={(e) => setLocationForm({ ...locationForm, description: e.target.value })}
                  />
                  <select
                    value={locationForm.category}
                    onChange={(e) => setLocationForm({ ...locationForm, category: e.target.value })}
                  >
                    <option value="">Seleccionar categoría (opcional)</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <div className="form-buttons">
                    <button type="submit">Guardar</button>
                    <button type="button" onClick={() => setShowLocationForm(false)}>
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {showPolygonForm && (
            <div className="location-form-overlay">
              <div className="location-form">
                <h3>Guardar Zona de Interés</h3>
                <p>Puntos en el polígono: {currentPolygon?.coordinates.length || 0}</p>
                <form onSubmit={handleSavePolygon}>
                  <input
                    type="text"
                    placeholder="Nombre de la zona (ej: Zona de riesgo, Área comercial)"
                    value={polygonForm.name}
                    onChange={(e) => setPolygonForm({ ...polygonForm, name: e.target.value })}
                    required
                  />
                  <textarea
                    placeholder="Descripción de la zona (opcional)"
                    value={polygonForm.description}
                    onChange={(e) => setPolygonForm({ ...polygonForm, description: e.target.value })}
                  />
                  <div className="form-buttons">
                    <button type="submit">Guardar Polígono</button>
                    <button type="button" onClick={() => setShowPolygonForm(false)}>
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {editingLocation && !showLocationForm && (
            <div className="location-form-overlay">
              <div className="location-form">
                <h3>Editar Punto de Interés</h3>
                <EditLocationForm
                  location={locations.find(loc => loc._id === editingLocation)}
                  categories={categories}
                  onSave={(data) => handleUpdateLocation(editingLocation, data)}
                  onCancel={() => setEditingLocation(null)}
                />
              </div>
            </div>
          )}

          <MapContainer
            center={[19.4326, -99.1332]}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
          >
            <MapController mapRef={mapRef} />
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <MapClickHandler onMapClick={handleMapClick} drawingMode={drawingMode} addingLocationMode={addingLocationMode} />

            {locations && locations.length > 0 && locations.map((location) => {
              if (!location.latitude || !location.longitude) return null;
              return (
                <Marker
                  key={location._id}
                  position={[location.latitude, location.longitude]}
                  eventHandlers={{
                    click: () => {
                      // Asegurar que el popup se abra
                    }
                  }}
                >
                  <Popup autoOpen={false}>
                    {editingLocation === location._id ? (
                      <EditLocationForm
                        location={location}
                        categories={categories}
                        onSave={(data) => handleUpdateLocation(location._id, data)}
                        onCancel={() => setEditingLocation(null)}
                      />
                    ) : (
                      <LocationPopup
                        location={location}
                        onEdit={() => setEditingLocation(location._id)}
                        onDelete={() => handleDeleteLocation(location._id)}
                      />
                    )}
                  </Popup>
                </Marker>
              );
            })}

            {polygons.map((polygon) => (
              <LeafletPolygon
                key={polygon._id}
                positions={polygon.coordinates.map(coord => [coord.latitude, coord.longitude])}
                pathOptions={{ color: '#667eea', fillColor: '#764ba2', fillOpacity: 0.4, weight: 2 }}
                eventHandlers={{
                  click: () => {
                    handleCenterOnPolygon(polygon);
                  }
                }}
              >
                <Popup>
                  <div className="polygon-popup">
                    <h4>{polygon.name}</h4>
                    {polygon.description && <p>{polygon.description}</p>}
                    <p><strong>Puntos:</strong> {polygon.coordinates.length}</p>
                    <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>
                      Haz clic en la zona para centrar el mapa
                    </p>
                    <button
                      onClick={() => handleDeletePolygon(polygon._id)}
                      className="delete-button"
                      style={{ marginTop: '10px', width: '100%' }}
                    >
                      Eliminar Zona
                    </button>
                  </div>
                </Popup>
              </LeafletPolygon>
            ))}

            {drawingMode && currentPolygon && currentPolygon.coordinates.length > 0 && (
              <LeafletPolygon
                positions={currentPolygon.coordinates.map(coord => [coord.latitude, coord.longitude])}
                pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.3 }}
              />
            )}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

const LocationPopup = ({ location, onEdit, onDelete }) => (
  <div className="location-popup">
    <h4 style={{ marginTop: 0, color: '#2c3e50', fontSize: '1.2rem' }}>{location.name}</h4>
    {location.description && <p style={{ margin: '0.5rem 0', color: '#666' }}>{location.description}</p>}
    {location.category && (
      <p style={{ margin: '0.5rem 0' }}>
        <strong>Categoría:</strong> <span style={{ color: location.category.color || '#667eea' }}>{location.category.name}</span>
      </p>
    )}
    <p style={{ margin: '0.5rem 0', fontSize: '0.85rem', color: '#999' }}>
      <strong>Coordenadas:</strong><br />
      Lat: {location.latitude.toFixed(6)}, Lng: {location.longitude.toFixed(6)}
    </p>
    <div className="popup-buttons">
      <button onClick={onEdit} className="edit-button">Editar</button>
      <button onClick={onDelete} className="delete-button">Eliminar</button>
    </div>
  </div>
);

const EditLocationForm = ({ location, onSave, onCancel, categories = [] }) => {
  const [formData, setFormData] = useState({
    name: location.name,
    description: location.description || '',
    category: location.category?._id || location.category || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = { ...formData };
    if (!submitData.category) {
      delete submitData.category;
    }
    onSave(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="edit-location-form">
      <input
        type="text"
        placeholder="Nombre"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />
      <textarea
        placeholder="Descripción"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
      />
      <select
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
      >
        <option value="">Sin categoría</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.name}
          </option>
        ))}
      </select>
      <div className="form-buttons">
        <button type="submit">Guardar</button>
        <button type="button" onClick={onCancel}>Cancelar</button>
      </div>
    </form>
  );
};

export default Main;

