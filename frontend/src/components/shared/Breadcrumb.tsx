import { ChevronRight } from "lucide-react";
import Link from "next/link";

export type BreadcrumbData = {
  label: string;
  url: string;
};

export default function Breadcrumb({
  className,
  data,
}: {
  className?: string;
  data: BreadcrumbData[];
}) {
  return (
    <div className={"flex text-green-dark dark:text-grey-gc font-semibold " + className}>
      {data.map((d, index) => (
        <div className="flex items-center" key={d.url}>
          <Link href={d.url} className="hover:bg-white/10 duration-200 px-2 py-1 rounded-md">{d.label}</Link>
          {isTheLastBreadcrumb(index, data.length) ? null : <ChevronRight className="my-2.5" />}
        </div>
      ))}
    </div>
  );
}

function isTheLastBreadcrumb(index: number, length: number) {
  return index === length - 1;
}

