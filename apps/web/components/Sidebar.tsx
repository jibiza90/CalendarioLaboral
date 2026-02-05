"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useApp } from "../contexts/AppContext";
import { useI18n } from "../contexts/I18nContext";

export function Sidebar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout, getUnreadMessageCount } = useApp();
  const unreadCount = getUnreadMessageCount();
  const { t, lang, setLang, available } = useI18n();

  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("cl_theme") : null;
    const initialTheme = saved === "dark" ? "dark" : "light";
    setTheme(initialTheme);
    document.documentElement.setAttribute("data-theme", initialTheme);
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("cl_theme", next);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Link href="/calendario" className="brand">
          <div className="brand-icon">CL</div>
          <span>{t("nav.brand")}</span>
        </Link>
      </div>

      <nav className="sidebar-nav">
        <Link
          href="/calendario"
          className={`nav-item ${pathname === "/calendario" ? "active" : ""}`}
        >
          <span>📅</span>
          <span>{t("nav.calendar")}</span>
        </Link>
        <Link
          href="/mensajes"
          className={`nav-item ${pathname.startsWith("/mensajes") || pathname.startsWith("/ofertas") ? "active" : ""}`}
        >
          <span>💬</span>
          <span>{t("nav.messages")}</span>
          {unreadCount > 0 && (
            <span className="nav-badge">{unreadCount > 99 ? "99+" : unreadCount}</span>
          )}
        </Link>
        <Link
          href="/perfil"
          className={`nav-item ${pathname === "/perfil" ? "active" : ""}`}
        >
          <span>👤</span>
          <span>{t("nav.profile")}</span>
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
                {user.subscription ? t(`profile.plan.${user.subscription}.name`) : t("profile.plan.free.name")}
              </div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={logout}>
              {t("auth.logout")}
            </button>
          </div>
        ) : (
          <Link href="/login" className="btn btn-primary" style={{ width: "100%" }}>
            {t("nav.login")}
          </Link>
        )}
        <div style={{ display: "grid", gap: "8px", marginTop: "10px" }}>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value as any)}
            className="form-input"
            style={{ width: "100%" }}
          >
            {available.map((loc) => (
              <option key={loc} value={loc}>
                {loc.toUpperCase()}
              </option>
            ))}
          </select>
          <button className="btn btn-secondary" style={{ width: "100%" }} onClick={toggleTheme}>
            {theme === "light" ? t("theme.dark") : t("theme.light")}
          </button>
        </div>
      </div>
    </aside>
  );
}
