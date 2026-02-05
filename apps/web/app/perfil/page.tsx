"use client";

import { useMemo, useState } from "react";
import { useApp } from "../../contexts/AppContext";
import { Sidebar } from "../../components/Sidebar";
import { CompanySelector } from "../../components/CompanySelector";
import { getInitials } from "../../lib/utils";
import { useI18n } from "../../contexts/I18nContext";

const basePlans = [
  { id: "free", price: 0, features: ["profile.plan.free.f1", "profile.plan.free.f2", "profile.plan.free.f3"] },
  { id: "pro", price: 9.99, features: ["profile.plan.pro.f1", "profile.plan.pro.f2", "profile.plan.pro.f3", "profile.plan.pro.f4", "profile.plan.pro.f5"] },
  { id: "business", price: 29.99, features: ["profile.plan.business.f1", "profile.plan.business.f2", "profile.plan.business.f3", "profile.plan.business.f4", "profile.plan.business.f5"] },
];

export default function PerfilPage() {
  const { user, isAuthenticated, logout, updateUser } = useApp();
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<"general" | "empresas" | "suscripcion">("general");

  const subscriptionPlans = useMemo(() => basePlans.map((plan) => ({
    ...plan,
    name: t(`profile.plan.${plan.id}.name`),
    features: plan.features.map((key) => t(key)),
  })), [t]);

  const handleSubscribe = (planId: string) => {
    // Aquí iría la integración con Stripe/PayPal
    updateUser({ subscription: planId as any });
    alert(t("profile.subscribe.toast", { plan: t(`profile.plan.${planId}.name`) }));
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <div className="empty-state">
            <div className="empty-icon">🔐</div>
            <div className="empty-title">{t("profile.login.title")}</div>
            <div className="empty-desc">{t("profile.login.desc")}</div>
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
          <div>
            <h1 className="page-title">{t("profile.title")}</h1>
            <p className="page-subtitle">{t("profile.subtitle")}</p>
          </div>
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
                  background: user.subscription === "pro" || user.subscription === "business" ? "rgba(139,92,246,0.15)" : "rgba(255,255,255,0.08)",
                  color: "#f8fafc",
                }}
              >
                {currentPlan.name}
              </span>
              {(user.subscription === "pro" || user.subscription === "business") && <span>⭐</span>}
            </div>
          </div>
          <button className="btn btn-secondary" onClick={logout}>
            {t("profile.logout")}
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
          {[
            { id: "general", label: t("profile.tabs.general") },
            { id: "empresas", label: t("profile.tabs.companies") },
            { id: "suscripcion", label: t("profile.tabs.subscription") },
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
            <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "16px" }}>{t("profile.personal.title")}</h3>
            <div style={{ display: "grid", gap: "16px" }}>
              <div>
                <label className="form-label">{t("profile.personal.name")}</label>
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
              <h3 style={{ fontSize: "18px", fontWeight: 700 }}>{t("profile.subscription.current", { plan: currentPlan.name })}</h3>
              <p style={{ color: "#6b7280" }}>
                {currentPlan.price === 0
                  ? t("profile.subscription.free")
                  : t("profile.subscription.paid", { price: String(currentPlan.price) })}
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
                      {t("profile.subscription.currentButton")}
                    </button>
                  ) : (
                    <button
                      className={`btn ${plan.id === "free" ? "btn-secondary" : "btn-premium"}`}
                      style={{ width: "100%" }}
                      onClick={() => handleSubscribe(plan.id)}
                    >
                      {plan.price === 0 ? t("profile.subscription.select") : t("profile.subscription.subscribe")}
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
