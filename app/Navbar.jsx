"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, getIsAdmin, clearAuthToken } from "../lib/api";

export default function Navbar() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [isAdmin, setIsAdminState] = useState(false);

  useEffect(() => {
    setUserName(getCurrentUser().userName || "");
    setIsAdminState(getIsAdmin());
  }, []);

  function logout() {
    clearAuthToken();
    router.replace("/login");
  }

  return (
    <nav className="navbar">
      <div className="logo">MindLog</div>
      <div>
        {userName && <span style={{ marginRight: 12 }}>Welcome, {userName}!</span>}
        {isAdmin && <a href="/admin">Admin Panel</a>}
        <a href="/weather">Weather</a>
        <a href="http://localhost:8080/swagger-ui/index.html" target="_blank">API Docs</a>
        <button onClick={logout}>Logout</button>
      </div>
    </nav>
  );
}
