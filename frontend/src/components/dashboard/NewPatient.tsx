import { Dispatch, SetStateAction } from "react";
import Button from "../shared/Button";
import { PlusCircle } from "lucide-react";
import ContentCard from "../shared/ContentCard";

export default function NewPatient({
  modalState,
  setModalState,
}: {
  modalState: boolean;
  setModalState: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <>
      <Button
        className="flex gap-2 items-center justify-center"
        onClick={(e) => {
          e.preventDefault();
          setModalState(true);
        }}
      >
        <PlusCircle /> New Patient
      </Button>

      <div className={`${modalState ? "fixed" : "hidden"} top-0 left-0 w-screen h-screen flex justify-center items-center`}>
        <div
          className="bg-green-dark/20 backdrop-blur-sm w-full h-full absolute z-0"
          onClick={() => setModalState(false)}
        >
        </div>

        <ContentCard className="relative z-1 w-[80%] max-w-[600px]">
          <form>
            <h2 className="text-[20px] font-semibold text-green-dark dark:text-white">Register New Patient</h2>

            <div className="flex flex-col gap-1">
              <label>Medical Record Number</label>
            </div>
          </form>
        </ContentCard>
      </div>
    </>
  );
}

