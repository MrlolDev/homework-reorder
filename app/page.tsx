"use client";

import App from "@/components/App";
import Auth from "@/components/Auth";
import { ThemeToggle } from "@/components/ThemeToggle";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [auth, setAuth] = useState(false);
  return (
    <>
      <ThemeToggle></ThemeToggle>

      <main className="flex flex-col items-center">
        {auth ? <App></App> : <Auth setAuth={setAuth}></Auth>}
      </main>
    </>
  );
}
