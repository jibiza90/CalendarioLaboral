"use client";

import { useMemo } from "react";
import { useCalendar } from "../hooks/useCalendar";
import { useI18n } from "../contexts/I18nContext";

type OfferedDatesPickerProps = {
  value: string[];
  onChange: (next: string[]) => void;
  startDate?: string; // YYYY-MM-DD
  blockedDate?: string; // YYYY-MM-DD (e.g. the requested shift day)
};

const toLocalISODate = (d: Date): string => {
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
};

export function OfferedDatesPicker({ value, onChange, startDate, blockedDate }: OfferedDatesPickerProps) {
  const { t, lang } = useI18n();

  const initial = useMemo(() => {
    if (!startDate) return new Date();
    const parsed = new Date(`${startDate}T00:00:00`);
    return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
  }, [startDate]);

  const { currentDate, days, goToPrevMonth, goToNextMonth, selectDate } = useCalendar(initial);

  const locale = useMemo(() => {
    const map: Record<string, string> = {
      es: "es-ES",
      ca: "ca-ES",
      en: "en-US",
      fr: "fr-FR",
      it: "it-IT",
      de: "de-DE",
    };
    return map[lang] || "es-ES";
  }, [lang]);

  const monthLabel = useMemo(() => {
    return new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toLocaleDateString(locale, {
      month: "long",
      year: "numeric",
    });
  }, [currentDate, locale]);

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

  const selected = useMemo(() => new Set(value), [value]);
  const selectedSorted = useMemo(() => [...selected].sort(), [selected]);

  const toggle = (iso: string) => {
    if (blockedDate && iso === blockedDate) return;
    const next = new Set(selected);
    if (next.has(iso)) next.delete(iso);
    else next.add(iso);
    onChange([...next].sort());
  };

  const remove = (iso: string) => {
    const next = new Set(selected);
    next.delete(iso);
    onChange([...next].sort());
  };

  const clear = () => {
    onChange([]);
  };

  return (
    <div className="offered-dates-picker">
      <div className="od-header">
        <div className="od-title">
          <div className="od-month">{monthLabel}</div>
          <div className="od-sub">{selected.size} seleccionado(s)</div>
        </div>
        <div className="od-actions">
          <button type="button" className="od-nav" onClick={goToPrevMonth} aria-label="Mes anterior">
            {"<"}
          </button>
          <button type="button" className="od-nav" onClick={goToNextMonth} aria-label="Mes siguiente">
            {">"}
          </button>
          {selected.size > 0 ? (
            <button type="button" className="od-clear" onClick={clear}>
              Limpiar
            </button>
          ) : null}
        </div>
      </div>

      <div className="od-weekdays">
        {weekdays.map((w) => (
          <div key={w} className="od-weekday">
            {w}
          </div>
        ))}
      </div>

      <div className="od-grid" role="grid" aria-label="Selector de dias libres">
        {days.map((slot, index) => {
          const iso = toLocalISODate(new Date(slot.year, slot.month, slot.day));
          const isSelected = selected.has(iso);
          const isBlocked = Boolean(blockedDate && iso === blockedDate);
          const className = [
            "od-day",
            !slot.isCurrentMonth ? "other" : "",
            slot.isToday ? "today" : "",
            isSelected ? "selected" : "",
            isBlocked ? "blocked" : "",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <button
              key={`${slot.year}-${slot.month}-${slot.day}-${index}`}
              type="button"
              className={className}
              onClick={() => {
                if (!slot.isCurrentMonth) {
                  selectDate(slot.day, slot.month, slot.year);
                }
                toggle(iso);
              }}
              disabled={isBlocked}
              aria-pressed={isSelected}
            >
              <span className="od-day-num">{slot.day}</span>
              {isSelected ? <span className="od-dot" aria-hidden="true" /> : null}
            </button>
          );
        })}
      </div>

      <div className="od-selected">
        {selectedSorted.length ? (
          selectedSorted.map((iso) => (
            <button key={iso} type="button" className="od-chip" onClick={() => remove(iso)}>
              {new Date(`${iso}T00:00:00`).toLocaleDateString(locale, { day: "numeric", month: "short" })}
              <span className="od-chip-x">x</span>
            </button>
          ))
        ) : (
          <div className="od-empty">Selecciona uno o varios dias en el calendario.</div>
        )}
      </div>
    </div>
  );
}

