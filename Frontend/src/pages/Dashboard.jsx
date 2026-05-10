import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, TrendingUp, Calendar, ChevronRight, Plus } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// 1. ¡Adiós datos falsos! Importamos tus servicios reales
import { mazoService } from "../services/mazoService"; 
import { flashcardService } from "../services/flashcardService";

import "./Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  
  // Estados para nuestros datos reales
  const [decks, setDecks] = useState([]);
  const [tarjetasHoy, setTarjetasHoy] = useState(0);
  const [deckParaEstudiar, setDeckParaEstudiar] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 2. Cargamos los datos reales desde el Backend
 // Cargamos los datos reales desde el Backend
  useEffect(() => {
    const cargarDashboard = async () => {
      try {
        setIsLoading(true);
        
        // Obtenemos la respuesta del backend
        const respuesta = await mazoService.obtenerMazos();
        
        // ¡El truco antibalas! Extraemos la lista, sin importar cómo la envíe el backend
        const misMazos = respuesta?.mazos || (Array.isArray(respuesta) ? respuesta : []);
        setDecks(misMazos);

        let totalPendientes = 0;
        let primerMazoConPendientes = null;

        // Revisamos mazo por mazo
        if (misMazos.length > 0) {
          for (const mazo of misMazos) {
            // Aseguramos el ID correcto (a veces se llama id, a veces mazo_id)
            const idDelMazo = mazo.mazo_id || mazo.id;
            
            if (!idDelMazo) continue; // Si por alguna razón no hay ID, lo saltamos

            const dataRepaso = await flashcardService.obtenerParaRepasar(idDelMazo);
            const pendientesMazo = dataRepaso?.flashcards?.length || 0;
            
            totalPendientes += pendientesMazo;

            if (pendientesMazo > 0 && !primerMazoConPendientes) {
              primerMazoConPendientes = idDelMazo;
            }
          }
        }

        setTarjetasHoy(totalPendientes);
        setDeckParaEstudiar(primerMazoConPendientes);

      } catch (error) {
        console.error("Error al cargar el Dashboard:", error);
        setDecks([]); // Si hay error, ponemos la lista vacía para que no explote
      } finally {
        setIsLoading(false);
      }
    };

    cargarDashboard();
  }, []);

  // 3. Gráfica de actividad (La dejaremos visual por ahora hasta conectar el historial)
  const chartData = [];
  for (let i = 6; i >= 0; i--) {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() - i);
    chartData.push({
      dia: fecha.toLocaleDateString("es-ES", { weekday: "short" }),
      tarjetas: Math.floor(Math.random() * 10), // Datos visuales temporales
    });
  }

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Buenos días";
    if (h < 18) return "Buenas tardes";
    return "Buenas noches";
  };

  if (isLoading) {
    return <div style={{ padding: '50px', textAlign: 'center' }}>Cargando tu progreso... 🚀</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        
        {/* Header */}
        <div className="dashboard-header">
          <h1 className="greeting-title">
            {greeting()} 👋
          </h1>
          <p className="greeting-subtitle">¡Sigue aprendiendo, estás progresando muy bien!</p>
        </div>

        {/* Sección de repaso destacada */}
        <div className="highlight-card">
          <div className="highlight-content">
            <div className="highlight-info">
              <div className="icon-circle">
                <Calendar className="icon-white" />
              </div>
              <div>
                <h2 className="highlight-title">
                  {tarjetasHoy} tarjeta{tarjetasHoy !== 1 ? "s" : ""} para hoy
                </h2>
                <p className="highlight-subtitle">
                  Tarjetas pendientes según tu calendario de repaso espaciado
                </p>
              </div>
            </div>
            <button
              className="btn-primary btn-large"
              disabled={tarjetasHoy === 0}
              onClick={() => {
                if (deckParaEstudiar) {
                  navigate(`/app/decks/${deckParaEstudiar}/study`); // 4. Redirección arreglada
                }
              }}
            >
              Estudiar Ahora
            </button>
          </div>
        </div>

        <div className="dashboard-grid">
          {/* Tarjetas de mazos */}
          <div className="decks-section">
            <div className="section-header">
              <h2 className="section-title">Mis Mazos</h2>
              <button className="btn-outline" onClick={() => navigate("/app/decks")}>
                Ver todos <ChevronRight size={16} />
              </button>
            </div>
            
            <div className="decks-list">
              {decks.length === 0 ? (
                <div className="empty-state-card">
                  <BookOpen className="empty-icon" size={48} />
                  <p className="empty-text">Aún no tienes mazos creados</p>
                  <button className="btn-primary btn-small" onClick={() => navigate("/app/decks")}>
                    <Plus size={16} /> Crear primer mazo
                  </button>
                </div>
              ) : (
                decks.slice(0, 3).map((deck) => {
                  const idDelMazo = deck.mazo_id || deck.id; // Protegemos el ID
                  return (
                    <div 
                      key={idDelMazo} 
                      className="deck-card"
                      onClick={() => navigate(`/app/decks/${idDelMazo}`)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="deck-card-header">
                        <div className="deck-info">
                          <div className="deck-icon">
                            <BookOpen size={20} />
                          </div>
                          <div>
                            <h3 className="deck-title">{deck.nombre}</h3>
                            <p className="deck-description">{deck.descripcion || "Sin descripción"}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Estadísticas y Resumen */}
          <div className="stats-section">
            <h2 className="section-title mb-4">Estadísticas</h2>
            
            <div className="card stats-card">
              <div className="card-header">
                <TrendingUp size={20} />
                <h3>Actividad (7 días)</h3>
              </div>
              <div className="card-body chart-container">
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={chartData} barSize={24}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EADFF0" />
                    <XAxis dataKey="dia" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#7A3A8E' }} />
                    <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#7A3A8E' }} />
                    <Tooltip cursor={{ fill: "#F8EDFB" }} contentStyle={{ borderRadius: '8px', border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }} />
                    <Bar dataKey="tarjetas" fill="#7A3A8E" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Caja de Resumen Conectada */}
            <div className="card stats-card">
              <div className="card-header">
                <h3>Resumen</h3>
              </div>
              <div className="card-body summary-list">
                <div className="summary-item">
                  <span>Mazos totales</span>
                  <span className="summary-value">{decks.length}</span>
                </div>
                <div className="summary-item no-border">
                  <span>Para revisar hoy</span>
                  <span className="summary-value highlight-red">{tarjetasHoy}</span>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}