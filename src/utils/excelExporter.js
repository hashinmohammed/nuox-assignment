import * as XLSX from "xlsx";
import { formatDate } from "./dateUtils";

/**
 * Export shareholder summary to Excel
 * @param {Array} shareholders - Array of shareholders with their data
 * @param {Array} allInstallments - All installments
 * @returns {void} - Downloads Excel file
 */
export const exportShareholderSummary = (shareholders, allInstallments) => {
  const data = shareholders.map((shareholder) => {
    const shareholderInstallments = allInstallments.filter(
      (inst) => inst.shareholderId === shareholder.id
    );

    const totalExpected = shareholderInstallments.reduce(
      (sum, inst) => sum + inst.installmentAmount,
      0
    );
    const totalPaid = shareholderInstallments.reduce(
      (sum, inst) => sum + inst.paidAmount,
      0
    );
    const outstanding = shareholderInstallments.reduce(
      (sum, inst) => sum + inst.balanceAmount,
      0
    );

    return {
      Name: shareholder.name,
      Email: shareholder.email,
      Mobile: shareholder.mobile,
      Country: shareholder.country,
      "Total Expected": totalExpected.toFixed(2),
      "Total Paid": totalPaid.toFixed(2),
      Outstanding: outstanding.toFixed(2),
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Shareholder Summary");

  // Auto-size columns
  const maxWidth = data.reduce((w, r) => Math.max(w, r.Name?.length || 0), 10);
  worksheet["!cols"] = [
    { wch: maxWidth },
    { wch: 25 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
  ];

  XLSX.writeFile(workbook, `Shareholder_Summary_${Date.now()}.xlsx`);
};

/**
 * Export detailed shareholder report
 * @param {Object} shareholder - Shareholder data
 * @param {Array} shares - Shareholder's shares
 * @param {Array} installments - All installments for the shareholder
 * @returns {void} - Downloads Excel file
 */
export const exportShareholderDetail = (shareholder, shares, installments) => {
  // Shareholder Info Sheet
  const infoData = [
    { Field: "Name", Value: shareholder.name },
    { Field: "Email", Value: shareholder.email },
    { Field: "Mobile", Value: shareholder.mobile },
    { Field: "Country", Value: shareholder.country },
  ];

  // Shares Sheet
  const sharesData = shares.map((share) => ({
    "Share ID": share.id,
    "Duration (Years)": share.duration,
    "Annual Amount": share.annualAmount.toFixed(2),
    "Total Amount": share.totalAmount.toFixed(2),
    "Installment Type": share.installmentType,
    "Start Date": formatDate(share.startDate),
    "Payment Mode": share.paymentMode || "N/A",
  }));

  // Installments Sheet
  const installmentsData = installments.map((inst) => ({
    "Due Date": formatDate(inst.dueDate),
    "Installment Amount": inst.installmentAmount.toFixed(2),
    "Paid Amount": inst.paidAmount.toFixed(2),
    Balance: inst.balanceAmount.toFixed(2),
    Status: inst.status.toUpperCase(),
    "Paid Date": inst.paidDate ? formatDate(inst.paidDate) : "N/A",
  }));

  // Create workbook
  const workbook = XLSX.utils.book_new();

  const infoSheet = XLSX.utils.json_to_sheet(infoData);
  const sharesSheet = XLSX.utils.json_to_sheet(sharesData);
  const installmentsSheet = XLSX.utils.json_to_sheet(installmentsData);

  XLSX.utils.book_append_sheet(workbook, infoSheet, "Shareholder Info");
  XLSX.utils.book_append_sheet(workbook, sharesSheet, "Shares");
  XLSX.utils.book_append_sheet(workbook, installmentsSheet, "Installments");

  XLSX.writeFile(
    workbook,
    `${shareholder.name.replace(/\s+/g, "_")}_Detail_${Date.now()}.xlsx`
  );
};

/**
 * Export installment due report
 * @param {Array} installments - Array of installments with shareholder info
 * @param {string} month - Optional month filter
 * @returns {void} - Downloads Excel file
 */
export const exportInstallmentDueReport = (installments, month = null) => {
  const data = installments.map((inst) => ({
    Shareholder: inst.shareholderName,
    Email: inst.shareholderEmail,
    "Due Date": formatDate(inst.dueDate),
    "Due Amount": inst.installmentAmount.toFixed(2),
    "Paid Amount": inst.paidAmount.toFixed(2),
    Balance: inst.balanceAmount.toFixed(2),
    Status: inst.status.toUpperCase(),
    "Paid Date": inst.paidDate ? formatDate(inst.paidDate) : "N/A",
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();

  const sheetName = month ? `Due Report - ${month}` : "Due Report";
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // Auto-size columns
  worksheet["!cols"] = [
    { wch: 20 },
    { wch: 25 },
    { wch: 12 },
    { wch: 12 },
    { wch: 12 },
    { wch: 12 },
    { wch: 10 },
    { wch: 12 },
  ];

  const filename = month
    ? `Installment_Due_Report_${month}_${Date.now()}.xlsx`
    : `Installment_Due_Report_${Date.now()}.xlsx`;

  XLSX.writeFile(workbook, filename);
};

/**
 * Export custom data to Excel
 * @param {Array} data - Array of objects to export
 * @param {string} filename - Filename without extension
 * @param {string} sheetName - Sheet name
 * @returns {void} - Downloads Excel file
 */
export const exportToExcel = (
  data,
  filename = "export",
  sheetName = "Sheet1"
) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  XLSX.writeFile(workbook, `${filename}_${Date.now()}.xlsx`);
};
