import { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Home, BookOpen, LogOut, GraduationCap, Menu, X, ChevronRight } from "lucide-react";
import { storage } from "../utils/storage";
import "./Layout.css"; 

const navItems = [
  { icon: Home, label: "Dashboard", path: "/app" },
  { icon: BookOpen, label: "Mis Mazos", path: "/app/decks" },
];

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null); 

  useEffect(() => {
    const storedUser = storage.getUser();
    setUser(storedUser);
  }, []);

  // 👇 Aquí está la magia de tu botón
  const handleLogout = () => {
    storage.clearUser(); // Esto borra los datos usando tu archivo storage.js
    navigate("/");       // Esto te manda de regreso al Login
  };

  const isActive = (path) => { 
    if (path === "/app") return location.pathname === "/app";
    return location.pathname.startsWith(path);
  };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : user?.email?.slice(0, 2).toUpperCase() || "U";

  return (
    <div className="layout-container">
      {/* Fondo oscuro para celulares cuando se abre el menú */}
      {sidebarOpen && (
        <div className="mobile-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* --- BARRA LATERAL IZQUIERDA --- */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        {/* Logo */}
        <div className="sidebar-header">
          <div className="logo-group">
            <div className="logo-icon">
              <GraduationCap size={20} color="white" />
            </div>
            <span className="logo-text">SmartLearn</span>
          </div>
          <button className="btn-close-mobile" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Navegación (Los recuadros) */}
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`nav-item ${active ? "active" : ""}`}
              >
                <Icon className="nav-icon" size={20} />
                <span className="nav-label">{item.label}</span>
                {active && <ChevronRight size={16} className="nav-chevron" />}
              </Link>
            );
          })}
        </nav>

        {/* Usuario y Cerrar Sesión */}
        <div className="sidebar-footer">
          {user && (
            <div className="user-info">
              <div className="user-avatar">
                <span>{initials}</span>
              </div>
              <div className="user-details">
                <p className="user-name">{user.name || "Usuario"}</p>
                <p className="user-email">{user.email}</p>
              </div>
            </div>
          )}
          {/* 👇 Tu botón ya tiene el onClick={handleLogout} */}
          <button className="btn-logout" onClick={handleLogout}>
            <LogOut size={16} />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* --- ÁREA PRINCIPAL DERECHA (Donde va el Dashboard) --- */}
      <div className="main-wrapper">
        {/* Barra superior solo para celulares */}
        <header className="mobile-header">
          <button onClick={() => setSidebarOpen(true)} className="btn-menu">
            <Menu size={24} />
          </button>
          <div className="mobile-logo">
            <div className="logo-icon-small">
              <GraduationCap size={16} color="white" />
            </div>
            <span>SmartLearn</span>
          </div>
        </header>

        <main className="main-content">
          <Outlet /> {/* Aquí adentro se renderizan las demás pantallas */}
        </main>
      </div>
    </div>
  );
}