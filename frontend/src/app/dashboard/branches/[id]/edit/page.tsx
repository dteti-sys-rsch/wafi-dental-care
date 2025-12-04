// app/dashboard/branches/[id]/edit/page.tsx
"use client";
import { IBranch } from "@/app/types";
import { getAllBranches, updateBranch } from "@/client/client";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { ProtectedRoute } from "@/contexts/sessionContext";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function EditBranchPage() {
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
    {
      label: "Edit",
      url: `/dashboard/branches/${id}/edit`,
    },
  ];

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Form fields
  const [branchName, setBranchName] = useState<string>("");
  const [branchLocation, setBranchLocation] = useState<string>("");

  useEffect(() => {
    fetchBranchData();
  }, [id]);

  const fetchBranchData = async () => {
    try {
      setIsLoading(true);
      const response = await getAllBranches();
      const branches = response.branches || response;

      // Find the specific branch by ID
      const foundBranch = branches.find((b: IBranch) => b._id === id);

      if (foundBranch) {
        // Populate form fields
        setBranchName(foundBranch.branchName);
        setBranchLocation(foundBranch.branchLocation);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!branchName || !branchLocation) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setIsSaving(true);

      const payload = {
        name: branchName,
        location: branchLocation,
      };

      await updateBranch(id as string, payload);

      toast.success("Branch updated successfully!");
      router.push(`/dashboard/branches/${id}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update branch");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.push(`/dashboard/branches/${id}`);
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

  return (
    <ProtectedRoute>
      <main className="bg-light-secondary dark:bg-dark-primary w-full min-h-screen p-10">
        <Breadcrumb data={breadcrumbData} />

        <div className="mb-6">
          <h1 className="text-[32px] font-semibold text-green-dark dark:text-white">
            Edit Branch
          </h1>
          <p className="font-semibold text-grey-dark dark:text-grey-gc mt-2">
            Update branch information for your clinic.
          </p>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-dark-secondary rounded-lg shadow-md p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Branch Name */}
            <div className="flex flex-col gap-1">
              <label className="uppercase font-bold text-grey-gc">
                Branch Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={branchName}
                onChange={(e) => setBranchName(e.target.value)}
                className="outline outline-white/20 hover:outline-white-50 focus:outline-white px-2 py-1 rounded-md bg-transparent text-green-dark dark:text-white"
                required
              />
            </div>

            {/* Branch Location */}
            <div className="flex flex-col gap-1">
              <label className="uppercase font-bold text-grey-gc">
                Branch Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={branchLocation}
                onChange={(e) => setBranchLocation(e.target.value)}
                className="outline outline-white/20 hover:outline-white-50 focus:outline-white px-2 py-1 rounded-md bg-transparent text-green-dark dark:text-white"
                required
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8 justify-end">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSaving}
              className="px-6 py-2 bg-grey-dark text-white rounded-md hover:bg-grey-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2 bg-green-dark text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </main>
    </ProtectedRoute>
  );
}