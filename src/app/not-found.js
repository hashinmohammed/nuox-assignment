import Link from "next/link";
import Button from "@/components/ui/Button";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-100 p-4 rounded-full dark:bg-blue-900/30">
            <FileQuestion className="w-16 h-16 text-blue-600 dark:text-blue-400" />
          </div>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-2 dark:text-white">
          Page Not Found
        </h1>

        <p className="text-xl text-gray-600 mb-8 dark:text-gray-400 max-w-md mx-auto">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It
          might have been moved or deleted.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button className="w-full sm:w-auto">Return Home</Button>
          </Link>
          <Link href="/shareholders">
            <Button variant="outline" className="w-full sm:w-auto">
              View All Shareholders
            </Button>
          </Link>
        </div>
      </div>

      <div className="mt-12 text-sm text-gray-500 dark:text-gray-500">
        Error Code: 404
      </div>
    </div>
  );
}
