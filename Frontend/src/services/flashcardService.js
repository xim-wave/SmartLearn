import api from './api';

export const flashcardService = {
  // Crear una nueva tarjeta (POST /api/flashcards)
  crearFlashcard: async (datosTarjeta) => {
    const response = await api.post('/flashcards', datosTarjeta);
    return response.data;
  },

  // Obtener tarjetas para estudiar hoy (GET /api/flashcards/estudiar/:mazo_id)
  obtenerParaRepasar: async (mazoId) => {
    const response = await api.get(`/flashcards/estudiar/${mazoId}`);
    return response.data;
  },

  // Actualizar el estado de la tarjeta tras repasarla (PUT /api/flashcards/:id/repasar)
  repasarFlashcard: async (id, calificacion) => {
    const response = await api.put(`/flashcards/${id}/repasar`, { calificacion });
    return response.data;
  }
};