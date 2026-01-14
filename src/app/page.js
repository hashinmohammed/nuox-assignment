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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
            <h1 className="text-lg sm:text-2xl font-bold text-gray-900">
              Shareholder Management System
            </h1>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              <Link href="/shareholders/new" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto text-sm">
                  Add Shareholder
                </Button>
              </Link>
              <Link href="/shareholders" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto text-sm">
                  View All Shareholders
                </Button>
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
