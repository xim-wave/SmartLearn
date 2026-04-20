import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Plus, X, Pencil, Trash2, CheckCircle } from 'lucide-react';
import { mazoService } from '../services/mazoService'; // 👈 Importamos la conexión al backend
import './MisMazos.css';

export function MisMazos() {
  const navigate = useNavigate();
  // 1. Iniciamos los mazos como un arreglo vacío (se llenarán desde el backend)
  const [decks, setDecks] = useState([]);

  // Estados para los formularios y modales
  const [modalConfig, setModalConfig] = useState({ isOpen: false, mode: 'create', deckId: null });
  const [deleteModalConfig, setDeleteModalConfig] = useState({ isOpen: false, deckId: null });
  const [deckName, setDeckName] = useState('');
  const [deckDesc, setDeckDesc] = useState('');

  // Estado para el mensaje Toast (notificación)
  const [toast, setToast] = useState({ visible: false, message: '' });

  // 2. Este Hook hace que se carguen los mazos apenas entras a la pantalla
  useEffect(() => {
    cargarMazos();
  }, []);

  // Función que va a la base de datos a traer los mazos reales
  const cargarMazos = async () => {
    try {
      const data = await mazoService.obtenerMazos();
      
      // Mapeamos los datos por si la base de datos usa nombres en español
      // (ej. "nombre" en lugar de "title")
      const mazosReales = data.map(mazo => ({
        id: mazo.id,
        title: mazo.nombre || mazo.title || 'Sin título',
        description: mazo.descripcion || mazo.description || 'Sin descripción',
        totalCards: mazo.totalCards || 0,
        dueCards: mazo.dueCards || 0,
        progress: mazo.progress || 0
      }));

      setDecks(mazosReales);
    } catch (error) {
      console.error("Error al cargar los mazos:", error);
      showToast('Error al cargar los mazos desde el servidor');
    }
  };

  const showToast = (message) => {
    setToast({ visible: true, message });
    setTimeout(() => {
      setToast({ visible: false, message: '' });
    }, 3000);
  };

  const handleDeckClick = (id) => {
    navigate(`/app/decks/${id}`);
  };

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

  // 3. Modificamos el guardado para que envíe el mazo a Supabase
  // 3. Función actualizada para CREAR y EDITAR en base de datos
  const handleSaveDeck = async (e) => {
    e.preventDefault();
    if (!deckName.trim()) return;

    if (modalConfig.mode === 'create') {
      try {
        await mazoService.crearMazo({
          nombre: deckName,
          descripcion: deckDesc || 'Sin descripción'
        });
        await cargarMazos();
        showToast('Mazo creado en la base de datos');
      } catch (error) {
        console.error("Error al crear mazo:", error);
        showToast('Error al guardar el mazo');
      }
    } else {
      // 👇 AQUÍ CONECTAMOS LA EDICIÓN REAL
      try {
        await mazoService.editarMazo(modalConfig.deckId, {
          nombre: deckName,
          descripcion: deckDesc || 'Sin descripción'
        });
        await cargarMazos(); // Recargamos la lista desde el backend
        showToast('Mazo actualizado exitosamente');
      } catch (error) {
        console.error("Error al editar mazo:", error);
        showToast('Error al actualizar el mazo');
      }
    }

    setModalConfig({ isOpen: false, mode: 'create', deckId: null });
  };

  const openDeleteModal = (id) => {
    setDeleteModalConfig({ isOpen: true, deckId: id });
  };

  // 4. Función actualizada para ELIMINAR en base de datos
  const confirmDelete = async () => {
    try {
      // 👇 AQUÍ CONECTAMOS LA ELIMINACIÓN REAL
      await mazoService.eliminarMazo(deleteModalConfig.deckId);
      await cargarMazos(); // Recargamos la lista desde el backend
      setDeleteModalConfig({ isOpen: false, deckId: null });
      showToast('Mazo eliminado para siempre 🗑️');
    } catch (error) {
      console.error("Error al eliminar mazo:", error);
      showToast('Error al eliminar el mazo');
    }
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
        {decks.length === 0 && (
          <div style={{ textAlign: 'center', color: '#666', gridColumn: '1 / -1', padding: '40px' }}>
            Aún no tienes mazos. ¡Crea el primero!
          </div>
        )}
        
        {decks.map((deck) => (
          <div 
            key={deck.id}
            className="deck-card" 
            onClick={() => handleDeckClick(deck.id)} 
            style={{ cursor: 'pointer' }}
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
                    e.stopPropagation(); 
                    openEditModal(deck); 
                  }} 
                  title="Editar"
                >
                  <Pencil size={16} />
                </button>
                <button 
                  className="btn-action btn-delete" 
                  onClick={(e) => { 
                    e.stopPropagation(); 
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

      {toast.visible && (
        <div className="toast-notification">
          <CheckCircle size={18} className="toast-icon" />
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}