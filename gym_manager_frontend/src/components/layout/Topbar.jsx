import React from "react";
import Button from "../common/Button";

/**
 * PUBLIC_INTERFACE
 * Topbar with search, notifications and user menu placeholder.
 */
export default function Topbar() {
  return (
    <header
      className="app-gradient"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        borderBottom: "1px solid var(--color-border)",
        background: "var(--color-surface)", /* ensure solid background over gradient on scroll */
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "12px 0",
        }}
      >
        <div className="hide-mobile" style={{ fontWeight: 700, fontSize: "1.1rem" }}>
          Dashboard
        </div>
        <div style={{ flex: 1 }}>
          <input
            className="input-base"
            placeholder="Search members, classes, trainers..."
            aria-label="Search"
          />
        </div>
        <Button variant="ghost" ariaLabel="Notifications">🔔</Button>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 10px",
            border: "1px solid var(--color-border)",
            borderRadius: "999px",
            background: "var(--color-surface)",
          }}
          role="button"
          aria-label="User menu"
        >
          <span role="img" aria-label="user">🧑</span>
          <span className="hide-mobile">Admin</span>
        </div>
      </div>
    </header>
  );
}
