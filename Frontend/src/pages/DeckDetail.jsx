import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Plus, Upload, X, Sparkles, Layers, CheckCircle, Edit2, Trash2, Save } from 'lucide-react';
import { flashcardService } from '../services/flashcardService'; 
import './DeckDetail.css';

export function DeckDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('flashcards'); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFlashcardModalOpen, setIsFlashcardModalOpen] = useState(false); 
  
  const [resourcesList, setResourcesList] = useState([]); 
  const [flashcardsList, setFlashcardsList] = useState([]);
  const [currentDeck, setCurrentDeck] = useState({ title: 'Cargando...', description: '' });

  // Estados para crear una nueva tarjeta manual
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  
  // Estados para la EDICIÓN de tarjetas
  const [editandoId, setEditandoId] = useState(null);
  const [editPregunta, setEditPregunta] = useState("");
  const [editRespuesta, setEditRespuesta] = useState("");

  const [toast, setToast] = useState({ visible: false, message: '' });

  useEffect(() => {
    setCurrentDeck({ title: `Mazo de Estudio`, description: 'Administra todas tus tarjetas aquí' });
    cargarTarjetas();
  }, [id]);

  // CARGAR TODAS LAS TARJETAS DEL MAZO
  const cargarTarjetas = async () => {
    try {
      // Ahora usamos obtenerTodasMazo para ver el inventario completo, no solo las de repasar hoy
      const data = await flashcardService.obtenerTodasMazo(id);
      
      if (data && data.flashcards) {
        const tarjetasReales = data.flashcards.map(card => ({
          id: card.flashcard_id,
          question: card.pregunta,
          answer: card.respuesta
        }));
        setFlashcardsList(tarjetasReales);
      } else {
        setFlashcardsList([]);
      }
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

  // CREAR TARJETA
  const handleSaveFlashcard = async (e) => {
    e.preventDefault();
    if (!newQuestion.trim() || !newAnswer.trim()) return;

    try {
      await flashcardService.crearFlashcard({
        mazo_id: id, 
        pregunta: newQuestion,
        respuesta: newAnswer
      });

      showToast('Tarjeta creada exitosamente');
      setNewQuestion('');
      setNewAnswer('');
      setIsFlashcardModalOpen(false);
      cargarTarjetas(); // Recargar la lista
    } catch (error) {
      console.error("Error al crear tarjeta:", error);
      showToast('Hubo un error al guardar la tarjeta');
    }
  };

  // ELIMINAR TARJETA
  const handleEliminar = async (flashcard_id) => {
    if (window.confirm("¿Estás seguro de que quieres borrar esta tarjeta para siempre?")) {
      try {
        await flashcardService.eliminarFlashcard(flashcard_id);
        showToast('Tarjeta eliminada');
        cargarTarjetas(); // Recargar la lista
      } catch (error) {
        showToast("No se pudo eliminar la tarjeta");
      }
    }
  };

  // INICIAR MODO EDICIÓN
  const iniciarEdicion = (tarjeta) => {
    setEditandoId(tarjeta.id);
    setEditPregunta(tarjeta.question);
    setEditRespuesta(tarjeta.answer);
  };

  // GUARDAR EDICIÓN
  const guardarEdicion = async (flashcard_id) => {
    try {
      await flashcardService.editarFlashcard(flashcard_id, editPregunta, editRespuesta);
      setEditandoId(null);
      showToast('Tarjeta actualizada correctamente');
      cargarTarjetas(); // Recargar la lista
    } catch (error) {
      showToast("No se pudo actualizar la tarjeta");
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
                  <div key={card.id} className="flashcard-item" style={{ display: 'flex', flexDirection: 'column' }}>
                    
                    {/* SI ESTAMOS EDITANDO ESTA TARJETA */}
                    {editandoId === card.id ? (
                      <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '10px', height: '100%' }}>
                        <textarea 
                          value={editPregunta}
                          onChange={(e) => setEditPregunta(e.target.value)}
                          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', resize: 'vertical', minHeight: '60px' }}
                          placeholder="Pregunta"
                        />
                        <textarea 
                          value={editRespuesta}
                          onChange={(e) => setEditRespuesta(e.target.value)}
                          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', resize: 'vertical', minHeight: '80px' }}
                          placeholder="Respuesta"
                        />
                        <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                          <button onClick={() => guardarEdicion(card.id)} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', backgroundColor: '#10B981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', flex: 1, justifyContent: 'center' }}>
                            <Save size={14} /> Guardar
                          </button>
                          <button onClick={() => setEditandoId(null)} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', backgroundColor: '#F3F4F6', color: '#4B5563', border: '1px solid #D1D5DB', borderRadius: '4px', cursor: 'pointer', flex: 1, justifyContent: 'center' }}>
                            <X size={14} /> Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* VISTA NORMAL DE LA TARJETA */
                      <>
                        <div className="flashcard-q">
                          <span className="label-q">P</span>
                          <p>{card.question}</p>
                        </div>
                        <hr className="flashcard-divider" />
                        <div className="flashcard-a" style={{ flexGrow: 1 }}>
                          <span className="label-a">R</span>
                          <p>{card.answer}</p>
                        </div>
                        
                        {/* BOTONES DE ADMINISTRACIÓN */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '15px', paddingTop: '10px', borderTop: '1px dashed #e5e7eb' }}>
                          <button onClick={() => iniciarEdicion(card)} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', cursor: 'pointer', color: '#4F46E5', fontSize: '0.85rem', fontWeight: '500' }}>
                            <Edit2 size={14} /> Editar
                          </button>
                          <button onClick={() => handleEliminar(card.id)} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444', fontSize: '0.85rem', fontWeight: '500' }}>
                            <Trash2 size={14} /> Borrar
                          </button>
                        </div>
                      </>
                    )}

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PESTAÑA: RECURSOS */}
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