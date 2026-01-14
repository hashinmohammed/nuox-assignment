"use client";

import Link from "next/link";
import DashboardSummary from "@/components/DashboardSummary";
import ShareholderSummaryTable from "@/components/ShareholderSummaryTable";
import Button from "@/components/ui/Button";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Shareholder Management System
            </h1>
            <div className="flex gap-3">
              <Link href="/shareholders/new">
                <Button>Add Shareholder</Button>
              </Link>
              <Link href="/shareholders">
                <Button variant="outline">View All Shareholders</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <DashboardSummary />

        {/* Installment Table */}
        <ShareholderSummaryTable />
      </main>
    </div>
  );
}
