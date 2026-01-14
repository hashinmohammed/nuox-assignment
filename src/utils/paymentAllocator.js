/**
 * Allocate payment amount across pending installments
 * Payments are allocated to oldest installments first (FIFO)
 * @param {number} paymentAmount - Amount to allocate
 * @param {Array} installments - Array of installment objects
 * @returns {Array} - Array of updates to apply to installments
 */
export const allocatePayment = (paymentAmount, installments) => {
  // Sort installments by due date (oldest first)
  const sortedInstallments = [...installments]
    .filter((inst) => inst.status !== "paid")
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  let remainingAmount = paymentAmount;
  const updates = [];

  for (const installment of sortedInstallments) {
    if (remainingAmount <= 0) break;

    const balanceAmount = installment.balanceAmount;

    if (remainingAmount >= balanceAmount) {
      // Full payment for this installment
      updates.push({
        id: installment.id,
        paidAmount: installment.paidAmount + balanceAmount,
        balanceAmount: 0,
        status: "paid",
        paidDate: new Date().toISOString(),
        allocatedAmount: balanceAmount,
      });
      remainingAmount -= balanceAmount;
    } else {
      // Partial payment
      updates.push({
        id: installment.id,
        paidAmount: installment.paidAmount + remainingAmount,
        balanceAmount: balanceAmount - remainingAmount,
        status: "partial",
        paidDate: new Date().toISOString(),
        allocatedAmount: remainingAmount,
      });
      remainingAmount = 0;
    }
  }

  return {
    updates,
    remainingAmount, // Should be 0 if fully allocated
  };
};

/**
 * Calculate outstanding amount for a set of installments
 * @param {Array} installments - Array of installment objects
 * @returns {number} - Total outstanding amount
 */
export const calculateOutstanding = (installments) => {
  return installments.reduce((total, inst) => total + inst.balanceAmount, 0);
};

/**
 * Calculate total paid amount for a set of installments
 * @param {Array} installments - Array of installment objects
 * @returns {number} - Total paid amount
 */
export const calculateTotalPaid = (installments) => {
  return installments.reduce((total, inst) => total + inst.paidAmount, 0);
};

/**
 * Calculate total expected amount for a set of installments
 * @param {Array} installments - Array of installment objects
 * @returns {number} - Total expected amount
 */
export const calculateTotalExpected = (installments) => {
  return installments.reduce(
    (total, inst) => total + inst.installmentAmount,
    0
  );
};

/**
 * Get payment statistics for a shareholder
 * @param {Array} installments - Array of installment objects
 * @returns {Object} - Payment statistics
 */
export const getPaymentStatistics = (installments) => {
  const totalExpected = calculateTotalExpected(installments);
  const totalPaid = calculateTotalPaid(installments);
  const outstanding = calculateOutstanding(installments);

  const pendingCount = installments.filter(
    (i) => i.status === "pending"
  ).length;
  const partialCount = installments.filter(
    (i) => i.status === "partial"
  ).length;
  const paidCount = installments.filter((i) => i.status === "paid").length;

  return {
    totalExpected,
    totalPaid,
    outstanding,
    pendingCount,
    partialCount,
    paidCount,
    totalInstallments: installments.length,
    completionPercentage:
      totalExpected > 0 ? (totalPaid / totalExpected) * 100 : 0,
  };
};
