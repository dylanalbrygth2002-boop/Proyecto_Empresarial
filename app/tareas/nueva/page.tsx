"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Card, CardBody } from "@/components/ui/Card";

interface Project {
  id: string;
  name: string;
}

interface User {
  id: string;
  name: string;
}

export default function NuevaTareaPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/proyectos").then((r) => r.json()),
      fetch("/api/usuarios").then((r) => r.json()).catch(() => ({ success: false })),
    ]).then(([projectsRes, usersRes]) => {
      if (projectsRes.success) setProjects(projectsRes.data);
      if (usersRes.success) setUsers(usersRes.data);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      projectId: formData.get("projectId") as string,
      responsibleId: formData.get("responsibleId") as string,
      priority: formData.get("priority") as string,
      status: formData.get("status") as string,
      dueDate: formData.get("dueDate") as string,
    };

    try {
      const res = await fetch("/api/tareas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!result.success) {
        setError(result.message || "Error al crear tarea");
        return;
      }

      router.push("/tareas");
      router.refresh();
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Nueva tarea</h1>
          <p className="text-slate-500">Completa la información de la tarea</p>
        </div>

        <Card>
          <CardBody>
            {error && (
              <div className="mb-4">
                <Alert variant="error">{error}</Alert>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Título" name="title" required />
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
                <textarea
                  name="description"
                  rows={3}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <Select
                label="Proyecto"
                name="projectId"
                required
                options={projects.map((p) => ({ value: p.id, label: p.name }))}
              />
              <Select
                label="Responsable"
                name="responsibleId"
                required
                options={users.map((u) => ({ value: u.id, label: u.name }))}
              />
              <Select
                label="Prioridad"
                name="priority"
                options={[
                  { value: "LOW", label: "Baja" },
                  { value: "MEDIUM", label: "Media" },
                  { value: "HIGH", label: "Alta" },
                  { value: "CRITICAL", label: "Crítica" },
                ]}
              />
              <Select
                label="Estado"
                name="status"
                options={[
                  { value: "PENDING", label: "Pendiente" },
                  { value: "IN_PROGRESS", label: "En progreso" },
                  { value: "IN_REVIEW", label: "En revisión" },
                  { value: "COMPLETED", label: "Completada" },
                  { value: "CANCELLED", label: "Cancelada" },
                ]}
              />
              <Input label="Fecha límite" name="dueDate" type="date" />
              <div className="flex gap-3 pt-4">
                <Button type="submit" isLoading={loading}>Guardar</Button>
                <Link href="/tareas">
                  <Button type="button" variant="outline">Cancelar</Button>
                </Link>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </AppShell>
  );
}
