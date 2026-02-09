"use client";

import type { AppOffer } from "../contexts/AppContext";
import type { CalendarDay } from "../hooks/useCalendar";
import { useI18n } from "../contexts/I18nContext";
import { useMemo } from "react";
import { Card } from "../src/components/ui/Card";

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
    <Card variant="elevated" padding="none" className="overflow-hidden">
      {/* Calendar Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border-default)] bg-gradient-to-r from-purple-500/5 to-cyan-500/5">
        <h2 className="text-xl font-bold text-[var(--color-text-primary)]">{monthLabel}</h2>
        <div className="flex items-center gap-2">
          <button
            className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-[var(--color-bg-secondary)] transition-colors text-[var(--color-text-primary)] font-semibold"
            onClick={onPrevMonth}
          >
            ←
          </button>
          <button
            className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-[var(--color-bg-secondary)] transition-colors text-[var(--color-text-primary)] font-semibold"
            onClick={onNextMonth}
          >
            →
          </button>
        </div>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 gap-px bg-[var(--color-border-default)] border-b border-[var(--color-border-default)]">
        {weekdays.map((d) => (
          <div
            key={d}
            className="bg-[var(--color-bg-secondary)] py-3 text-center text-sm font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-px bg-[var(--color-border-default)]">
        {days.map((slot, index) => {
          const isSelected =
            selectedDate.getDate() === slot.day &&
            selectedDate.getMonth() === slot.month &&
            selectedDate.getFullYear() === slot.year;

          const hasPremium = slot.offers.some((o) => o.isPremium);

          return (
            <button
              key={index}
              className={`
                relative min-h-[100px] p-2 bg-[var(--color-bg-primary)] hover:bg-[var(--color-bg-secondary)] transition-all
                ${isSelected ? "ring-2 ring-inset ring-[var(--color-brand-primary)] bg-purple-500/5" : ""}
                ${!slot.isCurrentMonth ? "opacity-40" : ""}
                ${slot.isToday ? "bg-cyan-500/5" : ""}
                ${slot.offers.length > 0 ? "cursor-pointer" : "cursor-default"}
                disabled:opacity-30
              `}
              onClick={() => handleDayClick(slot.day, slot.month, slot.year, slot.isCurrentMonth)}
              disabled={!slot.isCurrentMonth}
            >
              {/* Day Number */}
              <div className="flex items-start justify-between mb-1">
                <span className={`
                  text-sm font-semibold
                  ${slot.isToday ? "w-6 h-6 rounded-full bg-[var(--color-brand-primary)] text-white flex items-center justify-center" : "text-[var(--color-text-primary)]"}
                `}>
                  {slot.day}
                </span>
                {hasPremium && (
                  <span className="text-xs bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-1.5 py-0.5 rounded font-semibold">
                    PRO
                  </span>
                )}
              </div>

              {/* Offers */}
              <div className="space-y-1">
                {slot.offers.slice(0, 3).map((offer) => (
                  <div
                    key={offer.id}
                    className={`
                      text-xs px-2 py-1 rounded truncate font-medium
                      ${getOfferType(offer.type) === "hot" ? "bg-red-100 text-red-700" : ""}
                      ${getOfferType(offer.type) === "fast" ? "bg-green-100 text-green-700" : ""}
                      ${getOfferType(offer.type) === "new" ? "bg-blue-100 text-blue-700" : ""}
                      ${offer.isPremium ? "ring-1 ring-purple-500/30" : ""}
                    `}
                    title={offer.title}
                  >
                    {offer.isPremium && "⭐ "}
                    {offer.title.slice(0, 20)}
                    {offer.title.length > 20 ? "..." : ""}
                  </div>
                ))}
                {slot.offers.length > 3 && (
                  <div className="text-xs text-[var(--color-text-tertiary)] font-medium px-2">
                    +{slot.offers.length - 3} {t("calendar.more", { count: String(slot.offers.length - 3) })}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </Card>
  );
}
