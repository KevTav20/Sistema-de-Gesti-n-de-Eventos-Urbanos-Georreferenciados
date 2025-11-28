import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';
import './CRUD.css';

// SVG Icon Component for Categories
const CategoryIcon = ({ color }) => (
  <div className="category-color-badge shape-animate-float" style={{ backgroundColor: color }}>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white" fillOpacity="0.9" />
      <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

// Header Icon
const HeaderIcon = () => (
  <div className="icon-shape">
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="10" height="10" rx="2" fill="#4299e1" className="shape-animate-float" />
      <rect x="18" y="4" width="10" height="10" rx="2" fill="#5a67d8" className="shape-animate-float" style={{ animationDelay: '0.2s' }} />
      <rect x="4" y="18" width="10" height="10" rx="2" fill="#48bb78" className="shape-animate-float" style={{ animationDelay: '0.4s' }} />
      <rect x="18" y="18" width="10" height="10" rx="2" fill="#4299e1" className="shape-animate-float" style={{ animationDelay: '0.6s' }} />
    </svg>
  </div>
);

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', color: '#4299e1' });

  useEffect(() => {
    loadCategories();
    initializeCategories();
  }, []);

  const initializeCategories = async () => {
    try {
      const response = await api.get('/categories');
      if (response.data.data.length === 0) {
        await api.post('/categories/initialize');
        loadCategories();
      }
    } catch (error) {
      console.error('Error initializing categories:', error);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data.data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await api.put(`/categories/${editingCategory._id}`, formData);
      } else {
        await api.post('/categories', formData);
      }
      setShowForm(false);
      setEditingCategory(null);
      setFormData({ name: '', description: '', color: '#4299e1' });
      loadCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Error al guardar categoría');
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      color: category.color || '#4299e1'
    });
    setShowForm(true);
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm('¿Estás seguro de eliminar esta categoría?')) {
      try {
        await api.delete(`/categories/${categoryId}`);
        loadCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('Error al eliminar categoría');
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCategory(null);
    setFormData({ name: '', description: '', color: '#4299e1' });
  };

  return (
    <div className="crud-container">
      <Navbar />
      <div className="crud-content">
        <div className="crud-header">
          <h1>Gestión de Categorías</h1>
          <button onClick={() => setShowForm(true)} className="add-button">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Nueva Categoría
          </button>
        </div>

        {showForm && (
          <div className="form-card">
            <h2>
              <HeaderIcon />
              {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nombre:</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="Ej: Cultura, Deporte, Seguridad"
                />
              </div>
              <div className="form-group">
                <label>Descripción:</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe el propósito de esta categoría..."
                />
              </div>
              <div className="form-group">
                <label>Color:</label>
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="save-button">
                  {editingCategory ? 'Actualizar' : 'Crear'}
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
            <HeaderIcon />
            Categorías Registradas
          </h2>
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Color</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: '#718096' }}>
                    No hay categorías registradas
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr key={category._id}>
                    <td style={{ fontWeight: '600', color: '#2d3748' }}>{category.name}</td>
                    <td style={{ color: '#4a5568' }}>{category.description || '-'}</td>
                    <td>
                      <CategoryIcon color={category.color} />
                    </td>
                    <td>
                      <button
                        onClick={() => handleEdit(category)}
                        className="edit-button"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(category._id)}
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

export default Categories;
