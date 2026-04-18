import api from './api';

export const mazoService = {
  // Obtener todos los mazos
  obtenerMazos: async () => {
    const response = await api.get('/mazos');
    return response.data;
  },

  // Crear un mazo
  crearMazo: async (datosMazo) => {
    const response = await api.post('/mazos', datosMazo);
    return response.data;
  },

  // 👇 NUEVO: Editar un mazo
  editarMazo: async (id, datosMazo) => {
    const response = await api.put(`/mazos/${id}`, datosMazo);
    return response.data;
  },

  // 👇 NUEVO: Eliminar un mazo
  eliminarMazo: async (id) => {
    const response = await api.delete(`/mazos/${id}`);
    return response.data;
  }
};