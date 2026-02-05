"use client";

import { useParams, useRouter } from "next/navigation";
import { useApp } from "../../../contexts/AppContext";
import { Sidebar } from "../../../components/Sidebar";
import { useEffect, useMemo, useRef, useState } from "react";
import { PrivateMessage } from "../../../types";
import { useI18n } from "../../../contexts/I18nContext";

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const DoubleCheckIcon = ({ read }: { read?: boolean }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={read ? "#34c759" : "currentColor"}
    strokeWidth="2">
    <polyline points="20 6 9 17 4 12" />
    <polyline points="20 6 9 17 4 12" transform="translate(4, 0)" />
  </svg>
);

const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

// Helper to get remaining edit time in seconds
const getRemainingEditTime = (createdAt: string): number => {
  const EDIT_TIME_LIMIT = 5 * 60 * 1000; // 5 minutes
  const messageTime = new Date(createdAt).getTime();
  const now = Date.now();
  const remaining = EDIT_TIME_LIMIT - (now - messageTime);
  return Math.max(0, Math.floor(remaining / 1000));
};

// Format remaining time
const formatRemainingTime = (seconds: number): string => {
  if (seconds <= 0) return "";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins > 0) return `${mins}m ${secs}s`;
  return `${secs}s`;
};

export default function OfferDetailPage() {
  const params = useParams();
  const router = useRouter();
  const offerId = params.id as string;
  
  const {
    user,
    isAuthenticated,
    getOfferById,
    deleteOffer,
    sendPrivateMessage,
    getPrivateConversation,
    markMessagesAsRead,
    companies,
    getUserConversations,
    canEditMessage,
    editPrivateMessage,
    deleteConversation,
    addToast,
  } = useApp();
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

  const [messageText, setMessageText] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeleteConvConfirm, setShowDeleteConvConfirm] = useState(false);
  const [selectedChatUser, setSelectedChatUser] = useState<{ id: string; name: string } | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [remainingTimes, setRemainingTimes] = useState<Record<string, number>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const offer = useMemo(() => getOfferById(offerId), [offerId, getOfferById]);

  // Get offer owner info
  const ownerInfo = useMemo(() => {
    if (!offer) return null;
    const mockUsers: Record<string, { name: string; subscription: string }> = {
      "user-1": { name: "Laura", subscription: "pro" },
      "user-2": { name: "María", subscription: "pro" },
      "user-3": { name: "Carlos", subscription: "free" },
      "user-4": { name: "Ana", subscription: "business" },
    };
    return {
      id: offer.ownerId,
      name: mockUsers[offer.ownerId]?.name || "Usuario",
      subscription: mockUsers[offer.ownerId]?.subscription || "free",
    };
  }, [offer]);

  // Get all conversations for this offer
  const offerConversations = useMemo(() => {
    if (!user || !offerId) return [];
    const allConversations = getUserConversations();
    return allConversations.filter((conv) => conv.offerId === offerId);
  }, [user, offerId, getUserConversations]);

  // Get current conversation messages
  const conversation = useMemo(() => {
    if (!user || !offer || !selectedChatUser) return [];
    return getPrivateConversation(offerId, selectedChatUser.id);
  }, [offerId, selectedChatUser, getPrivateConversation, user, offer]);

  // Update remaining edit times every second
  useEffect(() => {
    const interval = setInterval(() => {
      const times: Record<string, number> = {};
      conversation.forEach((msg) => {
        if (msg.senderId === user?.id && !msg.edited) {
          times[msg.id] = getRemainingEditTime(msg.createdAt);
        }
      });
      setRemainingTimes(times);
    }, 1000);

    return () => clearInterval(interval);
  }, [conversation, user?.id]);

  // Auto-select chat partner on load
  useEffect(() => {
    if (offer && user && !selectedChatUser && ownerInfo) {
      if (user.id === offer.ownerId) {
        if (offerConversations.length > 0) {
          setSelectedChatUser(offerConversations[0].otherUser);
        }
      } else {
        setSelectedChatUser({ id: offer.ownerId, name: ownerInfo.name });
      }
    }
  }, [offer, user, ownerInfo, offerConversations, selectedChatUser]);

  // Mark messages as read when viewing
  useEffect(() => {
    if (selectedChatUser && offerId) {
      markMessagesAsRead(offerId, selectedChatUser.id);
    }
  }, [selectedChatUser, offerId, markMessagesAsRead]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  // Auth check
  useEffect(() => {
    if (!isAuthenticated && !user) {
      const timer = setTimeout(() => {
        router.push("/login");
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, user, router]);

  const handleSendMessage = () => {
    if (!messageText.trim() || !offer || !user || !selectedChatUser) return;
    
    sendPrivateMessage(offerId, selectedChatUser.id, selectedChatUser.name, messageText.trim());
    setMessageText("");
  };

  const handleStartEdit = (msg: PrivateMessage) => {
    if (!canEditMessage(msg.id)) return;
    setEditingMessageId(msg.id);
    setEditText(msg.text);
  };

  const handleSaveEdit = () => {
    if (!editingMessageId || !editText.trim()) return;
    
    const success = editPrivateMessage(editingMessageId, editText.trim());
    if (success) {
      setEditingMessageId(null);
      setEditText("");
    }
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditText("");
  };

  const handleDeleteConversation = () => {
    if (!selectedChatUser || !offer) return;
    deleteConversation(offerId, selectedChatUser.id);
    setShowDeleteConvConfirm(false);
    setSelectedChatUser(null);
  };

  const handleDelete = () => {
    if (!offer || !user) return;
    // Extra security check - only owner can delete
    if (offer.ownerId !== user.id) {
      addToast({ type: "error", message: t("offer.delete.noPermission") });
      return;
    }
    deleteOffer(offer.id);
    router.push("/calendario");
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, { day: "numeric", month: "short" });
  };

  const isSameDay = (date1: string, date2: string) => {
    return new Date(date1).toDateString() === new Date(date2).toDateString();
  };

  const canDelete = offer && user && offer.ownerId === user.id;
  const isOwner = offer && user && offer.ownerId === user.id;

  if (!offer || !user) {
    return (
      <div className="page-container">
        <Sidebar />
        <main className="main-content">
          <div className="loading-state">{t("common.loading")}</div>
        </main>
      </div>
    );
  }

  const company = companies.find((c) => c.id === offer.companyId);

  return (
    <div className="page-container">
      <Sidebar />
      <main className="main-content">
        <div className="offer-detail-page">
          {/* Header */}
          <div className="offer-detail-header">
            <button className="back-button" onClick={() => router.push("/calendario")}>
              {t("offer.back")}
            </button>
            <div className="offer-status-badges">
              <span className={`status-badge ${offer.status.toLowerCase().replace(" ", "-")}`}>
                {offer.status}
              </span>
              {offer.isPremium && (
                <span className="premium-badge">
                  <span className="crown">👑</span> {t("offer.premium")}
                </span>
              )}
            </div>
          </div>

          <div className="offer-detail-content">
            {/* Left: Offer Info */}
            <div className="offer-info-card">
              <h1 className="offer-title">{offer.title}</h1>
              
              <div className="offer-meta">
                <div className="meta-item">
                  <span className="meta-label">{t("offer.meta.company")}</span>
                  <span className="meta-value company-name">{offer.companyName}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">{t("offer.meta.department")}</span>
                  <span className="meta-value">{offer.departmentName}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">{t("offer.meta.date")}</span>
                  <span className="meta-value">{new Date(offer.date).toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "long" })}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">{t("offer.meta.rate")}</span>
                  <span className="meta-value amount">{offer.amount || t("offer.meta.rateUnset")}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">{t("offer.meta.type")}</span>
                  <span className={`meta-value type-${offer.type.toLowerCase().replace(/\s+/g, "-")}`}>
                    {offer.type}
                  </span>
                </div>
              </div>

              <div className="offer-description">
                <h3>{t("offer.description.title")}</h3>
                <p>{offer.description}</p>
              </div>

              {/* Owner Info */}
              <div className="owner-info">
                <h3>{t("offer.owner.title")}</h3>
                <div className="owner-card">
                  <div className="owner-avatar">
                    {ownerInfo?.name.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div className="owner-details">
                    <span className="owner-name">
                      {offer.hideName ? t("offer.owner.anonymous") : ownerInfo?.name}
                      {ownerInfo?.subscription !== "free" && (
                        <span className="owner-premium-badge">★</span>
                      )}
                    </span>
                    <span className="owner-role">
                      {isOwner ? t("offer.owner.you") : t("offer.owner.role")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Company Info */}
              {company && (
                <div className="company-info-box">
                  <h3>{t("offer.company.title")}</h3>
                  <div className="company-details">
                    <div className="company-detail-row">
                      <span className="detail-label">{t("offer.company.code")}</span>
                      <code className="company-code">{company.code}</code>
                    </div>
                    <div className="company-detail-row">
                      <span className="detail-label">{t("offer.company.province")}</span>
                      <span>{company.province}</span>
                    </div>
                  </div>
                </div>
              )}

              {canDelete && (
                <button
                  className="delete-offer-button"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  🗑️ {t("offer.delete.button")}
                </button>
              )}
            </div>

            {/* Right: Private Chat */}
            <div className="private-chat-section">
              <div className="chat-header">
                <div className="chat-header-main">
                  <div>
                    <h2>💬 {t("offer.chat.title")}</h2>
                    {isOwner ? (
                      <p className="chat-subtitle">
                        {t("offer.chat.subtitle.owner")}
                      </p>
                    ) : (
                      <p className="chat-subtitle">
                        {t("offer.chat.subtitle.other", { name: ownerInfo?.name || "" })}
                      </p>
                    )}
                  </div>
                  {selectedChatUser && (
                    <button
                      className="delete-conv-button"
                      onClick={() => setShowDeleteConvConfirm(true)}
                      title={t("offer.chat.delete.tooltip")}
                    >
                      <TrashIcon />
                    </button>
                  )}
                </div>
              </div>

              {/* Chat List (for owner) */}
              {isOwner && offerConversations.length > 0 && (
                <div className="chat-list">
                  <h4>{t("offer.chat.list.title")}</h4>
                  {offerConversations.map((conv) => (
                    <button
                      key={conv.otherUser.id}
                      className={`chat-list-item ${selectedChatUser?.id === conv.otherUser.id ? "active" : ""}`}
                      onClick={() => setSelectedChatUser(conv.otherUser)}
                    >
                      <div className="chat-list-avatar">{conv.otherUser.name.charAt(0)}</div>
                      <div className="chat-list-info">
                        <span className="chat-list-name">{conv.otherUser.name}</span>
                        <span className="chat-list-preview">{conv.lastMessage.text.slice(0, 30)}...</span>
                      </div>
                      {conv.unreadCount > 0 && (
                        <span className="chat-list-badge">{conv.unreadCount}</span>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Chat Messages */}
              <div className="chat-container">
                {selectedChatUser ? (
                  <>
                    <div className="chat-messages">
                      {conversation.length === 0 ? (
                        <div className="chat-empty">
                          <div className="empty-icon">💬</div>
                          <p>{t("offer.chat.empty.title")}</p>
                          <span>{t("offer.chat.empty.subtitle", { name: selectedChatUser.name })}</span>
                        </div>
                      ) : (
                        <>
                          {conversation.map((msg, index) => {
                            const isMine = msg.senderId === user.id;
                            const showDate = index === 0 || !isSameDay(msg.createdAt, conversation[index - 1].createdAt);
                            const canEdit = canEditMessage(msg.id);
                            const remainingTime = remainingTimes[msg.id] || 0;
                            
                            return (
                              <div key={msg.id}>
                                {showDate && (
                                  <div className="message-date-divider">
                                    <span>{formatDate(msg.createdAt)}</span>
                                  </div>
                                )}
                                <div className={`message ${isMine ? "sent" : "received"}`}>
                                  {!isMine && (
                                    <div className="message-avatar">{msg.senderName.charAt(0)}</div>
                                  )}
                                  <div className="message-content">
                                    {editingMessageId === msg.id ? (
                                      <div className="edit-box">
                                        <input
                                          type="text"
                                          value={editText}
                                          onChange={(e) => setEditText(e.target.value)}
                                          onKeyDown={(e) => {
                                            if (e.key === "Enter") handleSaveEdit();
                                            if (e.key === "Escape") handleCancelEdit();
                                          }}
                                          autoFocus
                                          className="edit-input"
                                        />
                                        <div className="edit-actions">
                                          <button onClick={handleSaveEdit} className="edit-save">{t("offer.chat.edit.save")}</button>
                                          <button onClick={handleCancelEdit} className="edit-cancel">{t("offer.chat.edit.cancel")}</button>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className={`message-bubble ${canEdit && remainingTime > 0 ? "editable" : ""}`}>
                                        <p className="message-text">{msg.text}</p>
                                        {msg.edited && (
                                          <span className="edited-label">{t("offer.chat.edited")}</span>
                                        )}
                                      </div>
                                    )}
                                    <div className="message-meta">
                                      <span className="message-time">{formatTime(msg.createdAt)}</span>
                                      {isMine && !editingMessageId && (
                                        <span className="message-status">
                                          {msg.read ? <DoubleCheckIcon read /> : <DoubleCheckIcon />}
                                        </span>
                                      )}
                                    </div>
                                    {isMine && !editingMessageId && canEdit && remainingTime > 0 && (
                                      <button
                                        className="edit-button"
                                        onClick={() => handleStartEdit(msg)}
                                        title={t("offer.chat.edit.tooltip", { time: formatRemainingTime(remainingTime) })}
                                      >
                                        <EditIcon />
                                        <span>{formatRemainingTime(remainingTime)}</span>
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                          <div ref={messagesEndRef} />
                        </>
                      )}
                    </div>

                    <div className="chat-input-area">
                      <textarea
                        className="chat-input"
                        placeholder={t("offer.chat.placeholder", { name: selectedChatUser.name })}
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!messageText.trim()}
                        className="chat-send-button send-button"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                        </svg>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="chat-empty">
                    <div className="empty-icon">👥</div>
                    <p>{t("offer.chat.noConversations")}</p>
                    <span>{t("offer.chat.noConversations.subtitle")}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Delete Offer Modal */}
        {showDeleteConfirm && (
          <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>{t("offer.delete.title")}</h3>
              <p>{t("offer.delete.body")}</p>
              <div className="modal-actions">
                <button className="btn-secondary" onClick={() => setShowDeleteConfirm(false)}>
                  {t("offer.delete.cancel")}
                </button>
                <button className="btn-danger" onClick={handleDelete}>
                  {t("offer.delete.confirm")}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Conversation Modal */}
        {showDeleteConvConfirm && selectedChatUser && (
          <div className="modal-overlay" onClick={() => setShowDeleteConvConfirm(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>{t("offer.chat.delete.title")}</h3>
              <p>{t("offer.chat.delete.body", { name: selectedChatUser.name })}</p>
              <div className="modal-actions">
                <button className="btn-secondary" onClick={() => setShowDeleteConvConfirm(false)}>
                  {t("offer.chat.delete.cancel")}
                </button>
                <button className="btn-danger" onClick={handleDeleteConversation}>
                  {t("offer.chat.delete.confirm")}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
