const STORAGE_KEYS = {
  DECKS: "smart_learn_decks",
  RESOURCES: "smart_learn_resources",
  SESSIONS: "smart_learn_sessions",
  USER: "smart_learn_user",
};

export const storage = {
  // --- Decks (Mazos) ---
  getDecks() {
    const data = localStorage.getItem(STORAGE_KEYS.DECKS);
    return data ? JSON.parse(data) : [];
  },

  saveDecks(decks) {
    localStorage.setItem(STORAGE_KEYS.DECKS, JSON.stringify(decks));
  },

  // --- Resources (Recursos/PDFs) ---
  getResources() {
    const data = localStorage.getItem(STORAGE_KEYS.RESOURCES);
    return data ? JSON.parse(data) : [];
  },

  saveResources(resources) {
    localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(resources));
  },

  // --- Study Sessions (Sesiones de estudio y estadísticas) ---
  getSessions() {
    const data = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    return data ? JSON.parse(data) : [];
  },

  saveSessions(sessions) {
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
  },

  // --- User (Usuario logueado) ---
  getUser() {
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    return data ? JSON.parse(data) : null;
  },

  saveUser(user) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  clearUser() {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem('token');
  },

  // --- Initialize with mock data (Datos de prueba iniciales) ---
  initializeMockData() {
    if (this.getDecks().length === 0) {
      const mockDecks = [
        {
          id: "1",
          nombre: "Ingeniería de Software",
          descripcion: "Conceptos fundamentales de ingeniería de software",
          progreso: 65,
          flashcards: [
            {
              id: "1-1",
              pregunta: "¿Qué es el patrón MVC?",
              respuesta: "Modelo-Vista-Controlador es un patrón de arquitectura de software que separa la lógica de negocio (Modelo), la interfaz de usuario (Vista) y el control de flujo (Controlador).",
              dificultad: null,
              proxima_revision: new Date().toISOString(),
              intervalo: 1,
              repeticiones: 0,
            },
            {
              id: "1-2",
              pregunta: "¿Qué es SCRUM?",
              respuesta: "SCRUM es un marco de trabajo ágil para gestionar proyectos complejos, utilizando sprints, dailys y retrospectivas.",
              dificultad: null,
              proxima_revision: new Date().toISOString(),
              intervalo: 1,
              repeticiones: 0,
            },
            {
              id: "1-3",
              pregunta: "¿Qué es un requisito funcional?",
              respuesta: "Es una descripción específica de una funcionalidad que el sistema debe realizar, como 'el usuario debe poder iniciar sesión'.",
              dificultad: null,
              proxima_revision: new Date().toISOString(),
              intervalo: 1,
              repeticiones: 0,
            },
          ],
        },
        {
          id: "2",
          nombre: "Estructuras de Datos",
          descripcion: "Listas, árboles, grafos y algoritmos",
          progreso: 40,
          flashcards: [
            {
              id: "2-1",
              pregunta: "¿Qué es una Pila (Stack)?",
              respuesta: "Una estructura de datos LIFO (Last In, First Out) donde el último elemento agregado es el primero en salir.",
              dificultad: null,
              proxima_revision: new Date().toISOString(),
              intervalo: 1,
              repeticiones: 0,
            },
            {
              id: "2-2",
              pregunta: "¿Cuál es la complejidad de búsqueda en un árbol binario balanceado?",
              respuesta: "O(log n) en el caso promedio y mejor caso.",
              dificultad: null,
              proxima_revision: new Date().toISOString(),
              intervalo: 1,
              repeticiones: 0,
            },
          ],
        },
        {
          id: "3",
          nombre: "Bases de Datos",
          descripcion: "SQL, normalización y diseño de BD",
          progreso: 80,
          flashcards: [
            {
              id: "3-1",
              pregunta: "¿Qué es la Primera Forma Normal (1NF)?",
              respuesta: "Una tabla está en 1NF cuando todos sus atributos contienen valores atómicos (no divisibles) y no hay grupos repetidos.",
              dificultad: null,
              proxima_revision: new Date().toISOString(),
              intervalo: 1,
              repeticiones: 0,
            },
          ],
        },
      ];
      this.saveDecks(mockDecks);
    }
  },
};