import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';
import './CRUD.css';

// SVG Icon Components
const EventIcon = () => (
  <div className="icon-shape">
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="6" width="24" height="22" rx="3" stroke="#4299e1" strokeWidth="2" fill="none" />
      <path d="M4 12H28" stroke="#4299e1" strokeWidth="2" />
      <circle cx="10" cy="18" r="1.5" fill="#4299e1" className="shape-animate-float" />
      <circle cx="16" cy="18" r="1.5" fill="#5a67d8" className="shape-animate-float" style={{ animationDelay: '0.2s' }} />
      <circle cx="22" cy="18" r="1.5" fill="#48bb78" className="shape-animate-float" style={{ animationDelay: '0.4s' }} />
      <path d="M10 4V8M22 4V8" stroke="#4299e1" strokeWidth="2" strokeLinecap="round" />
    </svg>
  </div>
);

const CalendarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="4" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M2 8H18" stroke="currentColor" strokeWidth="1.5" />
    <path d="M6 2V6M14 2V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const Events = () => {
  const [events, setEvents] = useState([]);
  const [locations, setLocations] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    status: 'Activo'
  });

  useEffect(() => {
    loadEvents();
    loadLocations();
  }, []);

  const loadEvents = async () => {
    try {
      const response = await api.get('/events');
      setEvents(response.data.data);
    } catch (error) {
      console.error('Error loading events:', error);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        location: formData.location || undefined
      };
      if (editingEvent) {
        await api.put(`/events/${editingEvent._id}`, submitData);
      } else {
        await api.post('/events', submitData);
      }
      setShowForm(false);
      setEditingEvent(null);
      setFormData({ title: '', description: '', date: '', location: '' });
      loadEvents();
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Error al guardar evento');
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description || '',
      date: event.date ? new Date(event.date).toISOString().split('T')[0] : '',
      location: event.location?._id || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (eventId) => {
    if (window.confirm('¿Estás seguro de eliminar este evento?')) {
      try {
        await api.delete(`/events/${eventId}`);
        loadEvents();
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Error al eliminar evento');
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingEvent(null);
    setFormData({ title: '', description: '', date: '', location: '', status: 'Activo' });
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  return (
    <div className="crud-container">
      <Navbar />
      <div className="crud-content">
        <div className="crud-header">
          <h1>Gestión de Eventos Urbanos</h1>
          <button onClick={() => setShowForm(true)} className="add-button">
            <CalendarIcon />
            Registrar Evento
          </button>
        </div>

        {showForm && (
          <div className="form-card">
            <h2>
              <EventIcon />
              {editingEvent ? 'Editar Evento' : 'Registrar Nuevo Evento'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Título:</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="Ej: Festival Cultural, Limpieza Comunitaria"
                />
              </div>
              <div className="form-group">
                <label>Descripción:</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe los detalles del evento..."
                />
              </div>
              <div className="form-group">
                <label>Fecha:</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Punto de Interés (opcional):</label>
                <p style={{ fontSize: '0.85rem', color: '#718096', marginTop: '0.25rem', marginBottom: '0.5rem' }}>
                  Selecciona una ubicación del mapa donde se realizará el evento
                </p>
                <select
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                >
                  <option value="">Seleccionar punto de interés</option>
                  {locations.map((location) => (
                    <option key={location._id} value={location._id}>
                      {location.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-actions">
                <button type="submit" className="save-button">
                  {editingEvent ? 'Actualizar' : 'Crear'}
                </button>
                <button type="button" onClick={handleCancel} className="cancel-button">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="table-card">
          <h2>
            <EventIcon />
            Eventos Urbanos Registrados
          </h2>
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Descripción</th>
                <th>Fecha</th>
                <th>Ubicación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {events.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#718096' }}>
                    No hay eventos registrados
                  </td>
                </tr>
              ) : (
                events.map((event) => (
                  <tr key={event._id}>
                    <td style={{ fontWeight: '600', color: '#2d3748' }}>{event.title}</td>
                    <td style={{ color: '#4a5568' }}>{event.description || '-'}</td>
                    <td style={{ color: '#4a5568' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="2" y="3" width="12" height="11" rx="1.5" stroke="#4299e1" strokeWidth="1.2" fill="none" />
                          <path d="M2 6H14" stroke="#4299e1" strokeWidth="1.2" />
                        </svg>
                        {formatDate(event.date)}
                      </div>
                    </td>
                    <td style={{ color: '#4a5568' }}>
                      {event.location?.name ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7 1C4.79086 1 3 2.79086 3 5C3 7.5 7 13 7 13C7 13 11 7.5 11 5C11 2.79086 9.20914 1 7 1Z" stroke="#48bb78" strokeWidth="1.2" fill="none" />
                            <circle cx="7" cy="5" r="1.5" fill="#48bb78" />
                          </svg>
                          {event.location.name}
                        </div>
                      ) : '-'}
                    </td>
                    <td>
                      <button
                        onClick={() => handleEdit(event)}
                        className="edit-button"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(event._id)}
                        className="delete-button"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Events;
