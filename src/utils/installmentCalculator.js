import { addMonths, addQuarters, addYears } from "date-fns";

/**
 * Get the frequency multiplier for installment type
 * @param {string} type - Installment type (monthly, quarterly, half-yearly, annual, custom)
 * @param {number} customValue - Custom frequency value (optional)
 * @returns {number} - Number of installments per year
 */
export const getInstallmentFrequency = (type, customValue = null) => {
  const frequencies = {
    monthly: 12,
    quarterly: 4,
    "half-yearly": 2,
    annual: 1,
    custom: customValue || 1,
  };

  return frequencies[type] || 12;
};

/**
 * Calculate total number of installments
 * @param {number} duration - Duration in years
 * @param {string} type - Installment type
 * @param {number} customValue - Custom frequency value (optional)
 * @returns {number} - Total number of installments
 */
export const calculateInstallmentCount = (
  duration,
  type,
  customValue = null
) => {
  const frequency = getInstallmentFrequency(type, customValue);
  return duration * frequency;
};

/**
 * Calculate amount per installment
 * @param {number} annualAmount - Annual amount
 * @param {number} duration - Duration in years
 * @param {string} type - Installment type
 * @param {number} customValue - Custom frequency value (optional)
 * @returns {number} - Amount per installment
 */
export const calculateInstallmentAmount = (
  annualAmount,
  duration,
  type,
  customValue = null
) => {
  const totalInstallments = calculateInstallmentCount(
    duration,
    type,
    customValue
  );
  const totalAmount = annualAmount * duration;
  return totalAmount / totalInstallments;
};

/**
 * Add time period to a date based on installment type
 * @param {Date} date - Starting date
 * @param {string} type - Installment type
 * @param {number} count - Number of periods to add
 * @returns {Date} - New date
 */
const addPeriod = (date, type, count = 1) => {
  switch (type) {
    case "monthly":
      return addMonths(date, count);
    case "quarterly":
      return addMonths(date, count * 3);
    case "half-yearly":
      return addMonths(date, count * 6);
    case "annual":
      return addYears(date, count);
    case "custom":
      // For custom, assume monthly intervals
      return addMonths(date, count);
    default:
      return addMonths(date, count);
  }
};

/**
 * Generate complete installment schedule
 * @param {Object} shareData - Share configuration
 * @returns {Array} - Array of installment objects
 */
export const generateInstallmentSchedule = (shareData) => {
  const {
    shareId,
    duration,
    annualAmount,
    installmentType,
    startDate,
    customInstallments,
  } = shareData;

  const totalInstallments = calculateInstallmentCount(
    duration,
    installmentType,
    customInstallments
  );

  const installmentAmount = calculateInstallmentAmount(
    annualAmount,
    duration,
    installmentType,
    customInstallments
  );

  const schedule = [];
  const start = new Date(startDate);

  for (let i = 0; i < totalInstallments; i++) {
    const dueDate = addPeriod(start, installmentType, i);

    schedule.push({
      shareId,
      dueDate: dueDate.toISOString(),
      installmentAmount: Math.round(installmentAmount * 100) / 100, // Round to 2 decimals
      installmentNumber: i + 1,
      status: "pending",
      paidAmount: 0,
      balanceAmount: Math.round(installmentAmount * 100) / 100,
      paidDate: null,
    });
  }

  return schedule;
};

/**
 * Preview installment schedule without saving
 * @param {Object} formData - Form data from share configuration
 * @returns {Array} - Preview of installment schedule
 */
export const previewInstallmentSchedule = (formData) => {
  return generateInstallmentSchedule({
    shareId: "preview",
    ...formData,
  });
};
