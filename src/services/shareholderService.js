export const shareholderService = {
  getShareholders: async (page = 1, limit = 10, filters = {}) => {
    const params = new URLSearchParams({
      page,
      limit,
      ...(filters.search && { search: filters.search }),
      ...(filters.country && { country: filters.country }),
    });

    const response = await fetch(`/api/shareholders?${params}`);
    if (!response.ok) throw new Error("Failed to fetch shareholders");
    return await response.json();
  },

  getShareholderById: async (id) => {
    const response = await fetch(`/api/shareholders/${id}`);
    if (!response.ok) throw new Error("Failed to fetch shareholder details");
    return await response.json();
  },

  createShareholder: async (data) => {
    const response = await fetch("/api/shareholders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to create shareholder");
    }

    return await response.json();
  },

  updateShareholder: async (id, data) => {
    const response = await fetch(`/api/shareholders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error("Failed to update shareholder");
    return await response.json();
  },

  deleteShareholder: async (id) => {
    const response = await fetch(`/api/shareholders/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to delete shareholder");
    }
    return true;
  },

  searchByEmail: async (email) => {
    const response = await fetch(
      `/api/shareholders/search?email=${encodeURIComponent(email)}`
    );
    if (!response.ok) throw new Error("Failed to search shareholders");
    return await response.json();
  },
};
