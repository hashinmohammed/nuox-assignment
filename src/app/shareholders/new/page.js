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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="secondary">← Back to Dashboard</Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">
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
