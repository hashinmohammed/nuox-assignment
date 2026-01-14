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

  fetchInstallments: async (page = 1, limit = 10, filters = {}) => {
    set({ loading: true, error: null });
    try {
      // Build query string with filters
      const params = new URLSearchParams({
        type: "installments",
        page: page.toString(),
        limit: limit.toString(),
      });

      // Add filter parameters if they exist
      if (filters.country) params.append("country", filters.country);
      if (filters.search) params.append("search", filters.search);
      if (filters.month) params.append("month", filters.month);
      if (filters.year) params.append("year", filters.year);
      if (filters.status) params.append("status", filters.status);

      const response = await fetch(`/api/summary?${params.toString()}`);
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
