// app/dashboard/branches/[id]/page.tsx
"use client";
import { IBranch } from "@/app/types";
import { getAllBranches, deleteBranch } from "@/client/client";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { ProtectedRoute } from "@/contexts/sessionContext";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function BranchDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const breadcrumbData = [
    {
      label: "Home",
      url: "/",
    },
    {
      label: "Dashboard",
      url: "/dashboard",
    },
    {
      label: "Branches",
      url: "/dashboard/branches",
    },
    {
      label: id as string,
      url: `/dashboard/branches/${id}`,
    },
  ];

  const [branch, setBranch] = useState<IBranch | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchBranchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchBranchData = async () => {
    try {
      setIsLoading(true);
      const response = await getAllBranches();
      const branches = response.branches || response;

      // Find the specific branch by ID
      const foundBranch = branches.find((b: IBranch) => b._id === id);

      if (foundBranch) {
        setBranch(foundBranch);
      } else {
        toast.error("Branch not found");
        router.push("/dashboard/branches");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load branch data");
      router.push("/dashboard/branches");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBranch = async () => {
    try {
      await deleteBranch(id as string);
      toast.success("Branch deleted successfully");
      router.push("/dashboard/branches");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete branch");
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <main className="bg-light-secondary dark:bg-dark-primary w-full min-h-screen p-10">
          <Breadcrumb data={breadcrumbData} />
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-dark dark:border-white"></div>
          </div>
        </main>
      </ProtectedRoute>
    );
  }

  if (!branch) {
    return (
      <ProtectedRoute>
        <main className="bg-light-secondary dark:bg-dark-primary w-full min-h-screen p-10">
          <Breadcrumb data={breadcrumbData} />
          <div className="text-center py-20">
            <p className="text-xl text-grey-dark dark:text-grey-gc">Branch not found</p>
            <button
              onClick={() => router.push("/dashboard/branches")}
              className="mt-4 px-6 py-2 bg-green-dark text-white rounded-md hover:bg-green-700"
            >
              Back to Branches
            </button>
          </div>
        </main>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <main className="bg-light-secondary dark:bg-dark-primary w-full min-h-screen p-10">
        <Breadcrumb data={breadcrumbData} />

        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-[32px] font-semibold text-green-dark dark:text-white">
              Branch Details
            </h1>
            <p className="font-semibold text-grey-dark dark:text-grey-gc mt-2">
              View branch information and manage settings.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => router.push(`/dashboard/branches/${id}/edit`)}
              className="px-6 py-2 bg-green-dark text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Edit Branch
            </button>
            <button
              onClick={() => setDeleteConfirmOpen(true)}
              className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              Delete Branch
            </button>
            <button
              onClick={() => router.push("/dashboard/branches")}
              className="px-6 py-2 bg-grey-dark text-white rounded-md hover:bg-grey-700 transition-colors"
            >
              Back to List
            </button>
          </div>
        </div>

        {/* Branch Information Card */}
        <div className="bg-white dark:bg-dark-secondary rounded-lg shadow-md p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-green-dark dark:text-white">
              {branch.branchName}
            </h2>
            <p className="text-grey-dark dark:text-grey-gc mt-1">
              ID: {branch._id}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-grey-dark dark:text-grey-gc uppercase mb-1">
                Branch Name
              </label>
              <p className="text-green-dark dark:text-white font-medium">
                {branch.branchName}
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-grey-dark dark:text-grey-gc uppercase mb-1">
                Location
              </label>
              <div className="flex items-start gap-2">
                <svg
                  className="w-5 h-5 text-green-dark dark:text-white mt-0.5 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <p className="text-green-dark dark:text-white font-medium">
                  {branch.branchLocation}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {deleteConfirmOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-dark-secondary rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-bold text-green-dark dark:text-white mb-4">
                Confirm Delete
              </h3>
              <p className="text-grey-dark dark:text-grey-gc mb-6">
                Are you sure you want to delete &quot;{branch.branchName}&quot;? This action cannot be undone and may affect users assigned to this branch.
              </p>
              <div className="flex gap-4 justify-end">
                <button
                  onClick={() => setDeleteConfirmOpen(false)}
                  className="px-4 py-2 bg-grey-dark text-white rounded-md hover:bg-grey-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteBranch}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </ProtectedRoute>
  );
}