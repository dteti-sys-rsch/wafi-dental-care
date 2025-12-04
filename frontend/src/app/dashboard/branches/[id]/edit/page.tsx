"use client";
import Breadcrumb from "@/components/shared/Breadcrumb";
import WorkInProgress from "@/components/shared/WorkInProgress";
import { ProtectedRoute } from "@/contexts/sessionContext";
import { useParams } from "next/navigation";

export default function EditBranchPage() {
  const { id } = useParams();
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
      label: "Branches",
      url: "/dashboard/branches",
    },
    {
      label: id as string,
      url: `/dashboard/branches/${id}`,
    },
    {
      label: "Edit",
      url: `/dashboard/branches/${id}/edit`
    }
  ];

  return (
    <ProtectedRoute>
      <main className="bg-light-secondary dark:bg-dark-primary w-full h-screen p-10">
        <Breadcrumb data={breadcrumbData} />
        <WorkInProgress />
      </main>
    </ProtectedRoute>
  );
}