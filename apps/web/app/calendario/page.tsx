"use client";

import { useState, useMemo } from "react";
import { useApp } from "../../contexts/AppContext";
import { useCalendar } from "../../hooks/useCalendar";
import { Calendar } from "../../components/Calendar";
import { DayModal } from "../../components/DayModal";
import { Sidebar } from "../../components/Sidebar";

export default function CalendarioPage() {
  const {
    isLoading,
    activeCompany,
    getOffersByDay,
  } = useApp();

  const {
    selectedDate,
    monthLabel,
    days,
    goToPrevMonth,
    goToNextMonth,
    selectDate,
  } = useCalendar();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalDate, setModalDate] = useState<Date | null>(null);

  const daysWithOffers = useMemo(() => {
    return days.map((day) => ({
      ...day,
      offers: getOffersByDay(day.day, day.month, day.year).filter(
        (o) => !activeCompany || o.companyId === activeCompany.id
      ),
    }));
  }, [days, getOffersByDay, activeCompany]);

  const handleOpenDayModal = (day: number, month: number, year: number) => {
    const date = new Date(year, month, day);
    setModalDate(date);
    setModalOpen(true);
  };

  const modalOffers = useMemo(() => {
    if (!modalDate) return [];
    return getOffersByDay(
      modalDate.getDate(),
      modalDate.getMonth(),
      modalDate.getFullYear()
    );
  }, [modalDate, getOffersByDay]);

  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div className="spinner" />
          <p style={{ marginTop: "16px", color: "#6b7280" }}>Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Sidebar />

      <main className="main-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">Calendario</h1>
            <p style={{ color: "#6b7280" }}>
              {activeCompany 
                ? `Gestionando turnos para ${activeCompany.name}` 
                : "Selecciona una empresa para ver sus turnos"}
            </p>
          </div>
          {activeCompany && (
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "12px", color: "#6b7280" }}>Código de empresa</div>
              <div style={{ fontFamily: "monospace", fontSize: "18px", fontWeight: 700, color: "#4f46e5" }}>
                {activeCompany.code}
              </div>
            </div>
          )}
        </div>

        <Calendar
          days={daysWithOffers}
          selectedDate={selectedDate}
          monthLabel={monthLabel}
          onPrevMonth={goToPrevMonth}
          onNextMonth={goToNextMonth}
          onSelectDate={selectDate}
          onOpenDayModal={handleOpenDayModal}
        />
      </main>

      {modalOpen && modalDate && (
        <DayModal
          date={modalDate}
          offers={modalOffers}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
