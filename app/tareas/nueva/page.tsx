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
  email: string;
  role: string;
}

export default function NuevaTareaPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem("userRole") || "";
    const userId = localStorage.getItem("userId") || "";
    setUserRole(role);
    setIsAdmin(role === "ADMIN");

    // Cargar proyectos (la API ya filtra según el rol)
    fetch("/api/proyectos")
      .then((r) => r.json())
      .then((projectsRes) => {
        if (projectsRes.success) {
          setProjects(projectsRes.data);
        }
      });

    // Cargar usuarios para el select de responsable (solo admin necesita esto)
    if (role === "ADMIN") {
      fetch("/api/usuarios")
        .then((r) => r.json())
        .then((usersRes) => {
          if (usersRes.success) {
            const normalUsers = usersRes.data.filter((u: User) => u.role !== "ADMIN");
            setUsers(normalUsers);
          }
        });
    } else {
      // Para usuario normal, guardar su info
      const currentUserName = localStorage.getItem("userName") || "Usuario";
      setCurrentUser({
        id: userId,
        name: currentUserName,
        email: "",
        role: "USER"
      });
    }

    setDataLoading(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const responsibleId = isAdmin 
      ? (formData.get("responsibleId") as string)
      : (currentUser?.id || "");

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
      const res = await fetch("/api/tareas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!result.success) {
        setError(result.message || "Error al crear tarea");
        setLoading(false);
        return;
      }

      router.push("/tareas");
      router.refresh();
    } catch {
      setError("Error de conexión");
      setLoading(false);
    }
  };

  if (dataLoading) {
    return (
      <AppShell>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      </AppShell>
    );
  }

  // Si es usuario normal y no tiene proyectos, mostrar mensaje
  if (!isAdmin && projects.length === 0) {
    return (
      <AppShell>
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900">Nueva tarea</h1>
            <p className="text-slate-500">Crear una nueva tarea</p>
          </div>
          <Card>
            <CardBody>
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <p className="mt-2 text-sm text-slate-500">No tienes proyectos asignados</p>
                <p className="text-xs text-slate-400 mt-1">Contacta al administrador para que te asigne a un proyecto</p>
                <div className="mt-4">
                  <Link href="/tareas">
                    <Button variant="outline">Volver</Button>
                  </Link>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Nueva tarea</h1>
          <p className="text-slate-500">
            {isAdmin 
              ? "Asigna una nueva tarea a un usuario" 
              : "Crea una nueva tarea en tu proyecto"
            }
          </p>
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
                options={[
                  { value: "", label: "Selecciona un proyecto..." },
                  ...projects.map((p) => ({ value: p.id, label: p.name }))
                ]}
              />
              
              {isAdmin ? (
                <Select
                  label="Asignar a"
                  name="responsibleId"
                  required
                  options={users.map((u) => ({ value: u.id, label: `${u.name} (${u.email})` }))}
                />
              ) : (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Responsable</label>
                  <div className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
                    {currentUser?.name} (Tú)
                  </div>
                  <input type="hidden" name="responsibleId" value={currentUser?.id || ""} />
                </div>
              )}
              
              {isAdmin && users.length === 0 && (
                <p className="text-sm text-amber-600">
                  No hay usuarios disponibles para asignar tareas.
                </p>
              )}
              
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
                <Button type="submit" isLoading={loading}>
                  {isAdmin ? "Asignar tarea" : "Crear tarea"}
                </Button>
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
