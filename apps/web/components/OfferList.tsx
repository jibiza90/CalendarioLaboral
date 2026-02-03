import type { OfferSummary } from "../types";

export function OfferList({ offers }: { offers: OfferSummary[] }) {
  return (
    <div className="panel">
      <div className="calendar-header">
        <div>
          <h2>Ofertas del día</h2>
          <p className="offer-meta">Negocia en privado y confirma cuando ambos acepten.</p>
        </div>
        <button className="button primary">Publicar oferta</button>
      </div>
      <div className="offer-list">
        {offers.map((offer) => (
          <article key={offer.id} className="offer-card">
            <div>
              <span className="tag">{offer.department}</span>
            </div>
            <h3>{offer.title}</h3>
            <p className="offer-meta">{offer.description}</p>
            <div className="offer-meta">
              <span>Empresa: {offer.company}</span>
              <span>Oferta: {offer.amount ?? "Sin compensación"}</span>
              <span>Estado: {offer.type}</span>
            </div>
            <div className="offer-actions">
              <button className="button">Contraofertar</button>
              <button className="button primary">Aceptar</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
