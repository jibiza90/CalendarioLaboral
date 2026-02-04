"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "../../contexts/AppContext";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { getInitials } from "../../lib/utils";

const DEMO_USERS = [
  { id: "user-1", name: "Laura Martínez", email: "laura@example.com", subscription: "pro" },
  { id: "user-2", name: "Carlos Rodríguez", email: "carlos@example.com", subscription: "free" },
  { id: "user-3", name: "Ana García", email: "ana@example.com", subscription: "business" },
];

export default function LoginPage() {
  const router = useRouter();
  const { login } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleDemoLogin = async (demoUser: typeof DEMO_USERS[0]) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    login({
      id: demoUser.id,
      name: demoUser.name,
      email: demoUser.email,
      companies: [],
      departments: [],
      notifications: { email: true, push: false, inApp: true },
      subscription: (demoUser.subscription as any) || "free",
    });
    
    setIsLoading(false);
    router.push("/calendario");
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    login({
      id: `user-${Date.now()}`,
      name: email.split("@")[0],
      email: email,
      companies: [],
      departments: [],
      notifications: { email: true, push: false, inApp: true },
      subscription: "free",
    });
    
    setIsLoading(false);
    router.push("/calendario");
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-brand">
          <div className="login-brand-mark">CL</div>
          <h1>Calendario Laboral</h1>
          <p>Intercambio de turnos profesional</p>
        </div>

        <div className="login-card">
          <h2 style={{ fontSize: "20px", fontWeight: 600, marginBottom: "8px", textAlign: "center" }}>
            Bienvenido
          </h2>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", textAlign: "center", marginBottom: "32px" }}>
            Selecciona una cuenta de demo para continuar
          </p>

          <div className="demo-users">
            {DEMO_USERS.map((user) => (
              <button
                key={user.id}
                className="demo-user"
                onClick={() => handleDemoLogin(user)}
                disabled={isLoading}
              >
                <div className="demo-user-avatar">
                  {getInitials(user.name)}
                </div>
                <div className="demo-user-info">
                  <div className="demo-user-name">{user.name}</div>
                  <div className="demo-user-email">{user.email}</div>
                </div>
                <span style={{ marginLeft: "auto", color: "var(--text-quaternary)" }}>→</span>
              </button>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px", margin: "24px 0" }}>
            <div style={{ flex: 1, height: "1px", background: "var(--border-default)" }} />
            <span style={{ fontSize: "12px", color: "var(--text-quaternary)" }}>o</span>
            <div style={{ flex: 1, height: "1px", background: "var(--border-default)" }} />
          </div>

          <form onSubmit={handleEmailLogin}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: "100%" }}
              disabled={isLoading}
            >
              {isLoading ? <LoadingSpinner /> : "Continuar con email"}
            </button>
          </form>

          <div style={{ marginTop: "24px", textAlign: "center" }}>
            <button className="btn btn-ghost btn-sm" onClick={() => router.push("/calendario")}>
              ← Volver al calendario
            </button>
          </div>
        </div>

        <p style={{ fontSize: "12px", color: "var(--text-quaternary)", textAlign: "center" }}>
          Al continuar, aceptas los términos de servicio
        </p>
      </div>
    </div>
  );
}
