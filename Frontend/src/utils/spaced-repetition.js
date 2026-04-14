/**
 * Algoritmo de repetición espaciada basado en SM-2
 * Calcula el próximo intervalo de revisión según la dificultad reportada
 */
export function calculateNextReview(flashcard, dificultad) {
  let intervalo = flashcard.intervalo;
  let repeticiones = flashcard.repeticiones;

  if (dificultad === "dificil") {
    // Reinicia el progreso
    intervalo = 1;
    repeticiones = 0;
  } else if (dificultad === "medio") {
    // Incrementa ligeramente
    intervalo = Math.max(1, Math.ceil(intervalo * 1.2));
    repeticiones += 1;
  } else if (dificultad === "facil") {
    // Incrementa significativamente
    if (repeticiones === 0) {
      intervalo = 1;
    } else if (repeticiones === 1) {
      intervalo = 6;
    } else {
      intervalo = Math.ceil(intervalo * 2.5);
    }
    repeticiones += 1;
  }

  // Calcular la próxima fecha de revisión
  const proximaRevision = new Date();
  proximaRevision.setDate(proximaRevision.getDate() + intervalo);

  return {
    ...flashcard,
    dificultad,
    intervalo,
    repeticiones,
    proxima_revision: proximaRevision.toISOString(),
  };
}

/**
 * Filtra las flashcards que deben revisarse hoy
 */
export function getCardsForToday(flashcards) {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  return flashcards.filter((card) => {
    const fechaRevision = new Date(card.proxima_revision);
    fechaRevision.setHours(0, 0, 0, 0);
    return fechaRevision <= hoy;
  });
}