import api from './api';

export const mazoService = {
  // Obtener todos los mazos
 obtenerMazos: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/mazos', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Error al obtener los mazos');
      return await response.json();
    } catch (error) {
      throw error;
    }
  },
  obtenerMazo: async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/mazos/${id}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Error al obtener el mazo');
      return await response.json();
    } catch (error) {
      throw error;
    }
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