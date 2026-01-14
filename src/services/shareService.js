export const shareService = {
  getSharesByShareholderId: async (shareholderId) => {
    const response = await fetch(`/api/shares?shareholderId=${shareholderId}`);
    if (!response.ok) throw new Error("Failed to fetch shares");
    return await response.json();
  },

  getShareById: async (id) => {
    const response = await fetch(`/api/shares/${id}`);
    if (!response.ok) throw new Error("Failed to fetch share details");
    return await response.json();
  },

  createShare: async (data) => {
    const response = await fetch("/api/shares", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to create share");
    }
    return await response.json();
  },

  updateShare: async (id, data) => {
    const response = await fetch(`/api/shares/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error("Failed to update share");
    return await response.json();
  },

  getShareWithInstallments: async (shareId) => {
    // This seems to be a composite fetch in the original store,
    // but the store was fetching /api/shares/${shareId} which returns { share, installments }
    // verifying that assumption from previous code reading.
    const response = await fetch(`/api/shares/${shareId}`);
    if (!response.ok) throw new Error("Failed to fetch share details");
    return await response.json();
  },
};
