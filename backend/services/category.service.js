const Category = require('../models/Category.model');

const createCategory = async (categoryData) => {
  const category = new Category(categoryData);
  await category.save();
  return category;
};

const getAllCategories = async () => {
  return await Category.find().sort({ createdAt: -1 });
};

const getCategoryById = async (categoryId) => {
  const category = await Category.findById(categoryId);
  
  if (!category) {
    const error = new Error('Category not found');
    error.status = 404;
    throw error;
  }
  
  return category;
};

const updateCategory = async (categoryId, categoryData) => {
  const category = await Category.findById(categoryId);
  
  if (!category) {
    const error = new Error('Category not found');
    error.status = 404;
    throw error;
  }

  Object.assign(category, categoryData);
  await category.save();
  
  return category;
};

const deleteCategory = async (categoryId) => {
  const category = await Category.findById(categoryId);
  
  if (!category) {
    const error = new Error('Category not found');
    error.status = 404;
    throw error;
  }

  await Category.deleteOne({ _id: categoryId });
  return { message: 'Category deleted successfully' };
};

const initializeThematicCategories = async () => {
  const thematicCategories = [
    { name: 'Cultura', description: 'Eventos culturales, conciertos, ferias y actividades artísticas', color: '#9b59b6' },
    { name: 'Seguridad', description: 'Alertas de seguridad, estaciones de policía y puntos de seguridad', color: '#e74c3c' },
    { name: 'Deporte', description: 'Jornadas deportivas, eventos atléticos y actividades físicas', color: '#3498db' },
    { name: 'Educación', description: 'Talleres educativos, escuelas y centros de aprendizaje', color: '#1abc9c' },
    { name: 'Riesgo', description: 'Alertas de riesgo urbano, inundaciones, cortes de agua y emergencias', color: '#f39c12' },
    { name: 'Comercio', description: 'Comercio local, ofertas comerciales y puntos de venta', color: '#16a085' },
    { name: 'Limpieza', description: 'Campañas de limpieza, rutas de recolección y zonas de mantenimiento', color: '#27ae60' },
    { name: 'Servicios', description: 'Servicios comunitarios, centros de salud y servicios públicos', color: '#34495e' }
  ];

  const createdCategories = [];
  for (const catData of thematicCategories) {
    const existing = await Category.findOne({ name: catData.name });
    if (!existing) {
      const category = new Category(catData);
      await category.save();
      createdCategories.push(category);
    } else {
      createdCategories.push(existing);
    }
  }

  return {
    message: 'Categorías temáticas inicializadas',
    categories: createdCategories
  };
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  initializeThematicCategories
};

