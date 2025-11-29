import Breadcrumb from "../../components/shared/Breadcrumb";
import { BreadcrumbData } from "../../components/shared/Breadcrumb";
import ContentCard from "../../components/shared/ContentCard";

export const metadata = {
  title: "Dashboard",
  description: "DMS Dashboard",
};

export default function DashboardPage() {
  const breadcrumbData: BreadcrumbData[] = [
    {
      label: "Home",
      url: "/",
    },
    {
      label: "Dashboard",
      url: "/dashboard",
    },
  ];

  return (
    <main className="bg-light-secondary dark:bg-dark-primary w-full h-screen p-10">
      <Breadcrumb data={breadcrumbData} />
      <h1 className="text-[32px] font-semibold text-green-dark dark:text-white">Overview</h1>
      <p className="font-semibold text-grey-dark dark:text-grey-gc mt-2">
        View important metrics for your dental clinic here.
      </p>

      <ContentCard className="my-7">
        <div className="flex justify-between">
          <div className="flex flex-col text-grey-gc">
            <h1 className="text-[30px] font-bold text-dark dark:text-white">15</h1>
            <p className="text-[20px] font-medium max-w-[15ch]">New Customers</p>
          </div>
          <div className="flex flex-col text-grey-gc">
            <h1 className="text-[30px] font-bold text-dark dark:text-white">20</h1>
            <p className="text-[20px] font-medium">Total Customers</p>
          </div>
          <div className="flex flex-col text-grey-gc">
            <h1 className="text-[30px] font-bold text-dark dark:text-white">545K</h1>
            <p className="text-[20px] font-medium">Monthly Revenue (IDR)</p>
          </div>
        </div>
      </ContentCard>

      <ContentCard>
        <h1 className="text-[24px] font-semibold text-green-dark dark:text-white">Title</h1>
        <p className="font-semibold text-grey-dark dark:text-grey-gc mb-5">
          Explanation for this section.
        </p>
      </ContentCard>
    </main>
  );
}

