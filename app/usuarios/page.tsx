"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  _count: { tasks: number };
}

export default function UsuariosPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/usuarios")
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setUsers(res.data);
        } else {
          setError(res.message || "Error al cargar usuarios");
        }
      })
      .catch(() => setError("Error de conexión"))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este usuario?")) return;

    const res = await fetch(`/api/usuarios/${id}`, { method: "DELETE" });
    const data = await res.json();

    if (data.success) {
      setUsers(users.filter((u) => u.id !== id));
    } else {
      alert(data.message);
    }
  };

  if (error) {
    return (
      <AppShell>
        <p className="text-center text-red-600">{error}</p>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Usuarios</h1>
          <p className="text-slate-500">Gestión de usuarios del sistema</p>
        </div>

        <Card>
          <CardBody>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
              </div>
            ) : users.length === 0 ? (
              <p className="text-center text-slate-500 py-8">No hay usuarios registrados</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 font-medium text-slate-700">Nombre</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-700">Correo</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-700">Rol</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-700">Tareas</th>
                      <th className="text-right py-3 px-4 font-medium text-slate-700">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4">{user.name}</td>
                        <td className="py-3 px-4">{user.email}</td>
                        <td className="py-3 px-4">
                          <Badge variant={user.role === "ADMIN" ? "danger" : "default"}>
                            {user.role === "ADMIN" ? "Administrador" : "Usuario"}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">{user._count.tasks}</td>
                        <td className="py-3 px-4 text-right">
                          <Button variant="danger" size="sm" onClick={() => handleDelete(user.id)}>
                            Eliminar
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </AppShell>
  );
}
