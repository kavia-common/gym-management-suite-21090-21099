import { create } from "zustand";

/**
 * PUBLIC_INTERFACE
 * Trainers store scaffold to hold trainers directory and filters.
 */
export const useTrainersStore = create((set) => ({
  items: [],
  loading: false,
  error: null,

  // PUBLIC_INTERFACE
  setItems: (items) => {
    /** Sets trainers items. */
    set({ items });
  },

  // PUBLIC_INTERFACE
  setLoading: (loading) => {
    /** Sets loading flag for trainers operations. */
    set({ loading });
  },

  // PUBLIC_INTERFACE
  setError: (error) => {
    /** Sets error for trainers operations. */
    set({ error });
  },
}));
