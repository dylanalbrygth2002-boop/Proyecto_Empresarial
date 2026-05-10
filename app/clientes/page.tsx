"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardBody } from "@/components/ui/Card";
import { getAuthHeaders } from "@/components/AuthProvider";

interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  status: string;
  _count: { projects: number };
}

export default function ClientesPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("userRole") || "";
    setUserRole(role);

    fetch("/api/clientes", { headers: getAuthHeaders() })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setClients(res.data);
          setFilteredClients(res.data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) {
      setFilteredClients(clients);
      return;
    }
    const filtered = clients.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.company.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query)
    );
    setFilteredClients(filtered);
  }, [searchQuery, clients]);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este cliente?")) return;

    const res = await fetch(`/api/clientes/${id}`, { method: "DELETE" });
    const data = await res.json();

    if (data.success) {
      const updated = clients.filter((c) => c.id !== id);
      setClients(updated);
      setFilteredClients(updated);
    } else {
      alert(data.message);
    }
  };

  const isAdmin = userRole === "ADMIN";

  return (
    <AppShell>
      <div className="space-y-4 md:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900">Clientes</h1>
            <p className="text-sm text-slate-500">
              {isAdmin ? "Gestión de clientes empresariales" : "Clientes registrados"}
            </p>
          </div>
          {isAdmin && (
            <Link href="/clientes/nuevo">
              <Button className="w-full sm:w-auto">Nuevo cliente</Button>
            </Link>
          )}
        </div>

        {/* Buscador */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Buscar cliente..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Contador */}
        <div className="text-sm text-slate-500">
          {searchQuery ? `${filteredClients.length} de ${clients.length} clientes` : `${clients.length} clientes`}
        </div>

        {/* Vista móvil: Cards */}
        <div className="block md:hidden space-y-3">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
          ) : filteredClients.length === 0 ? (
            <p className="text-center text-slate-500 py-8">
              {searchQuery ? "No se encontraron clientes" : "No hay clientes registrados"}
            </p>
          ) : (
            filteredClients.map((client) => (
              <Card key={client.id} className="!p-0">
                <CardBody className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-slate-900">{client.name}</h3>
                      <p className="text-sm text-slate-500">{client.company}</p>
                    </div>
                    <Badge variant={client.status === "ACTIVE" ? "success" : "default"}>
                      {client.status === "ACTIVE" ? "Activo" : "Inactivo"}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">{client.email}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">{client._count.projects} proyectos</span>
                    <div className="flex gap-2">
                      <Link href={`/clientes/${client.id}`}>
                        <Button variant="outline" size="sm">Ver</Button>
                      </Link>
                      {isAdmin && (
                        <>
                          <Link href={`/clientes/${client.id}/editar`}>
                            <Button variant="outline" size="sm">Editar</Button>
                          </Link>
                          <Button variant="danger" size="sm" onClick={() => handleDelete(client.id)}>
                            Eliminar
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))
          )}
        </div>

        {/* Vista desktop: Tabla */}
        <Card className="hidden md:block">
          <CardBody>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
              </div>
            ) : filteredClients.length === 0 ? (
              <p className="text-center text-slate-500 py-8">
                {searchQuery ? "No se encontraron clientes" : "No hay clientes registrados"}
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 font-medium text-slate-700">Nombre</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-700">Empresa</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-700">Email</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-700">Estado</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-700">Proyectos</th>
                      <th className="text-right py-3 px-4 font-medium text-slate-700">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredClients.map((client) => (
                      <tr key={client.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4">{client.name}</td>
                        <td className="py-3 px-4">{client.company}</td>
                        <td className="py-3 px-4">{client.email}</td>
                        <td className="py-3 px-4">
                          <Badge variant={client.status === "ACTIVE" ? "success" : "default"}>
                            {client.status === "ACTIVE" ? "Activo" : "Inactivo"}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">{client._count.projects}</td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <Link href={`/clientes/${client.id}`}>
                            <Button variant="outline" size="sm">Ver</Button>
                          </Link>
                          {isAdmin && (
                            <>
                              <Link href={`/clientes/${client.id}/editar`}>
                                <Button variant="outline" size="sm">Editar</Button>
                              </Link>
                              <Button variant="danger" size="sm" onClick={() => handleDelete(client.id)}>
                                Eliminar
                              </Button>
                            </>
                          )}
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
