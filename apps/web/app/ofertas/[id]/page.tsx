"use client";

import { useParams, useRouter } from "next/navigation";
import { useApp } from "../../../contexts/AppContext";
import { Sidebar } from "../../../components/Sidebar";
import { useEffect, useMemo, useRef, useState } from "react";
import { PrivateMessage } from "../../../types";

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
      addToast({ type: "error", message: "No tienes permiso para eliminar esta oferta" });
      return;
    }
    deleteOffer(offer.id);
    router.push("/calendario");
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
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
          <div className="loading-state">Cargando...</div>
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
              ← Volver al calendario
            </button>
            <div className="offer-status-badges">
              <span className={`status-badge ${offer.status.toLowerCase().replace(" ", "-")}`}>
                {offer.status}
              </span>
              {offer.isPremium && (
                <span className="premium-badge">
                  <span className="crown">👑</span> Premium
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
                  <span className="meta-label">Empresa</span>
                  <span className="meta-value company-name">{offer.companyName}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Departamento</span>
                  <span className="meta-value">{offer.departmentName}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Fecha</span>
                  <span className="meta-value">{new Date(offer.date).toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Tarifa</span>
                  <span className="meta-value amount">{offer.amount || "No especificada"}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Tipo</span>
                  <span className={`meta-value type-${offer.type.toLowerCase().replace(/\s+/g, "-")}`}>
                    {offer.type}
                  </span>
                </div>
              </div>

              <div className="offer-description">
                <h3>Descripción</h3>
                <p>{offer.description}</p>
              </div>

              {/* Owner Info */}
              <div className="owner-info">
                <h3>Publicado por</h3>
                <div className="owner-card">
                  <div className="owner-avatar">
                    {ownerInfo?.name.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div className="owner-details">
                    <span className="owner-name">
                      {offer.hideName ? "Usuario anónimo" : ownerInfo?.name}
                      {ownerInfo?.subscription !== "free" && (
                        <span className="owner-premium-badge">★</span>
                      )}
                    </span>
                    <span className="owner-role">
                      {isOwner ? "Tú eres el propietario" : "Propietario de la oferta"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Company Info */}
              {company && (
                <div className="company-info-box">
                  <h3>Información de la empresa</h3>
                  <div className="company-details">
                    <div className="company-detail-row">
                      <span className="detail-label">Código:</span>
                      <code className="company-code">{company.code}</code>
                    </div>
                    <div className="company-detail-row">
                      <span className="detail-label">Provincia:</span>
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
                  🗑️ Eliminar oferta
                </button>
              )}
            </div>

            {/* Right: Private Chat */}
            <div className="private-chat-section">
              <div className="chat-header">
                <div className="chat-header-main">
                  <div>
                    <h2>💬 Chat Privado</h2>
                    {isOwner ? (
                      <p className="chat-subtitle">
                        Gestiona tus conversaciones sobre esta oferta
                      </p>
                    ) : (
                      <p className="chat-subtitle">
                        Conversación privada con {ownerInfo?.name}
                      </p>
                    )}
                  </div>
                  {selectedChatUser && (
                    <button
                      className="delete-conv-button"
                      onClick={() => setShowDeleteConvConfirm(true)}
                      title="Eliminar conversación"
                    >
                      <TrashIcon />
                    </button>
                  )}
                </div>
              </div>

              {/* Chat List (for owner) */}
              {isOwner && offerConversations.length > 0 && (
                <div className="chat-list">
                  <h4>Conversaciones</h4>
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
                          <p>Aún no hay mensajes</p>
                          <span>Inicia la conversación con {selectedChatUser.name}</span>
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
                                          <button onClick={handleSaveEdit} className="edit-save">Guardar</button>
                                          <button onClick={handleCancelEdit} className="edit-cancel">Cancelar</button>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className={`message-bubble ${canEdit && remainingTime > 0 ? "editable" : ""}`}>
                                        <p className="message-text">{msg.text}</p>
                                        {msg.edited && (
                                          <span className="edited-label">(editado)</span>
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
                                        title={`Editar (${formatRemainingTime(remainingTime)})`}
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
                      <input
                        type="text"
                        placeholder={`Escribe un mensaje a ${selectedChatUser.name}...`}
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                        className="chat-input"
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!messageText.trim()}
                        className="chat-send-button"
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
                    <p>No hay conversaciones activas</p>
                    <span>Los interesados aparecerán aquí</span>
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
              <h3>¿Eliminar oferta?</h3>
              <p>Esta acción no se puede deshacer. La oferta y todas sus conversaciones se eliminarán permanentemente.</p>
              <div className="modal-actions">
                <button className="btn-secondary" onClick={() => setShowDeleteConfirm(false)}>
                  Cancelar
                </button>
                <button className="btn-danger" onClick={handleDelete}>
                  Sí, eliminar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Conversation Modal */}
        {showDeleteConvConfirm && selectedChatUser && (
          <div className="modal-overlay" onClick={() => setShowDeleteConvConfirm(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>¿Eliminar conversación?</h3>
              <p>Esta conversación se eliminará de tu lista. {selectedChatUser.name} seguirá viendo los mensajes hasta que también la elimine.</p>
              <div className="modal-actions">
                <button className="btn-secondary" onClick={() => setShowDeleteConvConfirm(false)}>
                  Cancelar
                </button>
                <button className="btn-danger" onClick={handleDeleteConversation}>
                  Sí, eliminar
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <style jsx>{`
        .offer-detail-page {
          max-width: 1400px;
          margin: 0 auto;
          padding: 24px;
        }

        .offer-detail-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .back-button {
          background: rgba(0, 0, 0, 0.05);
          border: none;
          padding: 10px 18px;
          border-radius: 20px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          color: #1d1d1f;
          transition: all 0.2s;
        }

        .back-button:hover {
          background: rgba(0, 0, 0, 0.1);
          transform: translateX(-2px);
        }

        .offer-status-badges {
          display: flex;
          gap: 10px;
        }

        .status-badge {
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .status-badge.publicado {
          background: #34c759;
          color: white;
        }

        .status-badge.en-negociación {
          background: #ff9500;
          color: white;
        }

        .status-badge.aceptado {
          background: #007aff;
          color: white;
        }

        .premium-badge {
          background: linear-gradient(135deg, #ffd700 0%, #ffb700 100%);
          color: #1d1d1f;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .crown {
          font-size: 12px;
        }

        .offer-detail-content {
          display: grid;
          grid-template-columns: 400px 1fr;
          gap: 24px;
          align-items: start;
        }

        @media (max-width: 1024px) {
          .offer-detail-content {
            grid-template-columns: 1fr;
          }
        }

        /* Offer Info Card */
        .offer-info-card {
          background: white;
          border-radius: 20px;
          padding: 28px;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
        }

        .offer-title {
          font-size: 24px;
          font-weight: 700;
          color: #1d1d1f;
          margin: 0 0 24px 0;
          line-height: 1.3;
        }

        .offer-meta {
          display: grid;
          gap: 16px;
          margin-bottom: 28px;
          padding-bottom: 24px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
        }

        .meta-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .meta-label {
          font-size: 14px;
          color: #86868b;
          font-weight: 500;
        }

        .meta-value {
          font-size: 14px;
          color: #1d1d1f;
          font-weight: 600;
        }

        .company-name {
          color: #007aff;
        }

        .amount {
          color: #34c759;
          font-size: 16px;
        }

        .type-alta-demanda {
          color: #ff9500;
        }

        .type-aceptación-rápida {
          color: #af52de;
        }

        .type-nueva {
          color: #007aff;
        }

        .offer-description {
          margin-bottom: 28px;
          padding-bottom: 24px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
        }

        .offer-description h3 {
          font-size: 14px;
          font-weight: 600;
          color: #86868b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin: 0 0 12px 0;
        }

        .offer-description p {
          font-size: 15px;
          line-height: 1.6;
          color: #1d1d1f;
          margin: 0;
        }

        /* Owner Info */
        .owner-info {
          margin-bottom: 24px;
        }

        .owner-info h3 {
          font-size: 14px;
          font-weight: 600;
          color: #86868b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin: 0 0 12px 0;
        }

        .owner-card {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px;
          background: rgba(0, 0, 0, 0.03);
          border-radius: 14px;
        }

        .owner-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, #007aff 0%, #5856d6 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          font-weight: 600;
        }

        .owner-details {
          display: flex;
          flex-direction: column;
        }

        .owner-name {
          font-size: 16px;
          font-weight: 600;
          color: #1d1d1f;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .owner-premium-badge {
          color: #ffd700;
          font-size: 14px;
        }

        .owner-role {
          font-size: 13px;
          color: #86868b;
        }

        /* Company Info */
        .company-info-box {
          background: rgba(0, 122, 255, 0.05);
          border-radius: 14px;
          padding: 16px;
          margin-bottom: 20px;
        }

        .company-info-box h3 {
          font-size: 13px;
          font-weight: 600;
          color: #007aff;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin: 0 0 12px 0;
        }

        .company-details {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .company-detail-row {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
        }

        .detail-label {
          color: #86868b;
        }

        .company-code {
          background: rgba(0, 0, 0, 0.05);
          padding: 2px 8px;
          border-radius: 4px;
          font-family: monospace;
          font-size: 13px;
          color: #1d1d1f;
        }

        /* Delete Button */
        .delete-offer-button {
          width: 100%;
          padding: 14px;
          background: rgba(255, 59, 48, 0.1);
          color: #ff3b30;
          border: none;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .delete-offer-button:hover {
          background: rgba(255, 59, 48, 0.2);
        }

        /* Private Chat Section */
        .private-chat-section {
          background: white;
          border-radius: 20px;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
          display: flex;
          flex-direction: column;
          height: 700px;
        }

        .chat-header {
          padding: 20px 24px 16px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
        }

        .chat-header-main {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .chat-header h2 {
          font-size: 18px;
          font-weight: 700;
          color: #1d1d1f;
          margin: 0 0 4px 0;
        }

        .chat-subtitle {
          font-size: 14px;
          color: #86868b;
          margin: 0;
        }

        .delete-conv-button {
          background: rgba(255, 59, 48, 0.1);
          color: #ff3b30;
          border: none;
          width: 36px;
          height: 36px;
          border-radius: 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .delete-conv-button:hover {
          background: rgba(255, 59, 48, 0.2);
        }

        /* Chat List (for owner) */
        .chat-list {
          padding: 16px 24px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
          background: rgba(0, 0, 0, 0.02);
        }

        .chat-list h4 {
          font-size: 12px;
          font-weight: 600;
          color: #86868b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin: 0 0 12px 0;
        }

        .chat-list-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border-radius: 12px;
          border: none;
          background: white;
          width: 100%;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
          margin-bottom: 8px;
        }

        .chat-list-item:hover,
        .chat-list-item.active {
          background: rgba(0, 122, 255, 0.1);
        }

        .chat-list-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #007aff 0%, #5856d6 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-weight: 600;
          flex-shrink: 0;
        }

        .chat-list-info {
          flex: 1;
          min-width: 0;
        }

        .chat-list-name {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #1d1d1f;
          margin-bottom: 2px;
        }

        .chat-list-preview {
          display: block;
          font-size: 13px;
          color: #86868b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .chat-list-badge {
          background: #ff3b30;
          color: white;
          font-size: 12px;
          font-weight: 600;
          min-width: 20px;
          height: 20px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 6px;
        }

        /* Chat Container */
        .chat-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 0;
        }

        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 20px 24px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .chat-empty {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #86868b;
          padding: 40px;
        }

        .empty-icon {
          font-size: 48px;
          margin-bottom: 16px;
          opacity: 0.5;
        }

        .chat-empty p {
          font-size: 16px;
          font-weight: 600;
          color: #1d1d1f;
          margin: 0 0 8px 0;
        }

        .chat-empty span {
          font-size: 14px;
          color: #86868b;
        }

        /* Message Date Divider */
        .message-date-divider {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 16px 0;
        }

        .message-date-divider span {
          font-size: 12px;
          color: #86868b;
          background: rgba(0, 0, 0, 0.05);
          padding: 4px 12px;
          border-radius: 12px;
        }

        /* Message Bubbles */
        .message {
          display: flex;
          gap: 10px;
          margin-bottom: 4px;
          max-width: 80%;
          position: relative;
        }

        .message.sent {
          align-self: flex-end;
          flex-direction: row-reverse;
        }

        .message.received {
          align-self: flex-start;
        }

        .message-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #5856d6 0%, #af52de 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 600;
          flex-shrink: 0;
          align-self: flex-end;
        }

        .message-content {
          display: flex;
          flex-direction: column;
          gap: 2px;
          position: relative;
        }

        .message.sent .message-content {
          align-items: flex-end;
        }

        .message.received .message-content {
          align-items: flex-start;
        }

        .message-bubble {
          padding: 12px 16px;
          border-radius: 18px;
          max-width: 100%;
          word-wrap: break-word;
          position: relative;
        }

        .message-bubble.editable {
          padding-right: 40px;
        }

        .message.sent .message-bubble {
          background: #007aff;
          color: white;
          border-bottom-right-radius: 4px;
        }

        .message.received .message-bubble {
          background: #f2f2f7;
          color: #1d1d1f;
          border-bottom-left-radius: 4px;
        }

        .message-text {
          margin: 0;
          font-size: 15px;
          line-height: 1.4;
        }

        .edited-label {
          font-size: 11px;
          opacity: 0.7;
          margin-left: 6px;
          font-style: italic;
        }

        .message-meta {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          color: #86868b;
          padding: 0 4px;
        }

        .message.sent .message-meta {
          justify-content: flex-end;
        }

        .message-status {
          display: flex;
          align-items: center;
        }

        /* Edit Button */
        .edit-button {
          position: absolute;
          right: -24px;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(0, 0, 0, 0.1);
          border: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: all 0.2s;
          color: #86868b;
          flex-direction: column;
          padding: 2px;
        }

        .message.sent:hover .edit-button {
          opacity: 1;
        }

        .edit-button:hover {
          background: rgba(0, 122, 255, 0.2);
          color: #007aff;
        }

        .edit-button span {
          font-size: 8px;
          margin-top: -2px;
        }

        /* Edit Box */
        .edit-box {
          background: white;
          border: 2px solid #007aff;
          border-radius: 12px;
          padding: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .edit-input {
          width: 100%;
          border: none;
          outline: none;
          font-size: 15px;
          padding: 4px;
          margin-bottom: 8px;
        }

        .edit-actions {
          display: flex;
          gap: 8px;
          justify-content: flex-end;
        }

        .edit-save,
        .edit-cancel {
          padding: 6px 12px;
          border: none;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .edit-save {
          background: #007aff;
          color: white;
        }

        .edit-save:hover {
          background: #0051d5;
        }

        .edit-cancel {
          background: rgba(0, 0, 0, 0.1);
          color: #1d1d1f;
        }

        .edit-cancel:hover {
          background: rgba(0, 0, 0, 0.15);
        }

        /* Chat Input */
        .chat-input-area {
          padding: 16px 24px 24px;
          border-top: 1px solid rgba(0, 0, 0, 0.06);
          display: flex;
          gap: 12px;
        }

        .chat-input {
          flex: 1;
          padding: 12px 18px;
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: 24px;
          font-size: 15px;
          outline: none;
          transition: all 0.2s;
        }

        .chat-input:focus {
          border-color: #007aff;
          box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
        }

        .chat-send-button {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #007aff;
          color: white;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .chat-send-button:hover:not(:disabled) {
          background: #0051d5;
          transform: scale(1.05);
        }

        .chat-send-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-content {
          background: white;
          border-radius: 20px;
          padding: 28px;
          max-width: 400px;
          width: 100%;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
        }

        .modal-content h3 {
          font-size: 20px;
          font-weight: 700;
          color: #1d1d1f;
          margin: 0 0 12px 0;
        }

        .modal-content p {
          font-size: 15px;
          color: #86868b;
          line-height: 1.5;
          margin: 0 0 24px 0;
        }

        .modal-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }

        .btn-secondary {
          padding: 12px 20px;
          background: rgba(0, 0, 0, 0.05);
          color: #1d1d1f;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-secondary:hover {
          background: rgba(0, 0, 0, 0.1);
        }

        .btn-danger {
          padding: 12px 20px;
          background: #ff3b30;
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-danger:hover {
          background: #d70015;
        }

        .loading-state {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 50vh;
          font-size: 16px;
          color: #86868b;
        }
      `}</style>
    </div>
  );
}
