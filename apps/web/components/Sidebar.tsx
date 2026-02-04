"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "../contexts/AppContext";

export function Sidebar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout, getUnreadMessageCount } = useApp();
  const unreadCount = getUnreadMessageCount();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Link href="/calendario" className="brand">
          <div className="brand-icon">CL</div>
          <span>Calendario Laboral</span>
        </Link>
      </div>

      <nav className="sidebar-nav">
        <Link
          href="/calendario"
          className={`nav-item ${pathname === "/calendario" ? "active" : ""}`}
        >
          <span>📅</span>
          <span>Calendario</span>
        </Link>
        <Link
          href="/mensajes"
          className={`nav-item ${pathname.startsWith("/mensajes") || pathname.startsWith("/ofertas") ? "active" : ""}`}
        >
          <span>💬</span>
          <span>Mensajes</span>
          {unreadCount > 0 && (
            <span className="nav-badge">{unreadCount > 99 ? "99+" : unreadCount}</span>
          )}
        </Link>
        <Link
          href="/perfil"
          className={`nav-item ${pathname === "/perfil" ? "active" : ""}`}
        >
          <span>👤</span>
          <span>Perfil</span>
        </Link>
      </nav>

      <div className="sidebar-footer">
        {isAuthenticated && user ? (
          <div className="user-card">
            <div className="user-avatar">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: "14px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {user.name}
              </div>
              <div style={{ fontSize: "12px", color: "#6b7280" }}>
                {user.subscription === "pro" || user.subscription === "business" ? "⭐ " : ""}
                {user.subscription || "free"}
              </div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={logout}>
              Salir
            </button>
          </div>
        ) : (
          <Link href="/login" className="btn btn-primary" style={{ width: "100%" }}>
            Iniciar sesión
          </Link>
        )}
      </div>
    </aside>
  );
}
