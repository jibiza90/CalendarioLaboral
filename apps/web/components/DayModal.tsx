"use client";

import { useApp } from "../contexts/AppContext";
import type { AppOffer } from "../contexts/AppContext";
import { formatDate } from "../lib/utils";
import { OfferForm } from "./OfferForm";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "../contexts/I18nContext";

interface DayModalProps {
  date: Date;
  offers: AppOffer[];
  onClose: () => void;
}

export function DayModal({ date, offers, onClose }: DayModalProps) {
  const router = useRouter();
  const { user, isAuthenticated, activeCompany, departments, addOffer } = useApp();
  const [showForm, setShowForm] = useState(false);
  const { t, lang } = useI18n();

  const toLocalISODate = (d: Date) => {
    const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 10);
  };

  const locale = useMemo(() => {
    const map: Record<string, string> = {
      es: "es-ES",
      ca: "ca-ES",
      en: "en-US",
      fr: "fr-FR",
      it: "it-IT",
      de: "de-DE",
    };
    return map[lang] || "es-ES";
  }, [lang]);

  const companyDepts = departments.filter(
    (d) => d.companyId === activeCompany?.id
  );

  const handlePublish = (data: {
    date: string;
    description: string;
    amount?: string;
    hideName: boolean;
    departmentId?: string;
    exchangeType: "simple" | "exchange" | "hybrid";
    offeredDates?: string[];
  }) => {
    if (!activeCompany || !user) return;
    const dept = companyDepts.find((d) => d.id === data.departmentId);
    const isoDate = `${data.date}T00:00:00`;

    addOffer({
      ...data,
      day: new Date(isoDate).getDate(),
      date: isoDate,
      title: data.description.slice(0, 50) + (data.description.length > 50 ? "..." : ""),
      department: data.departmentId || "",
      departmentName: dept?.name || t("offer.department.general"),
      companyId: activeCompany.id,
      companyName: activeCompany.name,
      type: "Nueva",
      status: "Publicado",
      ownerId: user.id,
      isPremium: user.subscription !== "free",
      exchangeType: data.exchangeType,
      offeredDates: data.offeredDates || [],
    });

    setShowForm(false);
  };

  const getBadgeClass = (type: string, isPremium?: boolean) => {
    if (isPremium) return "badge-gold";
    const highDemand = ["Alta demanda", "High demand", "Alta demanda", "Haute demande", "Alta domanda", "Hohe Nachfrage", t("offer.type.highDemand")];
    const fastAccept = ["Aceptación rápida", "Quick acceptance", "Acceptació ràpida", "Acceptation rapide", "Accettazione rapida", "Schnelle Annahme", t("offer.type.quick")];
    if (highDemand.includes(type)) return "badge-red";
    if (fastAccept.includes(type)) return "badge-green";
    return "badge-blue";
  };

  return (
    <div className="day-modal-overlay" onClick={onClose}>
      <div className="day-modal" onClick={(e) => e.stopPropagation()}>
        <div className="day-modal-header">
          <div>
            <h2 className="day-modal-title">{date.toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "long" })}</h2>
            <p style={{ color: "#6b7280", marginTop: "4px" }}>
              {offers.length} {offers.length === 1 ? t("dayModal.oneOffer") : t("dayModal.manyOffers")}
            </p>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            {isAuthenticated && (
              <button 
                className="btn btn-primary" 
                onClick={() => setShowForm(true)}
              >
                + {t("dayModal.publish")}
              </button>
            )}
            <button className="btn btn-ghost" onClick={onClose}>
              ✕
            </button>
          </div>
        </div>

        {showForm ? (
          <div style={{ marginBottom: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: 600 }}>{t("dayModal.form.title")}</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowForm(false)}>
                {t("common.cancel")}
              </button>
            </div>
            <OfferForm
              departments={companyDepts}
              initialDate={toLocalISODate(date)}
              onSubmit={handlePublish}
              onCancel={() => setShowForm(false)}
            />
          </div>
        ) : (
          <>
            {offers.length > 0 ? (
              <div>
                {offers.map((offer) => (
                  <div
                    key={offer.id}
                    className={`offer-card ${offer.isPremium ? "premium" : ""}`}
                    onClick={() => router.push(`/ofertas/${offer.id}`)}
                  >
                    <div className="offer-header">
                      <div className="offer-badges">
                        {offer.isPremium && (
                          <span className="badge badge-gold">⭐ PREMIUM</span>
                        )}
                        <span className={`badge ${getBadgeClass(offer.type, offer.isPremium)}`}>
                          {offer.type}
                        </span>
                        <span className="badge badge-purple">
                          {offer.exchangeType === "simple" && "💰 Simple"}
                          {offer.exchangeType === "exchange" && "🔄 Intercambio"}
                          {offer.exchangeType === "hybrid" && "💰🔄 Híbrido"}
                        </span>
                      </div>
                      {offer.hideName && (
                        <span style={{ fontSize: "12px", color: "#6b7280" }}>
                          🕵️ {t("offer.owner.anonymous")}
                        </span>
                      )}
                    </div>
                    <div className="offer-title">{offer.title}</div>
                    <div className="offer-desc">{offer.description}</div>
                    <div className="offer-meta">
                      <span className="offer-company">
                        {offer.departmentName} • {offer.companyName}
                      </span>
                      {offer.amount && (
                        <span className="offer-amount">{offer.amount}</span>
                      )}
                    </div>
                    {offer.offeredDates && offer.offeredDates.length > 0 && (
                      <div style={{ marginTop: "8px", fontSize: "12px", color: "#6b7280" }}>
                        <span>Ofrece: </span>
                        {offer.offeredDates.slice(0, 2).map(dateStr => (
                          <span key={dateStr} style={{
                            display: "inline-block",
                            padding: "2px 6px",
                            background: "#e0f2fe",
                            color: "#0369a1",
                            borderRadius: "8px",
                            fontSize: "11px",
                            fontWeight: 500,
                            marginRight: "4px"
                          }}>
                            {new Date(dateStr + "T00:00:00").toLocaleDateString(locale, {
                              day: "numeric",
                              month: "short"
                            })}
                          </span>
                        ))}
                        {offer.offeredDates.length > 2 && (
                          <span>+{offer.offeredDates.length - 2} más</span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📅</div>
                <div className="empty-title">{t("dayModal.empty.title")}</div>
                <div className="empty-desc">
                  {t("dayModal.empty.desc")}
                </div>
                {!isAuthenticated && (
                  <button 
                    className="btn btn-primary" 
                    style={{ marginTop: "16px" }}
                    onClick={() => router.push("/login")}
                  >
                    {t("nav.login")}
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
