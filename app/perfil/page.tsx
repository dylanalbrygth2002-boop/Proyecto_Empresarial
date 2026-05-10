"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/Badge";
import { Card, CardBody } from "@/components/ui/Card";
import { getAuthHeaders } from "@/components/AuthProvider";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function PerfilPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me", { headers: getAuthHeaders() })
      .then((res) => res.json())
      .then((res) => { if (res.success) setUser(res.data.user); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <AppShell><div className="flex justify-center py-12"><div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-200 border-t-indigo-600" /></div></AppShell>;
  if (!user) return <AppShell><p className="text-center text-slate-500 py-12">No se pudo cargar el perfil</p></AppShell>;

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Perfil</h1>
          <p className="text-sm text-slate-500 mt-0.5">Información de tu cuenta</p>
        </div>

        <Card color="purple" className="!border-t-4">
          <CardBody className="space-y-6">
            <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <span className="text-2xl font-bold text-white">{user.name.charAt(0).toUpperCase()}</span>
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">{user.name}</h2>
                <p className="text-sm text-slate-500">{user.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Correo electrónico</p>
                <p className="font-semibold text-slate-900">{user.email}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Rol</p>
                <Badge variant={user.role === "ADMIN" ? "danger" : "purple"} className="mt-0.5">
                  {user.role === "ADMIN" ? "Administrador" : "Usuario"}
                </Badge>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Miembro desde</p>
                <p className="font-semibold text-slate-900">{new Date(user.createdAt).toLocaleDateString("es-ES", { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">ID de usuario</p>
                <p className="font-mono text-xs text-slate-600 truncate">{user.id}</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </AppShell>
  );
}
