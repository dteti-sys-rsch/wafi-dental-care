export default function SeverityBadge({ level, className }: { level: "low" | "medium" | "high"; className?: string }) {
  let defaultClass = "";

  switch (level) {
    case "low":
      defaultClass = "bg-green-200 outline-green-700 text-green-700";
      break;
    case "medium":
      defaultClass = "bg-orange-200 outline-orange-500 text-orange-500";
      break;
    case "high":
      defaultClass = "bg-red-200 outline-red-500 text-red-500";
      break;
    default:
      throw new Error("invalid severity level");
  }

  return <div className={`${defaultClass} rounded-full font-semibold outline-1 text-[14px] px-2 text-center ${className}`}>{toCamelCase(level)}</div>;
}

function toCamelCase(str: string) {
  return str[0].toUpperCase() + str.slice(1, str.length);
}

