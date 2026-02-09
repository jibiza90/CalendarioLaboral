"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useApp } from "../../contexts/AppContext";
import { useCalendar } from "../../hooks/useCalendar";
import { Calendar } from "../../components/Calendar";
import { DayModal } from "../../components/DayModal";
import { Sidebar } from "../../components/Sidebar";
import { useI18n } from "../../contexts/I18nContext";
import { Card } from "../../src/components/ui/Card";
import { Badge } from "../../src/components/ui/Badge";
import { Skeleton } from "../../src/components/ui/Skeleton";

export default function CalendarioPage() {
  const {
    isLoading,
    activeCompany,
    getOffersByDay,
    offers,
    getUnreadMessageCount,
  } = useApp();
  const { t } = useI18n();

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

  const stats = useMemo(() => {
    const month = selectedDate.getMonth();
    const year = selectedDate.getFullYear();
    const scopedOffers = offers.filter((o) =>
      activeCompany ? o.companyId === activeCompany.id : true
    );
    const monthOffers = scopedOffers.filter((o) => {
      const d = new Date(o.date);
      return d.getMonth() === month && d.getFullYear() === year;
    });
    const todayOffers = scopedOffers.filter((o) => {
      const d = new Date(o.date);
      const today = new Date();
      return d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
    });

    return [
      {
        label: "Ofertas activas",
        value: scopedOffers.length || 0,
        icon: "📋",
        color: "primary" as const
      },
      {
        label: "Este mes",
        value: monthOffers.length || 0,
        icon: "📅",
        color: "info" as const
      },
      {
        label: "Hoy",
        value: todayOffers.length || 0,
        icon: "⭐",
        color: "warning" as const
      },
      {
        label: "Mensajes sin leer",
        value: getUnreadMessageCount() || 0,
        icon: "💬",
        color: "success" as const
      },
    ];
  }, [activeCompany, getUnreadMessageCount, offers, selectedDate]);

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
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <div className="max-w-7xl mx-auto space-y-6">
            <Skeleton className="h-20 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-24" />
              ))}
            </div>
            <Skeleton className="h-96 w-full" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Sidebar />

      <main className="main-content">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
                {activeCompany
                  ? t("calendar.subtitle.company", { company: activeCompany.name })
                  : t("calendar.title")}
              </h1>
            </div>
            {activeCompany && (
              <div className="flex items-center gap-3 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 px-4 py-2.5 rounded-xl border border-[var(--color-brand-primary)]/20">
                <div className="text-sm font-medium text-[var(--color-text-secondary)]">
                  Código de invitación
                </div>
                <Badge variant="primary" size="lg" className="font-mono text-base">
                  {activeCompany.inviteCode}
                </Badge>
              </div>
            )}
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <Card
                  variant="interactive"
                  padding="lg"
                  className="hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">{stat.icon}</div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-[var(--color-text-secondary)]">
                        {stat.label}
                      </div>
                      <div className="text-2xl font-bold text-[var(--color-text-primary)] mt-1">
                        {stat.value}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Calendar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Calendar
              days={daysWithOffers}
              selectedDate={selectedDate}
              monthLabel={monthLabel}
              onPrevMonth={goToPrevMonth}
              onNextMonth={goToNextMonth}
              onSelectDate={selectDate}
              onOpenDayModal={handleOpenDayModal}
            />
          </motion.div>
        </div>
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
