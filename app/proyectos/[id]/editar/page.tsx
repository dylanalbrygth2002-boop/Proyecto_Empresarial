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

interface Client {
  id: string;
  name: string;
  company: string;
}

export default function EditarProyectoPage() {
  const router = useRouter();
  const params = useParams();
  const [project, setProject] = useState<any>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const headers = getAuthHeaders();
    Promise.all([
      fetch(`/api/proyectos/${params.id}`, { headers }).then((r) => r.json()),
      fetch("/api/clientes", { headers }).then((r) => r.json()),
    ]).then(([projectRes, clientsRes]) => {
      if (projectRes.success) setProject(projectRes.data);
      if (clientsRes.success) setClients(clientsRes.data);
      setLoading(false);
    });
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      startDate: formData.get("startDate") as string,
      endDate: formData.get("endDate") as string,
      status: formData.get("status") as string,
      clientId: formData.get("clientId") as string,
    };

    try {
      const res = await fetch(`/api/proyectos/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!result.success) {
        setError(result.message || "Error al actualizar proyecto");
        return;
      }

      router.push("/proyectos");
      router.refresh();
    } catch {
      setError("Error de conexión");
    } finally {
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

  if (!project) {
    return (
      <AppShell>
        <p className="text-center text-slate-500">Proyecto no encontrado</p>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Editar proyecto</h1>
          <p className="text-slate-500">Actualiza la información del proyecto</p>
        </div>

        <Card>
          <CardBody>
            {error && (
              <div className="mb-4">
                <Alert variant="error">{error}</Alert>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Nombre" name="name" defaultValue={project.name} required />
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
                <textarea
                  name="description"
                  rows={3}
                  defaultValue={project.description || ""}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Fecha de inicio" name="startDate" type="date" defaultValue={project.startDate?.split("T")[0]} required />
                <Input label="Fecha de fin" name="endDate" type="date" defaultValue={project.endDate?.split("T")[0] || ""} />
              </div>
              <Select
                label="Cliente"
                name="clientId"
                defaultValue={project.clientId}
                required
                options={clients.map((c) => ({ value: c.id, label: `${c.name} (${c.company})` }))}
              />
              <Select
                label="Estado"
                name="status"
                defaultValue={project.status}
                options={[
                  { value: "PLANNED", label: "Planificado" },
                  { value: "IN_PROGRESS", label: "En progreso" },
                  { value: "PAUSED", label: "Pausado" },
                  { value: "FINISHED", label: "Finalizado" },
                  { value: "CANCELLED", label: "Cancelado" },
                ]}
              />
              <div className="flex gap-3 pt-4">
                <Button type="submit" isLoading={saving}>Guardar cambios</Button>
                <Link href="/proyectos">
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