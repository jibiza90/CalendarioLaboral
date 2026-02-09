"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "../../contexts/AppContext";
import { useI18n } from "../../contexts/I18nContext";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useApp();
  const { t } = useI18n();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    
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
          <h1 style={{ fontSize: "28px", marginBottom: "8px" }}>Calendario Laboral</h1>
          <p style={{ color: "var(--muted)", lineHeight: 1.6 }}>{t("login.brand.subtitle")}</p>
        </div>

        <div className="login-card">
          <h2 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "8px", textAlign: "center" }}>
            {t("login.title")}
          </h2>
          <p style={{ fontSize: "14px", color: "var(--muted)", textAlign: "center", marginBottom: "24px" }}>
            {t("login.subtitle")}
          </p>

          <form onSubmit={handleEmailLogin} style={{ display: "grid", gap: "16px" }}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                placeholder="tu@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: "100%" }}
              disabled={isLoading}
            >
              {isLoading ? <LoadingSpinner /> : t("login.button")}
            </button>
            <button className="btn btn-secondary" type="button" onClick={() => router.push("/calendario")}>
              {t("login.back")}
            </button>
          </form>
        </div>

        <p style={{ fontSize: "12px", color: "var(--muted)", textAlign: "center" }}>
          Al continuar, aceptas los términos de servicio
        </p>
      </div>
    </div>
  );
}
