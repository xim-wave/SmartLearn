import axios from 'axios';

// Creamos la conexión base
const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Cambia esto si tu backend usa otro puerto o ruta
});

// 👇 ESTA ES LA MAGIA 👇
// Le decimos a Axios que, antes de enviar CUALQUIER petición, le pegue el gafete (Token)
api.interceptors.request.use(
  (config) => {
    // Aquí buscamos el token que se guardó cuando hiciste Login. 
    // NOTA: Si en tu Login lo guardaste con otro nombre (ej. 'accessToken' o 'jwt'), cámbialo aquí abajo.
    const token = localStorage.getItem('token'); 
    
    if (token) {
      // Si tenemos el token, se lo ponemos en la cabecera (Header) de Autorización
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;