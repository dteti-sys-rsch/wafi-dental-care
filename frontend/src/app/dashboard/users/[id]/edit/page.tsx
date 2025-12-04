"use client";
import { UserRole, IBranch, IUser } from "@/app/types";
import { updateUser, getAllBranches, getAllUsers } from "@/client/client";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { ProtectedRoute } from "@/contexts/sessionContext";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function EditUserPage() {
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
      label: "Users & Staff",
      url: "/dashboard/users",
    },
    {
      label: id as string,
      url: `/dashboard/users/${id}`,
    },
    {
      label: "Edit",
      url: `/dashboard/users/${id}/edit`,
    },
  ];

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [branches, setBranches] = useState<IBranch[]>([]);
  const [isLoadingBranches, setIsLoadingBranches] = useState<boolean>(false);

  // Form fields
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [role, setRole] = useState<UserRole | "">("");
  const [branchId, setBranchId] = useState<string>("");

  useEffect(() => {
    fetchUserData();
    fetchBranches();
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
        // Populate form fields
        setUsername(foundUser.username);
        setRole(foundUser.role);
        setBranchId(typeof foundUser.branch === "string" ? foundUser.branch : foundUser.branch._id);
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

  const fetchBranches = async () => {
    try {
      setIsLoadingBranches(true);
      const response = await getAllBranches();
      setBranches(response.branches || response);
    } catch (error) {
      toast.error(`Failed to load branches${error instanceof Error ? `: ${error.message}` : ""}`);
    } finally {
      setIsLoadingBranches(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!username || !role || !branchId) {
      toast.error("Please fill in all required fields");
      return;
    }

    // If password is being changed, validate it
    if (password || confirmPassword) {
      if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }

      if (password.length < 6) {
        toast.error("Password must be at least 6 characters");
        return;
      }
    }

    try {
      setIsSaving(true);

      const payload: { username: string; role: UserRole; branch: string; password?: string } = {
        username,
        role,
        branch: branchId,
      };

      // Only include password if it's being changed
      if (password) {
        payload.password = password;
      }

      await updateUser(id as string, payload);

      toast.success("User updated successfully!");
      router.push(`/dashboard/users/${id}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update user");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.push(`/dashboard/users/${id}`);
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
          <h1 className="text-[32px] font-semibold text-green-dark dark:text-white">Edit User</h1>
          <p className="font-semibold text-grey-dark dark:text-grey-gc mt-2">
            Update user information for your clinic.
          </p>
        </div>

        {/* Edit Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-dark-secondary rounded-lg shadow-md p-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Username */}
            <div className="flex flex-col gap-1">
              <label className="uppercase font-bold text-grey-gc">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="outline dark:outline-white/20 outline-green-dark/20 px-2 py-1 rounded-md bg-transparent text-green-dark dark:text-white"
                required
              />
            </div>

            {/* Role */}
            <div className="flex flex-col gap-1">
              <label className="uppercase font-bold text-grey-gc">
                Role <span className="text-red-500">*</span>
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="outline dark:outline-white/20 outline-green-dark/20 px-2 py-1 rounded-md bg-transparent text-green-dark dark:text-white"
                required
              >
                <option
                  value=""
                  disabled
                  className="bg-white dark:bg-dark-secondary"
                >
                  Select Role
                </option>
                <option
                  value={UserRole.OWNER}
                  className="bg-white dark:bg-dark-secondary"
                >
                  {UserRole.OWNER}
                </option>
                <option
                  value={UserRole.MANAGER}
                  className="bg-white dark:bg-dark-secondary"
                >
                  {UserRole.MANAGER}
                </option>
                <option
                  value={UserRole.DOCTOR}
                  className="bg-white dark:bg-dark-secondary"
                >
                  {UserRole.DOCTOR}
                </option>
                <option
                  value={UserRole.STAFF}
                  className="bg-white dark:bg-dark-secondary"
                >
                  {UserRole.STAFF}
                </option>
              </select>
            </div>

            {/* Branch */}
            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="uppercase font-bold text-grey-gc">
                Branch <span className="text-red-500">*</span>
              </label>
              {isLoadingBranches ? (
                <div className="px-2 py-1 text-grey-dark dark:text-grey-gc">Loading branches...</div>
              ) : (
                <select
                  value={branchId}
                  onChange={(e) => setBranchId(e.target.value)}
                  className="outline-1 dark:outline-white/20 outline-green-dark/20 px-2 py-1 rounded-md bg-transparent text-green-dark dark:text-white"
                  required
                >
                  <option
                    value=""
                    disabled
                    className="bg-white dark:bg-dark-secondary"
                  >
                    Select Branch
                  </option>
                  {branches.map((branch) => (
                    <option
                      key={branch._id}
                      value={branch._id}
                      className="bg-white dark:bg-dark-secondary"
                    >
                      {branch.branchName} - {branch.branchLocation}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Password Section Divider */}
            <div className="md:col-span-2 border-t border-grey-light dark:border-grey-dark pt-6 mt-2">
              <h3 className="text-lg font-semibold text-green-dark dark:text-white mb-4">Change Password (Optional)</h3>
              <p className="text-sm text-grey-dark dark:text-grey-gc mb-4">Leave blank to keep the current password</p>
            </div>

            {/* New Password */}
            <div className="flex flex-col gap-1">
              <label className="uppercase font-bold text-grey-gc">New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="outline dark:outline-white/20 outline-green-dark/20 px-2 py-1 rounded-md bg-transparent text-green-dark dark:text-white"
                minLength={6}
              />
              <p className="text-xs text-grey-dark dark:text-grey-gc">Minimum 6 characters</p>
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1">
              <label className="uppercase font-bold text-grey-gc">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="outline dark:outline-white/20 outline-green-dark/20 px-2 py-1 rounded-md bg-transparent text-green-dark dark:text-white"
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
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </main>
    </ProtectedRoute>
  );
}

