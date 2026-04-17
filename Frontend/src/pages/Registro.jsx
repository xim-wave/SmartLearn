import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, GraduationCap } from "lucide-react";
import { authService } from "../services/authService";
import "./Registro.css"; 

export default function Registro() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegistro = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // 1. Enviamos los datos al backend de tu equipo
      await authService.registro({ nombre, email, password });
      
      // 2. Si todo sale bien, lo redirigimos al Login
      navigate("/");
      
    } catch (err) {
      console.error("Error al registrar:", err);
      // Mostramos el error que devuelva el backend
      setError(
        err.response?.data?.mensaje || 
        err.response?.data?.error || 
        "Hubo un problema al crear tu cuenta. Intenta nuevamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-header">
          <div className="login-logo">
            <GraduationCap size={48} />
            <h1 className="login-title">SmartLearn</h1>
          </div>
          <p className="login-subtitle">Crea tu cuenta gratis</p>
        </div>

        <div className="login-card">
          <h2>Regístrate</h2>

          {error && (
            <div style={{ backgroundColor: "#FEE2E2", color: "#991B1B", padding: "12px", borderRadius: "8px", marginBottom: "20px", fontSize: "0.9rem", textAlign: "center", border: "1px solid #FCA5A5" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleRegistro}>
            <div className="form-group">
              <label htmlFor="nombre">Nombre completo</label>
              <div className="input-container">
                <input
                  id="nombre"
                  type="text"
                  placeholder="Tu nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                  className="form-input"
                />
                <User className="input-icon" />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Correo electrónico</label>
              <div className="input-container">
                <input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="form-input"
                />
                <Mail className="input-icon" />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <div className="input-container">
                <input
                  id="password"
                  type="password"
                  placeholder="Crea una contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="form-input"
                  style={{ paddingLeft: "10px", paddingRight: "35px" }}
                />
                <Lock className="input-icon" style={{ left: "auto", right: "5px" }} />
              </div>
            </div>

            <button type="submit" className="btn-submit" disabled={isLoading}>
              {isLoading ? "Creando cuenta..." : "Registrarme"}
            </button>
          </form>

          <div className="login-footer">
            ¿Ya tienes cuenta?{" "}
            <Link to="/" className="register-link">
              Inicia sesión aquí
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}