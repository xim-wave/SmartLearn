# SmartLearn 🧠

> Plataforma web de micro-aprendizaje con repetición espaciada para estudiantes universitarios.

SmartLearn permite centralizar recursos académicos (PDFs, URLs), organizarlos en mazos temáticos y crear flashcards impulsadas por el **algoritmo SM-2**, que calcula automáticamente el intervalo óptimo de repaso para cada tarjeta según el rendimiento del usuario.

---

## ✨ Características principales

- 🔐 **Autenticación segura** — Registro e inicio de sesión con JWT vía Supabase Auth
- 📚 **Gestión de mazos** — Crea, edita y elimina colecciones temáticas de estudio
- 📎 **Recursos multimedia** — Adjunta PDFs (hasta 10 MB) y URLs externas a cada mazo
- 🃏 **Flashcards** — Crea tarjetas de pregunta/respuesta con modo de estudio interactivo
- 🧮 **Algoritmo SM-2** — Repetición espaciada que programa el próximo repaso según la dificultad calificada (Fácil / Medio / Difícil)
- 📊 **Dashboard de progreso** — Visualiza tu actividad de estudio de los últimos días
- 🛡️ **Aislamiento de datos** — Row Level Security (RLS) garantiza que cada usuario solo accede a su información

---

## 🛠️ Stack tecnológico

| Capa | Tecnología | Versión |
|---|---|---|
| Frontend | React + Vite | v19.2.6 |
| Estilos | Tailwind CSS | v4.2.4 |
| Backend | Node.js | v24.15.0 |
| Framework API | Express | v5.2.1 |
| Base de datos | PostgreSQL (Supabase) | v15 |
| Auth & Storage | Supabase JS | v2.103.0 |
| Upload middleware | Multer | v2.1.1 |

> **Arquitectura:** Monorepo con `/Frontend` y `/backend` separados, desplegados de forma independiente.

---

## 🚀 Despliegue en producción

| Servicio | Plataforma |
|---|---|
| Frontend | [Vercel](https://vercel.com) |
| Backend | [Render](https://render.com) |
| Base de datos | [Supabase](https://supabase.com) |

---

## ⚙️ Configuración local (para el equipo)

### Requisitos previos

- [Node.js](https://nodejs.org/) v18 o superior
- [Git](https://git-scm.com/)
- Acceso al proyecto de Supabase (solicitar al Data Architect)

---

### Paso 1 — Clonar el repositorio

```bash
git clone https://github.com/xim-wave/SmartLearn.git
cd SmartLearn
```

---

### Paso 2 — Configurar y levantar el Backend

```bash
cd backend
npm install
```

Crea un archivo `.env` en `/backend` con las siguientes variables:

```env
SUPABASE_URL=tu_supabase_url
SUPABASE_SERVICE_KEY=tu_supabase_service_key
PORT=3000
```

Inicia el servidor:

```bash
node server.js
```

El API quedará disponible en `http://localhost:3000`

---

### Paso 3 — Configurar y levantar el Frontend

```bash
cd ../Frontend
npm install
```

Crea un archivo `.env` en `/Frontend` con las siguientes variables:

```env
VITE_API_URL=http://localhost:3000
VITE_SUPABASE_URL=tu_supabase_url
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key
```

Inicia el servidor de desarrollo:

```bash
npm run dev
```

La app quedará disponible en `http://localhost:5173`

---

### Paso 4 — Base de datos

El esquema de la base de datos se encuentra en `/database/schema.sql`. Para aplicarlo, ejecuta el contenido del archivo en el **SQL Editor de Supabase**.

> ⚠️ Asegúrate de que RLS (Row Level Security) esté habilitado en las tablas `mazos`, `recursos` y `flashcards`.

---

## 📁 Estructura del proyecto

```
SmartLearn/
├── Frontend/                   # Aplicación React + Vite
│   ├── src/
│   │   ├── components/         # Componentes reutilizables (Layout, Sidebar, etc.)
│   │   ├── pages/              # Vistas principales (Login, Dashboard, Mazos, Repaso)
│   │   └── utils/
│   │       └── storage.js      # Manejo del JWT en Local Storage
│   └── vite.config.js
│
├── backend/                    # API REST con Node.js + Express
│   ├── controllers/            # Lógica de negocio (authController, mazoController...)
│   ├── routes/                 # Definición de endpoints REST
│   ├── middleware/
│   │   └── uploadMiddleware.js # Configuración de Multer (límite 10 MB)
│   ├── utils/
│   │   └── sm2.js              # Implementación del algoritmo SM-2
│   └── server.js
│
├── database/                   # Scripts de base de datos
│   └── schema.sql              # Esquema de tablas y políticas RLS
│
├── Documentos/                 # Documentación académica del proyecto
├── vite.config.js
├── .gitignore
└── README.md
```

---

## 🧮 Algoritmo SM-2

El núcleo de SmartLearn es la función `calcularSM2()` en `/backend/utils/sm2.js`. Calcula el próximo intervalo de repaso usando la fórmula del algoritmo SuperMemo 2:

```
EF' = EF + (0.1 − (5 − q) × (0.08 + (5 − q) × 0.02))
```

Donde `q` es la calidad de respuesta del usuario (escala 0–5) y `EF` es el Factor de Facilidad actual.

**Valores iniciales de cada flashcard nueva:**

| Campo | Valor por defecto |
|---|---|
| `intervalo_dias` | 1 |
| `factor_facilidad` | 2.5 |
| `repeticiones` | 0 |
| `prox_revision` | fecha de creación |

---

## 🔌 Endpoints principales de la API

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/auth/registro` | Registro de nuevo usuario |
| `POST` | `/api/auth/login` | Inicio de sesión, retorna JWT |
| `GET` | `/api/mazos` | Obtener mazos del usuario |
| `POST` | `/api/mazos` | Crear nuevo mazo |
| `DELETE` | `/api/mazos/:id` | Eliminar mazo (cascada a recursos y flashcards) |
| `POST` | `/api/recursos/:mazo_id` | Agregar recurso (PDF o URL) a un mazo |
| `GET` | `/api/flashcards/:mazo_id` | Obtener flashcards de un mazo |
| `POST` | `/api/flashcards` | Crear flashcard |
| `PATCH` | `/api/flashcards/:id/repasar` | Registrar repaso y actualizar SM-2 |

---

## 👥 Equipo de desarrollo

| Integrante | Rol |
|---|---|
| **David Martínez Moreno** | Backend Lead & API |
| **Brenda Ramírez Aguilar** | Frontend Lead & UX |
| **Ricardo Nieto Campos** | Data Architect & Documentación |
| **Julia Vanessa Cortés Quezada** | UI Designer & Frontend Dev |
| **Ximena González Sandoval** | Project Manager & QA Lead |

---

## 📋 Notas

- El compilador de React **no está habilitado** en esta plantilla por su impacto en el rendimiento de desarrollo. Si deseas activarlo, consulta la [documentación oficial](https://react.dev/learn/react-compiler/installation).
- Los archivos PDF adjuntos tienen un límite de **10 MB** por archivo (RF-10).
- La plataforma no incluye: app móvil, sistema de pagos, integración con redes sociales ni planes premium.

---

*Universidad de Guadalajara — CUCEI | Ingeniería de Software D13 — Equipo 2 | 2026*
