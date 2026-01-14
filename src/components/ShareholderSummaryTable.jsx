"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Card from "./ui/Card";
import Table from "./ui/Table";
import Pagination from "./ui/Pagination";
import { useSummaryStore } from "@/stores/summaryStore";
import { formatDate } from "@/utils/dateUtils";

export default function ShareholderSummaryTable() {
  const router = useRouter();
  const { installments, pagination, loading, fetchInstallments } =
    useSummaryStore();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchInstallments(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const styles = {
      paid: "bg-green-100 text-green-800",
      partial: "bg-yellow-100 text-yellow-800",
      pending: "bg-red-100 text-red-800",
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

  const columns = [
    {
      header: "Name",
      accessor: "shareholderName",
      render: (row) => (
        <button
          onClick={() => router.push(`/shareholders/${row.shareholderId}`)}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          {row.shareholderName}
        </button>
      ),
    },
    {
      header: "Due Payment Date",
      accessor: "dueDate",
      render: (row) => formatDate(row.dueDate),
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
              ? "text-red-600 font-semibold"
              : "text-green-600"
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
    <Card title="Installment Due Amount Details">
      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      ) : (
        <>
          <Table columns={columns} data={installments} />
          <Pagination pagination={pagination} onPageChange={handlePageChange} />
        </>
      )}
    </Card>
  );
}
