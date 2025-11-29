"use client";

import { getAllPatients } from "@/client/client";
import NewPatient from "@/components/dashboard/NewPatient";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function PatientPage() {
  const [openNewPatientModal, setOpenNewPatientModal] = useState<boolean>(false);
  useEffect(() => {
    async function fetchPatients() {
      try {
        const response = await getAllPatients();
        console.log(response);
      } catch (error) {
        toast(error instanceof Error ? error.message : "An Error Occurred");
      }
    }
    fetchPatients();
  }, []);

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
      label: "Patients",
      url: "/dashboard/patients",
    },
  ];

  return (
    <main className="bg-light-secondary dark:bg-dark-primary w-full h-screen p-10">
      <Breadcrumb data={breadcrumbData} />
      <div className="flex justify-between">
        <h1 className="text-[32px] font-semibold text-green-dark dark:text-white">Patients Management</h1>
        <NewPatient modalState={openNewPatientModal} setModalState={setOpenNewPatientModal} />
      </div>
      <p className="font-semibold text-grey-dark dark:text-grey-gc mt-2">Manage patients of your clinic here.</p>
    </main>
  );
}

