//
// PUBLIC_INTERFACE
// Feature flag configuration for the Gym Manager frontend.
//
// This module centralizes feature toggles for major modules to enable
// phased delivery, A/B testing, or gradual rollouts without code changes.
//
// How it works:
// - Each flag has a boolean default (see defaults).
// - Each flag can be overridden by an environment variable at build time
//   using the pattern REACT_APP_FEATURE_<FLAGNAME>=true|false
//   For example: REACT_APP_FEATURE_DASHBOARD=true
//
// Example usage:
//   import { features } from '../config/features';
//   if (features.memberships) { /* render memberships module */ }
//
// Note: CRA exposes env vars prefixed with REACT_APP_ at build time.
//
function parseBool(val, fallback) {
  if (val === undefined || val === null || val === "") return fallback;
  const s = String(val).toLowerCase().trim();
  if (["1", "true", "yes", "on"].includes(s)) return true;
  if (["0", "false", "no", "off"].includes(s)) return false;
  return fallback;
}

// Default rollout plan: enable core modules by default; portals may be
// enabled depending on the current delivery phase. Adjust as needed.
const defaults = {
  dashboard: true,
  memberships: true,
  classes: true,
  trainers: true,
  bookings: true,
  memberPortal: true,
  trainerPortal: true,
  // Auth is optional and OFF by default. See docs/auth-behavior.md for usage.
  auth: false,
};

// Helper to read an env var for a given key, following the REACT_APP_FEATURE_* convention.
function envFlag(key, fallback) {
  const envKey = `REACT_APP_FEATURE_${key.toUpperCase()}`;
  return parseBool(process.env[envKey], fallback);
}

// PUBLIC_INTERFACE
export const features = {
  dashboard: envFlag("dashboard", defaults.dashboard),
  memberships: envFlag("memberships", defaults.memberships),
  classes: envFlag("classes", defaults.classes),
  trainers: envFlag("trainers", defaults.trainers),
  bookings: envFlag("bookings", defaults.bookings),
  memberPortal: envFlag("memberPortal", defaults.memberPortal),
  trainerPortal: envFlag("trainerPortal", defaults.trainerPortal),
  // Toggle optional authentication pathway at build time:
  // REACT_APP_FEATURE_AUTH=true
  auth: envFlag("auth", defaults.auth),
};

// PUBLIC_INTERFACE
export function isFeatureEnabled(name) {
  // Returns boolean indicating if a named feature is enabled.
  return !!features[name];
}
