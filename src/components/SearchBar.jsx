"use client";

import { useState } from "react";
import Button from "./ui/Button";

export default function SearchBar({
  onSearch,
  placeholder = "Search by email...",
  loading = false,
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  const handleClear = () => {
    setSearchTerm("");
    if (onSearch) {
      onSearch("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-2 mb-4 sm:mb-6"
    >
      <div className="flex-1 relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
      <div className="flex gap-2">
        <Button
          type="submit"
          disabled={loading || !searchTerm}
          className="flex-1 sm:flex-none text-sm sm:text-base"
        >
          {loading ? "Searching..." : "Search"}
        </Button>
        {searchTerm && (
          <Button
            type="button"
            variant="secondary"
            onClick={handleClear}
            className="flex-1 sm:flex-none text-sm sm:text-base"
          >
            Clear
          </Button>
        )}
      </div>
    </form>
  );
}
