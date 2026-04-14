import { Routes, Route } from 'react-router-dom';
import { DeckDetail } from './pages/DeckDetail';
import { MisMazos } from './pages/MisMazos';

// Importamos el Layout que acabas de crear
import { Layout } from './components/Layout';

// Importamos tus pantallas
import Login from './pages/Login';
import Registro from './pages/Registro';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<Login />} />
      <Route path="/registro" element={<Registro />} />

      {/* Rutas con la barra lateral */}
      <Route path="/app" element={<Layout />}>
        {/* Esta línea hace que funcione en /app */}
        <Route index element={<Dashboard />} /> 
        
        {/* Esta línea hace que funcione específicamente en /app/dashboard */}
        <Route path="dashboard" element={<Dashboard />} />
        
        <Route path="decks" element={<MisMazos />} /> 
        
        {/* Ruta dinámica corregida (sin el /app/ al principio porque ya está anidada) */}
        <Route path="decks/:id" element={<DeckDetail />} />
      </Route>
    </Routes>
  );
}

export default App;