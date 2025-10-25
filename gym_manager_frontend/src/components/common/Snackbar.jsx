import React, { useEffect } from "react";

/**
 * PUBLIC_INTERFACE
 * Snackbar/toast notification.
 */
export default function Snackbar({ open, message, onClose, duration = 3000, tone = "info" }) {
  useEffect(() => {
    if (!open) return;
    const id = setTimeout(() => onClose?.(), duration);
    return () => clearTimeout(id);
  }, [open, duration, onClose]);

  if (!open) return null;

  const tones = {
    info: { borderColor: "rgba(37,99,235,0.25)" },
    success: { borderColor: "rgba(34,197,94,0.25)" },
    warning: { borderColor: "rgba(245,158,11,0.25)" },
    danger: { borderColor: "rgba(239,68,68,0.25)" },
  };

  return (
    <div className="snackbar" role="status" style={tones[tone] || tones.info}>
      {message}
    </div>
  );
}
