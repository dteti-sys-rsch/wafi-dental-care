// components/dashboard/NewUser.tsx
import { Dispatch, SetStateAction, useState, useEffect } from "react";
import Button from "../shared/Button";
import { PlusCircle, X } from "lucide-react";
import ContentCard from "../shared/ContentCard";
import { UserRole, IBranch } from "@/app/types";
import { createUser, getAllBranches } from "@/client/client";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function NewUser({
  modalState,
  setModalState,
  onUserCreated,
}: {
  modalState: boolean;
  setModalState: Dispatch<SetStateAction<boolean>>;
  onUserCreated?: () => void;
}) {
  const router = useRouter();
  const [branches, setBranches] = useState<IBranch[]>([]);
  const [isLoadingBranches, setIsLoadingBranches] = useState<boolean>(false);

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [role, setRole] = useState<UserRole | "">("");
  const [branchId, setBranchId] = useState<string>("");

  useEffect(() => {
    if (modalState) {
      fetchBranches();
    }
  }, [modalState]);

  const fetchBranches = async () => {
    try {
      setIsLoadingBranches(true);
      const response = await getAllBranches();
      // console.log(response)
      setBranches(response.branches);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load branches");
    } finally {
      setIsLoadingBranches(false);
    }
  };

  function reset() {
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setRole("");
    setBranchId("");
  }

  async function handleSubmit() {
    // Validation
    if (!username || !password || !role || !branchId) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      const userData = {
        username,
        password,
        role,
        branchId,
      };

      const response = await createUser(userData);

      console.log(response);
      toast.success("New User Created");
      reset();
      setModalState(false);
      
      if (onUserCreated) {
        onUserCreated();
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.message == "Authentication Error") {
          toast.error("Authentication failed, please authenticate again");
          return router.replace("/auth/login");
        }
        toast.error(error.message);
      } else {
        toast.error("An error occurred");
      }
    }
  }

  return (
    <>
      <Button
        className="flex gap-2 items-center justify-center"
        onClick={(e) => {
          e.preventDefault();
          setModalState(true);
        }}
      >
        <PlusCircle /> New User
      </Button>

      <div
        className={`${modalState ? "fixed" : "hidden"} top-0 left-0 w-screen h-screen flex justify-center items-center z-50`}
      >
        <div
          className="bg-green-dark/20 backdrop-blur-sm w-full h-full absolute z-0"
          onClick={() => {
            reset();
            setModalState(false);
          }}
        ></div>

        <ContentCard className="relative z-1 w-[80%] max-w-[600px]">
          <button
            className="absolute top-0 right-0 p-10"
            onClick={() => {
              reset();
              setModalState(false);
            }}
          >
            <X />
          </button>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="flex flex-col gap-2.5"
          >
            <h2 className="text-[20px] font-semibold text-green-dark dark:text-white">
              Create New User
            </h2>

            <div className="flex flex-col gap-1">
              <label className="uppercase font-bold text-grey-gc">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="outline outline-white/20 hover:outline-white-50 focus:outline-white px-2 py-1 rounded-md bg-transparent text-green-dark dark:text-white"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="uppercase font-bold text-grey-gc">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="outline outline-white/20 hover:outline-white-50 focus:outline-white px-2 py-1 rounded-md bg-transparent text-green-dark dark:text-white"
                minLength={6}
                required
              />
              <p className="text-xs text-grey-dark dark:text-grey-gc">
                Minimum 6 characters
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <label className="uppercase font-bold text-grey-gc">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="outline outline-white/20 hover:outline-white-50 focus:outline-white px-2 py-1 rounded-md bg-transparent text-green-dark dark:text-white"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="uppercase font-bold text-grey-gc">
                Role <span className="text-red-500">*</span>
              </label>
              <select
                className={
                  (!role ? "text-white/50" : "text-white") +
                  " outline outline-white/20 hover:outline-white-50 focus:outline-white px-2 py-1 rounded-md bg-transparent"
                }
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                required
              >
                <option value="" disabled className="bg-dark-secondary">
                  Select Role
                </option>
                <option value={UserRole.OWNER} className="bg-dark-secondary">
                  {UserRole.OWNER}
                </option>
                <option value={UserRole.MANAGER} className="bg-dark-secondary">
                  {UserRole.MANAGER}
                </option>
                <option value={UserRole.DOCTOR} className="bg-dark-secondary">
                  {UserRole.DOCTOR}
                </option>
                <option value={UserRole.STAFF} className="bg-dark-secondary">
                  {UserRole.STAFF}
                </option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="uppercase font-bold text-grey-gc">
                Branch <span className="text-red-500">*</span>
              </label>
              {isLoadingBranches ? (
                <div className="px-2 py-1 text-grey-dark dark:text-grey-gc">
                  Loading branches...
                </div>
              ) : (
                <select
                  className={
                    (!branchId ? "text-white/50" : "text-white") +
                    " outline outline-white/20 hover:outline-white-50 focus:outline-white px-2 py-1 rounded-md bg-transparent"
                  }
                  value={branchId}
                  onChange={(e) => setBranchId(e.target.value)}
                  required
                >
                  <option value="" disabled className="bg-dark-secondary">
                    Select Branch
                  </option>
                  {branches.map((branch) => (
                    <option key={branch._id} value={branch._id} className="bg-dark-secondary">
                      {branch.branchName} - {branch.branchLocation}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <Button type="submit">Create User</Button>
          </form>
        </ContentCard>
      </div>
    </>
  );
}