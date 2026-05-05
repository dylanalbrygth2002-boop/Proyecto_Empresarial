"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardBody } from "@/components/ui/Card";

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  dueDate: string | null;
  project: { name: string };
  responsible: { name: string };
}

export default function TareasPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tareas")
      .then((res) => res.json())
      .then((res) => {
        if (res.success) setTasks(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar esta tarea?")) return;

    const res = await fetch(`/api/tareas/${id}`, { method: "DELETE" });
    const data = await res.json();

    if (data.success) {
      setTasks(tasks.filter((t) => t.id !== id));
    } else {
      alert(data.message);
    }
  };

  const getStatusVariant = (status: string) => {
    const map: Record<string, any> = {
      PENDING: "warning",
      IN_PROGRESS: "info",
      IN_REVIEW: "default",
      COMPLETED: "success",
      CANCELLED: "danger",
    };
    return map[status] || "default";
  };

  const getPriorityVariant = (priority: string) => {
    const map: Record<string, any> = {
      LOW: "default",
      MEDIUM: "info",
      HIGH: "warning",
      CRITICAL: "danger",
    };
    return map[priority] || "default";
  };

  const getStatusLabel = (status: string) => {
    const map: Record<string, string> = {
      PENDING: "Pendiente",
      IN_PROGRESS: "En progreso",
      IN_REVIEW: "En revisión",
      COMPLETED: "Completada",
      CANCELLED: "Cancelada",
    };
    return map[status] || status;
  };

  const getPriorityLabel = (priority: string) => {
    const map: Record<string, string> = {
      LOW: "Baja",
      MEDIUM: "Media",
      HIGH: "Alta",
      CRITICAL: "Crítica",
    };
    return map[priority] || priority;
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Tareas</h1>
            <p className="text-slate-500">Gestión de tareas</p>
          </div>
          <Link href="/tareas/nueva">
            <Button>Nueva tarea</Button>
          </Link>
        </div>

        <Card>
          <CardBody>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
              </div>
            ) : tasks.length === 0 ? (
              <p className="text-center text-slate-500 py-8">No hay tareas registradas</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 font-medium text-slate-700">Título</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-700">Proyecto</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-700">Responsable</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-700">Prioridad</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-700">Estado</th>
                      <th className="text-right py-3 px-4 font-medium text-slate-700">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((task) => (
                      <tr key={task.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4">{task.title}</td>
                        <td className="py-3 px-4">{task.project.name}</td>
                        <td className="py-3 px-4">{task.responsible.name}</td>
                        <td className="py-3 px-4">
                          <Badge variant={getPriorityVariant(task.priority)}>
                            {getPriorityLabel(task.priority)}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={getStatusVariant(task.status)}>
                            {getStatusLabel(task.status)}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <Link href={`/tareas/${task.id}`}>
                            <Button variant="outline" size="sm">Ver</Button>
                          </Link>
                          <Link href={`/tareas/${task.id}/editar`}>
                            <Button variant="outline" size="sm">Editar</Button>
                          </Link>
                          <Button variant="danger" size="sm" onClick={() => handleDelete(task.id)}>
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
