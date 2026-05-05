"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";

interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  status: string;
  _count: { projects: number };
}

export default function ClientesPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/clientes")
      .then((res) => res.json())
      .then((res) => {
        if (res.success) setClients(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este cliente?")) return;

    const res = await fetch(`/api/clientes/${id}`, { method: "DELETE" });
    const data = await res.json();

    if (data.success) {
      setClients(clients.filter((c) => c.id !== id));
    } else {
      alert(data.message);
    }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Clientes</h1>
            <p className="text-slate-500">Gestión de clientes empresariales</p>
          </div>
          <Link href="/clientes/nuevo">
            <Button>Nuevo cliente</Button>
          </Link>
        </div>

        <Card>
          <CardBody>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
              </div>
            ) : clients.length === 0 ? (
              <p className="text-center text-slate-500 py-8">No hay clientes registrados</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 font-medium text-slate-700">Nombre</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-700">Empresa</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-700">Email</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-700">Estado</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-700">Proyectos</th>
                      <th className="text-right py-3 px-4 font-medium text-slate-700">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map((client) => (
                      <tr key={client.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4">{client.name}</td>
                        <td className="py-3 px-4">{client.company}</td>
                        <td className="py-3 px-4">{client.email}</td>
                        <td className="py-3 px-4">
                          <Badge variant={client.status === "ACTIVE" ? "success" : "default"}>
                            {client.status === "ACTIVE" ? "Activo" : "Inactivo"}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">{client._count.projects}</td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <Link href={`/clientes/${client.id}`}>
                            <Button variant="outline" size="sm">Ver</Button>
                          </Link>
                          <Link href={`/clientes/${client.id}/editar`}>
                            <Button variant="outline" size="sm">Editar</Button>
                          </Link>
                          <Button variant="danger" size="sm" onClick={() => handleDelete(client.id)}>
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
