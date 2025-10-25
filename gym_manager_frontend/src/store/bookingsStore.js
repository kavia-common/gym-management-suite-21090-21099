import { create } from "zustand";

/**
 * PUBLIC_INTERFACE
 * Bookings store scaffold to hold bookings and filters.
 */
export const useBookingsStore = create((set) => ({
  items: [],
  loading: false,
  error: null,

  // PUBLIC_INTERFACE
  setItems: (items) => {
    /** Sets bookings items. */
    set({ items });
  },

  // PUBLIC_INTERFACE
  setLoading: (loading) => {
    /** Sets loading flag for bookings operations. */
    set({ loading });
  },

  // PUBLIC_INTERFACE
  setError: (error) => {
    /** Sets error for bookings operations. */
    set({ error });
  },
}));
