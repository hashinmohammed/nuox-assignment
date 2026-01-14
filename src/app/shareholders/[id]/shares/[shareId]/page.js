"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import InstallmentScheduleTable from "@/components/InstallmentScheduleTable";
import { useShareStore } from "@/stores/shareStore";
import { useShareholderStore } from "@/stores/shareholderStore";
import { formatDate } from "@/utils/dateUtils";
import { getPaymentStatistics } from "@/utils/paymentAllocator";
import { exportShareholderDetail } from "@/utils/excelExporter";
import { ArrowLeft, Download } from "lucide-react";

export default function ShareDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id: shareholderId, shareId } = params;

  const { shareholders } = useShareholderStore();
  const { shares, installments, fetchShareWithInstallments } = useShareStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchShareWithInstallments(shareId);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [shareId]);

  const share = shares.find((s) => s.id === shareId);
  const shareInstallments = installments.filter((i) => i.shareId === shareId);
  const shareholder = shareholders.find((sh) => sh.id === shareholderId);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleExport = () => {
    if (shareholder && share) {
      exportShareholderDetail(shareholder, [share], shareInstallments);
    }
  };

  const handlePaymentSuccess = async () => {
    await fetchShareWithInstallments(shareId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading share details...</div>
      </div>
    );
  }

  if (!share) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Share not found</p>
          <Link href={`/shareholders/${shareholderId}`}>
            <Button>Back to Shareholder</Button>
          </Link>
        </div>
      </div>
    );
  }

  const stats = getPaymentStatistics(shareInstallments);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col gap-3">
            <Link href={`/shareholders/${shareholderId}`}>
              <Button variant="secondary" className="w-full sm:w-auto text-sm">
                ← Back to Shareholder
              </Button>
            </Link>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4">
              <div className="flex-1">
                <h1 className="text-lg sm:text-2xl font-bold text-gray-900 mb-1">
                  Share Details
                </h1>
                {shareholder && (
                  <p className="text-sm sm:text-base text-gray-600">
                    {shareholder.name}
                  </p>
                )}
              </div>
              <Button
                onClick={handleExport}
                variant="success"
                className="w-full sm:w-auto text-sm"
              >
                Export to Excel
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Share Configuration */}
        <Card title="Share Configuration" className="mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Duration</p>
              <p className="font-medium">
                {share.duration} Year{share.duration > 1 ? "s" : ""}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Annual Amount</p>
              <p className="font-medium">
                {formatCurrency(share.annualAmount)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="font-medium">{formatCurrency(share.totalAmount)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Installment Type</p>
              <p className="font-medium capitalize">{share.installmentType}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Start Date</p>
              <p className="font-medium">{formatDate(share.startDate)}</p>
            </div>
            {share.paymentMode && (
              <div>
                <p className="text-sm text-gray-600">Payment Mode</p>
                <p className="font-medium">{share.paymentMode}</p>
              </div>
            )}
            {share.officeStaff && (
              <div>
                <p className="text-sm text-gray-600">Office Staff</p>
                <p className="font-medium">{share.officeStaff}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Payment Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-blue-50">
            <p className="text-sm text-gray-600 mb-1">Total Expected</p>
            <p className="text-2xl font-bold text-blue-700">
              {formatCurrency(stats.totalExpected)}
            </p>
          </Card>
          <Card className="bg-green-50">
            <p className="text-sm text-gray-600 mb-1">Total Paid</p>
            <p className="text-2xl font-bold text-green-700">
              {formatCurrency(stats.totalPaid)}
            </p>
            <p className="text-xs text-gray-600 mt-1">
              {stats.paidCount} installments
            </p>
          </Card>
          <Card className="bg-orange-50">
            <p className="text-sm text-gray-600 mb-1">Outstanding</p>
            <p className="text-2xl font-bold text-orange-700">
              {formatCurrency(stats.outstanding)}
            </p>
            <p className="text-xs text-gray-600 mt-1">
              {stats.pendingCount + stats.partialCount} pending
            </p>
          </Card>
          <Card className="bg-purple-50">
            <p className="text-sm text-gray-600 mb-1">Completion</p>
            <p className="text-2xl font-bold text-purple-700">
              {stats.completionPercentage.toFixed(1)}%
            </p>
            <p className="text-xs text-gray-600 mt-1">
              {stats.paidCount}/{stats.totalInstallments} paid
            </p>
          </Card>
        </div>

        {/* Installment Schedule */}
        <InstallmentScheduleTable
          installments={shareInstallments}
          onPaymentSuccess={handlePaymentSuccess}
        />
      </main>
    </div>
  );
}
