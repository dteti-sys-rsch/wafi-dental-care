import React from "react";

export default function ContentCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={
        "p-[30px] bg-white dark:bg-dark-secondary/80 text-dark dark:text-white rounded-[20px] outline outline-dark/20 dark:outline-white/20 shadow-[0_2px_6px_rgba(0,0,50,.25)] " +
        className
      }
    >
      {children}
    </div>
  );
}

