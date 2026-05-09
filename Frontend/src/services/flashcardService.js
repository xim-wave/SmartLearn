import axios from 'axios';

// La URL base de tu backend
const API_URL = 'http://localhost:3000/api/flashcards';

// Función mágica para obtener el pase VIP antes de cada petición
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}` // Así se le muestra el pase VIP al cadenero
    }
  };
};

export const flashcardService = {
  // Crear una nueva flashcard (Manual)
  crearFlashcard: async ({ mazo_id, pregunta, respuesta }) => { // 👈 ¡Ojo aquí con las llaves!
    try {
      const response = await axios.post(
        `${API_URL}/`, 
        { mazo_id, pregunta, respuesta },
        getAuthHeaders() 
      );
      return response.data;
    } catch (error) {
      console.error("Error al crear flashcard:", error);
      throw error;
    }
  },

  // Obtener las tarjetas que tocan repasar HOY (Se arregló el error 404 cambiando 'repasar' por 'estudiar')
  obtenerParaRepasar: async (mazo_id) => {
    try {
      const response = await axios.get(
        `${API_URL}/estudiar/${mazo_id}`,
        getAuthHeaders() // Le enviamos el token
      );
      return response.data;
    } catch (error) {
      console.error("Error al cargar tarjetas para repasar:", error);
      throw error;
    }
  },

  // Enviar la calificación de la tarjeta (Algoritmo SM-2)
  calificarFlashcard: async (flashcard_id, calidad) => {
    try {
      const response = await axios.put(
        `${API_URL}/${flashcard_id}/repasar`, 
        { calidad },
        getAuthHeaders() // Le enviamos el token
      );
      return response.data;
    } catch (error) {
      console.error("Error al calificar flashcard:", error);
      throw error;
    }
  }
};