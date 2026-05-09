"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  _count: { tasks: number };
}

interface UserTask {
  id: string;
  title: string;
  status: string;
  priority: string;
  project: { name: string };
}

export default function UsuariosPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Estado para el modal de tareas
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userTasks, setUserTasks] = useState<UserTask[]>([]);
  const [tasksLoading, setTasksLoading] = useState(false);

  useEffect(() => {
    fetch("/api/usuarios")
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setUsers(res.data);
          setFilteredUsers(res.data);
        } else {
          setError(res.message || "Error al cargar usuarios");
        }
      })
      .catch(() => setError("Error de conexión"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) {
      setFilteredUsers(users);
      return;
    }
    const filtered = users.filter(
      (u) =>
        u.name.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query) ||
        u.role.toLowerCase().includes(query)
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este usuario?")) return;

    const res = await fetch(`/api/usuarios/${id}`, { method: "DELETE" });
    const data = await res.json();

    if (data.success) {
      const updated = users.filter((u) => u.id !== id);
      setUsers(updated);
      setFilteredUsers(updated);
    } else {
      alert(data.message);
    }
  };

  const handleShowTasks = async (user: User) => {
    setSelectedUser(user);
    setTasksLoading(true);
    try {
      const res = await fetch(`/api/tareas?responsibleId=${user.id}`);
      const data = await res.json();
      if (data.success) {
        setUserTasks(data.data);
      }
    } catch {
      alert("Error al cargar tareas del usuario");
    } finally {
      setTasksLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedUser(null);
    setUserTasks([]);
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

  const getPriorityVariant = (priority: string) => {
    const map: Record<string, any> = {
      LOW: "default",
      MEDIUM: "info",
      HIGH: "warning",
      CRITICAL: "danger",
    };
    return map[priority] || "default";
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

  if (error) {
    return (
      <AppShell>
        <p className="text-center text-red-600">{error}</p>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-4 md:space-y-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900">Usuarios</h1>
          <p className="text-sm text-slate-500">Gestión de usuarios del sistema</p>
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
            placeholder="Buscar usuario..."
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
          {searchQuery ? `${filteredUsers.length} de ${users.length} usuarios` : `${users.length} usuarios`}
        </div>

        {/* Vista móvil: Cards */}
        <div className="block md:hidden space-y-3">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <p className="text-center text-slate-500 py-8">
              {searchQuery ? "No se encontraron usuarios" : "No hay usuarios registrados"}
            </p>
          ) : (
            filteredUsers.map((user) => (
              <Card key={user.id} className="!p-0">
                <CardBody className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-slate-900">{user.name}</h3>
                      <p className="text-sm text-slate-500">{user.email}</p>
                    </div>
                    <Badge variant={user.role === "ADMIN" ? "danger" : "default"}>
                      {user.role === "ADMIN" ? "Admin" : "Usuario"}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">{user._count.tasks} tareas</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleShowTasks(user)} className="flex-1">
                      Ver tareas
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(user.id)}>
                      Eliminar
                    </Button>
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
            ) : filteredUsers.length === 0 ? (
              <p className="text-center text-slate-500 py-8">
                {searchQuery ? "No se encontraron usuarios" : "No hay usuarios registrados"}
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 font-medium text-slate-700">Nombre</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-700">Correo</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-700">Rol</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-700">Tareas</th>
                      <th className="text-right py-3 px-4 font-medium text-slate-700">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4">{user.name}</td>
                        <td className="py-3 px-4">{user.email}</td>
                        <td className="py-3 px-4">
                          <Badge variant={user.role === "ADMIN" ? "danger" : "default"}>
                            {user.role === "ADMIN" ? "Administrador" : "Usuario"}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">{user._count.tasks}</td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleShowTasks(user)}>
                            Ver tareas
                          </Button>
                          <Button variant="danger" size="sm" onClick={() => handleDelete(user.id)}>
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

      {/* Modal de tareas del usuario */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={closeModal} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[85vh] flex flex-col">
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between rounded-t-2xl shrink-0">
              <div>
                <h3 className="text-base font-semibold text-slate-900">Tareas de {selectedUser.name}</h3>
                <p className="text-xs text-slate-500">{selectedUser.email}</p>
              </div>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 p-1">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-4 py-3 overflow-y-auto flex-1">
              {tasksLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                </div>
              ) : userTasks.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-slate-500">Este usuario no tiene tareas asignadas</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {userTasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-slate-900">{task.title}</p>
                          <Badge variant={getPriorityVariant(task.priority)}>
                            {getPriorityLabel(task.priority)}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{task.project.name}</p>
                      </div>
                      <Badge variant={getStatusVariant(task.status)}>
                        {getStatusLabel(task.status)}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="bg-slate-50 px-4 py-2 border-t border-slate-200 flex justify-between items-center rounded-b-2xl shrink-0">
              <p className="text-xs text-slate-500">{userTasks.length} tarea{userTasks.length !== 1 ? "s" : ""}</p>
              <Button variant="outline" size="sm" onClick={closeModal}>Cerrar</Button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
