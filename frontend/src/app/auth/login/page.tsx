"use client";

import Image from "next/image";
import LogoWhite from "@/../public/LogoWhite.png";
import ThemeSwitcher from "@/components/shared/ThemeSwitcher";
import Button from "@/components/shared/Button";
import { FormEvent, useState } from "react";
import { toast } from "react-toastify";
import { useSession } from "@/contexts/sessionContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const { login } = useSession();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (username == "") {
      return toast("Username cannot be empty");
    }

    if (password == "") {
      return toast("Password cannot be empty");
    }

    try {
      const response = await login(username, password);
      console.log(response);
      toast("Login success");
      router.replace("/dashboard");
    } catch (error) {
      toast(error instanceof Error ? error.message : "An error occurred");
    }
  }

  return (
    <main className="min-h-screen relative flex flex-col justify-center items-center bg-light-primary dark:bg-dark-primary text-green-dark dark:text-white">
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

      <div>
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className="flex flex-col gap-2">
            <label>Username</label>
            <input
              className="outline outline-green-dark dark:outline-white py-1 px-2"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label>Password</label>
            <input
              className="outline outline-green-dark dark:outline-white py-1 px-2"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button type="submit">
            <span>Log In</span>
          </Button>
        </form>
      </div>

      <div className="absolute bottom-0 right-0 p-10">
        <ThemeSwitcher />
      </div>
    </main>
  );
}

