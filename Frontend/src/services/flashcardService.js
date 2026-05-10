import axios from 'axios';

const API_URL = 'http://localhost:3000/api/flashcards';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const flashcardService = {
  // 1. Crear una nueva flashcard
  crearFlashcard: async ({ mazo_id, pregunta, respuesta }) => {
    try {
      const response = await axios.post(`${API_URL}/`, { mazo_id, pregunta, respuesta }, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error("Error al crear flashcard:", error);
      throw error;
    }
  },

  // 2. Obtener para repasar HOY
  obtenerParaRepasar: async (mazo_id) => {
    try {
      const response = await axios.get(`${API_URL}/estudiar/${mazo_id}`, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error("Error al cargar tarjetas para repasar:", error);
      throw error;
    }
  },

  // 3. Calificar (SM-2)
  calificarFlashcard: async (flashcard_id, calidad) => {
    try {
      const response = await axios.put(`${API_URL}/${flashcard_id}/repasar`, { calidad }, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error("Error al calificar flashcard:", error);
      throw error;
    }
  },

  // ==========================================
  // NUEVAS FUNCIONES FRONTEND
  // ==========================================

  // 4. Obtener TODAS las tarjetas de un mazo
  obtenerTodasMazo: async (mazo_id) => {
    try {
      const response = await axios.get(`${API_URL}/mazo/${mazo_id}`, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error("Error al obtener todas las tarjetas:", error);
      throw error;
    }
  },

  // 5. Editar una tarjeta
  editarFlashcard: async (flashcard_id, pregunta, respuesta) => {
    try {
      const response = await axios.put(`${API_URL}/${flashcard_id}`, { pregunta, respuesta }, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error("Error al editar tarjeta:", error);
      throw error;
    }
  },

  // 6. Eliminar una tarjeta
  eliminarFlashcard: async (flashcard_id) => {
    try {
      const response = await axios.delete(`${API_URL}/${flashcard_id}`, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error("Error al eliminar tarjeta:", error);
      throw error;
    }
  }
};