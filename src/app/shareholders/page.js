"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Table from "@/components/ui/Table";
import Pagination from "@/components/ui/Pagination";
import SearchBar from "@/components/SearchBar";
import { useShareholderStore } from "@/stores/shareholderStore";
import { formatDate } from "@/utils/dateUtils";
import { ArrowLeft, UserPlus } from "lucide-react";

export default function ShareholdersPage() {
  const router = useRouter();
  const {
    shareholders,
    pagination,
    loading,
    fetchShareholders,
    searchByEmail,
  } = useShareholderStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchResults, setSearchResults] = useState(null);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!searchResults) {
      fetchShareholders(currentPage);
    }
  }, [currentPage, searchResults]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = async (email) => {
    if (!email) {
      setSearchResults(null);
      setCurrentPage(1);
      return;
    }

    setSearching(true);
    try {
      const results = await searchByEmail(email);
      setSearchResults(results);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setSearching(false);
    }
  };

  const handleRowClick = (row) => {
    router.push(`/shareholders/${row.id}`);
  };

  const columns = [
    {
      header: "Name",
      accessor: "name",
      render: (row) => (
        <span className="font-medium text-gray-900">{row.name}</span>
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

  const displayData = searchResults !== null ? searchResults : shareholders;
  const showPagination = searchResults === null && pagination;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
            <h1 className="text-lg sm:text-2xl font-bold text-gray-900">
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
        <Card>
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search shareholders by email..."
            loading={searching}
          />

          {searchResults !== null && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                Found {searchResults.length} result
                {searchResults.length !== 1 ? "s" : ""}
              </p>
            </div>
          )}

          {loading || searching ? (
            <div className="text-center py-8 text-gray-500">
              {searching ? "Searching..." : "Loading shareholders..."}
            </div>
          ) : displayData.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">
                {searchResults !== null
                  ? "No shareholders found matching your search"
                  : "No shareholders found"}
              </p>
              {searchResults === null && (
                <Link href="/shareholders/new">
                  <Button>Add Your First Shareholder</Button>
                </Link>
              )}
            </div>
          ) : (
            <>
              <Table
                columns={columns}
                data={displayData}
                onRowClick={handleRowClick}
              />
              {showPagination && (
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
