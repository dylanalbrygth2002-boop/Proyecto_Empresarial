"use client";

import { useAuth } from "@/lib/use-auth";
import { AppSidebar } from "./AppSidebar";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppSidebar userRole={user.role} />
      <div className="lg:ml-64 min-h-screen">
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}