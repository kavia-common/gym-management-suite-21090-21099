import React from "react";

/**
 * PUBLIC_INTERFACE
 * Select dropdown with label and error state.
 */
export default function Select({
  id,
  label,
  value,
  onChange,
  options = [],
  placeholder = "Select...",
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
      <select
        id={id}
        className="input-base"
        value={value}
        onChange={onChange}
        aria-invalid={!!error}
        aria-describedby={helperText ? `${id}-helper` : undefined}
        style={{
          borderColor: error ? "var(--color-error)" : "var(--color-border)",
          appearance: "none",
          backgroundImage:
            "linear-gradient(45deg, transparent 50%, var(--color-text-muted) 50%), linear-gradient(135deg, var(--color-text-muted) 50%, transparent 50%), linear-gradient(to right, transparent, transparent)",
          backgroundPosition: "calc(100% - 18px) calc(1em + 2px), calc(100% - 13px) calc(1em + 2px), 100% 0",
          backgroundSize: "5px 5px, 5px 5px, 2.5em 2.5em",
          backgroundRepeat: "no-repeat",
        }}
        {...props}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt.value ?? opt} value={opt.value ?? opt}>
            {opt.label ?? String(opt)}
          </option>
        ))}
      </select>
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
