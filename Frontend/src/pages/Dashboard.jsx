import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, TrendingUp, Calendar, ChevronRight, Plus } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Importamos tus archivos de lógica (los crearemos en el siguiente paso)
import { storage } from "../utils/storage";
import { getCardsForToday } from "../utils/spaced-repetition";

// Importamos nuestro nuevo CSS limpio
import "./Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const [decks, setDecks] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [tarjetasHoy, setTarjetasHoy] = useState(0);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Si la lógica de storage aún no está lista, usamos arreglos vacíos de respaldo
    const loadedDecks = storage?.getDecks() || [];
    setDecks(loadedDecks);
    setUser(storage?.getUser() || null);

    let totalHoy = 0;
    loadedDecks.forEach((deck) => {
      totalHoy += getCardsForToday(deck.flashcards || []).length;
    });
    setTarjetasHoy(totalHoy);

    const loadedSessions = storage?.getSessions() || [];
    setSessions(loadedSessions);
  }, []);

  // Preparar datos para la gráfica de los últimos 7 días
  const chartData = [];
  for (let i = 6; i >= 0; i--) {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() - i);
    const fechaStr = fecha.toISOString().split("T")[0];
    
    const session = sessions.find((s) => s.fecha === fechaStr);
    chartData.push({
      dia: fecha.toLocaleDateString("es-ES", { weekday: "short" }),
      tarjetas: session?.tarjetasEstudiadas || 0,
    });
  }

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Buenos días";
    if (h < 18) return "Buenas tardes";
    return "Buenas noches";
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        
        {/* Header */}
        <div className="dashboard-header">
          <h1 className="greeting-title">
            {greeting()}{user?.name ? `, ${user.name.split(" ")[0]}` : ""} 👋
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
                const deckConPendientes = decks.find(
                  (deck) => getCardsForToday(deck.flashcards || []).length > 0
                );
                if (deckConPendientes) {
                  navigate(`/app/study/${deckConPendientes.id}`);
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
                  const pendientes = getCardsForToday(deck.flashcards || []).length;
                  return (
                    <div 
                      key={deck.id} 
                      className="deck-card"
                      onClick={() => navigate(`/app/study/${deck.id}`)}
                    >
                      <div className="deck-card-header">
                        <div className="deck-info">
                          <div className="deck-icon">
                            <BookOpen size={20} />
                          </div>
                          <div>
                            <h3 className="deck-title">{deck.nombre}</h3>
                            <p className="deck-description">{deck.descripcion}</p>
                          </div>
                        </div>
                        {pendientes > 0 && (
                          <span className="badge-danger">
                            {pendientes} pendiente{pendientes !== 1 ? "s" : ""}
                          </span>
                        )}
                      </div>
                      <div className="deck-card-body">
                        <div className="progress-info">
                          <span>Progreso</span>
                          <span className="progress-percentage">{deck.progreso}%</span>
                        </div>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${deck.progreso}%` }}></div>
                        </div>
                        <p className="cards-total">{deck.flashcards?.length || 0} tarjetas totales</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Estadísticas */}
          <div className="stats-section">
            <h2 className="section-title mb-4">Estadísticas</h2>
            
            {/* Gráfica de actividad */}
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
                    <Tooltip
                      cursor={{ fill: "#F8EDFB" }}
                      contentStyle={{ borderRadius: '8px', border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                      formatter={(v) => [`${v} tarjetas`, "Estudiadas"]}
                    />
                    <Bar dataKey="tarjetas" fill="#7A3A8E" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Resumen */}
            <div className="card stats-card">
              <div className="card-header">
                <h3>Resumen</h3>
              </div>
              <div className="card-body summary-list">
                <div className="summary-item">
                  <span>Mazos totales</span>
                  <span className="summary-value">{decks.length}</span>
                </div>
                <div className="summary-item">
                  <span>Tarjetas totales</span>
                  <span className="summary-value">
                    {decks.reduce((sum, deck) => sum + (deck.flashcards?.length || 0), 0)}
                  </span>
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