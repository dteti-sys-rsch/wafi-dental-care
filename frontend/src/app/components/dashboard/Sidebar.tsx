"use client";

import Image from "next/image";
import ThemeSwitcher from "../shared/ThemeSwitcher";
import LogoWhite from "@/../public/LogoWhite.png";
import { usePathname } from "next/navigation";
import NavigationItem from "./NavigationLink";
import { House, User } from "lucide-react";
import Link from "next/link";

export function Sidebar() {
  const path = usePathname();

  const mainLinks = [
    { label: "Main Dashboard", link: "/dashboard", icon: <House />, active: path === "/dashboard" },
    { label: "Customers", link: "/dashboard/customers", icon: <User />, active: path === "/dashboard/customers"}
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

        <h1 className="text-grey-gc font-bold text-[14px] mb-2.5">MAIN</h1>
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

        <h1 className="text-grey-gc font-bold text-[14px] mb-2.5 mt-5">OTHERS</h1>
      </div>

      <div className="mx-auto">
        <ThemeSwitcher />
      </div>
    </aside>
  );
}

