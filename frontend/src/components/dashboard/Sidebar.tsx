"use client";

import Image from "next/image";
import ThemeSwitcher from "../shared/ThemeSwitcher";
import LogoWhite from "@/../public/LogoWhite.png";
import { usePathname } from "next/navigation";
import NavigationItem from "./NavigationLink";
import { Building2, Calendar, FileText, House, UserCog, Users, NotebookPen } from "lucide-react";
import Link from "next/link";

export function Sidebar() {
  const path = usePathname();

  const mainLinks = [
    {
      label: "Main Dashboard",
      link: "/dashboard",
      icon: <House />,
      active: path === "/dashboard",
    },
    {
      label: "Patients",
      link: "/dashboard/patients",
      icon: <Users />,
      active: path.startsWith("/dashboard/patients"),
    },
    {
      label: "Transactions",
      link: "/dashboard/transactions",
      icon: <NotebookPen />,
      active: path.startsWith("/dashboard/transactions"),
    },
    {
      label: "Appointments",
      link: "/dashboard/appointments",
      icon: <Calendar />,
      active: path.startsWith("/dashboard/appointments"),
    },
  ];

  const managementLinks = [
    {
      label: "Branches",
      link: "/dashboard/branches",
      icon: <Building2 />,
      active: path.startsWith("/dashboard/branches"),
      // Roles: OWNER, MANAGER
    },
    {
      label: "Users & Staff",
      link: "/dashboard/users",
      icon: <UserCog />,
      active: path.startsWith("/dashboard/users"),
      // Roles: OWNER, MANAGER
    },
    {
      label: "Disease Registry",
      link: "/dashboard/diseases",
      icon: <FileText />,
      active: path.startsWith("/dashboard/diseases"),
      // Common diseases, templates, ICD codes
      // Roles: OWNER, MANAGER, DOCTOR
    },
  ];

  return (
    <aside className="flex flex-col justify-between p-10 bg-white dark:bg-dark-secondary outline-dark-primary/20 dark:outline-white/20 outline-1 w-[275px] min-h-screen shrink-0">
      <div>
        <Link
          href="/"
          className="flex gap-2.5 items-center justify-center"
        >
          <Image
            src={LogoWhite}
            className="w-10"
            alt="Logo"
          />
          <div className="flex flex-col gap-0">
            <p className="text-green-dark dark:text-white font-bold text-[18px]">DENTAL</p>
            <span className="text-[12px] font-bold">
              <span className="text-green-dark dark:text-white">MANAGEMENT SYSTEM</span>
            </span>
          </div>
        </Link>

        <hr className="border-grey-gc mt-4 mb-[50px]" />

        <h1 className="text-grey-gc font-bold text-[14px] mb-2.5">MENU</h1>
        <div className="flex flex-col gap-2.5">
          {mainLinks.map((item) => (
            <NavigationItem
              key={item.label}
              link={item.link}
              label={item.label}
              icon={item.icon}
              active={item.active}
            />
          ))}
        </div>

        <h1 className="text-grey-gc font-bold text-[14px] mb-2.5 mt-5">MANAGEMENT</h1>
        <div className="flex flex-col gap-2.5">
          {managementLinks.map((item) => (
            <NavigationItem
              key={item.label}
              link={item.link}
              label={item.label}
              icon={item.icon}
              active={item.active}
            />
          ))}
        </div>
      </div>

      <div className="mx-auto">
        <ThemeSwitcher />
      </div>
    </aside>
  );
}

