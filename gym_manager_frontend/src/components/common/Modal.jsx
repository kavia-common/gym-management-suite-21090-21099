import React, { useEffect } from "react";
import Button from "./Button";

/**
 * PUBLIC_INTERFACE
 * Accessible modal dialog with backdrop.
 */
export default function Modal({ open, onClose, title, children, actions }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape" && open) onClose?.();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={title || "Dialog"}>
      <div className="modal-panel">
        <div style={{ padding: 16, borderBottom: "1px solid var(--color-border)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h3 style={{ margin: 0 }}>{title}</h3>
            <Button ariaLabel="Close dialog" variant="ghost" onClick={onClose}>
              ✕
            </Button>
          </div>
        </div>
        <div style={{ padding: 16 }}>{children}</div>
        <div
          style={{
            padding: 12,
            borderTop: "1px solid var(--color-border)",
            display: "flex",
            gap: 8,
            justifyContent: "flex-end",
          }}
        >
          {actions}
        </div>
      </div>
    </div>
  );
}
