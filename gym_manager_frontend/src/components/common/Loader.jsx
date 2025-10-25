import React from "react";

/**
 * PUBLIC_INTERFACE
 * Inline spinner loader with optional label.
 */
export default function Loader({ label = "Loading..." }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
      <div className="spinner" aria-hidden="true" />
      <span className="text-muted">{label}</span>
    </div>
  );
}
