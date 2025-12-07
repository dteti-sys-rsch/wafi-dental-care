"use client"
import { Dispatch, SetStateAction, useState, useEffect } from "react";
import { PlusCircle, X } from "lucide-react";
import { PaymentMethod, IPatient, IUser, IBranch } from "@/app/types";
import { createTransaction, getAllPatients, getAllUsers, getAllBranches } from "@/client/client";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Button from "@/components/shared/Button";
import ContentCard from "@/components/shared/ContentCard";

export default function NewTransaction({
  modalState,
  setModalState,
  onTransactionCreated,
}: {
  modalState: boolean;
  setModalState: Dispatch<SetStateAction<boolean>>;
  onTransactionCreated?: () => void;
}) {
  const router = useRouter();

  const [patients, setPatients] = useState<IPatient[]>([]);
  const [doctors, setDoctors] = useState<IUser[]>([]);
  const [branches, setBranches] = useState<IBranch[]>([]);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);

  const [transactionDate, setTransactionDate] = useState<string>(() => {
    const now = new Date();
    return now.toISOString().slice(0, 16);
  });
  const [transactionAmount, setTransactionAmount] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | "">("");
  const [patientId, setPatientId] = useState<string>("");
  const [doctorId, setDoctorId] = useState<string>("");
  const [branchId, setBranchId] = useState<string>("");

  useEffect(() => {
    if (modalState) {
      fetchData();
      const now = new Date();
      setTransactionDate(now.toISOString().slice(0, 16));
    }
  }, [modalState]);

  const fetchData = async () => {
    try {
      setIsLoadingData(true);
      const [patientsRes, usersRes, branchesRes] = await Promise.all([
        getAllPatients(),
        getAllUsers(),
        getAllBranches()
      ]);
      
      setPatients(patientsRes.patients || patientsRes);
      // Filter only doctors
      const allUsers = usersRes.users || usersRes;
      setDoctors(allUsers.filter((u: IUser) => u.role === 'DOCTOR'));
      setBranches(branchesRes.branches || branchesRes);
    } catch (error) {
      toast.error("Failed to load data" + (error instanceof Error ? `: ${error.message}` : ""));
    } finally {
      setIsLoadingData(false);
    }
  };

  function reset() {
    const now = new Date();
    setTransactionDate(now.toISOString().slice(0, 16));
    setTransactionAmount("");
    setPaymentMethod("");
    setPatientId("");
    setDoctorId("");
    setBranchId("");
  }

  async function handleSubmit() {
    if (!transactionDate || !transactionAmount || !paymentMethod || !patientId || !doctorId || !branchId) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (parseFloat(transactionAmount) <= 0) {
      toast.error("Transaction amount must be greater than 0");
      return;
    }

    try {
      const transactionData = {
        date: transactionDate,
        amount: parseFloat(transactionAmount),
        payment: paymentMethod,
        patientId,
        doctorId,
        branchId,
      };

      const response = await createTransaction(transactionData);

      console.log(response);
      toast.success("Transaction Created Successfully");
      reset();
      setModalState(false);
      
      if (onTransactionCreated) {
        onTransactionCreated();
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
        <PlusCircle /> New Transaction
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
            <h2 className="text-[20px] font-semibold text-green-dark dark:text-white">
              New Transaction
            </h2>

            {isLoadingData ? (
              <div className="flex items-center justify-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-dark dark:border-white"></div>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-1">
                  <label className="uppercase font-bold text-grey-gc">
                    Patient <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    className={
                      (!patientId ? "text-white/50" : "text-white") +
                      " outline outline-white/20 hover:outline-white-50 focus:outline-white px-2 py-1 rounded-md bg-transparent"
                    }
                    required
                  >
                    <option value="" disabled className="bg-dark-secondary">
                      Select Patient
                    </option>
                    {patients.map((patient) => (
                      <option key={patient._id} value={patient._id} className="bg-dark-secondary">
                        {patient.patientFullName} - {patient.patientMedicalRecordNumber}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="uppercase font-bold text-grey-gc">
                    Doctor <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={doctorId}
                    onChange={(e) => setDoctorId(e.target.value)}
                    className={
                      (!doctorId ? "text-white/50" : "text-white") +
                      " outline outline-white/20 hover:outline-white-50 focus:outline-white px-2 py-1 rounded-md bg-transparent"
                    }
                    required
                  >
                    <option value="" disabled className="bg-dark-secondary">
                      Select Doctor
                    </option>
                    {doctors.map((doctor) => (
                      <option key={doctor._id} value={doctor._id} className="bg-dark-secondary">
                        {doctor.username}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="uppercase font-bold text-grey-gc">
                    Branch <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={branchId}
                    onChange={(e) => setBranchId(e.target.value)}
                    className={
                      (!branchId ? "text-white/50" : "text-white") +
                      " outline outline-white/20 hover:outline-white-50 focus:outline-white px-2 py-1 rounded-md bg-transparent"
                    }
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
                </div>

                <div className="flex flex-col gap-1">
                  <label className="uppercase font-bold text-grey-gc">
                    Transaction Date & Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={transactionDate}
                    onChange={(e) => setTransactionDate(e.target.value)}
                    className="outline outline-white/20 hover:outline-white-50 focus:outline-white px-2 py-1 rounded-md bg-transparent text-green-dark dark:text-white"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="uppercase font-bold text-grey-gc">
                    Amount (IDR) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={transactionAmount}
                    onChange={(e) => setTransactionAmount(e.target.value)}
                    placeholder="50000"
                    min="0"
                    className="outline outline-white/20 hover:outline-white-50 focus:outline-white px-2 py-1 rounded-md bg-transparent text-green-dark dark:text-white"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="uppercase font-bold text-grey-gc">
                    Payment Method <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className={
                      (!paymentMethod ? "text-white/50" : "text-white") +
                      " outline outline-white/20 hover:outline-white-50 focus:outline-white px-2 py-1 rounded-md bg-transparent"
                    }
                    required
                  >
                    <option value="" disabled className="bg-dark-secondary">
                      Select Payment Method
                    </option>
                    <option value={PaymentMethod.CASH} className="bg-dark-secondary">
                      {PaymentMethod.CASH}
                    </option>
                    <option value={PaymentMethod.CARD} className="bg-dark-secondary">
                      {PaymentMethod.CARD}
                    </option>
                    <option value={PaymentMethod.QRIS} className="bg-dark-secondary">
                      {PaymentMethod.QRIS}
                    </option>
                  </select>
                </div>
              </>
            )}

            <Button type="submit" disabled={isLoadingData}>
              Create Transaction
            </Button>
          </form>
        </ContentCard>
      </div>
    </>
  );
}