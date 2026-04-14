import React, { useState } from 'react';
import { 
  ArrowLeft, Plus, Link as LinkIcon, FileText, Upload, X, 
  Pencil, Trash2, FlipHorizontal, PlayCircle, CheckCircle
} from 'lucide-react';
import './DeckDetail.css';

export function DeckDetail() {
  // Estado para las pestañas
  const [activeTab, setActiveTab] = useState('resources');
  
  // Estado para el panel lateral de recursos
  const [isResourcePanelOpen, setIsResourcePanelOpen] = useState(false);
  const [url, setUrl] = useState('');

  // Estado para notificaciones
  const [toast, setToast] = useState({ visible: false, message: '' });

  // Mazo de prueba (Mock data)
  const [deck, setDeck] = useState({
    id: 1,
    title: 'Ingeniería de Software',
    description: 'Conceptos fundamentales de ingeniería de software',
    resources: [],
    flashcards: []
  });

  const showToast = (message) => {
    setToast({ visible: true, message });
    setTimeout(() => setToast({ visible: false, message: '' }), 3000);
  };

  const handleSaveResource = (e) => {
    e.preventDefault();
    // Aquí en el futuro se guardará el recurso real
    showToast('Recurso agregado exitosamente');
    setIsResourcePanelOpen(false);
    setUrl('');
  };

  return (
    <div className="deck-detail-container">
      <div className="deck-detail-content">
        
        {/* --- HEADER --- */}
        <div className="deck-header">
          <button className="btn-back">
            <ArrowLeft size={16} /> Volver a Mazos
          </button>
          
          <div className="deck-title-row">
            <div>
              <h1 className="deck-main-title">{deck.title}</h1>
              <p className="deck-main-desc">{deck.description}</p>
            </div>
            <button className="btn-study" disabled={deck.flashcards.length === 0}>
              <PlayCircle size={20} />
              Estudiar Mazo
            </button>
          </div>
        </div>

        {/* --- TABS (Pestañas) --- */}
        <div className="tabs-container">
          <div className="tabs-list">
            <button 
              className={`tab-btn ${activeTab === 'resources' ? 'active' : ''}`}
              onClick={() => setActiveTab('resources')}
            >
              Recursos ({deck.resources.length})
            </button>
            <button 
              className={`tab-btn ${activeTab === 'flashcards' ? 'active' : ''}`}
              onClick={() => setActiveTab('flashcards')}
            >
              Flashcards ({deck.flashcards.length})
            </button>
          </div>

          {/* CONTENIDO RECURSOS */}
          {activeTab === 'resources' && (
            <div className="tab-content">
              <div className="tab-actions">
                <button className="btn-primary" onClick={() => setIsResourcePanelOpen(true)}>
                  <Plus size={16} /> Añadir Recurso
                </button>
              </div>

              {deck.resources.length === 0 ? (
                <div className="empty-state">
                  <Upload size={48} className="empty-icon" />
                  <h3>No hay recursos todavía</h3>
                  <p>Comienza agregando enlaces (URLs) o subiendo archivos PDF (Máximo 10MB por archivo).</p>
                </div>
              ) : (
                <p>Aquí iría la lista de recursos...</p>
              )}
            </div>
          )}

          {/* CONTENIDO FLASHCARDS */}
          {activeTab === 'flashcards' && (
            <div className="tab-content">
              <div className="tab-actions">
                <button className="btn-primary">
                  <Plus size={16} /> Crear Flashcard
                </button>
              </div>

              {deck.flashcards.length === 0 ? (
                <div className="empty-state">
                  <FlipHorizontal size={48} className="empty-icon" />
                  <h3>Aún no hay flashcards</h3>
                  <p>Crea tarjetas de pregunta y respuesta para empezar a estudiar con repetición espaciada.</p>
                </div>
              ) : (
                <p>Aquí iría la lista de flashcards...</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* --- PANEL LATERAL DESLIZABLE (Añadir Recurso) --- */}
      {isResourcePanelOpen && (
        <div className="slide-panel-overlay" onClick={() => setIsResourcePanelOpen(false)}>
          <div className="slide-panel" onClick={e => e.stopPropagation()}>
            
            <div className="panel-header">
              <h2>Agregar Nuevo Recurso</h2>
              <p>Agrega una URL o sube un PDF</p>
              <button className="btn-close-panel" onClick={() => setIsResourcePanelOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form className="panel-body" onSubmit={handleSaveResource}>
              
              <div className="form-group">
                <label>Mazo destino</label>
                <select className="input-field">
                  <option>{deck.title}</option>
                </select>
              </div>

              <div className="form-group">
                <label>URL (YouTube, artículos, etc.)</label>
                <input 
                  type="url" 
                  className="input-field" 
                  placeholder="Pegar URL externa..." 
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>

              <div className="divider">
                <span>O</span>
              </div>

              <div className="form-group">
                <label>Subir PDF</label>
                <div className="dropzone">
                  <Upload size={32} className="dropzone-icon" />
                  <span className="dropzone-text">Arrastra tu PDF aquí o haz clic para buscar</span>
                  <span className="dropzone-subtext">Solo formato .pdf hasta 10MB</span>
                  <input type="file" accept=".pdf" className="file-input" />
                </div>
              </div>

              <button type="submit" className="btn-primary w-full mt-auto">
                Guardar Recurso
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