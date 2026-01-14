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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Shareholder not found</p>
          <Link href="/shareholders">
            <Button>Back to Shareholders</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <Link href="/shareholders">
                <Button variant="secondary" className="mb-2">
                  ← Back to Shareholders
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">
                {shareholder.name}
              </h1>
              <p className="text-gray-600">{shareholder.email}</p>
            </div>
            <Button onClick={() => setShowAddShare(!showAddShare)}>
              {showAddShare ? "Cancel" : "Add New Share"}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {shareholderShares.map((share) => (
                <div
                  key={share.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() =>
                    router.push(
                      `/shareholders/${shareholderId}/shares/${share.id}`
                    )
                  }
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-lg">
                      {share.installmentType.charAt(0).toUpperCase() +
                        share.installmentType.slice(1)}{" "}
                      Plan
                    </h3>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {share.duration} Year{share.duration > 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Annual Amount:</span>
                      <span className="font-medium">
                        {formatCurrency(share.annualAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="font-medium">
                        {formatCurrency(share.totalAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Start Date:</span>
                      <span className="font-medium">
                        {formatDate(share.startDate)}
                      </span>
                    </div>
                    {share.paymentMode && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Mode:</span>
                        <span className="font-medium">{share.paymentMode}</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 pt-3 border-t">
                    <Button variant="outline" className="w-full text-sm">
                      View Details →
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}
