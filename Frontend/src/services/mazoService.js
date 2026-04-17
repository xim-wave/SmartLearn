import api from './api';

export const mazoService = {
  // Función para pedirle al backend la lista de mazos (GET /api/mazos)
  obtenerMazos: async () => {
    const response = await api.get('/mazos');
    return response.data;
  },

  // Función para guardar un mazo nuevo en la base de datos (POST /api/mazos)
  crearMazo: async (datosMazo) => {
    const response = await api.post('/mazos', datosMazo);
    return response.data;
  }
};