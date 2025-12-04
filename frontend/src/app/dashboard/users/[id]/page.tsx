"use client";
import { IUser } from "@/app/types";
import { getAllUsers, deleteUser } from "@/client/client";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { ProtectedRoute } from "@/contexts/sessionContext";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSession } from "@/contexts/sessionContext";

export default function UserDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user: currentUser } = useSession();

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
      label: "Users & Staff",
      url: "/dashboard/users",
    },
    {
      label: id as string,
      url: `/dashboard/users/${id}`,
    },
  ];

  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchUserData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const response = await getAllUsers();
      const users = response.users || response;

      // Find the specific user by ID
      const foundUser = users.find((u: IUser) => u._id === id);

      if (foundUser) {
        setUser(foundUser);
      } else {
        toast.error("User not found");
        router.push("/dashboard/users");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load user data");
      router.push("/dashboard/users");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    try {
      await deleteUser(id as string);
      toast.success("User deleted successfully");
      router.push("/dashboard/users");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete user");
    }
  };

  const getBranchName = (): string => {
    if (!user) return "";
    if (typeof user.branch === 'string') {
      return user.branch;
    }
    return user.branch.branchName;
  };

  const getBranchLocation = (): string => {
    if (!user) return "";
    if (typeof user.branch === 'string') {
      return "";
    }
    return user.branch.branchLocation;
  };

  const getRoleBadgeColor = (role: string): string => {
    switch (role) {
      case "OWNER":
        return "bg-purple-500/20 text-purple-600 dark:text-purple-400";
      case "MANAGER":
        return "bg-blue-500/20 text-blue-600 dark:text-blue-400";
      case "DOCTOR":
        return "bg-green-500/20 text-green-600 dark:text-green-400";
      case "STAFF":
        return "bg-orange-500/20 text-orange-600 dark:text-orange-400";
      default:
        return "bg-grey-500/20 text-grey-600 dark:text-grey-400";
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

  if (!user) {
    return (
      <ProtectedRoute>
        <main className="bg-light-secondary dark:bg-dark-primary w-full min-h-screen p-10">
          <Breadcrumb data={breadcrumbData} />
          <div className="text-center py-20">
            <p className="text-xl text-grey-dark dark:text-grey-gc">User not found</p>
            <button
              onClick={() => router.push("/dashboard/users")}
              className="mt-4 px-6 py-2 bg-green-dark text-white rounded-md hover:bg-green-700"
            >
              Back to Users
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
              User Details
            </h1>
            <p className="font-semibold text-grey-dark dark:text-grey-gc mt-2">
              View user information and manage access.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => router.push(`/dashboard/users/${id}/edit`)}
              className="px-6 py-2 bg-green-dark text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Edit User
            </button>
            {currentUser?._id !== user._id && (
              <button
                onClick={() => setDeleteConfirmOpen(true)}
                className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                Delete User
              </button>
            )}
            <button
              onClick={() => router.push("/dashboard/users")}
              className="px-6 py-2 bg-grey-dark text-white rounded-md hover:bg-grey-700 transition-colors"
            >
              Back to List
            </button>
          </div>
        </div>

        {/* User Information Card */}
        <div className="bg-white dark:bg-dark-secondary rounded-lg shadow-md p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-green-dark dark:text-white">
                {user.username}
                {currentUser?._id === user._id && (
                  <span className="ml-3 text-sm text-grey-dark dark:text-grey-gc italic font-normal">
                    (You)
                  </span>
                )}
              </h2>
              <p className="text-grey-dark dark:text-grey-gc mt-1">
                ID: {user._id}
              </p>
            </div>
            <div className="text-right">
              <span className={`inline-block px-4 py-1 rounded-full text-sm font-semibold ${getRoleBadgeColor(user.role)}`}>
                {user.role}
              </span>
            </div>
          </div>

          {/* User Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-grey-dark dark:text-grey-gc uppercase mb-1">
                  Username
                </label>
                <p className="text-green-dark dark:text-white font-medium">
                  {user.username}
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-grey-dark dark:text-grey-gc uppercase mb-1">
                  Role
                </label>
                <p className="text-green-dark dark:text-white font-medium">
                  {user.role}
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-grey-dark dark:text-grey-gc uppercase mb-1">
                  Branch
                </label>
                <p className="text-green-dark dark:text-white font-medium">
                  {getBranchName()}
                </p>
                {getBranchLocation() && (
                  <p className="text-grey-dark dark:text-grey-gc text-sm mt-1">
                    {getBranchLocation()}
                  </p>
                )}
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
                Are you sure you want to delete the user &quot;{user.username}&quot;? This action cannot be undone.
              </p>
              <div className="flex gap-4 justify-end">
                <button
                  onClick={() => setDeleteConfirmOpen(false)}
                  className="px-4 py-2 bg-grey-dark text-white rounded-md hover:bg-grey-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteUser}
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