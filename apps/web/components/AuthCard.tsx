"use client";

import { useRouter } from "next/navigation";
import { useApp } from "../contexts/AppContext";
import { getInitials } from "../lib/utils";

export function AuthCard() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useApp();

  if (!isAuthenticated || !user) {
    return (
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">Cuenta</h3>
            <p className="card-subtitle">Inicia sesión para acceder</p>
          </div>
        </div>
        <div style={{ textAlign: "center", padding: "40px 20px" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "var(--bg-tertiary)", display: "grid", placeItems: "center", margin: "0 auto 16px", fontSize: "24px" }}>
            ◉
          </div>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "20px" }}>
            Publica ofertas y negocia turnos
          </p>
          <button className="btn btn-primary" onClick={() => router.push("/login")}>
            Iniciar sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">Cuenta</h3>
          <p className="card-subtitle">Sesión iniciada</p>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "var(--accent-gradient)", display: "grid", placeItems: "center", fontSize: "18px", fontWeight: 600, color: "white" }}>
          {getInitials(user.name)}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600 }}>{user.name}</div>
          <div style={{ fontSize: "13px", color: "var(--text-tertiary)" }}>{user.email}</div>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={logout}>
          Salir
        </button>
      </div>
    </div>
  );
}
