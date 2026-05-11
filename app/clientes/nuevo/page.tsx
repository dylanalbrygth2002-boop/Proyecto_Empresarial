"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { getAuthHeaders } from "@/components/AuthProvider";

export default function NuevoClientePage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      company: formData.get("company") as string,
      status: formData.get("status") as string,
    };

    try {
      const res = await fetch("/api/clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!result.success) {
        setError(result.message || "Error al crear cliente");
        return;
      }

      router.push("/clientes");
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
          <h1 className="text-2xl font-bold text-blue-700 tracking-tight">Nuevo cliente</h1>
          <p className="text-sm text-slate-500 mt-0.5">Completa la información del cliente</p>
        </div>

        <Card color="blue" className="!border-t-4">
          <CardBody>
            {error && (
              <div className="mb-4">
                <Alert variant="error">{error}</Alert>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Nombre" name="name" required />
              <Input label="Correo electrónico" name="email" type="email" required />
              <Input label="Teléfono" name="phone" />
              <Input label="Empresa" name="company" required />
              <Select
                label="Estado"
                name="status"
                options={[
                  { value: "ACTIVE", label: "Activo" },
                  { value: "INACTIVE", label: "Inactivo" },
                ]}
              />
              <div className="flex gap-3 pt-4">
                <Button type="submit" isLoading={loading}>Guardar</Button>
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
