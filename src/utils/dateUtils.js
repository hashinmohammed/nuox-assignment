import { format, parseISO, isValid } from "date-fns";

/**
 * Format date for display
 * @param {string|Date} date - Date to format
 * @param {string} formatString - Format string (default: 'dd-MM-yyyy')
 * @returns {string} - Formatted date string
 */
export const formatDate = (date, formatString = "dd-MM-yyyy") => {
  if (!date) return "";

  try {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    if (!isValid(dateObj)) return "";
    return format(dateObj, formatString);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "";
  }
};

/**
 * Format date for input fields (YYYY-MM-DD)
 * @param {string|Date} date - Date to format
 * @returns {string} - Formatted date string
 */
export const formatDateForInput = (date) => {
  return formatDate(date, "yyyy-MM-dd");
};

/**
 * Check if a date is in the past
 * @param {string|Date} date - Date to check
 * @returns {boolean} - True if date is in the past
 */
export const isPastDate = (date) => {
  if (!date) return false;

  try {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    return dateObj < new Date();
  } catch (error) {
    return false;
  }
};

/**
 * Check if payment is overdue
 * @param {string|Date} dueDate - Due date
 * @param {string} status - Payment status
 * @returns {boolean} - True if overdue
 */
export const isOverdue = (dueDate, status) => {
  if (status === "paid") return false;
  return isPastDate(dueDate);
};

/**
 * Get current date in ISO format
 * @returns {string} - Current date in ISO format
 */
export const getCurrentDate = () => {
  return new Date().toISOString();
};

/**
 * Parse date string to Date object
 * @param {string} dateString - Date string
 * @returns {Date|null} - Date object or null if invalid
 */
export const parseDate = (dateString) => {
  if (!dateString) return null;

  try {
    const date = parseISO(dateString);
    return isValid(date) ? date : null;
  } catch (error) {
    return null;
  }
};
