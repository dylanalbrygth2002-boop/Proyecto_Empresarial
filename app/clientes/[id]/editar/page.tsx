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

export default function EditarClientePage() {
  const router = useRouter();
  const params = useParams();
  const [client, setClient] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/clientes/${params.id}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setClient(res.data);
        }
      })
      .finally(() => setLoading(false));
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      company: formData.get("company") as string,
      status: formData.get("status") as string,
    };

    try {
      const res = await fetch(`/api/clientes/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!result.success) {
        setError(result.message || "Error al actualizar cliente");
        return;
      }

      router.push("/clientes");
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

  if (!client) {
    return (
      <AppShell>
        <p className="text-center text-slate-500">Cliente no encontrado</p>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-blue-700">Editar cliente</h1>
          <p className="text-slate-500">Actualiza la información del cliente</p>
        </div>

        <Card color="blue" className="!border-t-4">
          <CardBody>
            {error && (
              <div className="mb-4">
                <Alert variant="error">{error}</Alert>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Nombre" name="name" defaultValue={client.name} required />
              <Input label="Correo electrónico" name="email" type="email" defaultValue={client.email} required />
              <Input label="Teléfono" name="phone" defaultValue={client.phone || ""} />
              <Input label="Empresa" name="company" defaultValue={client.company} required />
              <Select
                label="Estado"
                name="status"
                defaultValue={client.status}
                options={[
                  { value: "ACTIVE", label: "Activo" },
                  { value: "INACTIVE", label: "Inactivo" },
                ]}
              />
              <div className="flex gap-3 pt-4">
                <Button type="submit" isLoading={saving}>Guardar cambios</Button>
                <Link href="/clientes">
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