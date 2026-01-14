"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Table from "@/components/ui/Table";
import Pagination from "@/components/ui/Pagination";
import InstallmentFilters from "@/components/InstallmentFilters"; // Updated import
import { useShareholderStore } from "@/stores/shareholderStore";
import { formatDate } from "@/utils/dateUtils";
import { ArrowLeft, UserPlus } from "lucide-react";

export default function ShareholdersPage() {
  const router = useRouter();
  const { shareholders, pagination, loading, fetchShareholders } =
    useShareholderStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    country: "",
    search: "",
  });

  // Calculate unique countries for filter dropdown
  // Note: ideally this should come from a separate API or aggregation,
  // but for now we can compute it from the current list or better yet,
  // we might want a distinct list. Since we only have paginated data,
  // let's define a static list or try to get it from the store if possible.
  // For this assignment, we'll use a hardcoded list or assume we want to filter
  // by countries present in the system.
  // However, without a "get all countries" API, we can only filter by what we know.
  // Let's use a standard list of countries for now or just the ones visible if we had all data.
  // To make it useable, let's include some common ones + whatever is in the current view?
  // Actually, filtering usually requires a known set. Let's use a safe list + dynamic addition.
  const countries = useMemo(() => {
    const unique = new Set(shareholders.map((s) => s.country));
    return Array.from(unique).sort();
  }, [shareholders]);

  useEffect(() => {
    fetchShareholders(currentPage, 10, filters);
  }, [currentPage, filters]); // Re-fetch when page or filters change

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({
      ...prev,
      country: newFilters.country,
      search: newFilters.search,
    }));
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleRowClick = (row) => {
    router.push(`/shareholders/${row.id}`);
  };

  const columns = [
    {
      header: "Name",
      accessor: "name",
      render: (row) => (
        <span className="font-medium text-gray-900 dark:text-white">
          {row.name}
        </span>
      ),
    },
    { header: "Email", accessor: "email" },
    { header: "Mobile", accessor: "mobile" },
    { header: "Country", accessor: "country" },
    {
      header: "Created On",
      accessor: "createdAt",
      render: (row) => formatDate(row.createdAt),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white shadow-sm dark:bg-gray-900 dark:border-b dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
            <h1 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
              All Shareholders
            </h1>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              <Link href="/" className="w-full sm:w-auto">
                <Button
                  variant="secondary"
                  className="w-full sm:w-auto text-sm flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/shareholders/new" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto text-sm flex items-center justify-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  Add Shareholder
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <InstallmentFilters
          onFilterChange={handleFilterChange}
          countries={
            countries.length > 0
              ? countries
              : ["India", "USA", "UAE", "UK", "Canada"]
          } // Fallback list
          hideStatus={true}
          hideDates={true}
          searchPlaceholder="Search by name or email..."
        />

        <Card>
          {loading ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Loading shareholders...
            </div>
          ) : shareholders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4 dark:text-gray-400">
                No shareholders found matching your filters
              </p>
              {!filters.search && !filters.country && (
                <Link href="/shareholders/new">
                  <Button>Add Your First Shareholder</Button>
                </Link>
              )}
            </div>
          ) : (
            <>
              <Table
                columns={columns}
                data={shareholders}
                onRowClick={handleRowClick}
              />
              {pagination && (
                <Pagination
                  pagination={pagination}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </Card>
      </main>
    </div>
  );
}
