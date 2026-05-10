"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Card, CardBody } from "@/components/ui/Card";
import { getAuthHeaders } from "@/components/AuthProvider";

interface Project {
  id: string;
  name: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function EditarTareaPage() {
  const router = useRouter();
  const params = useParams();
  const [task, setTask] = useState<any>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("userRole") || "";
    const userId = localStorage.getItem("userId") || "";
    setIsAdmin(role === "ADMIN");

    const headers = getAuthHeaders();
    Promise.all([
      fetch(`/api/tareas/${params.id}`, { headers }).then((r) => r.json()),
      fetch("/api/proyectos", { headers }).then((r) => r.json()),
      fetch("/api/usuarios", { headers }).then((r) => r.json()),
    ]).then(([taskRes, projectsRes, usersRes]) => {
      if (taskRes.success) setTask(taskRes.data);
      if (projectsRes.success) setProjects(projectsRes.data);
      if (usersRes.success) {
        // Filtrar solo usuarios normales (no admin) como responsables
        const normalUsers = usersRes.data.filter((u: User) => u.role !== "ADMIN");
        setUsers(normalUsers);
      }
      
      // Guardar info del usuario actual
      const currentUserName = localStorage.getItem("userName") || "Usuario";
      setCurrentUser({
        id: userId,
        name: currentUserName,
        email: "",
        role: role
      });
      
      setLoading(false);
    });
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    const formData = new FormData(e.currentTarget);
    const responsibleId = isAdmin 
      ? (formData.get("responsibleId") as string)
      : (currentUser?.id || task?.responsibleId || "");

    const data = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      projectId: formData.get("projectId") as string,
      responsibleId: responsibleId,
      priority: formData.get("priority") as string,
      status: formData.get("status") as string,
      dueDate: formData.get("dueDate") as string,
    };

    try {
      const res = await fetch(`/api/tareas/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!result.success) {
        setError(result.message || "Error al actualizar tarea");
        setSaving(false);
        return;
      }

      router.push("/tareas");
      router.refresh();
    } catch {
      setError("Error de conexión");
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AppShell>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      </AppShell>
    );
  }

  if (!task) {
    return (
      <AppShell>
        <p className="text-center text-slate-500">Tarea no encontrada</p>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-blue-700">Editar tarea</h1>
          <p className="text-slate-500">Actualiza la información de la tarea</p>
        </div>

        <Card color="blue" className="!border-t-4">
          <CardBody>
            {error && (
              <div className="mb-4">
                <Alert variant="error">{error}</Alert>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Título" name="title" defaultValue={task.title} required />
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
                <textarea
                  name="description"
                  rows={3}
                  defaultValue={task.description || ""}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <Select
                label="Proyecto"
                name="projectId"
                defaultValue={task.projectId}
                required
                options={projects.map((p) => ({ value: p.id, label: p.name }))}
              />
              
              {isAdmin ? (
                <Select
                  label="Asignar a"
                  name="responsibleId"
                  defaultValue={task.responsibleId}
                  required
                  options={users.map((u) => ({ value: u.id, label: `${u.name} (${u.email})` }))}
                />
              ) : (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Responsable</label>
                  <div className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
                    {task.responsible?.name || currentUser?.name} (Tú)
                  </div>
                  <input type="hidden" name="responsibleId" value={task.responsibleId || currentUser?.id || ""} />
                </div>
              )}
              
              <Select
                label="Prioridad"
                name="priority"
                defaultValue={task.priority}
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
                defaultValue={task.status}
                options={[
                  { value: "PENDING", label: "Pendiente" },
                  { value: "IN_PROGRESS", label: "En progreso" },
                  { value: "IN_REVIEW", label: "En revisión" },
                  { value: "COMPLETED", label: "Completada" },
                  { value: "CANCELLED", label: "Cancelada" },
                ]}
              />
              <Input label="Fecha límite" name="dueDate" type="date" defaultValue={task.dueDate?.split("T")[0] || ""} />
              <div className="flex gap-3 pt-4">
                <Button type="submit" isLoading={saving}>Guardar cambios</Button>
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
