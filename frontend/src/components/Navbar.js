import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/main">GeoMap - Eventos Urbanos</Link>
        </div>
        <div className="navbar-menu">
          <Link to="/main" className="navbar-link">Mapa</Link>
          <Link to="/categories" className="navbar-link">Categorías</Link>
          <Link to="/events" className="navbar-link">Eventos</Link>
          <button onClick={handleLogout} className="navbar-button">
            Cerrar Sesión
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

