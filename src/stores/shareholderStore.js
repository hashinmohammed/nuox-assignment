import { create } from "zustand";
import { shareholderService } from "@/services/shareholderService";

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
      const data = await shareholderService.getShareholders(
        page,
        limit,
        filters
      );
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
      const data = await shareholderService.createShareholder(shareholderData);
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
      const data = await shareholderService.updateShareholder(
        id,
        shareholderData
      );
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
      await shareholderService.deleteShareholder(id);
      set((state) => ({
        shareholders: state.shareholders.filter((sh) => sh.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  fetchShareholderById: async (id) => {
    set({ loading: true, error: null });
    try {
      const data = await shareholderService.getShareholderById(id);

      // Update local state if needed, or just return the data
      // We'll update the list if the item exists, or add it if it's missing but valid
      set((state) => {
        const index = state.shareholders.findIndex((s) => s.id === id);
        if (index >= 0) {
          const newShareholders = [...state.shareholders];
          newShareholders[index] = data.shareholder;
          return { shareholders: newShareholders, loading: false };
        } else {
          return {
            shareholders: [...state.shareholders, data.shareholder],
            loading: false,
          };
        }
      });

      return data.shareholder;
    } catch (error) {
      set({ error: error.message, loading: false });
      return null;
    }
  },

  searchByEmail: async (email) => {
    set({ loading: true, error: null });
    try {
      const data = await shareholderService.searchByEmail(email);
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
