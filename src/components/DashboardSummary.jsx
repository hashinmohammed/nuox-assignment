"use client";

import { useEffect } from "react";
import Card from "./ui/Card";
import { useSummaryStore } from "@/stores/summaryStore";
import { DollarSign, TrendingUp, AlertCircle } from "lucide-react";

export default function DashboardSummary() {
  const { summary, loading, fetchSummary } = useSummaryStore();

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const stats = [
    {
      title: "Total Paid Amount",
      value: formatCurrency(summary.totalPaid),
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      textColor: "text-blue-700 dark:text-blue-400",
      icon: DollarSign,
    },
    {
      title: "Total Expected Amount",
      value: formatCurrency(summary.totalExpected),
      bgColor: "bg-green-50 dark:bg-green-900/20",
      textColor: "text-green-700 dark:text-green-400",
      icon: TrendingUp,
    },
    {
      title: "Due Amount",
      value: formatCurrency(summary.totalDue),
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      textColor: "text-orange-700 dark:text-orange-400",
      icon: AlertCircle,
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse dark:bg-gray-900">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-3 dark:bg-gray-700"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2 dark:bg-gray-700"></div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className={stat.bgColor}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">
                {stat.title}
              </p>
              <Icon className={`w-5 h-5 ${stat.textColor}`} />
            </div>
            <p className={`text-2xl sm:text-3xl font-bold ${stat.textColor}`}>
              {stat.value}
            </p>
          </Card>
        );
      })}
    </div>
  );
}
