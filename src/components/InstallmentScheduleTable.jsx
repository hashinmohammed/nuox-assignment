"use client";

import { useState } from "react";
import Button from "./ui/Button";
import Card from "./ui/Card";
import PaymentModal from "./PaymentModal";
import { formatDate, isOverdue } from "@/utils/dateUtils";

export default function InstallmentScheduleTable({
  installments,
  onPaymentSuccess,
}) {
  const [selectedInstallment, setSelectedInstallment] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

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

  const handleMakePayment = (installment) => {
    setSelectedInstallment(installment);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    setSelectedInstallment(null);
    if (onPaymentSuccess) onPaymentSuccess();
  };

  const sortedInstallments = [...installments].sort(
    (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
  );

  return (
    <>
      <Card title="Installment Schedule">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Installment Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Paid Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Balance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Paid Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedInstallments.map((inst, index) => {
                const overdueClass = isOverdue(inst.dueDate, inst.status)
                  ? "bg-red-50"
                  : "";

                return (
                  <tr key={inst.id} className={overdueClass}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {inst.installmentNumber || index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(inst.dueDate)}
                      {isOverdue(inst.dueDate, inst.status) && (
                        <span className="ml-2 text-xs text-red-600">
                          (Overdue)
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(inst.installmentAmount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                      {formatCurrency(inst.paidAmount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                      <span
                        className={
                          inst.balanceAmount > 0
                            ? "text-red-600"
                            : "text-green-600"
                        }
                      >
                        {formatCurrency(inst.balanceAmount)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {getStatusBadge(inst.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {inst.paidDate ? formatDate(inst.paidDate) : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {inst.status !== "paid" && (
                        <Button
                          variant="primary"
                          onClick={() => handleMakePayment(inst)}
                          className="text-xs py-1 px-3"
                        >
                          Make Payment
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        installment={selectedInstallment}
        onSuccess={handlePaymentSuccess}
      />
    </>
  );
}
