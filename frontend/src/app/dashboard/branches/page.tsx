import Breadcrumb from "@/components/shared/Breadcrumb";

export default function PatientPage() {
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
  ];
  
  return (
    <main className="bg-light-secondary dark:bg-dark-primary w-full h-screen p-10">
      <Breadcrumb data={breadcrumbData} />
    </main>
  );
}
