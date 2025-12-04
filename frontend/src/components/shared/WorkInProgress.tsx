import { Construction } from "lucide-react";

export default function WorkInProgress() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <Construction className="w-24 h-24 text-grey-dark dark:text-grey-gc mb-6" />
      <h2 className="text-3xl font-bold text-green-dark dark:text-white mb-3">
        Work In Progress
      </h2>
      <p className="text-grey-dark dark:text-grey-gc max-w-md">
        This feature is currently under development. Check back soon!
      </p>
    </div>
  );
}