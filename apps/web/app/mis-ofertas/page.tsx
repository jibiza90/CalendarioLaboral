"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useApp } from "../../contexts/AppContext";
import { Sidebar } from "../../components/Sidebar";
import { useI18n } from "../../contexts/I18nContext";
import { Card } from "../../src/components/ui/Card";
import { Badge } from "../../src/components/ui/Badge";
import { Button } from "../../src/components/ui/Button";
import { EmptyState } from "../../src/components/ui/EmptyState";

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const UsersIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const MessageIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

export default function MisOfertasPage() {
  const router = useRouter();
  const { user, getMyOffers, getUserConversations, privateMessages } = useApp();
  const { t, lang } = useI18n();

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

  const myOffers = useMemo(() => getMyOffers(), [getMyOffers]);

  const offersWithStats = useMemo(() => {
    const conversations = getUserConversations();

    return myOffers.map((offer) => {
      const offerConvs = conversations.filter((c) => c.offerId === offer.id);
      const offerMessages = privateMessages.filter((m) => m.offerId === offer.id);
      const unreadCount = offerMessages.filter((m) =>
        m.receiverId === user?.id && !m.read
      ).length;

      return {
        ...offer,
        interestedCount: offerConvs.length,
        unreadMessages: unreadCount,
      };
    });
  }, [myOffers, getUserConversations, privateMessages, user]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
      weekday: "long",
      day: "numeric",
      month: "long"
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aceptado":
        return "success";
      case "En negociación":
        return "warning";
      case "Rechazado":
        return "error";
      default:
        return "info";
    }
  };

  const getExchangeTypeLabel = (type: string) => {
    switch (type) {
      case "exchange":
        return "🔄 Intercambio";
      case "hybrid":
        return "💰🔄 Híbrido";
      default:
        return "💰 Simple";
    }
  };

  if (!user) {
    return (
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <Card variant="elevated" padding="none">
            <EmptyState
              icon="🔐"
              title="Inicia sesión"
              description="Necesitas iniciar sesión para ver tus ofertas"
            />
          </Card>
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
          >
            <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
              Mis Ofertas
            </h1>
            <p className="text-[var(--color-text-secondary)]">
              Gestiona tus ofertas de intercambio y negociaciones
            </p>
          </motion.div>

          {/* Stats Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <Card variant="elevated" padding="lg">
              <div className="flex items-center gap-3">
                <div className="text-2xl">📋</div>
                <div>
                  <div className="text-sm text-[var(--color-text-secondary)]">Total Ofertas</div>
                  <div className="text-2xl font-bold text-[var(--color-text-primary)]">
                    {myOffers.length}
                  </div>
                </div>
              </div>
            </Card>

            <Card variant="elevated" padding="lg">
              <div className="flex items-center gap-3">
                <div className="text-2xl">✅</div>
                <div>
                  <div className="text-sm text-[var(--color-text-secondary)]">Aceptadas</div>
                  <div className="text-2xl font-bold text-[var(--color-success)]">
                    {myOffers.filter((o) => o.status === "Aceptado").length}
                  </div>
                </div>
              </div>
            </Card>

            <Card variant="elevated" padding="lg">
              <div className="flex items-center gap-3">
                <div className="text-2xl">💬</div>
                <div>
                  <div className="text-sm text-[var(--color-text-secondary)]">En Negociación</div>
                  <div className="text-2xl font-bold text-[var(--color-warning)]">
                    {myOffers.filter((o) => o.status === "En negociación").length}
                  </div>
                </div>
              </div>
            </Card>

            <Card variant="elevated" padding="lg">
              <div className="flex items-center gap-3">
                <div className="text-2xl">👥</div>
                <div>
                  <div className="text-sm text-[var(--color-text-secondary)]">Total Interesados</div>
                  <div className="text-2xl font-bold text-[var(--color-brand-primary)]">
                    {offersWithStats.reduce((sum, o) => sum + o.interestedCount, 0)}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Offers List */}
          {myOffers.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card variant="elevated" padding="none">
                <EmptyState
                  icon="📋"
                  title="No tienes ofertas"
                  description="Crea tu primera oferta de intercambio desde el calendario"
                  action={{
                    label: "Ir al Calendario",
                    onClick: () => router.push("/calendario"),
                  }}
                />
              </Card>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              {offersWithStats.map((offer, index) => (
                <motion.div
                  key={offer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                >
                  <Card
                    variant="interactive"
                    padding="lg"
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => router.push(`/ofertas/${offer.id}`)}
                  >
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                      {/* Left: Offer Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-1 truncate">
                              {offer.title}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                              <CalendarIcon />
                              <span>{formatDate(offer.date)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge variant={getStatusColor(offer.status) as any} size="sm">
                            {offer.status}
                          </Badge>
                          <Badge variant="default" size="sm">
                            {getExchangeTypeLabel(offer.exchangeType)}
                          </Badge>
                          {offer.amount && (
                            <Badge variant="success" size="sm">
                              {offer.amount}
                            </Badge>
                          )}
                          {offer.isPremium && (
                            <Badge variant="primary" size="sm">
                              ⭐ Premium
                            </Badge>
                          )}
                        </div>

                        <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2">
                          {offer.description}
                        </p>

                        {offer.offeredDates && offer.offeredDates.length > 0 && (
                          <div className="mt-3 flex items-center gap-2 text-sm">
                            <span className="text-[var(--color-text-tertiary)]">Ofreces:</span>
                            <div className="flex flex-wrap gap-1">
                              {offer.offeredDates.slice(0, 3).map((date) => (
                                <Badge key={date} variant="info" size="sm">
                                  {new Date(date).toLocaleDateString(locale, {
                                    day: "numeric",
                                    month: "short"
                                  })}
                                </Badge>
                              ))}
                              {offer.offeredDates.length > 3 && (
                                <span className="text-[var(--color-text-tertiary)]">
                                  +{offer.offeredDates.length - 3} más
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right: Stats & Actions */}
                      <div className="flex md:flex-col gap-3 items-start">
                        <div className="flex items-center gap-2 px-3 py-2 bg-[var(--color-bg-secondary)] rounded-lg">
                          <UsersIcon />
                          <div className="text-center">
                            <div className="text-xs text-[var(--color-text-tertiary)]">Interesados</div>
                            <div className="text-lg font-bold text-[var(--color-brand-primary)]">
                              {offer.interestedCount}
                            </div>
                          </div>
                        </div>

                        {offer.unreadMessages > 0 && (
                          <div className="flex items-center gap-2 px-3 py-2 bg-[var(--color-error-bg)] rounded-lg">
                            <MessageIcon />
                            <div className="text-center">
                              <div className="text-xs text-[var(--color-text-tertiary)]">Sin leer</div>
                              <div className="text-lg font-bold text-[var(--color-error)]">
                                {offer.unreadMessages}
                              </div>
                            </div>
                          </div>
                        )}

                        <Button
                          variant="primary"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/ofertas/${offer.id}`);
                          }}
                        >
                          Ver Detalles
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
