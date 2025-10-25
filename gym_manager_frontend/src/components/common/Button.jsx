import React from "react";

/**
 * PUBLIC_INTERFACE
 * Button component with variants and sizes following Ocean Professional theme.
 */
export default function Button({
  children,
  variant = "primary", // primary | secondary | ghost | danger
  size = "md", // sm | md | lg
  fullWidth = false,
  onClick,
  type = "button",
  disabled = false,
  ariaLabel,
}) {
  const base = "btn";
  const sizeClass =
    size === "sm"
      ? { padding: "8px 12px", fontSize: "0.875rem" }
      : size === "lg"
      ? { padding: "12px 16px", fontSize: "1rem" }
      : { padding: "10px 14px", fontSize: "0.95rem" };

  const styles = {
    primary: {
      background: "var(--color-primary)",
      color: "#fff",
      borderColor: "var(--color-primary)",
    },
    secondary: {
      background: "var(--color-secondary)",
      color: "#111827",
      borderColor: "var(--color-secondary)",
    },
    ghost: {
      background: "transparent",
      color: "var(--color-text)",
      borderColor: "var(--color-border)",
    },
    danger: {
      background: "var(--color-error)",
      color: "#fff",
      borderColor: "var(--color-error)",
    },
  }[variant];

  const hoverStyles =
    variant === "ghost"
      ? { background: "#f3f4f6" }
      : variant === "secondary"
      ? { filter: "brightness(0.95)" }
      : { filter: "brightness(0.97)" };

  return (
    <button
      type={type}
      className={base}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      style={{
        ...sizeClass,
        ...styles,
        width: fullWidth ? "100%" : "auto",
        boxShadow: "var(--shadow-sm)",
      }}
      onMouseEnter={(e) => {
        Object.assign(e.currentTarget.style, hoverStyles);
      }}
      onMouseLeave={(e) => {
        Object.assign(e.currentTarget.style, styles);
      }}
    >
      {children}
    </button>
  );
}
