"use client";

import type { NotificationPreferences } from "../types";

interface NotificationPreferencesCardProps {
  preferences: NotificationPreferences;
  onChange: (prefs: NotificationPreferences) => void;
}

export function NotificationPreferencesCard({
  preferences,
  onChange,
}: NotificationPreferencesCardProps) {
  const toggle = (key: keyof NotificationPreferences) => {
    onChange({ ...preferences, [key]: !preferences[key] });
  };

  const channels = [
    { key: "email" as const, label: "Email", description: "Recibe notificaciones en tu correo" },
    { key: "push" as const, label: "Push", description: "Notificaciones en el navegador" },
    { key: "inApp" as const, label: "In-app", description: "Notificaciones dentro de la app" },
  ];

  return (
    <div className="card" style={{ maxWidth: "600px" }}>
      <div className="card-header">
        <div>
          <h3 className="card-title">Notificaciones</h3>
          <p className="card-subtitle">Elige cómo quieres recibir alertas</p>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {channels.map((channel) => (
          <div
            key={channel.key}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px 20px",
              background: "var(--bg-tertiary)",
              borderRadius: "var(--radius-lg)",
            }}
          >
            <div>
              <div style={{ fontWeight: 500, marginBottom: "2px" }}>{channel.label}</div>
              <div style={{ fontSize: "13px", color: "var(--text-tertiary)" }}>{channel.description}</div>
            </div>
            <div
              className={`toggle-switch ${preferences[channel.key] ? "active" : ""}`}
              onClick={() => toggle(channel.key)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
