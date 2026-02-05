"use client";

import type { AppOffer } from "../contexts/AppContext";
import type { CalendarDay } from "../hooks/useCalendar";
import { useI18n } from "../contexts/I18nContext";
import { useMemo } from "react";

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
  const { t } = useI18n();

  const weekdays = useMemo(
    () => [
      t("calendar.weekdays.mon"),
      t("calendar.weekdays.tue"),
      t("calendar.weekdays.wed"),
      t("calendar.weekdays.thu"),
      t("calendar.weekdays.fri"),
      t("calendar.weekdays.sat"),
      t("calendar.weekdays.sun"),
    ],
    [t]
  );
  const handleDayClick = (day: number, month: number, year: number, isCurrent: boolean) => {
    if (isCurrent) {
      onSelectDate(day, month, year);
      onOpenDayModal(day, month, year);
    }
  };

  const getOfferType = (type: string) => {
    const highDemand = ["Alta demanda", "High demand", "Alta demanda", "Haute demande", "Alta domanda", "Hohe Nachfrage"];
    const fastAccept = ["Aceptación rápida", "Quick acceptance", "Acceptació ràpida", "Acceptation rapide", "Accettazione rapida", "Schnelle Annahme"];
    if (highDemand.includes(type)) return "hot";
    if (fastAccept.includes(type)) return "fast";
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
                  <div className="day-offer-more">{t("calendar.more", { count: String(slot.offers.length - 3) })}</div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
