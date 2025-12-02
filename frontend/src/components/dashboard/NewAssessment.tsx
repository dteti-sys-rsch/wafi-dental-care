// components/dashboard/NewAssessment.tsx
import { Dispatch, SetStateAction, useState } from "react";
import Button from "../shared/Button";
import { PlusCircle, X } from "lucide-react";
import ContentCard from "../shared/ContentCard";
import { createAssessment } from "@/client/client";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useSession } from "@/contexts/sessionContext";

export default function NewAssessment({
  modalState,
  setModalState,
  patientId,
  onAssessmentCreated,
}: {
  modalState: boolean;
  setModalState: Dispatch<SetStateAction<boolean>>;
  patientId: string;
  onAssessmentCreated?: () => void;
}) {
  const { user } = useSession();
  const router = useRouter();

  const [assessmentDate, setAssessmentDate] = useState<string>(() => {
    const now = new Date();
    return now.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:mm
  });
  const [subjective, setSubjective] = useState<string>("");
  const [objective, setObjective] = useState<string>("");
  const [diagnosisAndAction, setDiagnosisAndAction] = useState<string>("");

  function reset() {
    const now = new Date();
    setAssessmentDate(now.toISOString().slice(0, 16));
    setSubjective("");
    setObjective("");
    setDiagnosisAndAction("");
  }

  async function handleSubmit() {
    // Validation
    if (!subjective || !objective || !diagnosisAndAction) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const assessmentData = {
        patientId: patientId,
        assessmentBy: user?._id,
        assessmentDate: assessmentDate,
        assesementSubjective: subjective,
        assesementObjective: objective,
        assesementDiagnosisAndAction: diagnosisAndAction,
      };

      const response = await createAssessment(assessmentData);

      console.log(response);
      toast.success("Medical Assessment Created");
      reset();
      setModalState(false);

      if (onAssessmentCreated) {
        onAssessmentCreated();
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
        <PlusCircle className="size-[18px]" /> New
      </Button>

      <div
        className={`${
          modalState ? "fixed" : "hidden"
        } top-0 left-0 w-screen h-screen flex justify-center items-center z-50`}
      >
        <div
          className="bg-green-dark/20 backdrop-blur-sm w-full h-full absolute z-0"
          onClick={() => {
            reset();
            setModalState(false);
          }}
        ></div>

        <ContentCard className="relative z-1 w-[80%] max-w-[700px] max-h-[90vh] overflow-y-auto">
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
            <h2 className="text-[20px] font-semibold text-green-dark dark:text-white">New Medical Assessment</h2>

            <div className="flex flex-col gap-1">
              <label className="uppercase font-bold text-grey-gc">
                Assessment Date & Time <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                value={assessmentDate}
                onChange={(e) => setAssessmentDate(e.target.value)}
                className="outline outline-white/20 hover:outline-white-50 focus:outline-white px-2 py-1 rounded-md bg-transparent text-green-dark dark:text-white"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="uppercase font-bold text-grey-gc">
                Subjective (S) <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-grey-dark dark:text-grey-gc mb-1">
                Patient&apos;s complaints, symptoms, and history
              </p>
              <textarea
                value={subjective}
                onChange={(e) => setSubjective(e.target.value)}
                rows={4}
                placeholder="e.g., Patient complains of headache for 2 days, nausea, no fever..."
                className="outline outline-white/20 hover:outline-white-50 focus:outline-white px-2 py-1 rounded-md bg-transparent text-green-dark dark:text-white resize-none"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="uppercase font-bold text-grey-gc">
                Objective (O) <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-grey-dark dark:text-grey-gc mb-1">
                Physical examination findings, vital signs, test results
              </p>
              <textarea
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                rows={4}
                placeholder="e.g., BP: 120/80 mmHg, Temp: 37°C, examination findings..."
                className="outline outline-white/20 hover:outline-white-50 focus:outline-white px-2 py-1 rounded-md bg-transparent text-green-dark dark:text-white resize-none"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="uppercase font-bold text-grey-gc">
                Assessment & Plan (A) <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-grey-dark dark:text-grey-gc mb-1">
                Diagnosis, treatment plan, medications, follow-up instructions
              </p>
              <textarea
                value={diagnosisAndAction}
                onChange={(e) => setDiagnosisAndAction(e.target.value)}
                rows={5}
                placeholder="e.g., Diagnosis: Tension headache. Plan: Prescribe paracetamol 500mg 3x daily, rest, follow-up in 3 days if symptoms persist..."
                className="outline outline-white/20 hover:outline-white-50 focus:outline-white px-2 py-1 rounded-md bg-transparent text-green-dark dark:text-white resize-none"
                required
              />
            </div>

            <Button type="submit">Create Assessment</Button>
          </form>
        </ContentCard>
      </div>
    </>
  );
}

