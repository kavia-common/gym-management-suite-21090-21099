import React from "react";

/**
 * PUBLIC_INTERFACE
 * Card surface with optional header and footer.
 */
export default function Card({ title, action, children, footer, style }) {
  return (
    <div className="card-surface shadow-hover" style={{ padding: 16, ...style }}>
      {(title || action) && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          {title && (
            <h3 style={{ margin: 0, fontSize: "1.05rem", color: "var(--color-text)" }}>
              {title}
            </h3>
          )}
          {action}
        </div>
      )}
      <div>{children}</div>
      {footer && <div style={{ marginTop: 12 }}>{footer}</div>}
    </div>
  );
}
