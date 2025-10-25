import { create } from "zustand";

/**
 * PUBLIC_INTERFACE
 * UI store manages local UI state: sidebar visibility, theme mode, and toasts/snackbars.
 */
export const useUIStore = create((set, get) => ({
  // State
  sidebarOpen: true,
  theme: "light", // 'light' | 'dark' (scaffold)
  toasts: [], // [{ id, message, tone, duration }]

  // PUBLIC_INTERFACE
  toggleSidebar: () => {
    /** Toggles the sidebar visibility. */
    set((s) => ({ sidebarOpen: !s.sidebarOpen }));
  },

  // PUBLIC_INTERFACE
  setSidebarOpen: (open) => {
    /** Sets the sidebar open state. */
    set({ sidebarOpen: !!open });
  },

  // PUBLIC_INTERFACE
  setTheme: (theme) => {
    /** Sets the UI theme mode. */
    set({ theme });
  },

  // PUBLIC_INTERFACE
  pushToast: (message, tone = "info", duration = 3000) => {
    /** Pushes a toast message to the stack. Returns the id. */
    const id = Math.random().toString(36).slice(2);
    set((s) => ({ toasts: [...s.toasts, { id, message, tone, duration }] }));
    return id;
  },

  // PUBLIC_INTERFACE
  removeToast: (id) => {
    /** Removes a toast by id. */
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
  },

  // PUBLIC_INTERFACE
  clearToasts: () => {
    /** Clears all toasts. */
    set({ toasts: [] });
  },
}));

/**
 * PUBLIC_INTERFACE
 * getUIState returns an instantaneous snapshot of UI store state.
 */
export function getUIState() {
  /** Returns current snapshot of UI state. */
  const { sidebarOpen, theme, toasts } = useUIStore.getState();
  return { sidebarOpen, theme, toasts };
}
