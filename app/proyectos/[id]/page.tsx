"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";

export default function ProyectoDetailPage() {
  const params = useParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/proyectos/${params.id}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success) setProject(res.data);
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

  if (!project) {
    return (
      <AppShell>
        <p className="text-center text-slate-500">Proyecto no encontrado</p>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{project.name}</h1>
            <p className="text-slate-500">Detalle del proyecto</p>
          </div>
          <div className="flex gap-2">
            <Link href={`/proyectos/${project.id}/editar`}>
              <Button variant="outline">Editar</Button>
            </Link>
            <Link href="/proyectos">
              <Button variant="outline">Volver</Button>
            </Link>
          </div>
        </div>

        <Card>
          <CardBody className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500">Cliente</p>
                <p className="font-medium">{project.client.name} ({project.client.company})</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Estado</p>
                <Badge variant={project.status === "FINISHED" ? "success" : project.status === "IN_PROGRESS" ? "info" : "default"}>
                  {project.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-slate-500">Fecha de inicio</p>
                <p className="font-medium">{new Date(project.startDate).toLocaleDateString("es-ES")}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Fecha de fin</p>
                <p className="font-medium">{project.endDate ? new Date(project.endDate).toLocaleDateString("es-ES") : "No definida"}</p>
              </div>
            </div>
            {project.description && (
              <div>
                <p className="text-sm text-slate-500">Descripción</p>
                <p className="mt-1">{project.description}</p>
              </div>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-slate-900">Tareas asociadas</h2>
          </CardHeader>
          <CardBody>
            {project.tasks.length === 0 ? (
              <p className="text-sm text-slate-500">No hay tareas asociadas</p>
            ) : (
              <div className="space-y-2">
                {project.tasks.map((task: any) => (
                  <div key={task.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                    <div>
                      <p className="font-medium text-sm">{task.title}</p>
                      <p className="text-xs text-slate-500">Responsable: {task.responsible.name}</p>
                    </div>
                    <Badge variant={task.status === "COMPLETED" ? "success" : task.status === "IN_PROGRESS" ? "info" : "warning"}>
                      {task.status}
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