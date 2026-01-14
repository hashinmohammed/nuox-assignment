import { create } from "zustand";

export const useShareholderStore = create((set, get) => ({
  // State
  shareholders: [],
  pagination: null,
  loading: false,
  error: null,

  // Actions
  fetchShareholders: async (page = 1, limit = 10, filters = {}) => {
    set({ loading: true, error: null });
    try {
      const params = new URLSearchParams({
        page,
        limit,
        ...(filters.search && { search: filters.search }),
        ...(filters.country && { country: filters.country }),
      });

      const response = await fetch(`/api/shareholders?${params}`);
      if (!response.ok) throw new Error("Failed to fetch shareholders");
      const data = await response.json();
      set({
        shareholders: data.shareholders,
        pagination: data.pagination,
        loading: false,
      });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  addShareholder: async (shareholderData) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/shareholders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(shareholderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create shareholder");
      }

      const data = await response.json();
      set((state) => ({
        shareholders: [...state.shareholders, data.shareholder],
        loading: false,
      }));
      return data.shareholder;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  updateShareholder: async (id, shareholderData) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/shareholders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(shareholderData),
      });

      if (!response.ok) throw new Error("Failed to update shareholder");

      const data = await response.json();
      set((state) => ({
        shareholders: state.shareholders.map((sh) =>
          sh.id === id ? data.shareholder : sh
        ),
        loading: false,
      }));
      return data.shareholder;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  deleteShareholder: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/shareholders/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete shareholder");
      }

      set((state) => ({
        shareholders: state.shareholders.filter((sh) => sh.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  searchByEmail: async (email) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(
        `/api/shareholders/search?email=${encodeURIComponent(email)}`
      );
      if (!response.ok) throw new Error("Failed to search shareholders");
      const data = await response.json();
      return data.shareholders;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  getShareholderById: (id) => {
    return get().shareholders.find((sh) => sh.id === id);
  },

  clearError: () => set({ error: null }),
}));
