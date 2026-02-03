import type { OfferSummary } from "../types";

const weekdays = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

function getOfferPills(offers: OfferSummary[]) {
  if (offers.length === 0) return null;
  const labels = offers.slice(0, 2).map((offer) => offer.type);
  const pills = labels.map((label, index) => {
    const variant = label === "Alta demanda" ? "warning" : label === "Aceptación rápida" ? "success" : "";
    return (
      <span key={`${label}-${index}`} className={`offer-pill ${variant}`}>
        {label}
      </span>
    );
  });

  if (offers.length > 2) {
    pills.push(
      <span key="more" className="offer-pill">
        +{offers.length - 2} más
      </span>
    );
  }

  return pills;
}

export function Calendar({
  days,
  selectedDay,
  onSelect
}: {
  days: { day: number; offers: OfferSummary[] }[];
  selectedDay: number;
  onSelect: (day: number) => void;
}) {
  return (
    <div className="panel">
      <div className="calendar-header">
        <div>
          <h2>Marzo 2025</h2>
          <p className="offer-meta">Vista mensual con ofertas activas</p>
        </div>
        <div className="actions">
          <button className="button">Mes anterior</button>
          <button className="button">Mes siguiente</button>
        </div>
      </div>
      <div className="calendar-grid">
        {weekdays.map((day) => (
          <span key={day} className="weekday">
            {day}
          </span>
        ))}
        {days.map((slot) => (
          <button
            key={slot.day}
            type="button"
            className={`day ${selectedDay === slot.day ? "active" : ""}`}
            onClick={() => onSelect(slot.day)}
          >
            <span className="date">{slot.day}</span>
            <div>{getOfferPills(slot.offers)}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
