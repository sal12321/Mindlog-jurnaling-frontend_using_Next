"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuthToken } from "../lib/api";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.replace(getAuthToken() ? "/journal" : "/login");
  }, [router]);
  return null;
}
