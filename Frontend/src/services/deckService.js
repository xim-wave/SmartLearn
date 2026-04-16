import api from './api';

export const deckService = {
  // Obtener todos los mazos del usuario
  getDecks: async () => {
    const response = await api.get('/decks');
    return response.data;
  },

  // Obtener un mazo específico por su ID
  getDeckById: async (id) => {
    const response = await api.get(`/decks/${id}`);
    return response.data;
  },

  // Crear un nuevo recurso (URL o PDF)
  addResource: async (deckId, resourceData) => {
    const response = await api.post(`/decks/${deckId}/resources`, resourceData);
    return response.data;
  },

  // Pedirle al backend que genere las flashcards
  generateFlashcards: async (deckId) => {
    const response = await api.post(`/decks/${deckId}/generate`);
    return response.data;
  }
};