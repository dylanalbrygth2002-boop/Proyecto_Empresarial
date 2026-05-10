"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { getAuthHeaders } from "@/components/AuthProvider";

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
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userTasks, setUserTasks] = useState<UserTask[]>([]);
  const [tasksLoading, setTasksLoading] = useState(false);

  useEffect(() => {
    fetch("/api/usuarios", { headers: getAuthHeaders() })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) { setUsers(res.data); setFilteredUsers(res.data); }
        else { setError(res.message || "Error"); }
      })
      .catch(() => setError("Error de conexión"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) { setFilteredUsers(users); return; }
    setFilteredUsers(users.filter((u) => u.name.toLowerCase().includes(query) || u.email.toLowerCase().includes(query)));
  }, [searchQuery, users]);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este usuario?")) return;
    const res = await fetch(`/api/usuarios/${id}`, { method: "DELETE", headers: getAuthHeaders() });
    const data = await res.json();
    if (data.success) { const updated = users.filter((u) => u.id !== id); setUsers(updated); setFilteredUsers(updated); }
    else { alert(data.message); }
  };

  const handleShowTasks = async (user: User) => {
    setSelectedUser(user);
    setTasksLoading(true);
    try {
      const res = await fetch(`/api/tareas?responsibleId=${user.id}`, { headers: getAuthHeaders() });
      const data = await res.json();
      if (data.success) setUserTasks(data.data);
    } catch { alert("Error al cargar tareas"); }
    finally { setTasksLoading(false); }
  };

  const closeModal = () => { setSelectedUser(null); setUserTasks([]); };

  const getStatusVariant = (status: string) => {
    const map: Record<string, any> = { PENDING: "warning", IN_PROGRESS: "info", IN_REVIEW: "default", COMPLETED: "success", CANCELLED: "danger" };
    return map[status] || "default";
  };
  const getStatusLabel = (status: string) => {
    const map: Record<string, string> = { PENDING: "Pendiente", IN_PROGRESS: "En progreso", IN_REVIEW: "En revisión", COMPLETED: "Completada", CANCELLED: "Cancelada" };
    return map[status] || status;
  };
  const getPriorityVariant = (priority: string) => {
    const map: Record<string, any> = { LOW: "default", MEDIUM: "info", HIGH: "warning", CRITICAL: "danger" };
    return map[priority] || "default";
  };
  const getPriorityLabel = (priority: string) => {
    const map: Record<string, string> = { LOW: "Baja", MEDIUM: "Media", HIGH: "Alta", CRITICAL: "Crítica" };
    return map[priority] || priority;
  };

  if (error) return <AppShell><p className="text-center text-red-600 py-12">{error}</p></AppShell>;

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Usuarios</h1>
          <p className="text-sm text-slate-500 mt-0.5">Gestión de usuarios del sistema</p>
        </div>

        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <input type="text" placeholder="Buscar usuario..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          )}
        </div>

        <p className="text-sm text-slate-500 font-medium">{searchQuery ? `${filteredUsers.length} de ${users.length}` : `${users.length} usuarios`}</p>

        {/* Mobile */}
        <div className="block md:hidden space-y-3">
          {loading ? (
            <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" /></div>
          ) : filteredUsers.length === 0 ? (
            <p className="text-center text-slate-500 py-12">No hay usuarios</p>
          ) : (
            filteredUsers.map((user) => (
               <Card key={user.id} color="purple" className="!p-0">
                <CardBody className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-slate-900">{user.name}</h3>
                      <p className="text-sm text-slate-500">{user.email}</p>
                    </div>
                    <Badge variant={user.role === "ADMIN" ? "danger" : "default"}>{user.role === "ADMIN" ? "Administrador" : "Usuario"}</Badge>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">{user._count.tasks} tareas</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleShowTasks(user)} className="flex-1">Ver tareas</Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(user.id)}>Eliminar</Button>
                  </div>
                </CardBody>
              </Card>
            ))
          )}
        </div>

        {/* Desktop */}
        <Card color="purple" className="hidden md:block !p-0 overflow-hidden !border-t-4">
          <CardBody className="p-0">
            {loading ? (
              <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" /></div>
            ) : filteredUsers.length === 0 ? (
              <p className="text-center text-slate-500 py-12">No hay usuarios</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/60">
                      <th className="text-left py-3.5 px-5 font-semibold text-slate-700 text-xs uppercase tracking-wider">Nombre</th>
                      <th className="text-left py-3.5 px-5 font-semibold text-slate-700 text-xs uppercase tracking-wider">Correo</th>
                      <th className="text-left py-3.5 px-5 font-semibold text-slate-700 text-xs uppercase tracking-wider">Rol</th>
                      <th className="text-left py-3.5 px-5 font-semibold text-slate-700 text-xs uppercase tracking-wider">Tareas</th>
                      <th className="text-right py-3.5 px-5 font-semibold text-slate-700 text-xs uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-5 font-medium text-slate-900">{user.name}</td>
                        <td className="py-3.5 px-5 text-slate-600">{user.email}</td>
                        <td className="py-3.5 px-5"><Badge variant={user.role === "ADMIN" ? "danger" : "default"}>{user.role === "ADMIN" ? "Administrador" : "Usuario"}</Badge></td>
                        <td className="py-3.5 px-5 text-slate-600">{user._count.tasks}</td>
                        <td className="py-3.5 px-5 text-right space-x-1.5">
                          <Button variant="outline" size="sm" onClick={() => handleShowTasks(user)}>Ver tareas</Button>
                          <Button variant="danger" size="sm" onClick={() => handleDelete(user.id)}>Eliminar</Button>
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

      {/* Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col animate-scale-in">
            <div className="bg-slate-50 px-5 py-4 border-b border-slate-100 flex items-center justify-between rounded-t-2xl shrink-0">
              <div>
                <h3 className="text-base font-bold text-slate-900">Tareas de {selectedUser.name}</h3>
                <p className="text-xs text-slate-500">{selectedUser.email}</p>
              </div>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="px-5 py-4 overflow-y-auto flex-1">
              {tasksLoading ? (
                <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" /></div>
              ) : userTasks.length === 0 ? (
                <div className="text-center py-8"><p className="text-sm text-slate-500">Sin tareas asignadas</p></div>
              ) : (
                <div className="space-y-2">
                  {userTasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-slate-900">{task.title}</p>
                          <Badge variant={getPriorityVariant(task.priority)}>{getPriorityLabel(task.priority)}</Badge>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{task.project.name}</p>
                      </div>
                      <Badge variant={getStatusVariant(task.status)}>{getStatusLabel(task.status)}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 flex justify-between items-center rounded-b-2xl shrink-0">
              <p className="text-xs text-slate-500 font-medium">{userTasks.length} tarea{userTasks.length !== 1 ? "s" : ""}</p>
              <Button variant="outline" size="sm" onClick={closeModal}>Cerrar</Button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
