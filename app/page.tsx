import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="text-center max-w-2xl px-4">
        <h1 className="text-4xl font-bold text-blue-700 mb-4">
          TechSolutions S.A.
        </h1>
        <p className="text-lg text-slate-600 mb-8">
          Sistema de gestión empresarial full-stack. Administra clientes, proyectos y tareas de manera eficiente.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/login">
            <Button size="lg">Iniciar sesión</Button>
          </Link>
          <Link href="/register">
            <Button variant="outline" size="lg">Registrarse</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
