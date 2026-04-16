import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Plus, Upload, X, Sparkles, Layers } from 'lucide-react';
import './DeckDetail.css';

export function DeckDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Estados para las pestañas y el modal de recursos
  const [activeTab, setActiveTab] = useState('recursos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Estados para el formulario de recursos
  const [resourceUrl, setResourceUrl] = useState('');
  const [resourcesList, setResourcesList] = useState([]); 

  // Estado para la lista de flashcards generadas por la plataforma
  const [flashcardsList, setFlashcardsList] = useState([]);

  // Simulamos la base de datos temporalmente
  const mockDecks = [
    { id: '1', title: 'Ingeniería de Software', description: 'Conceptos fundamentales de ingeniería de software', resources: 0, flashcards: 3 },
    { id: '2', title: 'Estructuras de Datos', description: 'Listas, árboles, grafos y algoritmos', resources: 0, flashcards: 2 },
    { id: '3', title: 'Bases de Datos', description: 'SQL, normalización y diseño', resources: 0, flashcards: 1 },
  ];

  // Buscamos el mazo actual por ID
  const currentDeck = mockDecks.find(deck => deck.id === id) || {
    title: 'Mazo no encontrado',
    description: '',
  };

  const handleGoBack = () => {
    navigate('/app/decks');
  };

  // Función para guardar un enlace de recurso
  const handleSaveResource = (e) => {
    e.preventDefault();
    if (!resourceUrl.trim()) return;

    const newResource = {
      id: Date.now(),
      type: 'url',
      link: resourceUrl,
      title: 'Enlace web guardado',
      date: new Date().toLocaleDateString()
    };

    setResourcesList([...resourcesList, newResource]);
    setResourceUrl('');
    setIsModalOpen(false);
  };

  // Función para SIMULAR la generación de flashcards de tu plataforma
  const handleAutoGenerateFlashcards = () => {
    const mockGeneratedCards = [
      { id: 1, question: '¿Qué es un componente en React?', answer: 'Un bloque de código reutilizable que representa una parte de la interfaz de usuario.' },
      { id: 2, question: '¿Para qué sirve el hook useState?', answer: 'Para añadir y gestionar el estado local dentro de un componente funcional.' },
      { id: 3, question: '¿Qué es el Virtual DOM?', answer: 'Una copia ligera en memoria del DOM real que React usa para optimizar las actualizaciones.' },
    ];
    setFlashcardsList(mockGeneratedCards);
  };

  return (
    <div className="deck-detail-container">
      {/* Botón de regreso */}
      <button className="btn-back" onClick={handleGoBack}>
        <ArrowLeft size={16} />
        Volver a Mazos
      </button>

      {/* Cabecera del Mazo */}
      <div className="deck-detail-header">
        <div className="deck-info">
          <h1>{currentDeck.title}</h1>
          <p>{currentDeck.description}</p>
        </div>
        <button className="btn-study">
          <Play size={16} fill="currentColor" />
          Estudiar Mazo
        </button>
      </div>

      {/* Pestañas (Tabs) con contadores dinámicos */}
      <div className="tabs-container">
        <button 
          className={`tab-btn ${activeTab === 'recursos' ? 'active' : ''}`}
          onClick={() => setActiveTab('recursos')}
        >
          Recursos ({resourcesList.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'flashcards' ? 'active' : ''}`}
          onClick={() => setActiveTab('flashcards')}
        >
          Flashcards ({flashcardsList.length})
        </button>
      </div>

      {/* Contenido principal según la pestaña */}
      <div className="tab-content">
        
        {/* PESTAÑA: RECURSOS */}
        {activeTab === 'recursos' && (
          <div className="resources-section">
            <div className="section-actions">
              <button className="btn-add" onClick={() => setIsModalOpen(true)}>
                <Plus size={16} />
                Añadir Recurso
              </button>
            </div>

            {resourcesList.length === 0 ? (
              <div className="empty-state">
                <Upload size={48} className="empty-icon" />
                <h3>No hay recursos todavía</h3>
                <p>Comienza agregando enlaces (URLs) o subiendo archivos PDF (Máximo 10MB por archivo).</p>
              </div>
            ) : (
              <div className="resources-list">
                {resourcesList.map((resource) => (
                  <div key={resource.id} className="resource-card">
                    <div className="resource-icon">
                      <Play size={20} /> 
                    </div>
                    <div className="resource-details">
                      <h4>{resource.title}</h4>
                      <a href={resource.link} target="_blank" rel="noopener noreferrer">
                        {resource.link}
                      </a>
                      <span className="resource-date">Agregado el {resource.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PESTAÑA: FLASHCARDS */}
        {activeTab === 'flashcards' && (
          <div className="flashcards-section">
            <div className="section-actions">
              <button className="btn-add" onClick={handleAutoGenerateFlashcards}>
                <Sparkles size={16} />
                Generar Flashcards Automáticamente
              </button>
            </div>

            {flashcardsList.length === 0 ? (
              <div className="empty-state">
                <Layers size={48} className="empty-icon" />
                <h3>Aún no hay flashcards</h3>
                <p>Sube recursos (enlaces o PDFs) y haz clic en "Generar Flashcards Automáticamente" para que la plataforma cree tus tarjetas de estudio.</p>
              </div>
            ) : (
              <div className="flashcards-grid">
                {flashcardsList.map((card) => (
                  <div key={card.id} className="flashcard-item">
                    <div className="flashcard-q">
                      <span className="label-q">P</span>
                      <p>{card.question}</p>
                    </div>
                    <hr className="flashcard-divider" />
                    <div className="flashcard-a">
                      <span className="label-a">R</span>
                      <p>{card.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal para Agregar Recurso */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content resource-modal">
            <div className="modal-header">
              <h2>Agregar Nuevo Recurso</h2>
              <p>Agrega una URL o sube un PDF</p>
              <button className="btn-close" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveResource}>
              <div className="form-group">
                <label>Mazo destino</label>
                <select disabled value={currentDeck.title}>
                  <option>{currentDeck.title}</option>
                </select>
              </div>

              <div className="form-group">
                <label>URL (YouTube, artículos, etc.)</label>
                <input 
                  type="url" 
                  placeholder="Pegar URL externa (YouTube, Artículos)..." 
                  value={resourceUrl}
                  onChange={(e) => setResourceUrl(e.target.value)}
                />
              </div>

              <div className="divider-text">O</div>

              <div className="upload-area">
                <Upload size={24} className="upload-icon" />
                <p>Arrastra tu PDF aquí o haz clic para buscar</p>
                <span>Solo formato .pdf hasta 10MB</span>
              </div>

              <button type="submit" className="btn-submit-deck mt-4">
                Guardar Recurso
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}