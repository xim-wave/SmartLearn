import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import './StudyDeck.css';

export function StudyDeck() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Estados para controlar el estudio
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Simulamos las tarjetas que la plataforma generó previamente
  const mockFlashcards = [
    { id: 1, question: '¿Qué es un componente en React?', answer: 'Un bloque de código reutilizable que representa una parte de la interfaz de usuario.' },
    { id: 2, question: '¿Para qué sirve el hook useState?', answer: 'Para añadir y gestionar el estado local dentro de un componente funcional.' },
    { id: 3, question: '¿Qué es el Virtual DOM?', answer: 'Una copia ligera en memoria del DOM real que React usa para optimizar las actualizaciones.' },
  ];

  const currentCard = mockFlashcards[currentIndex];
  const totalCards = mockFlashcards.length;

  // Funciones de navegación
  const handleGoBack = () => {
    navigate(`/app/decks/${id}`);
  };

  const handleNextCard = () => {
    if (currentIndex < totalCards - 1) {
      setIsFlipped(false); // Regresamos la tarjeta al frente antes de cambiar
      // Pequeño retraso para que la animación de giro termine antes de cambiar el texto
      setTimeout(() => setCurrentIndex(currentIndex + 1), 150);
    }
  };

  const handlePrevCard = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(currentIndex - 1), 150);
    }
  };

  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
  };

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
          onClick={toggleFlip}
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
              <div className="flip-hint">
                <RotateCcw size={16} />
                <span>Haz clic para voltear</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controles de navegación */}
      <div className="study-controls">
        <button 
          className="btn-control" 
          onClick={handlePrevCard} 
          disabled={currentIndex === 0}
        >
          <ChevronLeft size={20} />
          Anterior
        </button>
        
        <button 
          className="btn-control primary" 
          onClick={handleNextCard}
          disabled={currentIndex === totalCards - 1}
        >
          Siguiente
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}