import Breadcrumb from "@/components/shared/Breadcrumb";

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
    <main className="bg-light-secondary dark:bg-dark-primary w-full h-screen p-10">
      <Breadcrumb data={breadcrumbData} />
    </main>
  );
}
