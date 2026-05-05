import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@techsolutions.com" },
    update: {},
    create: {
      name: "Administrador",
      email: "admin@techsolutions.com",
      passwordHash,
      role: "ADMIN",
    },
  });

  const userPasswordHash = await bcrypt.hash("user123", 10);

  const user = await prisma.user.upsert({
    where: { email: "usuario@techsolutions.com" },
    update: {},
    create: {
      name: "Usuario Demo",
      email: "usuario@techsolutions.com",
      passwordHash: userPasswordHash,
      role: "USER",
    },
  });

  const client1 = await prisma.client.create({
    data: {
      name: "Juan Pérez",
      email: "juan@empresa.com",
      phone: "+593 98 765 4321",
      company: "Empresa ABC",
      status: "ACTIVE",
    },
  });

  const client2 = await prisma.client.create({
    data: {
      name: "María García",
      email: "maria@techcorp.com",
      phone: "+593 99 123 4567",
      company: "TechCorp",
      status: "ACTIVE",
    },
  });

  const project1 = await prisma.project.create({
    data: {
      name: "Desarrollo Web E-commerce",
      description: "Plataforma de comercio electrónico",
      startDate: new Date("2024-01-15"),
      endDate: new Date("2024-06-30"),
      status: "IN_PROGRESS",
      clientId: client1.id,
    },
  });

  const project2 = await prisma.project.create({
    data: {
      name: "Consultoría Cloud",
      description: "Migración a la nube",
      startDate: new Date("2024-03-01"),
      status: "PLANNED",
      clientId: client2.id,
    },
  });

  await prisma.task.create({
    data: {
      title: "Diseñar base de datos",
      description: "Crear modelo relacional",
      projectId: project1.id,
      responsibleId: admin.id,
      priority: "HIGH",
      status: "IN_PROGRESS",
      dueDate: new Date("2024-02-15"),
    },
  });

  await prisma.task.create({
    data: {
      title: "Análisis de requerimientos",
      description: "Reuniones con stakeholders",
      projectId: project2.id,
      responsibleId: user.id,
      priority: "MEDIUM",
      status: "PENDING",
      dueDate: new Date("2024-03-15"),
    },
  });

  console.log("Seed completado:");
  console.log(`- Admin: admin@techsolutions.com / admin123`);
  console.log(`- User: usuario@techsolutions.com / user123`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });