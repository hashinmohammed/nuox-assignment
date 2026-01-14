import { create } from "zustand";

export const useSummaryStore = create((set) => ({
  // State
  summary: {
    totalExpected: 0,
    totalPaid: 0,
    totalDue: 0,
    monthlyCollected: 0,
    totalShareholders: 0,
    totalShares: 0,
  },
  installments: [],
  pagination: null,
  loading: false,
  error: null,

  // Actions
  fetchSummary: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/summary");
      if (!response.ok) throw new Error("Failed to fetch summary");
      const data = await response.json();
      set({ summary: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  fetchInstallments: async (page = 1, limit = 10) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(
        `/api/summary?type=installments&page=${page}&limit=${limit}`
      );
      if (!response.ok) throw new Error("Failed to fetch installments");
      const data = await response.json();
      set({
        installments: data.installments,
        pagination: data.pagination,
        loading: false,
      });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
