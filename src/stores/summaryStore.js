import { create } from "zustand";
import { summaryService } from "@/services/summaryService";

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
      const data = await summaryService.getDashboardSummary();
      set({ summary: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  fetchInstallments: async (page = 1, limit = 10, filters = {}) => {
    set({ loading: true, error: null });
    try {
      const data = await summaryService.getInstallments(page, limit, filters);
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
