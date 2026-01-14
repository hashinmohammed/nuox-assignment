"use client";

import { useState } from "react";
import Button from "./ui/Button";
import Card from "./ui/Card";
import { Filter, X } from "lucide-react";

export default function InstallmentFilters({
  onFilterChange,
  countries = [],
  hideStatus = false,
  hideDates = false,
  searchPlaceholder = "Search by name...",
}) {
  const [filters, setFilters] = useState({
    country: "",
    search: "",
    month: "",
    year: new Date().getFullYear().toString(),
    status: "",
  });

  const months = [
    { value: "", label: "All Months" },
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  const years = Array.from({ length: 5 }, (_, i) => {
    const year = new Date().getFullYear() - 2 + i;
    return { value: year.toString(), label: year.toString() };
  });

  const statuses = [
    { value: "", label: "All Statuses" },
    { value: "paid", label: "Paid" },
    { value: "partial", label: "Partial" },
    { value: "pending", label: "Pending" },
  ];

  const handleChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilterChange(filters);
  };

  const handleReset = () => {
    const resetFilters = {
      country: "",
      search: "",
      month: "",
      year: new Date().getFullYear().toString(),
      status: "",
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <Card className="mb-6">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 dark:text-white">
        Filter
      </h3>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col lg:flex-row lg:items-end gap-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-row gap-4 flex-1">
          {/* Country Filter */}
          <div className="lg:w-48">
            <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
              Country
            </label>
            <select
              value={filters.country}
              onChange={(e) => handleChange("country", e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            >
              <option value="">All Countries</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          {/* Search User */}
          <div className="lg:flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
              Search
            </label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleChange("search", e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>

          {/* Status Filter */}
          {!hideStatus && (
            <div className="lg:w-40">
              <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleChange("status", e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              >
                {statuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {!hideDates && (
            <div className="lg:w-40">
              <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                Month
              </label>
              <select
                value={filters.month}
                onChange={(e) => handleChange("month", e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              >
                {months.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {!hideDates && (
            <div className="lg:w-32">
              <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                Year
              </label>
              <select
                value={filters.year}
                onChange={(e) => handleChange("year", e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              >
                {years.map((year) => (
                  <option key={year.value} value={year.value}>
                    {year.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            type="submit"
            className="w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Apply Filters
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={handleReset}
            className="w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <X className="w-4 h-4" />
            Clear Filters
          </Button>
        </div>
      </form>
    </Card>
  );
}
