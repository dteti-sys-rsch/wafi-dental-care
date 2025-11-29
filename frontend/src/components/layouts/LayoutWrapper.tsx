"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "../dashboard/Sidebar";
import { SessionProvider } from "@/contexts/sessionContext";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  
  if (path?.startsWith("/dashboard")) {
    return (
      <SessionProvider>
        <div className="flex">
        <Sidebar />
        <div className="flex-1">
          {children}
        </div>
      </div>
      </SessionProvider>
    );
  }

  return <SessionProvider>{children}</SessionProvider>;
}
