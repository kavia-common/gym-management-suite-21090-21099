import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import Badge from "../common/Badge";
import { useUIStore } from "../../store/uiStore";
import { useProfile } from "../../hooks/useProfile";

/**
 * PUBLIC_INTERFACE
 * Sidebar navigation with modules.
 */
export default function Sidebar() {
  const location = useLocation();
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const { data: profile } = useProfile(true);

  // Determine role and visibility
  const role = profile?.role || "member"; // 'admin' | 'trainer' | 'member'
  const baseItems = [
    { key: "dashboard", label: "Dashboard", emoji: "📊", roles: ["admin", "trainer", "member"] },
    { key: "memberships", label: "Memberships", emoji: "🎟️", roles: ["admin"] },
    { key: "classes", label: "Classes", emoji: "🏋️", roles: ["admin", "trainer"] },
    { key: "trainers", label: "Trainers", emoji: "🧑‍🏫", roles: ["admin"] },
    { key: "bookings", label: "Bookings", emoji: "🗓️", roles: ["admin"] },
    { key: "settings", label: "Settings", emoji: "⚙️", roles: ["admin", "trainer", "member"] },
  ];
  const portalItems = [
    { key: "portal/member", label: "Member Portal", emoji: "🧑‍💼", roles: ["member"] },
    { key: "portal/trainer", label: "Trainer Portal", emoji: "🏅", roles: ["trainer"] },
  ];

  const items = useMemo(() => {
    const allowed = (it) => it.roles.includes(role);
    return [...baseItems.filter(allowed), ...portalItems.filter(allowed)];
  }, [role]);

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
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background: "var(--color-primary)",
            color: "#fff",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
          }}
          aria-label="Gym Manager"
        >
          GM
        </div>
        <div>
          <div style={{ fontWeight: 800 }}>Gym Manager</div>
          <div className="text-muted" style={{ fontSize: 12 }}>
            Ocean Professional
          </div>
        </div>
        <div style={{ marginLeft: "auto" }}>
          <Badge tone="info">v0.2</Badge>
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
