import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Lock, Mail, User, GraduationCap } from "lucide-react";
import { storage } from "../utils/storage";
import "./Registro.css"; // <-- Aquí conectamos el diseño

export default function Registro() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      alert("Por favor completa todos los campos");
      return;
    }

    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      storage.saveUser({ email, name });
      storage.initializeMockData();
      alert("¡Cuenta creada exitosamente!");
      navigate("/app/dashboard");
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="registro-container">
      <div className="registro-wrapper">
        
        <div className="registro-header">
          <div className="registro-logo">
            <GraduationCap size={48} />
            <h1 className="registro-title">SmartLearn</h1>
          </div>
          <p className="registro-subtitle">Crea tu cuenta gratuita</p>
        </div>

        <div className="registro-card">
          <h2>Crear cuenta</h2>

          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label htmlFor="name">Nombre completo</label>
              <div className="input-container">
                <input
                  id="name"
                  type="text"
                  placeholder="Tu nombre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="form-input"
                  style={{ paddingLeft: "10px", paddingRight: "35px" }}
                />
                <Lock className="input-icon" style={{ left: "auto", right: "5px" }} />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar contraseña</label>
              <div className="input-container">
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Repite tu contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="form-input"
                  style={{ paddingLeft: "10px", paddingRight: "35px" }}
                />
                <Lock className="input-icon" style={{ left: "auto", right: "5px" }} />
              </div>
            </div>

            <button type="submit" className="btn-submit" disabled={isLoading}>
              {isLoading ? "Creando cuenta..." : "Crear cuenta"}
            </button>
          </form>

          <div className="registro-footer">
            ¿Ya tienes cuenta?{" "}
            <Link to="/" className="login-link">
              Inicia sesión
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}