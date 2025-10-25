import React from "react";

/**
 * PUBLIC_INTERFACE
 * Text input with label and error state.
 */
export default function Input({
  id,
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  error,
  helperText,
  ...props
}) {
  return (
    <div style={{ width: "100%" }}>
      {label && (
        <label
          htmlFor={id}
          style={{
            display: "block",
            marginBottom: 6,
            fontWeight: 600,
            color: "var(--color-text)",
            fontSize: "0.92rem",
          }}
        >
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        className="input-base"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        aria-invalid={!!error}
        aria-describedby={helperText ? `${id}-helper` : undefined}
        style={{
          borderColor: error ? "var(--color-error)" : "var(--color-border)",
        }}
        {...props}
      />
      {helperText && (
        <div
          id={`${id}-helper`}
          className="text-muted"
          style={{ marginTop: 6, fontSize: "0.85rem", color: error ? "var(--color-error)" : "var(--color-text-muted)" }}
        >
          {helperText}
        </div>
      )}
    </div>
  );
}
