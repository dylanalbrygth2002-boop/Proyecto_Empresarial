import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

// Contraseña para todos los usuarios demo
const USER_PASSWORD = "password123";

// Datos de clientes
const clientesData = [
  { name: "Carlos Mendoza", email: "carlos@techcorp.com", company: "TechCorp S.A.", phone: "555-0101" },
  { name: "Ana López", email: "ana@innovatech.com", company: "InnovaTech", phone: "555-0102" },
  { name: "Pedro Ramírez", email: "pedro@digitalplus.com", company: "Digital Plus", phone: "555-0103" },
  { name: "María Torres", email: "maria@cloudsys.com", company: "Cloud Systems", phone: "555-0104" },
  { name: "Luis Herrera", email: "luis@softdev.com", company: "SoftDev Corp", phone: "555-0105" },
  { name: "Diana Castro", email: "diana@net Solutions.com", company: "Net Solutions", phone: "555-0106" },
  { name: "Jorge Ruiz", email: "jorge@dataworld.com", company: "DataWorld", phone: "555-0107" },
  { name: "Sofía Morales", email: "sofia@apptech.com", company: "AppTech", phone: "555-0108" },
  { name: "Ricardo Flores", email: "ricardo@webcraft.com", company: "WebCraft", phone: "555-0109" },
  { name: "Patricia Vega", email: "patricia@cybersys.com", company: "CyberSys", phone: "555-0110" },
];

// Datos de usuarios
const usuariosData = [
  { name: "Dylan Caal", email: "dylan.caalsantos2@gmail.com" },
  { name: "Jose Martinez", email: "jose.martinez@techsolutions.com" },
  { name: "Miguel Ángel", email: "miguel.angel@techsolutions.com" },
  { name: "Fernando López", email: "fernando.lopez@techsolutions.com" },
  { name: "Laura Sánchez", email: "laura.sanchez@techsolutions.com" },
  { name: "Roberto Gómez", email: "roberto.gomez@techsolutions.com" },
  { name: "Daniela Ruiz", email: "daniela.ruiz@techsolutions.com" },
  { name: "Alejandro Torres", email: "alejandro.torres@techsolutions.com" },
  { name: "Carmen Vásquez", email: "carmen.vasquez@techsolutions.com" },
  { name: "Santiago Morales", email: "santiago.morales@techsolutions.com" },
];

// Datos de proyectos
const proyectosData = [
  { name: "Plataforma E-commerce", description: "Desarrollo de tienda online con pasarela de pagos", startDate: "2025-01-15", endDate: "2025-06-30", status: "IN_PROGRESS" },
  { name: "App Móvil Bancaria", description: "Aplicación móvil para gestión de cuentas bancarias", startDate: "2025-02-01", endDate: "2025-08-15", status: "IN_PROGRESS" },
  { name: "Sistema CRM", description: "Sistema de gestión de relaciones con clientes", startDate: "2025-03-10", endDate: "2025-09-20", status: "PLANNED" },
  { name: "Migración Cloud", description: "Migración de servidores locales a infraestructura cloud", startDate: "2025-01-20", endDate: "2025-05-30", status: "IN_PROGRESS" },
  { name: "Portal de Empleados", description: "Portal interno para gestión de recursos humanos", startDate: "2025-04-05", endDate: "2025-10-15", status: "PLANNED" },
  { name: "Dashboard Analytics", description: "Panel de visualización de datos en tiempo real", startDate: "2025-02-20", endDate: "2025-07-10", status: "IN_PROGRESS" },
  { name: "API de Integración", description: "API REST para integración con sistemas externos", startDate: "2025-03-01", endDate: "2025-06-15", status: "IN_PROGRESS" },
  { name: "Sistema de Inventario", description: "Gestión de inventario con control de stock", startDate: "2025-05-01", endDate: "2025-11-30", status: "PLANNED" },
  { name: "Chatbot de Soporte", description: "Asistente virtual para atención al cliente", startDate: "2025-04-15", endDate: "2025-08-30", status: "IN_PROGRESS" },
  { name: "Plataforma Educativa", description: "Sistema de e-learning con cursos interactivos", startDate: "2025-06-01", endDate: "2025-12-31", status: "PLANNED" },
];

// Títulos de tareas por categoría
const tareasPorProyecto: Record<number, string[]> = {
  0: ["Diseñar mockups de interfaz", "Configurar pasarela de pagos", "Desarrollar catálogo de productos", "Implementar carrito de compras", "Crear panel de administración", "Integrar envíos y tracking", "Pruebas de seguridad", "Optimizar rendimiento"],
  1: ["Diseñar flujo de autenticación", "Implementar transferencias", "Desarrollar historial de movimientos", "Integrar notificaciones push", "Configurar biometría", "Pruebas de penetración", "Documentación API"],
  2: ["Definir modelo de datos", "Crear módulo de contactos", "Desarrollar pipeline de ventas", "Implementar reportes", "Integrar email marketing", "Pruebas de integración"],
  3: ["Auditar servidores actuales", "Configurar instancias AWS", "Migrar bases de datos", "Implementar backups", "Configurar monitoreo", "Pruebas de failover"],
  4: ["Diseñar perfil de empleado", "Crear sistema de vacaciones", "Desarrollar nómina", "Implementar evaluaciones", "Integrar firma digital"],
  5: ["Conectar fuentes de datos", "Diseñar widgets", "Implementar filtros", "Crear alertas", "Exportar reportes"],
  6: ["Definir endpoints", "Implementar autenticación OAuth", "Crear documentación Swagger", "Desarrollar webhooks", "Pruebas de carga"],
  7: ["Diseñar base de datos", "Crear módulo de entradas", "Desarrollar módulo de salidas", "Implementar alertas de stock", "Generar reportes"],
  8: ["Entrenar modelo NLP", "Diseñar flujo de conversación", "Integrar con WhatsApp", "Crear base de conocimiento", "Analizar métricas"],
  9: ["Diseñar estructura de cursos", "Implementar video streaming", "Crear sistema de quizzes", "Desarrollar certificados", "Integrar foros"],
};

const prioridades = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
const estadosTarea = ["PENDING", "IN_PROGRESS", "IN_REVIEW", "COMPLETED"];

async function main() {
  const passwordHash = await bcrypt.hash("admin123", 10);
  const userPasswordHash = await bcrypt.hash(USER_PASSWORD, 10);

  // Limpiar datos anteriores (excepto admin)
  console.log("🧹 Limpiando datos anteriores...");
  await prisma.task.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.client.deleteMany({});
  await prisma.user.deleteMany({ where: { role: "USER" } });

  // 1. Crear admin
  const adminExists = await prisma.user.findFirst({
    where: { email: "admin@techsolutions.com" },
  });
  
  if (!adminExists) {
    await prisma.user.create({
      data: {
        name: "Administrador",
        email: "admin@techsolutions.com",
        passwordHash,
        role: "ADMIN",
      },
    });
  }

  // 2. Crear clientes
  const clientesCreados = [];
  for (const cliente of clientesData) {
    const existing = await prisma.client.findFirst({
      where: { email: cliente.email },
    });
    
    if (existing) {
      clientesCreados.push(existing);
    } else {
      const c = await prisma.client.create({
        data: {
          ...cliente,
          status: "ACTIVE",
        },
      });
      clientesCreados.push(c);
    }
  }

  // 3. Crear usuarios
  const usuariosCreados = [];
  for (const usuario of usuariosData) {
    const existing = await prisma.user.findFirst({
      where: { email: usuario.email },
    });
    
    if (existing) {
      usuariosCreados.push(existing);
    } else {
      const u = await prisma.user.create({
        data: {
          name: usuario.name,
          email: usuario.email,
          passwordHash: userPasswordHash,
          role: "USER",
        },
      });
      usuariosCreados.push(u);
    }
  }

  // 4. Crear proyectos (asociados a clientes)
  const proyectosCreados = [];
  for (let i = 0; i < proyectosData.length; i++) {
    const proyecto = proyectosData[i];
    const cliente = clientesCreados[i % clientesCreados.length];
    const p = await prisma.project.create({
      data: {
        name: proyecto.name,
        description: proyecto.description,
        startDate: new Date(proyecto.startDate),
        endDate: proyecto.endDate ? new Date(proyecto.endDate) : null,
        status: proyecto.status as any,
        clientId: cliente.id,
      },
    });
    proyectosCreados.push(p);
  }

  // 5. Crear tareas (5 por usuario = 50 tareas)
  // Distribuir tareas entre proyectos de forma variada
  let tareaIndex = 0;
  for (let u = 0; u < usuariosCreados.length; u++) {
    const usuario = usuariosCreados[u];
    
    // Asignar 5 tareas a cada usuario, en proyectos diferentes
    for (let t = 0; t < 5; t++) {
      const proyectoIndex = (u + t) % proyectosCreados.length;
      const proyecto = proyectosCreados[proyectoIndex];
      const tareasDisponibles = tareasPorProyecto[proyectoIndex] || tareasPorProyecto[0];
      const tituloTarea = tareasDisponibles[t % tareasDisponibles.length];
      
      // Distribuir estados para que haya variedad de porcentajes
      let estado: string;
      const random = Math.random();
      if (random < 0.2) estado = "COMPLETED";
      else if (random < 0.5) estado = "IN_PROGRESS";
      else if (random < 0.7) estado = "IN_REVIEW";
      else estado = "PENDING";

      await prisma.task.create({
        data: {
          title: `${tituloTarea} - ${proyecto.name}`,
          description: `Tarea asignada a ${usuario.name} para el proyecto ${proyecto.name}`,
          projectId: proyecto.id,
          responsibleId: usuario.id,
          priority: prioridades[t % prioridades.length] as any,
          status: estado as any,
          dueDate: new Date(Date.now() + (t + 1) * 7 * 24 * 60 * 60 * 1000), // Fechas futuras
        },
      });
      
      tareaIndex++;
    }
  }

  // Generar archivo de credenciales
  const credenciales = `# 🔐 Credenciales de Acceso - TechSolutions S.A.

> Generado automáticamente el ${new Date().toLocaleDateString("es-ES")}

---

## 👤 Administrador

| Campo | Valor |
|-------|-------|
| **Correo** | admin@techsolutions.com |
| **Contraseña** | admin123 |
| **Rol** | Administrador |

---

## 👥 Usuarios (10)

> **Contraseña para TODOS los usuarios:** \`password123\`

| # | Nombre | Correo |
|---|--------|--------|
| 1 | Dylan Caal | dylan.caalsantos2@gmail.com |
| 2 | Jose Martinez | jose.martinez@techsolutions.com |
| 3 | Miguel Ángel | miguel.angel@techsolutions.com |
| 4 | Fernando López | fernando.lopez@techsolutions.com |
| 5 | Laura Sánchez | laura.sanchez@techsolutions.com |
| 6 | Roberto Gómez | roberto.gomez@techsolutions.com |
| 7 | Daniela Ruiz | daniela.ruiz@techsolutions.com |
| 8 | Alejandro Torres | alejandro.torres@techsolutions.com |
| 9 | Carmen Vásquez | carmen.vasquez@techsolutions.com |
| 10 | Santiago Morales | santiago.morales@techsolutions.com |

---

## 📊 Datos Generados

| Entidad | Cantidad |
|---------|----------|
| Clientes | 10 |
| Proyectos | 10 |
| Usuarios | 10 |
| Tareas | 50 (5 por usuario) |

---

## 📝 Notas

- Todos los usuarios tienen la misma contraseña: \`password123\`
- Cada usuario tiene 5 tareas asignadas en distintos proyectos
- Los estados de las tareas están distribuidos aleatoriamente (Pendiente, En progreso, En revisión, Completada)
- Los proyectos tienen fechas de inicio y fin realistas
`;

  const credencialesPath = path.join(process.cwd(), "CREDENCIALES.md");
  fs.writeFileSync(credencialesPath, credenciales);

  console.log("\n✅ Seed completado exitosamente!");
  console.log("\n📊 Datos creados:");
  console.log(`  - 1 Administrador`);
  console.log(`  - ${usuariosCreados.length} Usuarios`);
  console.log(`  - ${clientesCreados.length} Clientes`);
  console.log(`  - ${proyectosCreados.length} Proyectos`);
  console.log(`  - ${tareaIndex} Tareas`);
  console.log("\n🔐 Archivo de credenciales generado:");
  console.log(`  📄 ${credencialesPath}`);
  console.log("\n👤 Admin: admin@techsolutions.com / admin123");
  console.log("👥 Usuarios: [correo] / password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
