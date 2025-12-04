// components/dashboard/NewDiseaseHistory.tsx
import { Dispatch, SetStateAction, useState } from "react";
import Button from "../shared/Button";
import { PlusCircle, X } from "lucide-react";
import ContentCard from "../shared/ContentCard";
import { addDiseaseHistory } from "@/client/client";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function NewDiseaseHistory({
  modalState,
  setModalState,
  patientId,
  onDiseaseHistoryCreated,
}: {
  modalState: boolean;
  setModalState: Dispatch<SetStateAction<boolean>>;
  patientId: string;
  onDiseaseHistoryCreated?: () => void;
}) {
  const router = useRouter();

  const [diseaseName, setDiseaseName] = useState<string>("");
  const [diseaseDescription, setDiseaseDescription] = useState<string>("");
  const [diseaseDiagnosisDate, setDiseaseDiagnosisDate] = useState<string>("");

  function reset() {
    setDiseaseName("");
    setDiseaseDescription("");
    setDiseaseDiagnosisDate("");
  }

  async function handleSubmit() {
    // Validation
    if (!diseaseName || !diseaseDiagnosisDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const diseaseData = {
        patientId: patientId,
        diseaseName: diseaseName,
        diseaseDescription: diseaseDescription,
        diseaseDiagnosisDate: diseaseDiagnosisDate,
      };

      const response = await addDiseaseHistory(diseaseData);

      console.log(response);
      toast.success("Disease History Added");
      reset();
      setModalState(false);
      
      if (onDiseaseHistoryCreated) {
        onDiseaseHistoryCreated();
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
        <PlusCircle /> Add Disease
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
              Add Disease History
            </h2>

            <div className="flex flex-col gap-1">
              <label className="uppercase font-bold text-grey-gc">
                Disease Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={diseaseName}
                onChange={(e) => setDiseaseName(e.target.value)}
                placeholder="e.g., Diabetes Type 2"
                className="outline outline-white/20 hover:outline-white-50 focus:outline-white px-2 py-1 rounded-md bg-transparent text-green-dark dark:text-white"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="uppercase font-bold text-grey-gc">
                Diagnosis Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={diseaseDiagnosisDate}
                onChange={(e) => setDiseaseDiagnosisDate(e.target.value)}
                className="outline outline-white/20 hover:outline-white-50 focus:outline-white px-2 py-1 rounded-md bg-transparent text-green-dark dark:text-white"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="uppercase font-bold text-grey-gc">
                Description (Optional)
              </label>
              <textarea
                value={diseaseDescription}
                onChange={(e) => setDiseaseDescription(e.target.value)}
                rows={4}
                placeholder="Additional notes about the diagnosis, treatment history, etc..."
                className="outline outline-white/20 hover:outline-white-50 focus:outline-white px-2 py-1 rounded-md bg-transparent text-green-dark dark:text-white resize-none"
              />
            </div>

            <Button type="submit">Add Disease History</Button>
          </form>
        </ContentCard>
      </div>
    </>
  );
}