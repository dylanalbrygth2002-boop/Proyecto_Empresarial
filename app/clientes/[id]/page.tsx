"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";

interface ClientDetail {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  projects: Array<{
    id: string;
    name: string;
    status: string;
    startDate: string;
    endDate: string | null;
  }>;
}

export default function ClienteDetailPage() {
  const params = useParams();
  const [client, setClient] = useState<ClientDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/clientes/${params.id}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success) setClient(res.data);
      })
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <AppShell>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      </AppShell>
    );
  }

  if (!client) {
    return (
      <AppShell>
        <p className="text-center text-slate-500">Cliente no encontrado</p>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{client.name}</h1>
            <p className="text-slate-500">Detalle del cliente</p>
          </div>
          <div className="flex gap-2">
            <Link href={`/clientes/${client.id}/editar`}>
              <Button variant="outline">Editar</Button>
            </Link>
            <Link href="/clientes">
              <Button variant="outline">Volver</Button>
            </Link>
          </div>
        </div>

        <Card>
          <CardBody className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500">Correo electrónico</p>
                <p className="font-medium">{client.email}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Teléfono</p>
                <p className="font-medium">{client.phone || "No registrado"}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Empresa</p>
                <p className="font-medium">{client.company}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Estado</p>
                <Badge variant={client.status === "ACTIVE" ? "success" : "default"}>
                  {client.status === "ACTIVE" ? "Activo" : "Inactivo"}
                </Badge>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-slate-900">Proyectos asociados</h2>
          </CardHeader>
          <CardBody>
            {client.projects.length === 0 ? (
              <p className="text-sm text-slate-500">No hay proyectos asociados</p>
            ) : (
              <div className="space-y-2">
                {client.projects.map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                    <div>
                      <p className="font-medium text-sm">{project.name}</p>
                      <p className="text-xs text-slate-500">
                        {new Date(project.startDate).toLocaleDateString("es-ES")}
                        {project.endDate && ` - ${new Date(project.endDate).toLocaleDateString("es-ES")}`}
                      </p>
                    </div>
                    <Badge variant={project.status === "FINISHED" ? "success" : project.status === "IN_PROGRESS" ? "info" : project.status === "PAUSED" ? "warning" : project.status === "CANCELLED" ? "danger" : "default"}>
                      {project.status === "PLANNED" ? "Planificado" : project.status === "IN_PROGRESS" ? "En progreso" : project.status === "PAUSED" ? "Pausado" : project.status === "FINISHED" ? "Finalizado" : project.status === "CANCELLED" ? "Cancelado" : project.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </AppShell>
  );
}