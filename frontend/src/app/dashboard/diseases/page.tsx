"use client"
import Breadcrumb from "@/components/shared/Breadcrumb";
import WorkInProgress from "@/components/shared/WorkInProgress";
import { ProtectedRoute } from "@/contexts/sessionContext";

export default function DiseasesPage() {
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
      label: "Diseases",
      url: "/dashboard/diseases",
    },
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

