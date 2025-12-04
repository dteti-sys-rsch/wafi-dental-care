"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Breadcrumb from "@/components/shared/Breadcrumb";
import NewUser from "@/components/dashboard/NewUser";
import { IUser, UserRole } from "@/app/types";
import { getAllUsers, deleteUser } from "@/client/client";
import { useRouter } from "next/navigation";
import { useSession } from "@/contexts/sessionContext";

export default function UsersAndStaffsPage() {
  const router = useRouter();
  const { user: currentUser } = useSession();
  const [openNewUserModal, setOpenNewUserModal] = useState<boolean>(false);
  const [users, setUsers] = useState<IUser[]>([]);
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
      label: "Users & Staff",
      url: "/dashboard/users",
    },
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await getAllUsers();
      setUsers(response.users);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load users");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId);
      toast.success("User deleted successfully");
      setDeleteConfirmId(null);
      fetchUsers();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete user");
    }
  };

  const getBranchName = (user: IUser): string => {
    if (typeof user.branch === 'string') {
      return user.branch;
    }
    return user.branch.branchName;
  };

  const getRoleBadgeColor = (role: UserRole): string => {
    switch (role) {
      case UserRole.OWNER:
        return "bg-purple-500/20 text-purple-600 dark:text-purple-400";
      case UserRole.MANAGER:
        return "bg-blue-500/20 text-blue-600 dark:text-blue-400";
      case UserRole.DOCTOR:
        return "bg-green-500/20 text-green-600 dark:text-green-400";
      case UserRole.STAFF:
        return "bg-orange-500/20 text-orange-600 dark:text-orange-400";
      default:
        return "bg-grey-500/20 text-grey-600 dark:text-grey-400";
    }
  };

  return (
    <main className="bg-light-secondary dark:bg-dark-primary w-full min-h-screen p-10">
      <Breadcrumb data={breadcrumbData} />
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-[32px] font-semibold text-green-dark dark:text-white">
            Users & Staff Management
          </h1>
          <p className="font-semibold text-grey-dark dark:text-grey-gc mt-2">
            Manage clinic users and staff members here.
          </p>
        </div>
        <NewUser 
          modalState={openNewUserModal} 
          setModalState={setOpenNewUserModal}
          onUserCreated={fetchUsers}
        />
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
        <div className="bg-white dark:bg-dark-secondary rounded-lg shadow-md p-6">
          <p className="text-sm font-semibold text-grey-dark dark:text-grey-gc uppercase">
            Total Users
          </p>
          <p className="text-3xl font-bold text-green-dark dark:text-white mt-2">
            {users.length}
          </p>
        </div>
        <div className="bg-white dark:bg-dark-secondary rounded-lg shadow-md p-6">
          <p className="text-sm font-semibold text-grey-dark dark:text-grey-gc uppercase">
            Doctors
          </p>
          <p className="text-3xl font-bold text-green-dark dark:text-white mt-2">
            {users.filter(u => u.role === UserRole.DOCTOR).length}
          </p>
        </div>
        <div className="bg-white dark:bg-dark-secondary rounded-lg shadow-md p-6">
          <p className="text-sm font-semibold text-grey-dark dark:text-grey-gc uppercase">
            Managers
          </p>
          <p className="text-3xl font-bold text-green-dark dark:text-white mt-2">
            {users.filter(u => u.role === UserRole.MANAGER).length}
          </p>
        </div>
        <div className="bg-white dark:bg-dark-secondary rounded-lg shadow-md p-6">
          <p className="text-sm font-semibold text-grey-dark dark:text-grey-gc uppercase">
            Staff
          </p>
          <p className="text-3xl font-bold text-green-dark dark:text-white mt-2">
            {users.filter(u => u.role === UserRole.STAFF).length}
          </p>
        </div>
      </div>

      {/* Users Table */}
      <div className="mt-8 bg-white dark:bg-dark-secondary rounded-lg shadow-md overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-dark dark:border-white"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-20 text-grey-dark dark:text-grey-gc">
            <p className="text-xl">No users found</p>
            <p className="mt-2">Add a new user to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-light-primary dark:bg-dark-primary">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-grey-dark dark:text-white">
                    Username
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-grey-dark dark:text-white">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-grey-dark dark:text-white">
                    Branch
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-grey-dark dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-grey-light dark:divide-grey-dark">
                {users.map((user) => (
                  <tr 
                    key={user._id}
                    className="hover:bg-light-primary dark:hover:bg-dark-primary transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-green-dark dark:text-white">
                      {user.username}
                      {currentUser?._id === user._id && (
                        <span className="ml-2 text-xs text-grey-dark dark:text-grey-gc italic">
                          (You)
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-grey-dark dark:text-grey-gc">
                      {getBranchName(user)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => router.push(`/dashboard/users/${user._id}`)}
                        className="text-green-dark dark:text-white hover:underline mr-4"
                      >
                        View
                      </button>
                      <button
                        onClick={() => router.push(`/dashboard/users/${user._id}/edit`)}
                        className="text-blue-500 hover:underline mr-4"
                      >
                        Edit
                      </button>
                      {currentUser?._id !== user._id && (
                        <button
                          onClick={() => setDeleteConfirmId(user._id)}
                          className="text-red-500 hover:underline"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 bg-grey-dark text-white rounded-md hover:bg-grey-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteUser(deleteConfirmId)}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User count */}
      {!isLoading && users.length > 0 && (
        <div className="mt-4 text-sm text-grey-dark dark:text-grey-gc">
          Showing {users.length} user{users.length !== 1 ? 's' : ''}
        </div>
      )}
    </main>
  );
}