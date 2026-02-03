"use client";

import { useMemo, useState } from "react";
import { Calendar } from "../components/Calendar";
import { OfferList } from "../components/OfferList";
import { Sidebar } from "../components/Sidebar";
import type { OfferSummary } from "../types";

const offers: OfferSummary[] = [
  {
    id: "1",
    day: 3,
    title: "Turno de mañana - atención clientes",
    description: "Revisión de incidencias, apertura del local y coordinación de stock.",
    amount: "40 €",
    department: "Operaciones",
    company: "Iberia Servicios",
    type: "Alta demanda"
  },
  {
    id: "2",
    day: 3,
    title: "Turno tarde - soporte interno",
    description: "Cobertura de mostrador y seguimiento de pedidos internos.",
    amount: "20 €",
    department: "Soporte",
    company: "Iberia Servicios",
    type: "Nueva"
  },
  {
    id: "3",
    day: 7,
    title: "Turno noche - logística",
    description: "Control de accesos y coordinación de entregas urgentes.",
    amount: "60 €",
    department: "Logística",
    company: "Iberia Servicios",
    type: "Aceptación rápida"
  },
  {
    id: "4",
    day: 12,
    title: "Turno mañana - recepción",
    description: "Atención de visitantes, gestión de llamadas y correo.",
    department: "Recepción",
    company: "Iberia Servicios",
    type: "Nueva"
  },
  {
    id: "5",
    day: 19,
    title: "Turno tarde - inspección",
    description: "Supervisión de equipos y checklist de seguridad.",
    amount: "50 €",
    department: "Seguridad",
    company: "Iberia Servicios",
    type: "Alta demanda"
  }
];

const daysInMonth = 30;

export default function Home() {
  const [selectedDay, setSelectedDay] = useState(3);

  const days = useMemo(() => {
    return Array.from({ length: daysInMonth }, (_, index) => {
      const day = index + 1;
      return {
        day,
        offers: offers.filter((offer) => offer.day === day)
      };
    });
  }, []);

  const selectedOffers = offers.filter((offer) => offer.day === selectedDay);

  return (
    <div className="main-layout">
      <Sidebar />
      <main className="content">
        <div className="topbar">
          <div>
            <h1>Hola, Laura</h1>
            <p className="offer-meta">
              Aquí tienes el mes en curso con las ofertas disponibles. Selecciona un día para ver los detalles.
            </p>
          </div>
          <div className="actions">
            <button className="button">Cambiar empresa</button>
            <button className="button primary">Nuevo turno</button>
          </div>
        </div>
        <div className="grid">
          <Calendar days={days} selectedDay={selectedDay} onSelect={setSelectedDay} />
          <OfferList offers={selectedOffers} />
        </div>
      </main>
    </div>
  );
}
