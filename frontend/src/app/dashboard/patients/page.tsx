"use client"

import { getAllPatients } from "@/client/client";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function PatientPage() {
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
    </main>
  );
}

