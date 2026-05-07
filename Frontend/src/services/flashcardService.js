import axios from 'axios';

// Asegúrate de que el puerto sea el mismo que el de tu backend (normalmente 3000)
const API_URL = 'http://localhost:3000/api/flashcards';

export const flashcardService = {
  // 1. Enviar los datos para crear una tarjeta nueva
  crearFlashcard: async (datos) => {
    // datos debe ser un objeto: { mazo_id, pregunta, respuesta }
    const response = await axios.post(`${API_URL}/`, datos);
    return response.data;
  },

  // 2. Traer solo las tarjetas que tocan estudiar el día de hoy
  obtenerParaRepasar: async (mazo_id) => {
    const response = await axios.get(`${API_URL}/repasar/${mazo_id}`);
    return response.data;
  },

  // 3. Mandar la calificación (0 al 5) para que el algoritmo haga su magia
  calificarFlashcard: async (flashcard_id, calidad) => {
    const response = await axios.put(`${API_URL}/${flashcard_id}`, { calidad });
    return response.data;
  }
};