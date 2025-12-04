// components/dashboard/NewBranch.tsx
import { Dispatch, SetStateAction, useState } from "react";
import Button from "../shared/Button";
import { PlusCircle, X } from "lucide-react";
import ContentCard from "../shared/ContentCard";
import { createBranch } from "@/client/client";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function NewBranch({
  modalState,
  setModalState,
  onBranchCreated,
}: {
  modalState: boolean;
  setModalState: Dispatch<SetStateAction<boolean>>;
  onBranchCreated?: () => void;
}) {
  const router = useRouter();

  const [branchName, setBranchName] = useState<string>("");
  const [branchLocation, setBranchLocation] = useState<string>("");

  function reset() {
    setBranchName("");
    setBranchLocation("");
  }

  async function handleSubmit() {
    // Validation
    if (!branchName || !branchLocation) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const branchData = {
        branchName,
        branchLocation,
      };

      const response = await createBranch(branchData);

      console.log(response);
      toast.success("New Branch Created");
      reset();
      setModalState(false);
      
      if (onBranchCreated) {
        onBranchCreated();
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
        <PlusCircle /> New Branch
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
              Create New Branch
            </h2>

            <div className="flex flex-col gap-1">
              <label className="uppercase font-bold text-grey-gc">
                Branch Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={branchName}
                onChange={(e) => setBranchName(e.target.value)}
                placeholder="e.g., Wafi Dental Care"
                className="outline outline-white/20 hover:outline-white-50 focus:outline-white px-2 py-1 rounded-md bg-transparent text-green-dark dark:text-white"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="uppercase font-bold text-grey-gc">
                Branch Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={branchLocation}
                onChange={(e) => setBranchLocation(e.target.value)}
                placeholder="e.g., Yogyakarta"
                className="outline outline-white/20 hover:outline-white-50 focus:outline-white px-2 py-1 rounded-md bg-transparent text-green-dark dark:text-white"
                required
              />
            </div>

            <Button type="submit">Create Branch</Button>
          </form>
        </ContentCard>
      </div>
    </>
  );
}