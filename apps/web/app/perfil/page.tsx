"use client";

import { useState } from "react";
import { useApp } from "../../contexts/AppContext";
import { Sidebar } from "../../components/Sidebar";
import { CompanySelector } from "../../components/CompanySelector";
import { getInitials } from "../../lib/utils";

const subscriptionPlans = [
  {
    id: "free",
    name: "Gratis",
    price: 0,
    features: [
      "Publicar hasta 5 ofertas/mes",
      "Ver todas las ofertas",
      "Negociar turnos",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 9.99,
    features: [
      "Ofertas ilimitadas",
      "Ofertas destacadas ⭐",
      "Prioridad en búsquedas",
      "Notificaciones push",
      "Soporte prioritario",
    ],
  },
  {
    id: "business",
    name: "Business",
    price: 29.99,
    features: [
      "Todo lo de Pro",
      "Múltiples empresas",
      "Dashboard de analíticas",
      "Exportar datos",
      "API access",
    ],
  },
];

export default function PerfilPage() {
  const { user, isAuthenticated, logout, updateUser } = useApp();
  const [activeTab, setActiveTab] = useState<"general" | "empresas" | "suscripcion">("general");

  const handleSubscribe = (planId: string) => {
    // Aquí iría la integración con Stripe/PayPal
    updateUser({ subscription: planId as any });
    alert(`¡Te has suscrito al plan ${planId}! (Demo)`);
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <div className="empty-state">
            <div className="empty-icon">🔐</div>
            <div className="empty-title">Inicia sesión</div>
            <div className="empty-desc">Debes iniciar sesión para ver tu perfil</div>
          </div>
        </main>
      </div>
    );
  }

  const currentPlan = subscriptionPlans.find((p) => p.id === user.subscription) || subscriptionPlans[0];

  return (
    <div className="app-container">
      <Sidebar />

      <main className="main-content">
        <div className="page-header">
          <h1 className="page-title">Perfil</h1>
        </div>

        {/* User Card */}
        <div className="card" style={{ marginBottom: "24px", display: "flex", alignItems: "center", gap: "16px" }}>
          <div className="user-avatar" style={{ width: "64px", height: "64px", fontSize: "24px" }}>
            {getInitials(user.name)}
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: "20px", fontWeight: 700 }}>{user.name}</h2>
            <p style={{ color: "#6b7280" }}>{user.email}</p>
            <div style={{ marginTop: "8px", display: "flex", gap: "8px", alignItems: "center" }}>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  padding: "4px 12px",
                  borderRadius: "20px",
                  background: user.subscription === "pro" || user.subscription === "business" ? "#fef3c7" : "#f3f4f6",
                  color: user.subscription === "pro" || user.subscription === "business" ? "#d97706" : "#374151",
                }}
              >
                {currentPlan.name}
              </span>
              {(user.subscription === "pro" || user.subscription === "business") && <span>⭐</span>}
            </div>
          </div>
          <button className="btn btn-secondary" onClick={logout}>
            Cerrar sesión
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
          {[
            { id: "general", label: "General" },
            { id: "empresas", label: "Empresas" },
            { id: "suscripcion", label: "Suscripción" },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`btn ${activeTab === tab.id ? "btn-primary" : "btn-secondary"}`}
              onClick={() => setActiveTab(tab.id as any)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "general" && (
          <div className="card">
            <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "16px" }}>Información personal</h3>
            <div style={{ display: "grid", gap: "16px" }}>
              <div>
                <label className="form-label">Nombre</label>
                <input type="text" className="form-input" value={user.name} readOnly />
              </div>
              <div>
                <label className="form-label">Email</label>
                <input type="email" className="form-input" value={user.email} readOnly />
              </div>
            </div>
          </div>
        )}

        {activeTab === "empresas" && <CompanySelector />}

        {activeTab === "suscripcion" && (
          <div>
            <div style={{ marginBottom: "24px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: 700 }}>Plan actual: {currentPlan.name}</h3>
              <p style={{ color: "#6b7280" }}>
                {currentPlan.price === 0
                  ? "Estás usando el plan gratuito"
                  : `Pagas €${currentPlan.price}/mes`}
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
              {subscriptionPlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`subscription-card ${plan.id !== "free" ? "premium" : ""} ${
                    user.subscription === plan.id ? "selected" : ""
                  }`}
                  style={user.subscription === plan.id ? { borderColor: "#4f46e5", boxShadow: "0 0 0 3px rgba(79, 70, 229, 0.1)" } : {}}
                >
                  <div className="subscription-name">{plan.name}</div>
                  <div className="subscription-price">
                    €{plan.price}
                    <span>/mes</span>
                  </div>
                  <ul className="subscription-features">
                    {plan.features.map((feature, i) => (
                      <li key={i}>{feature}</li>
                    ))}
                  </ul>
                  {user.subscription === plan.id ? (
                    <button className="btn btn-secondary" style={{ width: "100%" }} disabled>
                      Plan actual
                    </button>
                  ) : (
                    <button
                      className={`btn ${plan.id === "free" ? "btn-secondary" : "btn-premium"}`}
                      style={{ width: "100%" }}
                      onClick={() => handleSubscribe(plan.id)}
                    >
                      {plan.price === 0 ? "Seleccionar" : "Suscribirse"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
