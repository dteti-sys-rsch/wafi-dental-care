"use client";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Breadcrumb from "@/components/shared/Breadcrumb";
import NewBranch from "@/components/dashboard/NewBranch";
import { IBranch } from "@/app/types";
import { getAllBranches, deleteBranch } from "@/client/client";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/contexts/sessionContext";

export default function BranchesPage() {
  const router = useRouter();
  const [openNewBranchModal, setOpenNewBranchModal] = useState<boolean>(false);
  const [branches, setBranches] = useState<IBranch[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

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
  ];

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      setIsLoading(true);
      const response = await getAllBranches();
      setBranches(response.branches || response);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load branches");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBranch = async (branchId: string) => {
    try {
      await deleteBranch(branchId);
      toast.success("Branch deleted successfully");
      setDeleteConfirmId(null);
      fetchBranches();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete branch");
    }
  };

  return (
    <ProtectedRoute>
      <main className="bg-light-secondary dark:bg-dark-primary w-full min-h-screen p-10">
        <Breadcrumb data={breadcrumbData} />
        
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-[32px] font-semibold text-green-dark dark:text-white">
              Branch Management
            </h1>
            <p className="font-semibold text-grey-dark dark:text-grey-gc mt-2">
              Manage clinic branches and locations here.
            </p>
          </div>
          <NewBranch 
            modalState={openNewBranchModal} 
            setModalState={setOpenNewBranchModal}
            onBranchCreated={fetchBranches}
          />
        </div>

        {/* Statistics Card */}
        <div className="mt-8 bg-white dark:bg-dark-secondary rounded-lg shadow-md p-6 max-w-xs">
          <p className="text-sm font-semibold text-grey-dark dark:text-grey-gc uppercase">
            Total Branches
          </p>
          <p className="text-3xl font-bold text-green-dark dark:text-white mt-2">
            {branches.length}
          </p>
        </div>

        {/* Branches Grid */}
        <div className="mt-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-dark dark:border-white"></div>
            </div>
          ) : branches.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-dark-secondary rounded-lg shadow-md">
              <p className="text-xl text-grey-dark dark:text-grey-gc">No branches found</p>
              <p className="mt-2 text-grey-dark dark:text-grey-gc">Add a new branch to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {branches.map((branch) => (
                <div
                  key={branch._id}
                  className="bg-white dark:bg-dark-secondary rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-green-dark dark:text-white mb-2">
                        {branch.branchName}
                      </h3>
                      <div className="flex items-start gap-2">
                        <svg
                          className="w-5 h-5 text-grey-dark dark:text-grey-gc mt-0.5 shrink-0"
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
                        <p className="text-grey-dark dark:text-grey-gc">
                          {branch.branchLocation}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4 pt-4 border-t border-grey-light dark:border-grey-dark">
                    <button
                      onClick={() => router.push(`/dashboard/branches/${branch._id}`)}
                      className="flex-1 px-4 py-2 bg-green-dark text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => router.push(`/dashboard/branches/${branch._id}/edit`)}
                      className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(branch._id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {deleteConfirmId && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-dark-secondary rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-bold text-green-dark dark:text-white mb-4">
                Confirm Delete
              </h3>
              <p className="text-grey-dark dark:text-grey-gc mb-6">
                Are you sure you want to delete this branch? This action cannot be undone and may affect users assigned to this branch.
              </p>
              <div className="flex gap-4 justify-end">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 py-2 bg-grey-dark text-white rounded-md hover:bg-grey-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteBranch(deleteConfirmId)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Branch count */}
        {!isLoading && branches.length > 0 && (
          <div className="mt-4 text-sm text-grey-dark dark:text-grey-gc">
            Showing {branches.length} branch{branches.length !== 1 ? 'es' : ''}
          </div>
        )}
      </main>
    </ProtectedRoute>
  );
}