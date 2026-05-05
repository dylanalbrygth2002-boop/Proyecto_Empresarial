"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/Badge";
import { Card, CardBody } from "@/components/ui/Card";

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
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((res) => {
        if (res.success) setUser(res.data.user);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <AppShell>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      </AppShell>
    );
  }

  if (!user) {
    return (
      <AppShell>
        <p className="text-center text-slate-500">No se pudo cargar el perfil</p>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Perfil</h1>
          <p className="text-slate-500">Información de tu cuenta</p>
        </div>

        <Card>
          <CardBody className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500">Nombre</p>
                <p className="font-medium text-lg">{user.name}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Correo electrónico</p>
                <p className="font-medium text-lg">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Rol</p>
                <Badge variant={user.role === "ADMIN" ? "danger" : "default"} className="mt-1">
                  {user.role === "ADMIN" ? "Administrador" : "Usuario"}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-slate-500">Miembro desde</p>
                <p className="font-medium">{new Date(user.createdAt).toLocaleDateString("es-ES")}</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </AppShell>
  );
}
