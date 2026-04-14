import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Añadimos el icono CheckCircle para el mensaje de éxito
import { BookOpen, Plus, X, Pencil, Trash2, CheckCircle } from 'lucide-react';
import './MisMazos.css';

export function MisMazos() {
    const navigate = useNavigate();
  // Estado para los mazos
  const [decks, setDecks] = useState([
    { id: 1, title: 'Ingeniería de Software', description: 'Conceptos fundamentales de ingeniería de software', totalCards: 3, dueCards: 3, progress: 65 },
    { id: 2, title: 'Estructuras de Datos', description: 'Listas, árboles, grafos y algoritmos', totalCards: 2, dueCards: 2, progress: 40 },
    { id: 3, title: 'Bases de Datos', description: 'SQL, normalización y diseño', totalCards: 1, dueCards: 1, progress: 80 },
  ]);

  const handleDeckClick = (id) => {
  navigate(`/app/decks/${id}`); // Esto asume que tu ruta en App.jsx es /app/decks/:id
};

  // Estados para los formularios y modales
  const [modalConfig, setModalConfig] = useState({ isOpen: false, mode: 'create', deckId: null });
  const [deleteModalConfig, setDeleteModalConfig] = useState({ isOpen: false, deckId: null });
  const [deckName, setDeckName] = useState('');
  const [deckDesc, setDeckDesc] = useState('');

  // Estado para el mensaje Toast (notificación)
  const [toast, setToast] = useState({ visible: false, message: '' });

  // Función para mostrar el mensaje temporalmente
  const showToast = (message) => {
    setToast({ visible: true, message });
    setTimeout(() => {
      setToast({ visible: false, message: '' });
    }, 3000); // Se oculta después de 3 segundos
  };

  // --- LÓGICA DE CREAR / EDITAR ---
  const openCreateModal = () => {
    setDeckName('');
    setDeckDesc('');
    setModalConfig({ isOpen: true, mode: 'create', deckId: null });
  };

  const openEditModal = (deck) => {
    setDeckName(deck.title);
    setDeckDesc(deck.description);
    setModalConfig({ isOpen: true, mode: 'edit', deckId: deck.id });
  };

  const handleSaveDeck = (e) => {
    e.preventDefault();
    if (!deckName.trim()) return;

    if (modalConfig.mode === 'create') {
      const newDeck = {
        id: Date.now(),
        title: deckName,
        description: deckDesc || 'Sin descripción',
        totalCards: 0,
        dueCards: 0,
        progress: 0
      };
      setDecks([...decks, newDeck]);
      showToast('Mazo creado exitosamente');
    } else {
      // Modo edición
      setDecks(decks.map(deck => 
        deck.id === modalConfig.deckId 
          ? { ...deck, title: deckName, description: deckDesc } 
          : deck
      ));
      showToast('Mazo editado exitosamente');
    }

    setModalConfig({ isOpen: false, mode: 'create', deckId: null });
  };

  // --- LÓGICA DE ELIMINAR ---
  const openDeleteModal = (id) => {
    setDeleteModalConfig({ isOpen: true, deckId: id });
  };

  const confirmDelete = () => {
    setDecks(decks.filter(deck => deck.id !== deleteModalConfig.deckId));
    setDeleteModalConfig({ isOpen: false, deckId: null });
    showToast('Mazo eliminado exitosamente');
  };

  return (
    <div className="decks-container">
      <div className="decks-header">
        <div className="decks-header-text">
          <h1 className="decks-title">Mis Mazos</h1>
          <p className="decks-subtitle">Gestiona y organiza tus categorías de estudio</p>
        </div>
        <button className="btn-new-deck" onClick={openCreateModal}>
          <Plus size={18} />
          Nuevo Mazo
        </button>
      </div>

      <div className="decks-grid">
        {decks.map((deck) => (
          <div 
          key={deck.id}
        className="deck-card" 
             onClick={() => handleDeckClick(deck.id)} 
      style={{ cursor: 'pointer' }} // Para que el usuario sepa que es clickable
>
  <div className="deck-card-top">
    <div className="deck-title-group">
      <div className="deck-icon"><BookOpen size={20} /></div>
      <div className="deck-info">
        <h3>{deck.title}</h3>
        <p>{deck.description}</p>
      </div>
    </div>
    <div className="deck-actions">
      <button 
        className="btn-action" 
        onClick={(e) => { 
          e.stopPropagation(); // Evita que se entre al mazo al querer editar
          openEditModal(deck); 
        }} 
        title="Editar"
      >
        <Pencil size={16} />
      </button>
      <button 
        className="btn-action btn-delete" 
        onClick={(e) => { 
          e.stopPropagation(); // Evita que se entre al mazo al querer eliminar
          openDeleteModal(deck.id); 
        }} 
        title="Eliminar"
      >
        <Trash2 size={16} />
      </button>
    </div>
  </div>


            <div className="deck-card-middle">
              <div className="tag-cards">
                <span>[ ] {deck.totalCards} {deck.totalCards === 1 ? 'tarjeta' : 'tarjetas'}</span>
              </div>
              <div className="text-due">{deck.dueCards} para hoy</div>
            </div>

            <div className="deck-card-bottom">
              <div className="progress-labels">
                <span>Progreso</span>
                <span>{deck.progress}%</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${deck.progress}%` }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- MODAL CREAR / EDITAR --- */}
      {modalConfig.isOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{modalConfig.mode === 'create' ? 'Crear Nuevo Mazo' : 'Editar Mazo'}</h2>
              <button className="btn-close" onClick={() => setModalConfig({ isOpen: false, mode: 'create', deckId: null })}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSaveDeck}>
              <div className="form-group">
                <label>Nombre del Mazo</label>
                <input 
                  type="text" 
                  placeholder="Ej: Biología Celular" 
                  value={deckName}
                  onChange={(e) => setDeckName(e.target.value)}
                  autoFocus
                />
              </div>
              
              <div className="form-group">
                <label>Descripción (opcional)</label>
                <textarea 
                  placeholder="Breve descripción del contenido..."
                  value={deckDesc}
                  onChange={(e) => setDeckDesc(e.target.value)}
                  rows="3"
                ></textarea>
              </div>

              <button type="submit" className="btn-submit-deck">
                {modalConfig.mode === 'create' ? 'Guardar Mazo' : 'Actualizar Mazo'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL DE CONFIRMACIÓN DE ELIMINACIÓN --- */}
      {deleteModalConfig.isOpen && (
        <div className="modal-overlay">
          <div className="modal-content delete-modal">
            <h3>¿Estás seguro de eliminar este mazo?</h3>
            <p>Perderás todas sus tarjetas y tu progreso.</p>
            <div className="delete-modal-actions">
              <button className="btn-cancel" onClick={() => setDeleteModalConfig({ isOpen: false, deckId: null })}>
                Cancelar
              </button>
              <button className="btn-confirm-delete" onClick={confirmDelete}>
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MENSAJE TOAST (Notificación) --- */}
      {toast.visible && (
        <div className="toast-notification">
          <CheckCircle size={18} className="toast-icon" />
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}