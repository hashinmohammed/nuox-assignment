/**
 * Validate email format
 * @param {string} email - Email address
 * @returns {boolean} - True if valid
 */
export const validateEmail = (email) => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate mobile number
 * @param {string} mobile - Mobile number
 * @returns {boolean} - True if valid
 */
export const validateMobile = (mobile) => {
  if (!mobile) return false;
  // Allow digits, spaces, hyphens, and plus sign
  const mobileRegex = /^[\d\s\-+()]+$/;
  return mobileRegex.test(mobile) && mobile.replace(/\D/g, "").length >= 10;
};

/**
 * Validate shareholder form data
 * @param {Object} data - Form data
 * @returns {Object} - Validation result { valid: boolean, errors: Object }
 */
export const validateShareholderForm = (data) => {
  const errors = {};

  if (!data.name || data.name.trim().length === 0) {
    errors.name = "Name is required";
  }

  if (!data.email || !validateEmail(data.email)) {
    errors.email = "Valid email is required";
  }

  if (!data.mobile || !validateMobile(data.mobile)) {
    errors.mobile = "Valid mobile number is required (at least 10 digits)";
  }

  if (!data.country || data.country.trim().length === 0) {
    errors.country = "Country is required";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate share form data
 * @param {Object} data - Form data
 * @returns {Object} - Validation result { valid: boolean, errors: Object }
 */
export const validateShareForm = (data) => {
  const errors = {};

  if (!data.duration || data.duration < 1 || data.duration > 5) {
    errors.duration = "Duration must be between 1 and 5 years";
  }

  if (!data.annualAmount || data.annualAmount <= 0) {
    errors.annualAmount = "Annual amount must be greater than 0";
  }

  if (!data.installmentType) {
    errors.installmentType = "Installment type is required";
  }

  if (
    data.installmentType === "custom" &&
    (!data.customInstallments || data.customInstallments <= 0)
  ) {
    errors.customInstallments = "Custom installments must be greater than 0";
  }

  if (!data.startDate) {
    errors.startDate = "Start date is required";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate payment amount
 * @param {number} amount - Payment amount
 * @param {number} maxAmount - Maximum allowed amount
 * @returns {Object} - Validation result { valid: boolean, error: string }
 */
export const validatePaymentAmount = (amount, maxAmount) => {
  if (!amount || amount <= 0) {
    return {
      valid: false,
      error: "Payment amount must be greater than 0",
    };
  }

  if (amount > maxAmount) {
    return {
      valid: false,
      error: `Payment amount cannot exceed outstanding balance (${maxAmount})`,
    };
  }

  return {
    valid: true,
    error: null,
  };
};

/**
 * Sanitize numeric input
 * @param {string|number} value - Input value
 * @returns {number} - Sanitized number
 */
export const sanitizeNumber = (value) => {
  if (typeof value === "number") return value;
  const num = parseFloat(value);
  return isNaN(num) ? 0 : num;
};
