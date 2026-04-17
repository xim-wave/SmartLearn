import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Lock, Mail, GraduationCap } from "lucide-react";
import { storage } from "../utils/storage";
import { authService } from "../services/authService"; // Importamos el servicio que creamos
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(""); // Estado para manejar errores del backend

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(""); // Limpiamos cualquier error previo al intentar de nuevo

    try {
      // 1. Llamamos al backend real de tu equipo
      const data = await authService.login(email, password);
      
      // 2. Si el backend nos da un token (para mantener la sesión segura), lo guardamos
      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      // 3. Guardamos los datos locales del usuario
      storage.saveUser(data.usuario || { email, name: email.split("@")[0] });
      
      // 4. ¡Éxito! Redirigimos al Dashboard
      navigate("/app/dashboard");
      
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      // Extraemos el mensaje de error del backend (o ponemos uno general si el servidor está apagado)
      setError(
        err.response?.data?.mensaje || 
        err.response?.data?.error || 
        "Error al conectar. Verifica tus datos o revisa si el servidor backend está encendido."
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
          <p className="login-subtitle">Bienvenido de nuevo</p>
        </div>

        <div className="login-card">
          <h2>Iniciar sesión</h2>

          {/* 👇 Caja roja de error: Solo aparece si ocurre un error en el login 👇 */}
          {error && (
            <div style={{ 
              backgroundColor: "#FEE2E2", 
              color: "#991B1B", 
              padding: "12px", 
              borderRadius: "8px", 
              marginBottom: "20px", 
              fontSize: "0.9rem", 
              textAlign: "center",
              border: "1px solid #FCA5A5"
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
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
                  placeholder="Tu contraseña"
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
              {isLoading ? "Iniciando sesión..." : "Ingresar"}
            </button>
          </form>

          <div className="login-footer">
            ¿No tienes cuenta?{" "}
            <Link to="/registro" className="register-link">
              Regístrate aquí
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}