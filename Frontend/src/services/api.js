import axios from 'axios';

// Creamos una instancia de axios con la configuración base
const api = axios.create({
  // Aquí pondremos la URL donde esté corriendo el backend de tu equipo
  // Por ahora pongo una de ejemplo (localhost:3000), pero luego la ajustamos
  baseURL: 'http://localhost:3000/api', 
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor: Esto intercepta todas las peticiones ANTES de que salgan.
// Es el lugar perfecto para inyectar el token de seguridad si el usuario ya inició sesión.
api.interceptors.request.use(
  (config) => {
    // Si usas un token de autenticación (JWT), lo leemos del almacenamiento local
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;