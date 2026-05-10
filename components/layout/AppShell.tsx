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
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-200 border-t-indigo-600" />
          <p className="text-sm font-medium text-slate-500">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AppSidebar userRole={userRole} />
      <div className="lg:ml-64 min-h-screen">
        <main className="p-4 pt-20 lg:p-8 lg:pt-8 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
