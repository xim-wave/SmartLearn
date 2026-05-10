import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, RotateCcw, CheckCircle } from 'lucide-react';
import { flashcardService } from '../services/flashcardService'; // 👈 Importamos el servicio
import './StudyDeck.css';

export function StudyDeck() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Estados para controlar el estudio
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFinished, setIsFinished] = useState(false); // Para saber si ya acabó las de hoy

  // 1. Cargar las tarjetas cuando entramos a la pantalla
  useEffect(() => {
    cargarTarjetasDeHoy();
  }, [id]);

  const cargarTarjetasDeHoy = async () => {
    try {
      setIsLoading(true);
      const data = await flashcardService.obtenerParaRepasar(id);
      
      if (data && data.flashcards && data.flashcards.length > 0) {
        // Adaptamos los nombres de la base de datos a los que usa tu diseño
        const tarjetasReales = data.flashcards.map(card => ({
          id: card.flashcard_id || card.id,
          question: card.pregunta || card.question,
          answer: card.respuesta || card.answer
        }));
        setFlashcards(tarjetasReales);
      } else {
        // Si no hay tarjetas pendientes para hoy, marcamos como terminado
        setIsFinished(true); 
      }
    } catch (error) {
      console.error("Error al cargar tarjetas de estudio:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate(`/app/decks/${id}`);
  };

  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  // 2. Función clave: Calificar la tarjeta (Algoritmo SM-2)
  const handleRateCard = async (calidad) => {
    const currentCard = flashcards[currentIndex];
    
    try {
      // Mandamos la calificación de esta tarjeta específica al backend de David
      await flashcardService.calificarFlashcard(currentCard.id, calidad);
      
      // Si todo sale bien, pasamos a la siguiente tarjeta
      if (currentIndex < flashcards.length - 1) {
        setIsFlipped(false); // Volteamos la tarjeta de regreso
        setTimeout(() => setCurrentIndex(currentIndex + 1), 150); // Pequeño retraso visual
      } else {
        // Si ya era la última, terminamos la sesión
        setIsFinished(true);
      }
    } catch (error) {
      console.error("Error al calificar tarjeta:", error);
      alert("Hubo un error al guardar tu progreso.");
    }
  };

  // PANTALLA DE CARGA
  if (isLoading) {
    return (
      <div className="study-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <h2>Cargando tus tarjetas para hoy... 🧠</h2>
      </div>
    );
  }

  // PANTALLA DE "ESTÁS AL DÍA" (Cuando terminas)
  if (isFinished) {
    return (
      <div className="study-container">
        <div className="study-header">
          <button className="btn-back" onClick={handleGoBack}>
            <ArrowLeft size={16} /> Volver al Mazo
          </button>
        </div>
        <div className="empty-state" style={{ marginTop: '60px', textAlign: 'center' }}>
          <CheckCircle size={64} color="#4ade80" style={{ margin: '0 auto 20px auto' }} />
          <h2>¡Estás al día! 🎉</h2>
          <p>Ya no tienes más tarjetas pendientes por repasar en este mazo el día de hoy.</p>
          <button className="btn-add" onClick={handleGoBack} style={{ marginTop: '30px' }}>
            Regresar a Detalles
          </button>
        </div>
      </div>
    );
  }

  const currentCard = flashcards[currentIndex];
  const totalCards = flashcards.length;

  return (
    <div className="study-container">
      {/* Cabecera de estudio */}
      <div className="study-header">
        <button className="btn-back" onClick={handleGoBack}>
          <ArrowLeft size={16} />
          Volver al Mazo
        </button>
        <div className="study-progress">
          Tarjeta {currentIndex + 1} de {totalCards}
        </div>
      </div>

      {/* Tarjeta 3D */}
      <div className="flashcard-study-area">
        <div 
          className={`study-card ${isFlipped ? 'flipped' : ''}`} 
          onClick={!isFlipped ? toggleFlip : undefined} // Ya no dejamos que se voltee de regreso sola si ya está en la respuesta
        >
          <div className="study-card-inner">
            {/* Frente de la tarjeta (Pregunta) */}
            <div className="study-card-front">
              <span className="card-label">Pregunta</span>
              <h2>{currentCard.question}</h2>
              <div className="flip-hint">
                <RotateCcw size={16} />
                <span>Haz clic para voltear</span>
              </div>
            </div>

            {/* Reverso de la tarjeta (Respuesta) */}
            <div className="study-card-back">
              <span className="card-label answer-label">Respuesta</span>
              <p>{currentCard.answer}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controles de calificación (Solo aparecen cuando volteas la tarjeta) */}
      <div className="study-controls" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
        
        {!isFlipped ? (
          <button className="btn-control primary" onClick={toggleFlip} style={{ width: '200px' }}>
            Mostrar Respuesta
          </button>
        ) : (
          <>
            <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: 'bold' }}>
              ¿Qué tan difícil fue recordarlo?
            </span>
           <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button className="btn-control" onClick={() => handleRateCard(1)} style={{ backgroundColor: '#fef08a', color: '#854d0e', border: '1px solid #fde047' }}>
                Difícil
              </button>
              <button className="btn-control" onClick={() => handleRateCard(2)} style={{ backgroundColor: '#dcfce3', color: '#166534', border: '1px solid #86efac' }}>
                Bien
              </button>
              <button className="btn-control" onClick={() => handleRateCard(3)} style={{ backgroundColor: '#dbeafe', color: '#1e40af', border: '1px solid #93c5fd' }}>
                Muy Fácil
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}