"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import Modal from "./ui/Modal";
import Input from "./ui/Input";
import Button from "./ui/Button";
import { useShareStore } from "@/stores/shareStore";
import { validatePaymentAmount } from "@/utils/validators";
import { DollarSign, X } from "lucide-react";

export default function PaymentModal({
  isOpen,
  onClose,
  installment,
  onSuccess,
}) {
  const [amount, setAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [error, setError] = useState("");
  const { makePayment, loading } = useShareStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validatePaymentAmount(
      parseFloat(amount),
      installment.balanceAmount
    );
    if (!validation.valid) {
      setError(validation.error);
      toast.error(validation.error);
      return;
    }

    try {
      await makePayment(installment.id, parseFloat(amount), paymentDate);
      setAmount("");
      setPaymentDate(new Date().toISOString().split("T")[0]);
      setError("");
      toast.success(`Payment of ₹${amount} recorded successfully!`);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err.message);
      toast.error(err.message || "Failed to record payment");
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (!installment) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Make Payment" size="md">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Installment Info */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-600 dark:text-gray-400">
                  Installment Amount
                </p>
                <p className="font-semibold dark:text-gray-200">
                  {formatCurrency(installment.installmentAmount)}
                </p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Paid Amount</p>
                <p className="font-semibold text-green-600 dark:text-green-400">
                  {formatCurrency(installment.paidAmount)}
                </p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">
                  Balance Amount
                </p>
                <p className="font-semibold text-red-600 dark:text-red-400">
                  {formatCurrency(installment.balanceAmount)}
                </p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Status</p>
                <p className="font-semibold capitalize dark:text-gray-200">
                  {installment.status}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <Input
            label="Payment Amount"
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setError("");
            }}
            error={error}
            required
            placeholder={`Max: ${installment.balanceAmount}`}
          />

          <Input
            label="Payment Date"
            type="date"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
            required
          />

          {/* Preview */}
          {amount && parseFloat(amount) > 0 && (
            <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
                Payment Preview
              </p>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-blue-700 dark:text-blue-400">
                    Current Balance:
                  </span>
                  <span className="font-medium dark:text-blue-200">
                    {formatCurrency(installment.balanceAmount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700 dark:text-blue-400">
                    Payment Amount:
                  </span>
                  <span className="font-medium dark:text-blue-200">
                    - {formatCurrency(parseFloat(amount) || 0)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-blue-300 dark:border-blue-700 pt-1 mt-1">
                  <span className="text-blue-900 dark:text-blue-300 font-semibold">
                    New Balance:
                  </span>
                  <span className="font-semibold dark:text-blue-200">
                    {formatCurrency(
                      Math.max(
                        0,
                        installment.balanceAmount - (parseFloat(amount) || 0)
                      )
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700 dark:text-blue-400">
                    New Status:
                  </span>
                  <span className="font-medium capitalize dark:text-blue-200">
                    {installment.balanceAmount - (parseFloat(amount) || 0) === 0
                      ? "Paid"
                      : "Partial"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="submit"
              disabled={loading || !amount}
              className="w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <DollarSign className="w-4 h-4" />
              {loading ? "Processing..." : "Submit Payment"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
