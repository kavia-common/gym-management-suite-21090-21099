import React from "react";

/**
 * PUBLIC_INTERFACE
 * Badge component for statuses and counts.
 */
export default function Badge({ children, tone = "neutral" }) {
  const tones = {
    neutral: { bg: "#F3F4F6", color: "#374151", border: "#E5E7EB" },
    info: { bg: "rgba(37, 99, 235, 0.12)", color: "#1D4ED8", border: "rgba(37,99,235,0.25)" },
    success: { bg: "rgba(34,197,94,0.12)", color: "#065F46", border: "rgba(34,197,94,0.25)" },
    warning: { bg: "rgba(245,158,11,0.12)", color: "#92400E", border: "rgba(245,158,11,0.25)" },
    danger: { bg: "rgba(239,68,68,0.12)", color: "#7F1D1D", border: "rgba(239,68,68,0.25)" },
  };
  const s = tones[tone] || tones.neutral;

  return (
    <span
      style={{
        display: "inline-block",
        padding: "4px 8px",
        fontSize: "0.8rem",
        borderRadius: "999px",
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
        fontWeight: 600,
      }}
    >
      {children}
    </span>
  );
}
