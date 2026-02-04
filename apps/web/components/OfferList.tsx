"use client";

import type { AppOffer } from "../contexts/AppContext";
import { formatDate } from "../lib/utils";

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
  const getBadgeClass = (type: string) => {
    switch (type) {
      case "Alta demanda": return "hot";
      case "Aceptación rápida": return "fast";
      default: return "new";
    }
  };

  return (
    <div className="card" style={{ height: "fit-content" }}>
      <div className="card-header">
        <div>
          <h3 className="card-title">{formatDate(selectedDate)}</h3>
          <p className="card-subtitle">
            {offers.length === 0 ? "Sin ofertas" : `${offers.length} oferta${offers.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <button
          className="btn btn-primary btn-sm"
          onClick={onPublish}
          disabled={!isAuthenticated}
        >
          + Publicar
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {offers.length === 0 ? (
          <div className="empty-state" style={{ padding: "40px 20px" }}>
            <div className="empty-state-icon" style={{ width: "64px", height: "64px", fontSize: "28px" }}>📅</div>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>No hay ofertas para este día</p>
            {isAuthenticated && (
              <button className="btn btn-secondary btn-sm" onClick={onPublish} style={{ marginTop: "16px" }}>
                Crear oferta
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
