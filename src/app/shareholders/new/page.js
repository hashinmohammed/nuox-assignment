"use client";

import { useRouter } from "next/navigation";
import ShareholderForm from "@/components/ShareholderForm";
import Button from "@/components/ui/Button";
import Link from "next/link";

export default function NewShareholderPage() {
  const router = useRouter();

  const handleSuccess = () => {
    // Redirect to shareholders list after successful creation
    setTimeout(() => {
      router.push("/shareholders");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white shadow-sm dark:bg-gray-900 dark:border-b dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <Link href="/" className="w-full sm:w-auto">
              <Button
                variant="secondary"
                className="w-full sm:w-auto text-sm flex items-center gap-2"
              >
                ← Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
              Add New Shareholder
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ShareholderForm onSuccess={handleSuccess} />
      </main>
    </div>
  );
}
