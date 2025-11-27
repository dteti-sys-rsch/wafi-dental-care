import Image from "next/image";
import LogoWhite from "@/../public/LogoWhite.png";
import ThemeSwitcher from "./components/shared/ThemeSwitcher";
import Link from "next/link";
import Button from "./components/shared/Button";

export default function Home() {
  return (
    <main className="min-h-screen relative flex flex-col justify-center items-center bg-light-primary dark:bg-dark-primary">
      <div className="flex gap-2.5 items-center justify-center">
        <Image
          src={LogoWhite}
          className="w-20"
          alt="Logo"
        />
        <div className="flex flex-col gap-0">
          <p className="text-green-dark dark:text-white font-bold text-[32px]">DENTAL</p>
          <span className="text-[20px] font-bold">
            <span className="text-green-dark dark:text-white">MANAGEMENT SYSTEM</span>
          </span>
        </div>
      </div>

      <div className="mt-10">
        <Link href="/dashboard">
          <Button type="button" className="px-10">
            <span>Log In</span>
          </Button>
        </Link>
      </div>

      <div className="absolute bottom-0 right-0 p-10">
        <ThemeSwitcher />
      </div>
    </main>
  );
}

