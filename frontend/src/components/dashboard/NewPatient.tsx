import { Dispatch, SetStateAction, useState } from "react";
import Button from "../shared/Button";
import { PlusCircle, X } from "lucide-react";
import ContentCard from "../shared/ContentCard";
import { Gender } from "@/app/types";
import { createNewPatient } from "@/client/client";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function NewPatient({
  modalState,
  setModalState,
}: {
  modalState: boolean;
  setModalState: Dispatch<SetStateAction<boolean>>;
}) {
  const [fullName, setFullName] = useState<string>("");
  const [dob, setDob] = useState<string>("");
  const [pob, setPob] = useState<string>("");
  const [gender, setGender] = useState<Gender | null>(null);
  const [address, setAddress] = useState<string>("");
  const [nik, setNik] = useState<string>("");
  const [waNumber, setWaNumber] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const router = useRouter();

  function reset() {
    setFullName("");
    setDob("");
    setPob("");
    setGender(null);
    setAddress("");
    setNik("");
    setWaNumber("");
    setEmail("");
  }

  async function handleSubmit() {
    try {
      const patientData: {
        medicalRecordNumber: string;
        fullname: string;
        DOB: string;
        birthPlace: string;
        gender: Gender;
        address: string;
        NIK: string;
        WAPhoneNumber: string;
        email: string;
      } = {
        medicalRecordNumber: `DMS-${new Date().getFullYear()}-${Math.random() * 999}`,
        fullname: fullName,
        DOB: dob,
        birthPlace: pob,
        gender: gender as Gender,
        address: address,
        NIK: nik,
        WAPhoneNumber: waNumber,
        email: email,
      };
      const response = await createNewPatient(patientData);

      console.log(response);
      toast.success("New Patient Created");
    } catch (error) {
      if (error instanceof Error) {
        if (error.message == "Authentication Error") {
          toast.error("Authentication failed, please authenticate again");
          return router.replace("/auth/login");
        }
        toast.error(error.message);
      }
      toast.error("An error occured");
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
        <PlusCircle /> New Patient
      </Button>

      <div
        className={`${modalState ? "fixed" : "hidden"} top-0 left-0 w-screen h-screen flex justify-center items-center`}
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
            <h2 className="text-[20px] font-semibold text-green-dark dark:text-white">Register New Patient</h2>

            <div className="flex flex-col gap-1">
              <label className="uppercase font-bold text-grey-gc">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="outline outline-white/20 hover:outline-white-50 focus:outline-white px-2 py-1 rounded-md"
              />
            </div>

            <div className="flex flex-row-reverse gap-2.5">
              <div className="flex flex-col gap-1 shrink-0 w-fit">
                <label className="uppercase font-bold text-grey-gc">Date of Birth</label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="outline outline-white/20 hover:outline-white-50 focus:outline-white px-2 py-1 rounded-md"
                />
              </div>

              <div className="flex flex-col gap-1 w-full ">
                <label className="uppercase font-bold text-grey-gc">Place of Birth</label>
                <input
                  type="text"
                  value={pob}
                  onChange={(e) => setPob(e.target.value)}
                  className="outline outline-white/20 hover:outline-white-50 focus:outline-white px-2 py-1 rounded-md"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="uppercase font-bold text-grey-gc">Gender</label>
              <select
                className={
                  (!gender ? "text-white/50" : "text-white") +
                  " outline outline-white/20 hover:outline-white-50 focus:outline-white px-2 py-1 rounded-md"
                }
                value={gender as string ?? ""}
                onChange={(e) => setGender(e.target.value as Gender)}
              >
                <option
                  className="bg-dark-secondary"
                  disabled
                  value=""
                  key="placeholder"
                >
                  Select Gender
                </option>
                <option
                  className="bg-dark-secondary"
                  value={Gender.MALE}
                  key={Gender.MALE}
                >
                  {Gender.MALE}
                </option>
                <option
                  className="bg-dark-secondary"
                  value={Gender.FEMALE}
                  key={Gender.FEMALE}
                >
                  {Gender.FEMALE}
                </option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="uppercase font-bold text-grey-gc">Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="outline outline-white/20 hover:outline-white-50 focus:outline-white px-2 py-1 rounded-md"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="uppercase font-bold text-grey-gc">NIK</label>
              <input
                type="text"
                value={nik}
                onChange={(e) => setNik(e.target.value)}
                className="outline outline-white/20 hover:outline-white-50 focus:outline-white px-2 py-1 rounded-md"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="uppercase font-bold text-grey-gc">WhatsApp Number</label>
              <input
                type="text"
                value={waNumber}
                onChange={(e) => setWaNumber(e.target.value)}
                className="outline outline-white/20 hover:outline-white-50 focus:outline-white px-2 py-1 rounded-md"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="uppercase font-bold text-grey-gc">Email</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="outline outline-white/20 hover:outline-white-50 focus:outline-white px-2 py-1 rounded-md"
              />
            </div>

            <Button type="submit">Add Patient</Button>
          </form>
        </ContentCard>
      </div>
    </>
  );
}

