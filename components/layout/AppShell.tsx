"use client";

import { useEffect, useState } from "react";
import { AppSidebar } from "./AppSidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [userRole, setUserRole] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const role = localStorage.getItem("userRole");
    
    if (!userId) {
      window.location.href = "/login";
      return;
    }

    setUserRole(role || "USER");
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppSidebar userRole={userRole} />
      <div className="lg:ml-64 min-h-screen">
        <main className="p-4 pt-16 lg:p-6">{children}</main>
      </div>
    </div>
  );
}