"use client";

import { useApp } from "../../contexts/AppContext";

export function ToastContainer() {
  const { toasts, removeToast } = useApp();
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className="toast">
          <div className="toast-icon">✓</div>
          <div className="toast-content">
            <div className="toast-title">{t.type === "success" ? "Exito" : t.type}</div>
            <div className="toast-message">{t.message}</div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => removeToast(t.id)}>✕</button>
        </div>
      ))}
    </div>
  );
}
