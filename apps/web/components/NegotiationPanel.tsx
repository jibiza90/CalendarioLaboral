"use client";

import { useState, useRef, useEffect } from "react";
import type { AppNegotiationMessage } from "../contexts/AppContext";
import { formatRelativeTime, getInitials } from "../lib/utils";

interface NegotiationPanelProps {
  offerId: string;
  offerTitle: string;
  messages: AppNegotiationMessage[];
  onSend: (text: string) => void;
  isAuthenticated: boolean;
}

export function NegotiationPanel({
  offerTitle,
  messages,
  onSend,
  isAuthenticated,
}: NegotiationPanelProps) {
  const [text, setText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="card" style={{ height: "100%", display: "flex", flexDirection: "column", maxHeight: "700px" }}>
      {/* Header */}
      <div style={{ 
        padding: "20px", 
        borderBottom: "1px solid #e5e7eb",
        background: "#f9fafb",
        borderRadius: "12px 12px 0 0"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
          <div style={{
            width: "40px",
            height: "40px",
            borderRadius: "10px",
            background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
            display: "grid",
            placeItems: "center",
            fontSize: "20px"
          }}>
            💬
          </div>
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: 700 }}>Chat de negociación</h3>
            <p style={{ fontSize: "13px", color: "#6b7280", marginTop: "2px" }}>Habla directamente con {offerTitle.slice(0, 30)}...</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ 
        flex: 1, 
        overflowY: "auto", 
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "16px"
      }}>
        {messages.length === 0 ? (
          <div style={{ 
            textAlign: "center", 
            padding: "40px 20px",
            color: "#9ca3af"
          }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>💬</div>
            <p style={{ fontSize: "15px", fontWeight: 500, color: "#4b5563", marginBottom: "4px" }}>
              No hay mensajes todavía
            </p>
            <p style={{ fontSize: "13px" }}>
              Sé el primero en iniciar la conversación
            </p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isOwner = msg.role === "owner";
            const showAvatar = index === 0 || messages[index - 1].author !== msg.author;
            
            return (
              <div
                key={msg.id}
                style={{
                  display: "flex",
                  gap: "10px",
                  alignSelf: isOwner ? "flex-end" : "flex-start",
                  flexDirection: isOwner ? "row-reverse" : "row",
                  maxWidth: "85%",
                }}
              >
                {showAvatar ? (
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      background: isOwner ? "linear-gradient(135deg, #4f46e5, #7c3aed)" : "#e5e7eb",
                      color: isOwner ? "white" : "#374151",
                      display: "grid",
                      placeItems: "center",
                      fontSize: "13px",
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {getInitials(msg.author)}
                  </div>
                ) : (
                  <div style={{ width: "36px", flexShrink: 0 }} />
                )}
                
                <div style={{ maxWidth: "calc(100% - 46px)" }}>
                  {showAvatar && (
                    <div style={{ 
                      fontSize: "12px", 
                      color: "#9ca3af", 
                      marginBottom: "4px",
                      textAlign: isOwner ? "right" : "left",
                      paddingLeft: isOwner ? 0 : "4px",
                      paddingRight: isOwner ? "4px" : 0
                    }}>
                      {msg.author} • {formatRelativeTime(msg.createdAt)}
                    </div>
                  )}
                  <div
                    style={{
                      padding: "12px 16px",
                      borderRadius: isOwner ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                      background: isOwner ? "#4f46e5" : "white",
                      color: isOwner ? "white" : "#1f2937",
                      fontSize: "14px",
                      lineHeight: 1.5,
                      boxShadow: isOwner ? "none" : "0 1px 2px rgba(0,0,0,0.05)",
                      border: isOwner ? "none" : "1px solid #e5e7eb",
                      wordBreak: "break-word"
                    }}
                  >
                    {msg.text}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      {isAuthenticated ? (
        <div style={{ 
          padding: "16px 20px", 
          borderTop: "1px solid #e5e7eb",
          background: "#f9fafb",
          borderRadius: "0 0 12px 12px"
        }}>
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              type="text"
              placeholder="Escribe tu mensaje..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{
                flex: 1,
                padding: "12px 16px",
                border: "1px solid #d1d5db",
                borderRadius: "10px",
                fontSize: "14px",
                outline: "none",
                transition: "all 0.2s"
              }}
              onFocus={(e) => e.target.style.borderColor = "#4f46e5"}
              onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
            />
            <button 
              className="btn btn-primary"
              onClick={handleSend}
              disabled={!text.trim()}
              style={{ padding: "12px 20px" }}
            >
              Enviar
            </button>
          </div>
          <p style={{ fontSize: "12px", color: "#9ca3af", marginTop: "8px", textAlign: "center" }}>
            Presiona Enter para enviar rápidamente
          </p>
        </div>
      ) : (
        <div style={{ 
          padding: "20px", 
          borderTop: "1px solid #e5e7eb",
          background: "#f9fafb",
          borderRadius: "0 0 12px 12px",
          textAlign: "center"
        }}>
          <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "12px" }}>
            Inicia sesión para participar en la negociación
          </p>
          <button className="btn btn-primary btn-sm">
            Iniciar sesión
          </button>
        </div>
      )}
    </div>
  );
}
