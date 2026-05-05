"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardBody } from "@/components/ui/Card";

interface Project {
  id: string;
  name: string;
  description: string | null;
  status: string;
  startDate: string;
  client: { name: string; company: string };
  _count: { tasks: number };
}

export default function ProyectosPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/proyectos")
      .then((res) => res.json())
      .then((res) => {
        if (res.success) setProjects(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este proyecto?")) return;

    const res = await fetch(`/api/proyectos/${id}`, { method: "DELETE" });
    const data = await res.json();

    if (data.success) {
      setProjects(projects.filter((p) => p.id !== id));
    } else {
      alert(data.message);
    }
  };

  const getStatusVariant = (status: string) => {
    const map: Record<string, any> = {
      PLANNED: "default",
      IN_PROGRESS: "info",
      PAUSED: "warning",
      FINISHED: "success",
      CANCELLED: "danger",
    };
    return map[status] || "default";
  };

  const getStatusLabel = (status: string) => {
    const map: Record<string, string> = {
      PLANNED: "Planificado",
      IN_PROGRESS: "En progreso",
      PAUSED: "Pausado",
      FINISHED: "Finalizado",
      CANCELLED: "Cancelado",
    };
    return map[status] || status;
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Proyectos</h1>
            <p className="text-slate-500">Gestión de proyectos</p>
          </div>
          <Link href="/proyectos/nuevo">
            <Button>Nuevo proyecto</Button>
          </Link>
        </div>

        <Card>
          <CardBody>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
              </div>
            ) : projects.length === 0 ? (
              <p className="text-center text-slate-500 py-8">No hay proyectos registrados</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 font-medium text-slate-700">Nombre</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-700">Cliente</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-700">Estado</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-700">Inicio</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-700">Tareas</th>
                      <th className="text-right py-3 px-4 font-medium text-slate-700">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((project) => (
                      <tr key={project.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4">{project.name}</td>
                        <td className="py-3 px-4">{project.client.name}</td>
                        <td className="py-3 px-4">
                          <Badge variant={getStatusVariant(project.status)}>
                            {getStatusLabel(project.status)}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          {new Date(project.startDate).toLocaleDateString("es-ES")}
                        </td>
                        <td className="py-3 px-4">{project._count.tasks}</td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <Link href={`/proyectos/${project.id}`}>
                            <Button variant="outline" size="sm">Ver</Button>
                          </Link>
                          <Link href={`/proyectos/${project.id}/editar`}>
                            <Button variant="outline" size="sm">Editar</Button>
                          </Link>
                          <Button variant="danger" size="sm" onClick={() => handleDelete(project.id)}>
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
