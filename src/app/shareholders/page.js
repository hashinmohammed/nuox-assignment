"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Table from "@/components/ui/Table";
import Pagination from "@/components/ui/Pagination";
import { useShareholderStore } from "@/stores/shareholderStore";
import { formatDate } from "@/utils/dateUtils";

export default function ShareholdersPage() {
  const router = useRouter();
  const { shareholders, pagination, loading, fetchShareholders } =
    useShareholderStore();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchShareholders(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const columns = [
    {
      header: "Name",
      accessor: "name",
      render: (row) => (
        <button
          onClick={() => router.push(`/shareholders/${row.id}`)}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          {row.name}
        </button>
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              All Shareholders
            </h1>
            <div className="flex gap-3">
              <Link href="/">
                <Button variant="secondary">← Dashboard</Button>
              </Link>
              <Link href="/shareholders/new">
                <Button>Add Shareholder</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          {loading ? (
            <div className="text-center py-8 text-gray-500">
              Loading shareholders...
            </div>
          ) : shareholders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No shareholders found</p>
              <Link href="/shareholders/new">
                <Button>Add Your First Shareholder</Button>
              </Link>
            </div>
          ) : (
            <>
              <Table columns={columns} data={shareholders} />
              <Pagination
                pagination={pagination}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </Card>
      </main>
    </div>
  );
}
