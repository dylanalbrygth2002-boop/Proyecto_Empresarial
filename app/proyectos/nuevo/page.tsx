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
import { getAuthHeaders } from "@/components/AuthProvider";

interface Client {
  id: string;
  name: string;
  company: string;
}

export default function NuevoProyectoPage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/clientes", { headers: getAuthHeaders() })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) setClients(res.data);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

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
      const res = await fetch("/api/proyectos", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!result.success) {
        setError(result.message || "Error al crear proyecto");
        return;
      }

      // Redirigir al detalle del proyecto recien creado para que pueda agregar tareas
      const newProjectId = result.data?.id;
      if (newProjectId) {
        router.push(`/proyectos/${newProjectId}`);
      } else {
        router.push("/proyectos");
      }
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
          <h1 className="text-2xl font-bold text-blue-700">Nuevo proyecto</h1>
          <p className="text-slate-500">Completa la información del proyecto</p>
        </div>

        <Card color="indigo" className="!border-t-4">
          <CardBody>
            {error && (
              <div className="mb-4">
                <Alert variant="error">{error}</Alert>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Nombre" name="name" required />
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
                <textarea
                  name="description"
                  rows={3}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Fecha de inicio" name="startDate" type="date" required />
                <Input label="Fecha de fin (opcional)" name="endDate" type="date" />
              </div>
              <Select
                label="Cliente"
                name="clientId"
                required
                options={clients.map((c) => ({ value: c.id, label: `${c.name} (${c.company})` }))}
              />
              <Select
                label="Estado"
                name="status"
                options={[
                  { value: "PLANNED", label: "Planificado" },
                  { value: "IN_PROGRESS", label: "En progreso" },
                  { value: "PAUSED", label: "Pausado" },
                  { value: "FINISHED", label: "Finalizado" },
                  { value: "CANCELLED", label: "Cancelado" },
                ]}
              />
              <div className="flex gap-3 pt-4">
                <Button type="submit" isLoading={loading}>Guardar</Button>
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
