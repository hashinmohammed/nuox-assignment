import { create } from "zustand";
import {
  calculateOutstanding,
  calculateTotalPaid,
  calculateTotalExpected,
} from "@/utils/paymentAllocator";

export const useShareStore = create((set, get) => ({
  // State
  shares: [],
  installments: [],
  loading: false,
  error: null,

  // Actions
  fetchShares: async (shareholderId = null) => {
    set({ loading: true, error: null });
    try {
      const url = shareholderId
        ? `/api/shares?shareholderId=${shareholderId}`
        : "/api/shares";

      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch shares");
      const data = await response.json();
      set({ shares: data.shares, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  fetchShareWithInstallments: async (shareId) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/shares/${shareId}`);
      if (!response.ok) throw new Error("Failed to fetch share");
      const data = await response.json();

      // Update shares and installments in state
      set((state) => ({
        shares: state.shares.some((s) => s.id === shareId)
          ? state.shares.map((s) => (s.id === shareId ? data.share : s))
          : [...state.shares, data.share],
        installments: [
          ...state.installments.filter((i) => i.shareId !== shareId),
          ...data.installments,
        ],
        loading: false,
      }));

      return { share: data.share, installments: data.installments };
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  addShare: async (shareData) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/shares", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(shareData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create share");
      }

      const data = await response.json();
      set((state) => ({
        shares: [...state.shares, data.share],
        installments: [...state.installments, ...data.installments],
        loading: false,
      }));
      return { share: data.share, installments: data.installments };
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  deleteShare: async (shareId) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/shares/${shareId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete share");

      set((state) => ({
        shares: state.shares.filter((s) => s.id !== shareId),
        installments: state.installments.filter((i) => i.shareId !== shareId),
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  makePayment: async (installmentId, amount, paymentDate = null) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(
        `/api/installments/${installmentId}/payment`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount, paymentDate }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to process payment");
      }

      const data = await response.json();

      // Update installment in state
      set((state) => ({
        installments: state.installments.map((inst) =>
          inst.id === installmentId ? data.installment : inst
        ),
        loading: false,
      }));

      return data;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Selectors
  getSharesByShareholderId: (shareholderId) => {
    return get().shares.filter((s) => s.shareholderId === shareholderId);
  },

  getInstallmentsByShareId: (shareId) => {
    return get().installments.filter((i) => i.shareId === shareId);
  },

  getOutstandingAmount: (shareId) => {
    const installments = get().getInstallmentsByShareId(shareId);
    return calculateOutstanding(installments);
  },

  getTotalPaid: (shareId) => {
    const installments = get().getInstallmentsByShareId(shareId);
    return calculateTotalPaid(installments);
  },

  getTotalExpected: (shareId) => {
    const installments = get().getInstallmentsByShareId(shareId);
    return calculateTotalExpected(installments);
  },

  clearError: () => set({ error: null }),
}));
