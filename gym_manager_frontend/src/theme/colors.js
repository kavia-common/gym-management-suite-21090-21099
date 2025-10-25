export const colors = {
  primary: "#2563EB",
  secondary: "#F59E0B",
  success: "#22C55E",
  error: "#EF4444",
  background: "#f9fafb",
  surface: "#ffffff",
  text: "#111827",
  mutedText: "#6B7280",
  border: "#E5E7EB",
};

// PUBLIC_INTERFACE
export function getThemeColors() {
  /** Returns the application's theme colors for reuse in JS. */
  return colors;
}
