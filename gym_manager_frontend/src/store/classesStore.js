import { create } from "zustand";

/**
 * PUBLIC_INTERFACE
 * Classes store scaffold to hold class schedules and filters.
 */
export const useClassesStore = create((set) => ({
  items: [],
  loading: false,
  error: null,

  // PUBLIC_INTERFACE
  setItems: (items) => {
    /** Sets classes items. */
    set({ items });
  },

  // PUBLIC_INTERFACE
  setLoading: (loading) => {
    /** Sets loading flag for classes operations. */
    set({ loading });
  },

  // PUBLIC_INTERFACE
  setError: (error) => {
    /** Sets error for classes operations. */
    set({ error });
  },
}));
