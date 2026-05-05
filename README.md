# TechSolutions S.A. - Sistema Empresarial Full-Stack

Sistema de gestion empresarial full-stack para TechSolutions S.A., desarrollado con Next.js, React, TailwindCSS, Prisma y PostgreSQL.

## Tecnologias

- Next.js 16 con App Router
- React 19
- TypeScript
- TailwindCSS
- Prisma ORM 6
- PostgreSQL
- Bun (runtime y gestor de paquetes)
- JWT para autenticacion
- Zod para validaciones

## Requisitos Previos

- Bun instalado
- Cuenta en Railway
- Base de datos PostgreSQL configurada en Railway

## Instalacion Local

1. Clonar el repositorio
2. Instalar dependencias:
```bash
bun install
```

3. Copiar el archivo de variables de entorno:
```bash
cp .env.example .env
```

4. Configurar `DATABASE_URL` en `.env` con tus credenciales de PostgreSQL

5. Generar Prisma Client:
```bash
bunx prisma generate
```

6. Ejecutar migraciones:
```bash
bunx prisma migrate dev
```

7. Ejecutar seed (opcional, para datos de prueba):
```bash
bunx prisma db seed
```

8. Iniciar servidor de desarrollo:
```bash
bun dev
```

## Variables de Entorno

Ver `.env.example`:

```
DATABASE_URL=postgresql://usuario:password@host:puerto/nombre_base_datos?schema=public
JWT_SECRET=tu-secreto-jwt-super-seguro-cambia-esto
NODE_ENV=development
```

## Comandos Disponibles

```bash
bun dev          # Servidor de desarrollo
bun run build    # Compilar para produccion
bun start        # Iniciar en produccion
bunx prisma studio  # Prisma Studio
bunx prisma migrate dev  # Crear migracion
bunx prisma migrate deploy  # Aplicar migraciones en produccion
bunx prisma db seed  # Ejecutar seed
```

## Credenciales de Prueba

Si ejecutas el seed:

- **Administrador**: admin@techsolutions.com / admin123
- **Usuario**: usuario@techsolutions.com / user123

## Estructura del Proyecto

```
app/
  api/           # Route Handlers (backend)
  dashboard/     # Panel principal
  clientes/      # CRUD clientes
  proyectos/     # CRUD proyectos
  tareas/        # CRUD tareas
  usuarios/      # Gestion usuarios (admin)
  perfil/        # Perfil de usuario
  login/         # Inicio de sesion
  register/      # Registro
components/
  ui/            # Componentes reutilizables
  layout/        # Layout y navegacion
  dashboard/     # Componentes del dashboard
lib/
  prisma.ts      # Cliente Prisma
  auth-server.ts # Helpers de autenticacion (server)
  jwt.ts         # Manejo de JWT
  validations/   # Esquemas Zod
prisma/
  schema.prisma  # Modelo de datos
  seed.ts        # Datos de prueba
```

## Endpoints Principales

### Autenticacion
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout
- GET /api/auth/me

### Clientes
- GET /api/clientes
- POST /api/clientes
- GET /api/clientes/[id]
- PUT /api/clientes/[id]
- DELETE /api/clientes/[id]

### Proyectos
- GET /api/proyectos
- POST /api/proyectos
- GET /api/proyectos/[id]
- PUT /api/proyectos/[id]
- DELETE /api/proyectos/[id]

### Tareas
- GET /api/tareas
- POST /api/tareas
- GET /api/tareas/[id]
- PUT /api/tareas/[id]
- DELETE /api/tareas/[id]

### Usuarios
- GET /api/usuarios
- GET /api/usuarios/[id]
- PUT /api/usuarios/[id]
- DELETE /api/usuarios/[id]

### Dashboard
- GET /api/dashboard/resumen

## Despliegue en Railway

1. Crear proyecto en Railway
2. Crear servicio PostgreSQL y copiar `DATABASE_URL`
3. Conectar repositorio de GitHub
4. Configurar variables de entorno en Railway:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `NODE_ENV=production`
5. Ejecutar migraciones en produccion:
```bash
bunx prisma migrate deploy
```
6. La aplicacion estara disponible en la URL publica de Railway

## Autor

Proyecto Integrador Full-Stack Empresarial - TechSolutions S.A.