"use client";

import { useState, useMemo } from "react";
import toast from "react-hot-toast";
import Input from "./ui/Input";
import Button from "./ui/Button";
import Card from "./ui/Card";
import { useShareStore } from "@/stores/shareStore";
import { validateShareForm } from "@/utils/validators";
import { previewInstallmentSchedule } from "@/utils/installmentCalculator";
import { formatDate } from "@/utils/dateUtils";
import { Plus, RotateCcw } from "lucide-react";

export default function ShareAmountForm({ shareholderId, onSuccess }) {
  const [formData, setFormData] = useState({
    shareholderId,
    duration: 1,
    annualAmount: "",
    installmentType: "monthly",
    customInstallments: "",
    startDate: "",
    paymentMode: "",
    officeStaff: "",
  });
  const [errors, setErrors] = useState({});
  const { addShare, loading } = useShareStore();

  // Generate preview using useMemo instead of useEffect
  const preview = useMemo(() => {
    if (formData.annualAmount && formData.startDate) {
      try {
        const schedule = previewInstallmentSchedule({
          duration: parseInt(formData.duration),
          annualAmount: parseFloat(formData.annualAmount),
          installmentType: formData.installmentType,
          startDate: formData.startDate,
          customInstallments: formData.customInstallments
            ? parseInt(formData.customInstallments)
            : null,
        });
        return schedule;
      } catch (error) {
        return [];
      }
    }
    return [];
  }, [
    formData.duration,
    formData.annualAmount,
    formData.installmentType,
    formData.startDate,
    formData.customInstallments,
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validateShareForm(formData);
    if (!validation.valid) {
      setErrors(validation.errors);
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      await addShare({
        ...formData,
        duration: parseInt(formData.duration),
        annualAmount: parseFloat(formData.annualAmount),
        customInstallments: formData.customInstallments
          ? parseInt(formData.customInstallments)
          : null,
      });

      // Reset form
      setFormData({
        shareholderId,
        duration: 1,
        annualAmount: "",
        installmentType: "monthly",
        customInstallments: "",
        startDate: "",
        paymentMode: "",
        officeStaff: "",
      });
      setErrors({});
      toast.success("Share created successfully!");

      if (onSuccess) onSuccess();
    } catch (error) {
      setErrors({ submit: error.message });
      toast.error(error.message || "Failed to create share");
    }
  };

  const handleReset = () => {
    setFormData({
      shareholderId,
      duration: 1,
      annualAmount: "",
      installmentType: "monthly",
      customInstallments: "",
      startDate: "",
      paymentMode: "",
      officeStaff: "",
    });
    setErrors({});
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const totalAmount =
    formData.duration && formData.annualAmount
      ? parseFloat(formData.annualAmount) * parseInt(formData.duration)
      : 0;

  return (
    <Card title="Share Amount Details">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration - Year <span className="text-red-500">*</span>
            </label>
            <select
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[1, 2, 3, 4, 5].map((year) => (
                <option key={year} value={year}>
                  {year} Year{year > 1 ? "s" : ""}
                </option>
              ))}
            </select>
            {errors.duration && (
              <p className="mt-1 text-sm text-red-600">{errors.duration}</p>
            )}
          </div>

          <Input
            label="Total Amount/Year"
            name="annualAmount"
            type="number"
            value={formData.annualAmount}
            onChange={handleChange}
            error={errors.annualAmount}
            required
            placeholder="12000"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Installment Type <span className="text-red-500">*</span>
            </label>
            <select
              name="installmentType"
              value={formData.installmentType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="half-yearly">Half-Yearly</option>
              <option value="annual">Annual</option>
              <option value="custom">Custom</option>
            </select>
            {errors.installmentType && (
              <p className="mt-1 text-sm text-red-600">
                {errors.installmentType}
              </p>
            )}
          </div>

          {formData.installmentType === "custom" && (
            <Input
              label="Custom Installments per Year"
              name="customInstallments"
              type="number"
              value={formData.customInstallments}
              onChange={handleChange}
              error={errors.customInstallments}
              required
              placeholder="6"
            />
          )}

          <Input
            label="First Installment Start On"
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleChange}
            error={errors.startDate}
            required
          />

          <Input
            label="Payment Mode"
            name="paymentMode"
            value={formData.paymentMode}
            onChange={handleChange}
            placeholder="DD"
          />

          <Input
            label="Office Staff"
            name="officeStaff"
            value={formData.officeStaff}
            onChange={handleChange}
            placeholder="Abbc"
          />
        </div>

        {/* Preview Section */}
        {preview.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">
              Installment Due Date and Share Amount Details
            </h3>
            <div className="overflow-x-auto max-h-96 overflow-y-auto border rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Due Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Installment Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {preview.map((inst, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(inst.dueDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(inst.installmentAmount)}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50 font-semibold">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      Total Installment Amount - {formatCurrency(totalAmount)}{" "}
                      (Duration {formData.duration} Year
                      {formData.duration > 1 ? "s" : ""})
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(totalAmount)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {errors.submit && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {errors.submit}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <Button
            type="submit"
            disabled={loading || preview.length === 0}
            className="w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {loading ? "Creating..." : "Create Share"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={handleReset}
            className="w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
        </div>
      </form>
    </Card>
  );
}
