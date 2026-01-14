import { useEffect, useState } from "react";
import { useShareholderStore } from "@/stores/shareholderStore";
import { useShareStore } from "@/stores/shareStore";

export function useShareholderData(shareholderId) {
  // Select specific parts of the store to avoid unnecessary re-renders
  // Note: In Zustand, it's often better to select state, but destructuring is also common.
  // We'll stick to the pattern used in the component for now but extracted.
  const { shareholders, fetchShareholderById } = useShareholderStore();
  const { shares, fetchShares } = useShareStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      if (!shareholderId) return;

      // Check if we already have the shareholder details in the store
      // We check this inside the effect to ensure we have the latest state
      const existing = shareholders.find((s) => s.id === shareholderId);

      if (!existing) {
        await fetchShareholderById(shareholderId);
      }

      await fetchShares(shareholderId);

      if (mounted) {
        setLoading(false);
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
    // Including dependency array as required
  }, [shareholderId, fetchShareholderById, fetchShares]);
  // Note: we generally shouldn't depend on 'shareholders' array for the fetching logic
  // itself to avoid infinite loops if fetch updates the array,
  // BUT we need to know if it's there.
  // Ideally fetchShareholderById handles the "if exists" check or returns the data.
  // The original component logic was: find in list, if not found -> fetch.
  // The 'shareholders' dependency might trigger re-runs, but 'existing' check prevents double fetch.

  const shareholder = shareholders.find((sh) => sh.id === shareholderId);
  const shareholderShares = shares.filter(
    (s) => s.shareholderId === shareholderId
  );

  return {
    shareholder,
    shares: shareholderShares,
    loading,
  };
}
