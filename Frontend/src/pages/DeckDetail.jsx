import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Plus, Upload, X, Sparkles, Layers, CheckCircle } from 'lucide-react';
import { flashcardService } from '../services/flashcardService'; // 👈 Importamos el servicio
import './DeckDetail.css';

export function DeckDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('flashcards'); // Pestaña de flashcards por defecto
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFlashcardModalOpen, setIsFlashcardModalOpen] = useState(false); // Modal para crear tarjeta manual
  
  // Estados para recursos y flashcards reales
  const [resourcesList, setResourcesList] = useState([]); 
  const [flashcardsList, setFlashcardsList] = useState([]);
  const [currentDeck, setCurrentDeck] = useState({ title: 'Cargando...', description: '' });

  // Estados para crear una nueva tarjeta manual
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  
  // Estado para el Toast
  const [toast, setToast] = useState({ visible: false, message: '' });

  // 1. Cargar las tarjetas cuando entramos a la pantalla
  useEffect(() => {
    // Aquí idealmente deberíamos cargar los detalles del mazo desde el backend
    // Por ahora, simulamos el mazo actual
    setCurrentDeck({ title: `Mazo #${id}`, description: 'Descripción de tu mazo' });
    
    // Cargar las tarjetas reales del backend
    cargarTarjetas();
  }, [id]);

  const cargarTarjetas = async () => {
    try {
      // Usamos la ruta "estudiar" que nos da las tarjetas de este mazo
      const data = await flashcardService.obtenerParaRepasar(id);
      
      // Mapeamos para asegurar que los nombres de variables coincidan con tu diseño
      const tarjetasReales = data.map(card => ({
        id: card.id,
        question: card.pregunta || card.question,
        answer: card.respuesta || card.answer
      }));
      
      setFlashcardsList(tarjetasReales);
    } catch (error) {
      console.error("Error al cargar tarjetas:", error);
      showToast('Error al conectar con la base de datos');
    }
  };

  const showToast = (message) => {
    setToast({ visible: true, message });
    setTimeout(() => { setToast({ visible: false, message: '' }); }, 3000);
  };

  const handleGoBack = () => navigate('/app/decks');
  const handleStudyMode = () => navigate(`/app/decks/${id}/study`);

  // 2. Guardar una tarjeta REAL en el backend
  const handleSaveFlashcard = async (e) => {
    e.preventDefault();
    if (!newQuestion.trim() || !newAnswer.trim()) return;

    try {
      await flashcardService.crearFlashcard({
        mazo_id: parseInt(id),
        pregunta: newQuestion,
        respuesta: newAnswer
      });

      showToast('Tarjeta creada exitosamente');
      setNewQuestion('');
      setNewAnswer('');
      setIsFlashcardModalOpen(false);
      
      // Recargar la lista de tarjetas
      cargarTarjetas();
    } catch (error) {
      console.error("Error al crear tarjeta:", error);
      showToast('Hubo un error al guardar la tarjeta');
    }
  };

  return (
    <div className="deck-detail-container">
      <button className="btn-back" onClick={handleGoBack}>
        <ArrowLeft size={16} />
        Volver a Mazos
      </button>

      <div className="deck-detail-header">
        <div className="deck-info">
          <h1>{currentDeck.title}</h1>
          <p>{currentDeck.description}</p>
        </div>
        <button className="btn-study" onClick={handleStudyMode}>
          <Play size={16} fill="currentColor" />
          Estudiar Mazo
        </button>
      </div>

      <div className="tabs-container">
        <button 
          className={`tab-btn ${activeTab === 'flashcards' ? 'active' : ''}`}
          onClick={() => setActiveTab('flashcards')}
        >
          Flashcards ({flashcardsList.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'recursos' ? 'active' : ''}`}
          onClick={() => setActiveTab('recursos')}
        >
          Recursos ({resourcesList.length})
        </button>
      </div>

      <div className="tab-content">
        
        {/* PESTAÑA: FLASHCARDS */}
        {activeTab === 'flashcards' && (
          <div className="flashcards-section">
            <div className="section-actions">
              {/* Botón para crear tarjeta manualmente (NUEVO) */}
              <button className="btn-add" onClick={() => setIsFlashcardModalOpen(true)} style={{ marginRight: '10px' }}>
                <Plus size={16} />
                Crear Tarjeta Manual
              </button>
              
              <button className="btn-add" onClick={() => showToast('¡Próximamente! Generación por IA')} style={{ backgroundColor: '#f0e6ff', color: '#6b21a8' }}>
                <Sparkles size={16} />
                Generar con IA
              </button>
            </div>

            {flashcardsList.length === 0 ? (
              <div className="empty-state">
                <Layers size={48} className="empty-icon" />
                <h3>Aún no hay flashcards</h3>
                <p>Crea tu primera tarjeta manualmente o usa la IA para generarlas a partir de tus apuntes.</p>
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

        {/* PESTAÑA: RECURSOS (Mantenida igual por ahora) */}
        {activeTab === 'recursos' && (
          <div className="resources-section">
            <div className="section-actions">
              <button className="btn-add" onClick={() => setIsModalOpen(true)}>
                <Plus size={16} /> Añadir Recurso
              </button>
            </div>
            <div className="empty-state">
              <Upload size={48} className="empty-icon" />
              <h3>Sección en construcción</h3>
              <p>Próximamente podrás subir tus PDFs aquí.</p>
            </div>
          </div>
        )}
      </div>

      {/* --- MODAL PARA CREAR TARJETA MANUAL --- */}
      {isFlashcardModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Nueva Tarjeta</h2>
              <button className="btn-close" onClick={() => setIsFlashcardModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSaveFlashcard}>
              <div className="form-group">
                <label>Pregunta (Anverso)</label>
                <textarea 
                  placeholder="Ej: ¿Qué es una clave primaria en SQL?" 
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  rows="2"
                  autoFocus
                ></textarea>
              </div>
              
              <div className="form-group">
                <label>Respuesta (Reverso)</label>
                <textarea 
                  placeholder="Ej: Es un campo único que identifica de forma exclusiva cada registro en una tabla."
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  rows="3"
                ></textarea>
              </div>

              <button type="submit" className="btn-submit-deck">
                Guardar Tarjeta
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- MENSAJE TOAST --- */}
      {toast.visible && (
        <div className="toast-notification">
          <CheckCircle size={18} className="toast-icon" />
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}