"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import ShareAmountForm from "@/components/ShareAmountForm";
import { useShareholderStore } from "@/stores/shareholderStore";
import { useShareStore } from "@/stores/shareStore";
import { formatDate } from "@/utils/dateUtils";
import { ArrowLeft, Plus, Trash2, Edit, X } from "lucide-react";

export default function ShareholderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const shareholderId = params.id;

  const { shareholders, fetchShareholders } = useShareholderStore();
  const { shares, fetchShares } = useShareStore();
  const [showAddShare, setShowAddShare] = useState(false);

  useEffect(() => {
    if (shareholders.length === 0) {
      fetchShareholders();
    }
    fetchShares(shareholderId);
  }, [shareholderId]);

  const shareholder = shareholders.find((sh) => sh.id === shareholderId);
  const shareholderShares = shares.filter(
    (s) => s.shareholderId === shareholderId
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleShareCreated = () => {
    setShowAddShare(false);
    fetchShares(shareholderId);
  };

  if (!shareholder) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center dark:bg-gray-950">
        <div className="text-center">
          <p className="text-gray-500 mb-4 dark:text-gray-400">
            Shareholder not found
          </p>
          <Link href="/shareholders">
            <Button>Back to Shareholders</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white shadow-sm dark:bg-gray-900 dark:border-b dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="flex-1">
              <Link href="/shareholders">
                <Button
                  variant="secondary"
                  className="mb-2 text-sm flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Shareholders
                </Button>
              </Link>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                {shareholder.name}
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                {shareholder.email}
              </p>
            </div>
            <Button
              onClick={() => setShowAddShare(!showAddShare)}
              className="w-full sm:w-auto flex items-center justify-center gap-2"
            >
              {showAddShare ? (
                <>
                  <X className="w-4 h-4" />
                  Cancel
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Add New Share
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Shareholder Info */}
        <Card title="Shareholder Information" className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="font-medium">{shareholder.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium">{shareholder.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Mobile</p>
              <p className="font-medium">{shareholder.mobile}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Country</p>
              <p className="font-medium">{shareholder.country}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Created On</p>
              <p className="font-medium">{formatDate(shareholder.createdAt)}</p>
            </div>
          </div>
        </Card>

        {/* Add Share Form */}
        {showAddShare && (
          <div className="mb-6">
            <ShareAmountForm
              shareholderId={shareholderId}
              onSuccess={handleShareCreated}
            />
          </div>
        )}

        {/* Shares List */}
        <Card title="Shares">
          {shareholderShares.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">
                No shares found for this shareholder
              </p>
              <Button onClick={() => setShowAddShare(true)}>
                Add First Share
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {shareholderShares.map((share) => {
                const getBorderColor = (type) => {
                  switch (type.toLowerCase()) {
                    case "monthly":
                      return "border-blue-400 hover:border-blue-500 dark:border-blue-500/50 dark:hover:border-blue-400";
                    case "quarterly":
                      return "border-green-400 hover:border-green-500 dark:border-green-500/50 dark:hover:border-green-400";
                    case "yearly":
                      return "border-orange-400 hover:border-orange-500 dark:border-orange-500/50 dark:hover:border-orange-400";
                    case "custom":
                      return "border-purple-400 hover:border-purple-500 dark:border-purple-500/50 dark:hover:border-purple-400";
                    default:
                      return "border-gray-300 hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-600";
                  }
                };

                const getBadgeColor = (type) => {
                  switch (type.toLowerCase()) {
                    case "monthly":
                      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
                    case "quarterly":
                      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
                    case "yearly":
                      return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
                    case "custom":
                      return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
                    default:
                      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
                  }
                };

                return (
                  <div
                    key={share.id}
                    className={`border-2 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer bg-white dark:bg-gray-900 ${getBorderColor(
                      share.installmentType
                    )}`}
                    onClick={() =>
                      router.push(
                        `/shareholders/${shareholderId}/shares/${share.id}`
                      )
                    }
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                        {share.installmentType.charAt(0).toUpperCase() +
                          share.installmentType.slice(1)}{" "}
                        Plan
                      </h3>
                      <span
                        className={`text-xs px-2 py-1 rounded ${getBadgeColor(
                          share.installmentType
                        )}`}
                      >
                        {share.duration} Year{share.duration > 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Annual Amount:
                        </span>
                        <span className="font-medium text-gray-900 dark:text-gray-200">
                          {formatCurrency(share.annualAmount)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Total Amount:
                        </span>
                        <span className="font-medium text-gray-900 dark:text-gray-200">
                          {formatCurrency(share.totalAmount)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Start Date:
                        </span>
                        <span className="font-medium text-gray-900 dark:text-gray-200">
                          {formatDate(share.startDate)}
                        </span>
                      </div>
                      {share.paymentMode && (
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">
                            Payment Mode:
                          </span>
                          <span className="font-medium text-gray-900 dark:text-gray-200">
                            {share.paymentMode}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-800">
                      <Button variant="outline" className="w-full text-sm">
                        View Details →
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}
