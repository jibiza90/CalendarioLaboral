"use client";

import { useState, type FormEvent } from "react";
import type { Department, OfferExchangeType } from "../types";
import { useI18n } from "../contexts/I18nContext";
import { useApp } from "../contexts/AppContext";
import { OfferedDatesPicker } from "./OfferedDatesPicker";

type OfferFormProps = {
  departments: Department[];
  initialDate: string;
  onSubmit: (data: {
    date: string;
    description: string;
    amount?: string;
    hideName: boolean;
    departmentId?: string;
    exchangeType: OfferExchangeType;
    offeredDates?: string[];
  }) => void;
  onCancel: () => void;
};

export function OfferForm({ departments, initialDate, onSubmit, onCancel }: OfferFormProps) {
  const [date, setDate] = useState(initialDate);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [hideName, setHideName] = useState(false);
  const [deptId, setDeptId] = useState("");
  const [exchangeType, setExchangeType] = useState<OfferExchangeType>("simple");
  const [offeredDates, setOfferedDates] = useState<string[]>([]);
  const [showMatches, setShowMatches] = useState(false);
  const [error, setError] = useState("");
  const { t } = useI18n();
  const { findMatches } = useApp();

  const matches =
    showMatches && (exchangeType === "exchange" || exchangeType === "hybrid")
      ? findMatches(date, offeredDates)
      : [];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setError(t("offer.form.error.desc"));
      return;
    }
    if (description.length < 10) {
      setError(t("offer.form.error.min"));
      return;
    }
    // Validate exchange type requirements
    if (exchangeType === "exchange" && offeredDates.length === 0) {
      setError("Debes seleccionar al menos un dia libre que ofrecer para un intercambio");
      return;
    }
    if (exchangeType === "hybrid" && offeredDates.length === 0 && !amount.trim()) {
      setError("Para un intercambio hibrido, debes ofrecer dinero o dias libres (o ambos)");
      return;
    }

    setError("");
    onSubmit({
      date,
      description: description.trim(),
      amount: amount.trim() || undefined,
      hideName,
      departmentId: deptId || undefined,
      exchangeType,
      offeredDates: offeredDates.length > 0 ? offeredDates : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">{t("offer.form.date")}</label>
        <input type="date" className="form-input" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>

      <div className="form-group">
        <label className="form-label">{t("offer.form.department")}</label>
        <select className="form-select" value={deptId} onChange={(e) => setDeptId(e.target.value)}>
          <option value="">{t("offer.department.general")}</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      {/* Exchange Type Selector */}
      <div className="form-group">
        <label className="form-label">Tipo de oferta</label>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
            <input
              type="radio"
              name="exchangeType"
              value="simple"
              checked={exchangeType === "simple"}
              onChange={() => setExchangeType("simple")}
            />
            <span style={{ fontWeight: 500 }}>Simple</span>
            <span style={{ fontSize: "13px", color: "#6b7280" }}>Solo ofreces dinero o un favor</span>
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
            <input
              type="radio"
              name="exchangeType"
              value="exchange"
              checked={exchangeType === "exchange"}
              onChange={() => setExchangeType("exchange")}
            />
            <span style={{ fontWeight: 500 }}>Intercambio</span>
            <span style={{ fontSize: "13px", color: "#6b7280" }}>Cambias uno de tus dias libres</span>
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
            <input
              type="radio"
              name="exchangeType"
              value="hybrid"
              checked={exchangeType === "hybrid"}
              onChange={() => setExchangeType("hybrid")}
            />
            <span style={{ fontWeight: 500 }}>Hibrido</span>
            <span style={{ fontSize: "13px", color: "#6b7280" }}>Combinas dinero + dias libres</span>
          </label>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">{t("offer.form.description")}</label>
        <textarea
          className="form-textarea"
          rows={3}
          placeholder={t("offer.form.placeholder")}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* Amount field - show for simple and hybrid */}
      {(exchangeType === "simple" || exchangeType === "hybrid") && (
        <div className="form-group">
          <label className="form-label">{t("offer.form.compensation")}</label>
          <input
            type="text"
            className="form-input"
            placeholder={t("offer.form.compensation.placeholder")}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
      )}

      {/* Offered Dates - show for exchange and hybrid */}
      {(exchangeType === "exchange" || exchangeType === "hybrid") && (
        <div className="form-group">
          <div className="offered-dates-header">
            <label className="form-label">
              {exchangeType === "exchange" ? "Dias libres que ofreces" : "Dias libres que ofreces (opcional)"}
            </label>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowMatches(!showMatches)}>
              {showMatches ? "Ocultar matches" : "Ver matches"}
            </button>
          </div>
          <div className="form-help">Selecciona en el calendario los dias libres que puedes ofrecer a cambio.</div>
          <OfferedDatesPicker key={date} startDate={date} blockedDate={date} value={offeredDates} onChange={setOfferedDates} />
        </div>
      )}

      {/* Matches Display */}
      {showMatches && matches.length > 0 && (
        <div className="form-group">
          <label className="form-label">Usuarios compatibles ({matches.length})</label>
          <div
            style={{
              maxHeight: "200px",
              overflowY: "auto",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              padding: "8px",
            }}
          >
            {matches.slice(0, 10).map((match) => (
              <div
                key={match.userId}
                style={{
                  padding: "8px",
                  marginBottom: "6px",
                  background: "#f9fafb",
                  borderRadius: "6px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ fontWeight: 500, fontSize: "14px" }}>{match.userName}</div>
                  <div style={{ fontSize: "12px", color: "#6b7280" }}>
                    Disponible:{" "}
                    {match.availableDates
                      .slice(0, 3)
                      .map((d) => new Date(`${d}T00:00:00`).toLocaleDateString("es-ES", { day: "numeric", month: "short" }))
                      .join(", ")}
                    {match.availableDates.length > 3 && ` +${match.availableDates.length - 3} mas`}
                  </div>
                </div>
                <div
                  style={{
                    background: match.matchScore > 1 ? "#dcfce7" : "#e0f2fe",
                    color: match.matchScore > 1 ? "#16a34a" : "#0369a1",
                    padding: "4px 8px",
                    borderRadius: "12px",
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                >
                  {match.matchScore > 1 ? "Match perfecto" : "Compatible"}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showMatches && matches.length === 0 && (exchangeType === "exchange" || exchangeType === "hybrid") && (
        <div
          style={{
            padding: "12px",
            background: "#fef3c7",
            color: "#92400e",
            borderRadius: "6px",
            marginBottom: "16px",
            fontSize: "13px",
          }}
        >
          No se encontraron usuarios compatibles. Intenta ofrecer mas dias libres.
        </div>
      )}

      <div className="form-group" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div className={`toggle ${hideName ? "active" : ""}`} onClick={() => setHideName(!hideName)} />
        <span style={{ fontSize: "14px" }}>{t("offer.form.hideName")}</span>
      </div>

      {error && (
        <div
          style={{
            padding: "12px",
            background: "#fee2e2",
            color: "#dc2626",
            borderRadius: "6px",
            marginBottom: "16px",
          }}
        >
          {error}
        </div>
      )}

      <div className="modal-footer">
        <button type="button" className="btn btn-ghost" onClick={onCancel}>
          {t("common.cancel")}
        </button>
        <button type="submit" className="btn btn-primary">
          {t("offer.form.submit")}
        </button>
      </div>
    </form>
  );
}

