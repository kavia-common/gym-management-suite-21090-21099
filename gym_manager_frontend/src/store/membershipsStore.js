import { create } from "zustand";

/**
 * PUBLIC_INTERFACE
 * Memberships store scaffold to hold membership lists and filters.
 */
export const useMembershipsStore = create((set) => ({
  items: [],
  loading: false,
  error: null,

  // PUBLIC_INTERFACE
  setItems: (items) => {
    /** Sets membership items. */
    set({ items });
  },

  // PUBLIC_INTERFACE
  setLoading: (loading) => {
    /** Sets loading flag for memberships operations. */
    set({ loading });
  },

  // PUBLIC_INTERFACE
  setError: (error) => {
    /** Sets error for memberships operations. */
    set({ error });
  },
}));
