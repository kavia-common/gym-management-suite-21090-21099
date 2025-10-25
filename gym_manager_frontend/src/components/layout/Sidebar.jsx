import React from "react";
import logo from "../../assets/logo.svg";
import Badge from "../common/Badge";

/**
 * PUBLIC_INTERFACE
 * Sidebar navigation with modules.
 */
export default function Sidebar() {
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
        width: 260,
        minWidth: 220,
        background: "var(--color-surface)",
        borderRight: "1px solid var(--color-border)",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        position: "sticky",
        top: 0,
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
        {items.map((item) => (
          <button
            key={item.key}
            className="btn"
            style={{
              width: "100%",
              justifyContent: "flex-start",
              background: "transparent",
              color: "var(--color-text)",
              border: "none",
              borderBottom: "1px solid var(--color-border)",
              borderRadius: 0,
              padding: "12px 16px",
            }}
            onClick={() => {
              // Placeholder interaction; routing not implemented yet
              // eslint-disable-next-line no-console
              console.log("Navigate to", item.key);
            }}
          >
            <span style={{ fontSize: 18 }}>{item.emoji}</span>
            <span style={{ marginLeft: 10 }}>{item.label}</span>
          </button>
        ))}
      </nav>
      <div style={{ marginTop: "auto", padding: 16, borderTop: "1px solid var(--color-border)" }}>
        <div className="text-muted" style={{ fontSize: 12 }}>
          © {new Date().getFullYear()} GymCo
        </div>
      </div>
    </aside>
  );
}
