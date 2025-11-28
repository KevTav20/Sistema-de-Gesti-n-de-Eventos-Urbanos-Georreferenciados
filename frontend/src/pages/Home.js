import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <div className="home-hero">
        <div className="home-content">
          <h1 className="home-title animate-title">GeoMap - Gestión de Eventos Urbanos</h1>

          <div className="home-description animate-section-1">
            <h2>Conecta con tu comunidad</h2>
            <p>
              GeoMap es una plataforma colaborativa que conecta ciudadanos, negocios y autoridades
              para compartir y descubrir eventos urbanos y zonas de interés en tiempo real.
              Participa activamente en la vida de tu comunidad registrando eventos, marcando
              lugares importantes y ayudando a otros a mantenerse informados.
            </p>
            <p>
              Visualiza información geográfica relevante de manera intuitiva, planifica mejor tus
              actividades y contribuye al desarrollo de tu entorno. Desde eventos culturales hasta
              zonas de seguridad, toda la información que necesitas está al alcance de un clic.
            </p>
          </div>

          <div className="home-features animate-section-2">
            <h2>Características principales</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 4C17.373 4 12 9.373 12 16C12 24 24 40 24 40C24 40 36 24 36 16C36 9.373 30.627 4 24 4Z" stroke="#4299e1" strokeWidth="3" fill="none" />
                    <circle cx="24" cy="16" r="4" fill="#4299e1" />
                  </svg>
                </div>
                <h3>Puntos de Interés</h3>
                <p>Marca ubicaciones importantes en el mapa y compártelas con la comunidad</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 12L24 4L40 12L24 20L8 12Z" fill="#5a67d8" fillOpacity="0.3" />
                    <path d="M8 24L24 32L40 24M8 36L24 44L40 36" stroke="#5a67d8" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </div>
                <h3>Zonas Delimitadas</h3>
                <p>Define áreas de interés mediante polígonos personalizados</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="8" y="12" width="32" height="28" rx="3" stroke="#48bb78" strokeWidth="3" fill="none" />
                    <path d="M8 20H40" stroke="#48bb78" strokeWidth="3" />
                    <circle cx="16" cy="28" r="2" fill="#48bb78" />
                    <circle cx="24" cy="28" r="2" fill="#48bb78" />
                    <circle cx="32" cy="28" r="2" fill="#48bb78" />
                  </svg>
                </div>
                <h3>Gestión de Eventos</h3>
                <p>Crea y descubre eventos urbanos en tu área</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="8" y="8" width="14" height="14" rx="2" fill="#4299e1" fillOpacity="0.3" />
                    <rect x="26" y="8" width="14" height="14" rx="2" fill="#5a67d8" fillOpacity="0.3" />
                    <rect x="8" y="26" width="14" height="14" rx="2" fill="#48bb78" fillOpacity="0.3" />
                    <rect x="26" y="26" width="14" height="14" rx="2" fill="#4299e1" fillOpacity="0.3" />
                  </svg>
                </div>
                <h3>Categorización</h3>
                <p>Organiza información por cultura, seguridad, deporte, educación y más</p>
              </div>
            </div>
          </div>

          <div className="home-community animate-section-3">
            <h2>Una plataforma para todos</h2>
            <div className="community-benefits">
              <div className="benefit-item">
                <span className="benefit-icon">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="24" cy="14" r="6" fill="#4299e1" />
                    <path d="M12 38C12 30 16 26 24 26C32 26 36 30 36 38" stroke="#4299e1" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </span>
                <div>
                  <h3>Para Ciudadanos</h3>
                  <p>Mantente informado sobre eventos y zonas de interés en tu comunidad</p>
                </div>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="8" y="16" width="32" height="24" rx="2" stroke="#5a67d8" strokeWidth="3" fill="none" />
                    <path d="M16 16V12C16 10 18 8 24 8C30 8 32 10 32 12V16" stroke="#5a67d8" strokeWidth="3" />
                  </svg>
                </span>
                <div>
                  <h3>Para Negocios</h3>
                  <p>Aumenta tu visibilidad y conecta con clientes locales</p>
                </div>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="8" y="12" width="32" height="28" rx="2" stroke="#48bb78" strokeWidth="3" fill="none" />
                    <path d="M8 20H40M20 12V8M28 12V8" stroke="#48bb78" strokeWidth="3" />
                  </svg>
                </span>
                <div>
                  <h3>Para Autoridades</h3>
                  <p>Gestiona información urbana y comunica con eficiencia</p>
                </div>
              </div>
            </div>
          </div>

          <div className="home-cta animate-section-4">
            <h2>Únete a la comunidad</h2>
            <p>Comienza a explorar y contribuir hoy mismo</p>
            <div className="cta-buttons">
              <Link to="/login" className="btn btn-primary">
                Iniciar Sesión
              </Link>
              <Link to="/register" className="btn btn-secondary">
                Crear Cuenta
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
