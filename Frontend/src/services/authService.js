import api from './api';

export const authService = {
  // Función para iniciar sesión
  login: async (email, password) => {
    // Esto hará un POST a http://localhost:3000/api/auth/login
    const response = await api.post('/auth/login', {
      email,
      password
    });
    return response.data;
  },

  // Función para registrar (ya la dejamos lista de una vez)
  registro: async (userData) => {
    // Esto hará un POST a http://localhost:3000/api/auth/registro
    const response = await api.post('/auth/registro', userData);
    return response.data;
  }
};