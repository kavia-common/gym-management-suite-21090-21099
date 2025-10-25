import React from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo.svg";
import Badge from "../common/Badge";
import { useUIStore } from "../../store/uiStore";

/**
 * PUBLIC_INTERFACE
 * Sidebar navigation with modules.
 */
export default function Sidebar() {
  const location = useLocation();
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const items = [
    { key: "dashboard", label: "Dashboard", emoji: "📊" },
    { key: "memberships", label: "Memberships", emoji: "🎟️" },
    { key: "classes", label: "Classes", emoji: "🏋️" },
    { key: "trainers", label: "Trainers", emoji: "🧑‍🏫" },
    { key: "bookings", label: "Bookings", emoji: "🗓️" },
    { key: "settings", label: "Settings", emoji: "⚙️" },
  ];

  return (
    <aside
      aria-label="Sidebar"
      style={{
        width: sidebarOpen ? 260 : 0,
        minWidth: sidebarOpen ? 220 : 0,
        overflow: "hidden",
        background: "var(--color-surface)",
        borderRight: "1px solid var(--color-border)",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        position: "sticky",
        top: 0,
        transition: "width var(--transition), min-width var(--transition)",
      }}
    >
      <div
        style={{
          padding: 16,
          display: "flex",
          alignItems: "center",
          gap: 10,
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <img src={logo} width={28} height={28} alt="Gym Manager logo" />
        <div>
          <div style={{ fontWeight: 800 }}>Gym Manager</div>
          <div className="text-muted" style={{ fontSize: 12 }}>
            Ocean Professional
          </div>
        </div>
        <div style={{ marginLeft: "auto" }}>
          <Badge tone="info">v0.1</Badge>
        </div>
      </div>
      <nav aria-label="Primary">
        {items.map((item) => {
          const to = item.key === "dashboard" ? "/" : `/${item.key}`;
          const active = location.pathname === to;
          return (
            <Link
              key={item.key}
              to={to}
              className="btn"
              style={{
                width: "100%",
                justifyContent: "flex-start",
                background: active ? "rgba(37,99,235,0.08)" : "transparent",
                color: "var(--color-text)",
                border: "none",
                borderBottom: "1px solid var(--color-border)",
                borderRadius: 0,
                padding: "12px 16px",
              }}
            >
              <span style={{ fontSize: 18 }}>{item.emoji}</span>
              <span style={{ marginLeft: 10 }}>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div style={{ marginTop: "auto", padding: 16, borderTop: "1px solid var(--color-border)" }}>
        <div className="text-muted" style={{ fontSize: 12 }}>
          © {new Date().getFullYear()} GymCo
        </div>
      </div>
    </aside>
  );
}
