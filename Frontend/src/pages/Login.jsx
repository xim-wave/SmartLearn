import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Lock, Mail, GraduationCap } from "lucide-react";
import { storage } from "../utils/storage";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulación de inicio de sesión
    setTimeout(() => {
      // Validamos si el usuario existe o si es un login exitoso
      storage.saveUser({ email, name: email.split("@")[0] });
      navigate("/app/dashboard");
      setIsLoading(false);
    }, 800);
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