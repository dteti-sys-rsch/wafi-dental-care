import Breadcrumb from "@/components/shared/Breadcrumb";

export default function UsersAndStaffsPage() {
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
      label: "Users & Staff",
      url: "/dashboard/users",
    },
  ];
  
  return (
    <main className="bg-light-secondary dark:bg-dark-primary w-full h-screen p-10">
      <Breadcrumb data={breadcrumbData} />
    </main>
  );
}
