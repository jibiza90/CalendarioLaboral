"use client";

import type { AppOffer } from "../contexts/AppContext";
import { formatDate } from "../lib/utils";
import { useI18n } from "../contexts/I18nContext";
import { useMemo } from "react";

interface OfferListProps {
  offers: AppOffer[];
  selectedDate: Date;
  onViewOffer: (id: string) => void;
  onPublish: () => void;
  isAuthenticated: boolean;
}

export function OfferList({
  offers,
  selectedDate,
  onViewOffer,
  onPublish,
  isAuthenticated,
}: OfferListProps) {
  const { t, lang } = useI18n();
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

  const getBadgeClass = (type: string) => {
    switch (type) {
      case "Alta demanda":
      case "High demand":
      case "Haute demande":
      case "Alta domanda":
      case "Hohe Nachfrage":
        return "hot";
      case "Aceptación rápida":
      case "Quick acceptance":
      case "Acceptation rapide":
      case "Acceptació ràpida":
      case "Accettazione rapida":
      case "Schnelle Annahme":
        return "fast";
      default: return "new";
    }
  };

  return (
    <div className="card" style={{ height: "fit-content" }}>
      <div className="card-header">
        <div>
          <h3 className="card-title">{formatDate(selectedDate)}</h3>
          <p className="card-subtitle">
            {offers.length === 0
              ? t("offerList.empty")
              : t("offerList.count", { count: String(offers.length) })}
          </p>
        </div>
        <button
          className="btn btn-primary btn-sm"
          onClick={onPublish}
          disabled={!isAuthenticated}
        >
          + {t("offerList.publish")}
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {offers.length === 0 ? (
          <div className="empty-state" style={{ padding: "40px 20px" }}>
            <div className="empty-state-icon" style={{ width: "64px", height: "64px", fontSize: "28px" }}>📅</div>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>{t("offerList.empty")}</p>
            {isAuthenticated && (
              <button className="btn btn-secondary btn-sm" onClick={onPublish} style={{ marginTop: "16px" }}>
                {t("offerList.create")}
              </button>
            )}
          </div>
        ) : (
          offers.map((offer) => (
            <div
              key={offer.id}
              className="offer-card"
              onClick={() => onViewOffer(offer.id)}
            >
              <div className="offer-card-header">
                <span className={`offer-badge ${getBadgeClass(offer.type)}`}>
                  {offer.type}
                </span>
                <span style={{ fontSize: "12px", color: "var(--text-tertiary)" }}>
                  {offer.hideName ? "Anónimo" : offer.companyName}
                </span>
              </div>
              <h4 className="offer-title">{offer.title}</h4>
              <p className="offer-description">{offer.description}</p>
              <div className="offer-meta">
                <span>{offer.departmentName}</span>
                {offer.amount && <span className="offer-amount">{offer.amount}</span>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
