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
          <div className="messages-header">
            <div>
              <h1>💬 Mensajes</h1>
              <p>Tus conversaciones privadas con otros usuarios</p>
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
                <button className="btn-secondary" onClick={() => setConfirmDelete(null)}>
                  Cancelar
                </button>
                <button 
                  className="btn-danger" 
                  onClick={() => handleDelete(confirmDelete.offerId, confirmDelete.otherUserId)}
                >
                  Sí, eliminar
                </button>
              </div>
            </div>
          </div>
        )}

        <style jsx>{`
          .messages-page {
            max-width: 800px;
            margin: 0 auto;
            padding: 24px;
          }

          .messages-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 32px;
            flex-wrap: wrap;
            gap: 16px;
          }

          .messages-header h1 {
            font-size: 32px;
            font-weight: 700;
            color: #1d1d1f;
            margin: 0 0 8px 0;
          }

          .messages-header p {
            font-size: 16px;
            color: #86868b;
            margin: 0;
          }

          .toggle-deleted-btn {
            padding: 10px 18px;
            background: rgba(0, 0, 0, 0.05);
            border: none;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 500;
            color: #1d1d1f;
            cursor: pointer;
            transition: all 0.2s;
          }

          .toggle-deleted-btn:hover {
            background: rgba(0, 0, 0, 0.1);
          }

          .deleted-section {
            margin-bottom: 32px;
            padding: 20px;
            background: rgba(0, 0, 0, 0.02);
            border-radius: 16px;
          }

          .deleted-section h3 {
            font-size: 14px;
            font-weight: 600;
            color: #86868b;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin: 0 0 16px 0;
          }

          .empty-state {
            background: white;
            border-radius: 20px;
            padding: 60px 40px;
            text-align: center;
            box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
          }

          .empty-icon {
            font-size: 64px;
            margin-bottom: 24px;
            opacity: 0.5;
          }

          .empty-state h2 {
            font-size: 22px;
            font-weight: 700;
            color: #1d1d1f;
            margin: 0 0 12px 0;
          }

          .empty-state p {
            font-size: 15px;
            color: #86868b;
            margin: 0 0 24px 0;
            line-height: 1.5;
          }

          .btn-primary {
            display: inline-block;
            padding: 14px 28px;
            background: #007aff;
            color: white;
            text-decoration: none;
            border-radius: 12px;
            font-size: 15px;
            font-weight: 600;
            transition: all 0.2s;
          }

          .btn-primary:hover {
            background: #0051d5;
            transform: translateY(-1px);
          }

          .conversations-list {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }

          .conversation-card-wrapper {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .conversation-card {
            flex: 1;
            display: flex;
            gap: 16px;
            padding: 20px;
            background: white;
            border-radius: 16px;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
            text-decoration: none;
            transition: all 0.2s;
            border: 2px solid transparent;
          }

          .conversation-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            border-color: rgba(0, 122, 255, 0.2);
          }

          .conversation-card.deleted {
            opacity: 0.7;
            background: rgba(0, 0, 0, 0.03);
          }

          .conversation-avatar {
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background: linear-gradient(135deg, #007aff 0%, #5856d6 100%);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 22px;
            font-weight: 600;
            flex-shrink: 0;
          }

          .conversation-avatar.deleted {
            background: linear-gradient(135deg, #86868b 0%, #636366 100%);
          }

          .conversation-content {
            flex: 1;
            min-width: 0;
            display: flex;
            flex-direction: column;
            gap: 6px;
          }

          .conversation-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 12px;
          }

          .conversation-names {
            display: flex;
            flex-direction: column;
            gap: 2px;
            min-width: 0;
          }

          .other-user-name {
            font-size: 16px;
            font-weight: 600;
            color: #1d1d1f;
          }

          .offer-title {
            font-size: 13px;
            color: #86868b;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .conversation-time {
            font-size: 13px;
            color: #86868b;
            flex-shrink: 0;
          }

          .conversation-preview {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .conversation-preview p {
            flex: 1;
            margin: 0;
            font-size: 15px;
            color: #86868b;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .conversation-preview p.unread {
            color: #1d1d1f;
            font-weight: 600;
          }

          .you-prefix {
            color: #86868b;
            font-weight: 400;
          }

          .unread-badge {
            background: #ff3b30;
            color: white;
            font-size: 12px;
            font-weight: 600;
            min-width: 22px;
            height: 22px;
            border-radius: 11px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0 7px;
            flex-shrink: 0;
          }

          .delete-conv-btn {
            padding: 16px;
            background: rgba(255, 59, 48, 0.1);
            border: none;
            border-radius: 12px;
            color: #ff3b30;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
            opacity: 0;
          }

          .conversation-card-wrapper:hover .delete-conv-btn {
            opacity: 1;
          }

          .delete-conv-btn:hover {
            background: rgba(255, 59, 48, 0.2);
          }

          .conversation-actions {
            display: flex;
            gap: 12px;
            margin-top: 8px;
          }

          .restore-btn {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 8px 14px;
            background: #007aff;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
          }

          .restore-btn:hover {
            background: #0051d5;
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

          .modal-content strong {
            color: #1d1d1f;
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
      </main>
    </div>
  );
}
