"use client";

import { useState } from "react";
import Input from "./ui/Input";
import Button from "./ui/Button";
import Card from "./ui/Card";
import { useShareholderStore } from "@/stores/shareholderStore";
import { validateShareholderForm } from "@/utils/validators";

export default function ShareholderForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    country: "",
  });
  const [errors, setErrors] = useState({});
  const { addShareholder, loading } = useShareholderStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate
    const validation = validateShareholderForm(formData);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    try {
      await addShareholder(formData);
      // Reset form
      setFormData({ name: "", email: "", mobile: "", country: "" });
      setErrors({});
      if (onSuccess) onSuccess();
    } catch (error) {
      setErrors({ submit: error.message });
    }
  };

  const handleReset = () => {
    setFormData({ name: "", email: "", mobile: "", country: "" });
    setErrors({});
  };

  return (
    <Card title="Add Shareholder">
      <form onSubmit={handleSubmit}>
        <Input
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          required
          placeholder="First Name"
        />

        <Input
          label="Mobile Number"
          name="mobile"
          type="tel"
          value={formData.mobile}
          onChange={handleChange}
          error={errors.mobile}
          required
          placeholder="Mobile Number"
        />

        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
          placeholder="Email Id"
        />

        <Input
          label="Country"
          name="country"
          value={formData.country}
          onChange={handleChange}
          error={errors.country}
          placeholder="Country"
        />

        {errors.submit && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {errors.submit}
          </div>
        )}

        <div className="flex gap-3">
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create"}
          </Button>
          <Button type="button" variant="secondary" onClick={handleReset}>
            Reset
          </Button>
        </div>
      </form>
    </Card>
  );
}
