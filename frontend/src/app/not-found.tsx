"use client"
import Button from "@/components/shared/Button";
import { FileQuestion } from "lucide-react";
import { useRouter } from "next/navigation";


export default function NotFound() {
  const router = useRouter();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-center px-4 bg-white dark:bg-dark-primary">
      <FileQuestion className="w-24 h-24 text-grey-dark dark:text-grey-gc mb-6" />
      <h2 className="text-3xl font-bold text-green-dark dark:text-white mb-3">
        404 - Page Not Found
      </h2>
      <p className="text-grey-dark dark:text-grey-gc max-w-md mb-6">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Button onClick={() => router.push("/dashboard")}>
        Back to Dashboard
      </Button>
    </main>
  );
}