"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "../../contexts/AppContext";
import { Sidebar } from "../../components/Sidebar";
import Link from "next/link";

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
  const { user, isAuthenticated, getUserConversations, deleteConversation, restoreConversation, getDeletedConversations, getOfferById } = useApp();
  const router = useRouter();
  const [showDeleted, setShowDeleted] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{ offerId: string; otherUserId: string; otherUserName: string } | null>(null);
  
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
      return date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
    } else if (days === 1) {
      return "Ayer";
    } else if (days < 7) {
      return date.toLocaleDateString("es-ES", { weekday: "long" });
    } else {
      return date.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
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
    const relatedMsg = useApp().privateMessages.find(
      m => m.offerId === dc.offerId && 
      (m.senderId === dc.otherUserId || m.receiverId === dc.otherUserId)
    );
    const otherUserName = relatedMsg?.senderId === dc.otherUserId 
      ? relatedMsg.senderName 
      : relatedMsg?.receiverName || "Usuario";
    
    return {
      ...dc,
      offerTitle: offer?.title || "Oferta no disponible",
      otherUserName,
    };
  });

  if (!user) {
    return (
      <div className="page-container">
        <Sidebar />
        <main className="main-content">
          <div className="loading-state">Cargando...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Sidebar />
      <main className="main-content">
        <div className="messages-page">
          <div className="page-header">
            <div>
              <h1 className="page-title">Mensajes</h1>
              <p className="page-subtitle">Tus conversaciones privadas y notificaciones internas</p>
            </div>
            {deletedConversationsInfo.length > 0 && (
              <button 
                className="toggle-deleted-btn"
                onClick={() => setShowDeleted(!showDeleted)}
              >
                {showDeleted ? "Ocultar eliminadas" : `Ver eliminadas (${deletedConversationsInfo.length})`}
              </button>
            )}
          </div>

          {showDeleted && deletedConversationsInfo.length > 0 && (
            <div className="deleted-section">
              <h3>Conversaciones eliminadas</h3>
              <div className="conversations-list deleted">
                {deletedConversationsInfo.map((dc) => (
                  <div key={`${dc.offerId}-${dc.otherUserId}`} className="conversation-card deleted">
                    <div className="conversation-avatar deleted">{dc.otherUserName.charAt(0).toUpperCase()}</div>
                    <div className="conversation-content">
                      <div className="conversation-header">
                        <div className="conversation-names">
                          <span className="other-user-name">{dc.otherUserName}</span>
                          <span className="offer-title">{dc.offerTitle}</span>
                        </div>
                      </div>
                      <div className="conversation-actions">
                        <button 
                          className="restore-btn"
                          onClick={() => handleRestore(dc.offerId, dc.otherUserId)}
                        >
                          <RestoreIcon />
                          Restaurar conversación
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {conversations.length === 0 && !showDeleted ? (
            <div className="empty-state">
              <div className="empty-icon">💬</div>
              <h2>No tienes mensajes</h2>
              <p>Cuando te comuniques con otros usuarios sobre una oferta, tus conversaciones aparecerán aquí.</p>
              <Link href="/calendario" className="btn-primary">
                Explorar ofertas
              </Link>
            </div>
          ) : (
            <div className="conversations-list">
              {conversations.map((conv) => (
                <div key={`${conv.offerId}-${conv.otherUser.id}`} className="conversation-card-wrapper">
                  <Link
                    href={`/ofertas/${conv.offerId}`}
                    className="conversation-card"
                  >
                    <div className="conversation-avatar">
                      {conv.otherUser.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="conversation-content">
                      <div className="conversation-header">
                        <div className="conversation-names">
                          <span className="other-user-name">{conv.otherUser.name}</span>
                          <span className="offer-title">{conv.offerTitle}</span>
                        </div>
                        <span className="conversation-time">{formatDate(conv.lastMessage.createdAt)}</span>
                      </div>
                      <div className="conversation-preview">
                        <p className={conv.unreadCount > 0 ? "unread" : ""}>
                          {conv.lastMessage.senderId === user.id ? (
                            <span className="you-prefix">Tú: </span>
                          ) : null}
                          {conv.lastMessage.text}
                        </p>
                        {conv.unreadCount > 0 && (
                          <span className="unread-badge">{conv.unreadCount}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                  <button 
                    className="delete-conv-btn"
                    onClick={() => setConfirmDelete({ 
                      offerId: conv.offerId, 
                      otherUserId: conv.otherUser.id,
                      otherUserName: conv.otherUser.name 
                    })}
                    title="Eliminar conversación"
                  >
                    <TrashIcon />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {confirmDelete && (
          <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>¿Eliminar conversación?</h3>
              <p>
                Esta conversación con <strong>{confirmDelete.otherUserName}</strong> se eliminará de tu lista.
                El otro usuario seguirá viendo los mensajes hasta que también la elimine.
              </p>
              <div className="modal-actions">
                <button className="btn btn-secondary" onClick={() => setConfirmDelete(null)}>
                  Cancelar
                </button>
                <button 
                  className="btn btn-danger" 
                  onClick={() => handleDelete(confirmDelete.offerId, confirmDelete.otherUserId)}
                >
                  Sí, eliminar
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
