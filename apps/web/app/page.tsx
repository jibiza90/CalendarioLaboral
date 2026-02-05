"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "../contexts/AppContext";
import { useI18n } from "../contexts/I18nContext";

export default function Home() {
  const router = useRouter();
  const { isLoading, isAuthenticated } = useApp();
  const { t } = useI18n();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/calendario");
    }
  }, [isLoading, isAuthenticated, router]);

  const handlePrimary = () => router.push("/login");
  const handleSecondary = () => {
    const el = document.getElementById("landing-steps");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="landing">
      <header className="landing-hero">
        <div className="landing-hero__text">
          <p className="eyebrow">CL · Calendario Laboral</p>
          <h1>{t("landing.hero.title")}</h1>
          <p className="subtitle">{t("landing.hero.subtitle")}</p>
          <div className="cta-group">
            <button className="btn btn-primary" onClick={handlePrimary}>{t("landing.hero.ctaPrimary")}</button>
            <button className="btn btn-secondary" onClick={handleSecondary}>{t("landing.hero.ctaSecondary")}</button>
          </div>
          <div className="stats">
            <div className="stat-chip">⚡ {t("landing.hero.stats.sla")}</div>
            <div className="stat-chip">📅 {t("landing.hero.stats.shifts")}</div>
            <div className="stat-chip">🌐 {t("landing.hero.stats.languages")}</div>
          </div>
          <p className="trust">{t("landing.trust")}</p>
        </div>
        <div className="landing-hero__card">
          <div className="hero-card">
            <div className="hero-card__header">
              <div className="badge">LIVE</div>
              <span>Shift Exchange</span>
            </div>
            <div className="hero-card__body">
              <div className="hero-pill primary">{t("offer.type.highDemand")}</div>
              <div className="hero-pill success">{t("offer.type.quick")}</div>
              <div className="hero-pill">{t("offer.type.new")}</div>
              <div className="hero-card__meta">
                <div>
                  <p className="label">Barcelona · UCI</p>
                  <p className="value">22 mar · 07:00 - 15:00</p>
                </div>
                <button className="btn btn-ghost" onClick={handlePrimary}>{t("landing.hero.ctaPrimary")}</button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="landing-section" id="landing-features">
        <div className="section-header">
          <p className="eyebrow">Product</p>
          <h2>{t("landing.features.title")}</h2>
          <p className="subtitle">{t("landing.features.subtitle")}</p>
        </div>
        <div className="feature-grid">
          {[1,2,3,4].map((i) => (
            <div key={i} className="feature-card">
              <div className="feature-icon">{i === 1 ? "⚙️" : i === 2 ? "💬" : i === 3 ? "🔔" : "🌍"}</div>
              <h3>{t(`landing.features.${i}.title`)}</h3>
              <p>{t(`landing.features.${i}.desc`)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="landing-section" id="landing-steps">
        <div className="section-header">
          <p className="eyebrow">Flow</p>
          <h2>{t("landing.steps.title")}</h2>
        </div>
        <div className="steps">
          {[1,2,3].map((i) => (
            <div key={i} className="step-card">
              <div className="step-number">{i}</div>
              <div>
                <h3>{t(`landing.steps.${i}.title`)}</h3>
                <p>{t(`landing.steps.${i}.desc`)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="landing-cta">
        <div>
          <h2>{t("landing.cta.title")}</h2>
          <p className="subtitle">{t("landing.cta.subtitle")}</p>
        </div>
        <div className="cta-group">
          <button className="btn btn-primary" onClick={handlePrimary}>{t("landing.cta.button")}</button>
          <button className="btn btn-secondary" onClick={() => router.push("/login")}>{t("login.back")}</button>
        </div>
      </section>
    </div>
  );
}
