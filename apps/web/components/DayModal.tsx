"use client";

import { useApp } from "../contexts/AppContext";
import type { AppOffer } from "../contexts/AppContext";
import { formatDate } from "../lib/utils";
import { OfferForm } from "./OfferForm";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface DayModalProps {
  date: Date;
  offers: AppOffer[];
  onClose: () => void;
}

export function DayModal({ date, offers, onClose }: DayModalProps) {
  const router = useRouter();
  const { user, isAuthenticated, activeCompany, departments, addOffer } = useApp();
  const [showForm, setShowForm] = useState(false);

  const companyDepts = departments.filter(
    (d) => d.companyId === activeCompany?.id
  );

  const handlePublish = (data: {
    date: string;
    description: string;
    amount?: string;
    hideName: boolean;
    departmentId?: string;
  }) => {
    if (!activeCompany || !user) return;
    const dept = companyDepts.find((d) => d.id === data.departmentId);
    
    addOffer({
      ...data,
      day: new Date(data.date).getDate(),
      title: data.description.slice(0, 50) + (data.description.length > 50 ? "..." : ""),
      department: data.departmentId || "",
      departmentName: dept?.name || "General",
      companyId: activeCompany.id,
      companyName: activeCompany.name,
      type: "Nueva",
      status: "Publicado",
      ownerId: user.id,
      isPremium: user.subscription !== "free",
    });
    
    setShowForm(false);
  };

  const getBadgeClass = (type: string, isPremium?: boolean) => {
    if (isPremium) return "badge-gold";
    if (type === "Alta demanda") return "badge-red";
    if (type === "Aceptación rápida") return "badge-green";
    return "badge-blue";
  };

  return (
    <div className="day-modal-overlay" onClick={onClose}>
      <div className="day-modal" onClick={(e) => e.stopPropagation()}>
        <div className="day-modal-header">
          <div>
            <h2 className="day-modal-title">{formatDate(date)}</h2>
            <p style={{ color: "#6b7280", marginTop: "4px" }}>
              {offers.length} {offers.length === 1 ? "oferta" : "ofertas"}
            </p>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            {isAuthenticated && (
              <button 
                className="btn btn-primary" 
                onClick={() => setShowForm(true)}
              >
                + Publicar
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
              <h3 style={{ fontSize: "18px", fontWeight: 600 }}>Publicar turno</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowForm(false)}>
                Cancelar
              </button>
            </div>
            <OfferForm
              departments={companyDepts}
              initialDate={date.toISOString().slice(0, 10)}
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
                      </div>
                      {offer.hideName && (
                        <span style={{ fontSize: "12px", color: "#6b7280" }}>
                          🕵️ Anónimo
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
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📅</div>
                <div className="empty-title">Sin ofertas</div>
                <div className="empty-desc">
                  No hay ofertas para este día. ¡Sé el primero en publicar!
                </div>
                {!isAuthenticated && (
                  <button 
                    className="btn btn-primary" 
                    style={{ marginTop: "16px" }}
                    onClick={() => router.push("/login")}
                  >
                    Iniciar sesión
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
