"use client"
import Breadcrumb from "@/components/shared/Breadcrumb";
import { useParams } from "next/navigation";

export default function PatientDetailPage() {
  const {id} = useParams();
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
    {
      label: id as string,
      url: `/dashboard/patients/${id}`,
    },
  ];
  
  return (
    <main className="bg-light-secondary dark:bg-dark-primary w-full h-screen p-10">
      <Breadcrumb data={breadcrumbData} />
    </main>
  );
}
