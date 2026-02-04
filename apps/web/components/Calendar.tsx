"use client";

import type { AppOffer } from "../contexts/AppContext";
import type { CalendarDay } from "../hooks/useCalendar";

const weekdays = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

interface CalendarProps {
  days: (CalendarDay & { offers: AppOffer[] })[];
  selectedDate: Date;
  monthLabel: string;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onSelectDate: (day: number, month: number, year: number) => void;
  onOpenDayModal: (day: number, month: number, year: number) => void;
}

export function Calendar({
  days,
  selectedDate,
  monthLabel,
  onPrevMonth,
  onNextMonth,
  onSelectDate,
  onOpenDayModal,
}: CalendarProps) {
  const handleDayClick = (day: number, month: number, year: number, isCurrent: boolean) => {
    if (isCurrent) {
      onSelectDate(day, month, year);
      onOpenDayModal(day, month, year);
    }
  };

  const getOfferType = (type: string) => {
    if (type === "Alta demanda") return "hot";
    if (type === "Aceptación rápida") return "fast";
    return "new";
  };

  return (
    <div className="calendar-wrapper">
      <div className="calendar-header">
        <h2 className="calendar-title">{monthLabel}</h2>
        <div className="calendar-nav">
          <button className="btn btn-secondary" onClick={onPrevMonth}>←</button>
          <button className="btn btn-secondary" onClick={onNextMonth}>→</button>
        </div>
      </div>

      <div className="calendar-weekdays">
        {weekdays.map((d) => (
          <div key={d} className="calendar-weekday">{d}</div>
        ))}
      </div>

      <div className="calendar-days">
        {days.map((slot, index) => {
          const isSelected =
            selectedDate.getDate() === slot.day &&
            selectedDate.getMonth() === slot.month &&
            selectedDate.getFullYear() === slot.year;

          const hasPremium = slot.offers.some((o) => o.isPremium);

          return (
            <button
              key={index}
              className={`calendar-day ${isSelected ? "selected" : ""} ${
                !slot.isCurrentMonth ? "other-month" : ""
              } ${slot.isToday ? "today" : ""}`}
              onClick={() => handleDayClick(slot.day, slot.month, slot.year, slot.isCurrentMonth)}
              disabled={!slot.isCurrentMonth}
            >
              {hasPremium && <span className="day-premium-badge">PRO</span>}
              
              <span className="day-number">{slot.day}</span>

              <div className="day-offers">
                {slot.offers.slice(0, 3).map((offer) => (
                  <div
                    key={offer.id}
                    className={`day-offer-chip ${getOfferType(offer.type)} ${offer.isPremium ? "premium" : ""}`}
                    title={offer.title}
                  >
                    {offer.isPremium && "⭐ "}
                    {offer.title.slice(0, 20)}
                    {offer.title.length > 20 ? "..." : ""}
                  </div>
                ))}
                {slot.offers.length > 3 && (
                  <div className="day-offer-more">+{slot.offers.length - 3} más</div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
