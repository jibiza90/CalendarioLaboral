"use client";

import { useApp } from "../../contexts/AppContext";
import { useI18n } from "../../contexts/I18nContext";

export function ToastContainer() {
  const { toasts, removeToast } = useApp();
  const { t } = useI18n();
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map(toastItem => (
        <div key={toastItem.id} className="toast">
          <div className="toast-icon">✓</div>
          <div className="toast-content">
            <div className="toast-title">{toastItem.type === "success" ? t("toast.success") : t("toast.info")}</div>
            <div className="toast-message">{toastItem.message}</div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => removeToast(toastItem.id)} aria-label={t("toast.close")}>
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
