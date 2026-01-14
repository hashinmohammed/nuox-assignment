export const summaryService = {
  getDashboardSummary: async () => {
    const response = await fetch("/api/summary");
    if (!response.ok) throw new Error("Failed to fetch summary");
    return await response.json();
  },

  getInstallments: async (page = 1, limit = 10, filters = {}) => {
    const params = new URLSearchParams({
      type: "installments",
      page: page.toString(),
      limit: limit.toString(),
    });

    if (filters.country) params.append("country", filters.country);
    if (filters.search) params.append("search", filters.search);
    if (filters.month) params.append("month", filters.month);
    if (filters.year) params.append("year", filters.year);
    if (filters.status) params.append("status", filters.status);

    const response = await fetch(`/api/summary?${params.toString()}`);
    if (!response.ok) throw new Error("Failed to fetch installments");
    return await response.json();
  },
};
