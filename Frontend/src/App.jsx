import { Routes, Route } from 'react-router-dom';
import { DeckDetail } from './pages/DeckDetail';
import { MisMazos } from './pages/MisMazos';
import { StudyDeck } from './pages/StudyDeck';

// Importamos el Layout
import { Layout } from './components/Layout';

// 👇 Importamos a nuestro cadenero de seguridad
import { ProtectedRoute } from './components/ProtectedRoute';

// Importamos tus pantallas
import Login from './pages/Login';
import Registro from './pages/Registro';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Routes>
      {/* Rutas públicas (No necesitan gafete) */}
      <Route path="/" element={<Login />} />
      <Route path="/registro" element={<Registro />} />

      {/* Rutas Privadas (Protegidas por el cadenero) */}
      {/* 👇 Aquí envolvemos el Layout con el ProtectedRoute */}
      <Route path="/app" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        {/* Todo lo que esté aquí adentro ya está protegido automáticamente 🛡️ */}
        <Route index element={<Dashboard />} /> 
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="decks" element={<MisMazos />} /> 
        <Route path="decks/:id" element={<DeckDetail />} />
        <Route path="decks/:id/study" element={<StudyDeck />} />
      </Route>
    </Routes>
  );
}

export default App;