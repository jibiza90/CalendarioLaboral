"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useApp } from "../../contexts/AppContext";
import { Sidebar } from "../../components/Sidebar";
import Link from "next/link";
import { useI18n } from "../../contexts/I18nContext";
import { Card } from "../../src/components/ui/Card";
import { Badge } from "../../src/components/ui/Badge";
import { Button } from "../../src/components/ui/Button";
import { EmptyState } from "../../src/components/ui/EmptyState";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogBody, DialogFooter } from "../../src/components/ui/Dialog";

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

const RestoreIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </svg>
);

export default function MessagesPage() {
  const { user, isAuthenticated, getUserConversations, deleteConversation, restoreConversation, getDeletedConversations, getOfferById, privateMessages } = useApp();
  const router = useRouter();
  const [showDeleted, setShowDeleted] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{ offerId: string; otherUserId: string; otherUserName: string } | null>(null);
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
  
  const conversations = getUserConversations();
  const deletedConvs = getDeletedConversations();

  useEffect(() => {
    if (!isAuthenticated && !user) {
      router.push("/login");
    }
  }, [isAuthenticated, user, router]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return date.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
    } else if (days === 1) {
      return t("messages.time.yesterday");
    } else if (days < 7) {
      return date.toLocaleDateString(locale, { weekday: "long" });
    } else {
      return date.toLocaleDateString(locale, { day: "numeric", month: "short" });
    }
  };

  const handleDelete = (offerId: string, otherUserId: string) => {
    deleteConversation(offerId, otherUserId);
    setConfirmDelete(null);
  };

  const handleRestore = (offerId: string, otherUserId: string) => {
    restoreConversation(offerId, otherUserId);
  };

  // Get info about deleted conversations
  const deletedConversationsInfo = deletedConvs.map(dc => {
    const offer = getOfferById(dc.offerId);
    // Find the other user's name from private messages
    const relatedMsg = privateMessages.find(
      m => m.offerId === dc.offerId && 
      (m.senderId === dc.otherUserId || m.receiverId === dc.otherUserId)
    );
    const otherUserName = relatedMsg?.senderId === dc.otherUserId 
      ? relatedMsg.senderName 
      : relatedMsg?.receiverName || t("messages.userFallback");
    
    return {
      ...dc,
      offerTitle: offer?.title || t("messages.offerUnavailable"),
      otherUserName,
    };
  });

  if (!user) {
    return (
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="text-[var(--color-text-secondary)]">{t("common.loading")}</div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <div>
              <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
                {t("messages.title")}
              </h1>
              <p className="text-[var(--color-text-secondary)]">
                {t("messages.subtitle")}
              </p>
            </div>
            {deletedConversationsInfo.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDeleted(!showDeleted)}
              >
                {showDeleted
                  ? t("messages.toggle.hide")
                  : t("messages.toggle.show", { count: String(deletedConversationsInfo.length) })}
              </Button>
            )}
          </motion.div>

          {showDeleted && deletedConversationsInfo.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                {t("messages.deleted.title")}
              </h3>
              {deletedConversationsInfo.map((dc) => (
                <Card key={`${dc.offerId}-${dc.otherUserId}`} variant="default" padding="md" className="opacity-60">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-400 flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                      {dc.otherUserName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-[var(--color-text-primary)] truncate">
                        {dc.otherUserName}
                      </div>
                      <div className="text-sm text-[var(--color-text-secondary)] truncate">
                        {dc.offerTitle}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRestore(dc.offerId, dc.otherUserId)}
                    >
                      <RestoreIcon />
                      <span className="ml-2">{t("messages.restore")}</span>
                    </Button>
                  </div>
                </Card>
              ))}
            </motion.div>
          )}

          {conversations.length === 0 && !showDeleted ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card variant="elevated" padding="none">
                <EmptyState
                  icon="💬"
                  title={t("messages.empty.title")}
                  description={t("messages.empty.desc")}
                  action={{
                    label: t("messages.empty.cta"),
                    onClick: () => router.push("/calendario")
                  }}
                />
              </Card>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="space-y-3"
            >
              {conversations.map((conv, index) => (
                <motion.div
                  key={`${conv.offerId}-${conv.otherUser.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <Card variant="interactive" padding="none" className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4 p-4">
                      <Link href={`/ofertas/${conv.offerId}`} className="flex items-start gap-4 flex-1 min-w-0">
                        {/* Avatar */}
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                          {conv.otherUser.name.charAt(0).toUpperCase()}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          {/* Header */}
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <div className="min-w-0 flex-1">
                              <div className="font-semibold text-[var(--color-text-primary)] truncate">
                                {conv.otherUser.name}
                              </div>
                              <div className="text-sm text-[var(--color-text-secondary)] truncate">
                                {conv.offerTitle}
                              </div>
                            </div>
                            <span className="text-xs text-[var(--color-text-tertiary)] whitespace-nowrap">
                              {formatDate(conv.lastMessage.createdAt)}
                            </span>
                          </div>

                          {/* Preview */}
                          <div className="flex items-center gap-2">
                            <p className={`text-sm flex-1 truncate ${conv.unreadCount > 0 ? 'font-semibold text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)]'}`}>
                              {conv.lastMessage.senderId === user.id && (
                                <span className="text-[var(--color-text-tertiary)]">{t("messages.you")} </span>
                              )}
                              {conv.lastMessage.text}
                            </p>
                            {conv.unreadCount > 0 && (
                              <Badge variant="primary" size="sm">
                                {conv.unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </Link>

                      {/* Delete Button */}
                      <button
                        className="p-2 text-[var(--color-text-tertiary)] hover:text-[var(--color-error)] hover:bg-[var(--color-error-bg)] rounded-lg transition-colors flex-shrink-0"
                        onClick={() => setConfirmDelete({
                          offerId: conv.offerId,
                          otherUserId: conv.otherUser.id,
                          otherUserName: conv.otherUser.name
                        })}
                        title={t("messages.delete.tooltip")}
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        <Dialog open={!!confirmDelete} onOpenChange={(open) => !open && setConfirmDelete(null)}>
          <DialogContent maxWidth="sm">
            <DialogHeader>
              <DialogTitle>{t("messages.delete.title")}</DialogTitle>
            </DialogHeader>
            <DialogBody>
              <DialogDescription>
                {confirmDelete && t("messages.delete.body", { name: confirmDelete.otherUserName })}
              </DialogDescription>
            </DialogBody>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setConfirmDelete(null)}>
                {t("messages.delete.cancel")}
              </Button>
              <Button
                variant="destructive"
                onClick={() => confirmDelete && handleDelete(confirmDelete.offerId, confirmDelete.otherUserId)}
              >
                {t("messages.delete.confirm")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
