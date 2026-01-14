"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Card from "./ui/Card";
import Table from "./ui/Table";
import Pagination from "./ui/Pagination";
import InstallmentFilters from "./InstallmentFilters";
import { useSummaryStore } from "@/stores/summaryStore";
import { useShareholderStore } from "@/stores/shareholderStore";
import { formatDate } from "@/utils/dateUtils";

export default function ShareholderSummaryTable() {
  const router = useRouter();
  const { installments, pagination, loading, fetchInstallments } =
    useSummaryStore();
  const { shareholders, fetchShareholders } = useShareholderStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    fetchShareholders();
  }, [fetchShareholders]);

  useEffect(() => {
    fetchInstallments(currentPage, 10, filters);
  }, [currentPage, filters, fetchInstallments]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Extract unique countries from shareholders
  const countries = [...new Set(shareholders.map((sh) => sh.country))].filter(
    Boolean
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const styles = {
      paid: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      partial:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
      pending: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          styles[status] || styles.pending
        }`}
      >
        {status.toUpperCase()}
      </span>
    );
  };

  const handleRowClick = (row) => {
    router.push(`/shareholders/${row.shareholderId}`);
  };

  const columns = [
    {
      header: "Name",
      accessor: "shareholderName",
      render: (row) => (
        <span className="font-medium text-gray-900 dark:text-white">
          {row.shareholderName}
        </span>
      ),
    },
    {
      header: "Due Payment Date",
      accessor: "dueDate",
      render: (row) => formatDate(row.dueDate),
    },
    {
      header: "Country",
      accessor: "shareholderCountry",
      render: (row) => (
        <span className="text-gray-700 dark:text-gray-300">
          {row.shareholderCountry || "-"}
        </span>
      ),
    },
    {
      header: "Due Amount (INR)",
      accessor: "installmentAmount",
      render: (row) => formatCurrency(row.installmentAmount),
    },
    {
      header: "Paid Date",
      accessor: "paidDate",
      render: (row) => (row.paidDate ? formatDate(row.paidDate) : "-"),
    },
    {
      header: "Paid Amount (INR)",
      accessor: "paidAmount",
      render: (row) => formatCurrency(row.paidAmount),
    },
    {
      header: "Balance Amount (INR)",
      accessor: "balanceAmount",
      render: (row) => (
        <span
          className={
            row.balanceAmount > 0
              ? "text-red-600 font-semibold dark:text-red-400"
              : "text-green-600 dark:text-green-400"
          }
        >
          {formatCurrency(row.balanceAmount)}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      render: (row) => getStatusBadge(row.status),
    },
  ];

  return (
    <>
      <InstallmentFilters
        onFilterChange={handleFilterChange}
        countries={countries}
      />
      <Card title="Installment Due Amount Details">
        {loading ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            Loading...
          </div>
        ) : (
          <>
            <Table
              columns={columns}
              data={installments}
              onRowClick={handleRowClick}
            />
            <Pagination
              pagination={pagination}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </Card>
    </>
  );
}
