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
- jsPDF para reportes PDF

## Requisitos Previos

- Bun instalado
- PostgreSQL corriendo (local o Railway)

## Instalacion Local (Metodo Rapido)

Doble clic en `scripts/setup-local.bat` (Windows) y sigue las instrucciones. El script automatiza todo:
- Verifica PostgreSQL
- Genera cliente Prisma
- Aplica migraciones
- Opcionalmente limpia datos existentes
- Ejecuta seed con datos demo
- Verifica el estado final

## Instalacion Local (Metodo Manual)

1. Copiar el archivo de variables de entorno:
```bash
cp .env.example .env
```

2. Configurar `DATABASE_URL` en `.env` con tus credenciales de PostgreSQL

3. Instalar dependencias:
```bash
bun install
```

4. Generar Prisma Client:
```bash
bunx prisma generate
```

5. Ejecutar migraciones:
```bash
bunx prisma migrate dev
```

6. Crear usuario administrador:
```bash
bunx prisma db seed
```

7. Iniciar servidor de desarrollo:
```bash
bun run dev
```

## Variables de Entorno

Ver `.env.example`:

```
DATABASE_URL=postgresql://postgres:Dai12345@127.0.0.1:5432/sistema_empresarial?schema=public
JWT_SECRET=tu-secreto-jwt-super-seguro-cambia-esto
NODE_ENV=development
```

## Scripts Automatizados

Ejecuta con doble clic (Windows) o desde terminal:

| Script | Comando | Descripcion |
|--------|---------|-------------|
| `scripts/setup-local.bat` | `bun run setup` | Setup completo local |
| `scripts/deploy.bat` | `bun run deploy` | Guia paso a paso para produccion |
| `scripts/build-apk.bat` | `bun run build:apk` | Compilar APK de Android |
| `scripts/diagnostico.bat` | `bun run diagnostico` | Estado del sistema |

## Comandos Disponibles

```bash
bun run dev                    # Servidor de desarrollo
bun run build                  # Compilar para produccion (Vercel)
bun run build:capacitor        # Compilar archivos estaticos para Capacitor
bun run start                  # Iniciar en produccion
bun run setup                  # Setup local automatizado
bun run deploy                 # Despliegue guiado
bun run build:apk              # Compilar APK Android
bun run diagnostico            # Diagnostico del sistema
bun run cap:sync               # Sincronizar Capacitor
bun run cap:open:android       # Abrir Android Studio
bunx prisma studio             # Prisma Studio
bunx prisma migrate dev        # Crear migracion
bunx prisma migrate deploy     # Aplicar migraciones en produccion
bunx prisma db seed            # Crear usuario admin
```

## Credenciales

Despues de ejecutar `bunx prisma db seed`:

- **Administrador**: admin@techsolutions.com / admin123

Los usuarios normales se registran manualmente desde la pagina de registro.

## Funcionalidades

### Modulos

- **Dashboard**: Estadisticas generales del sistema
- **Clientes**: CRUD completo de clientes empresariales
- **Proyectos**: CRUD completo de proyectos asociados a clientes
- **Tareas**: CRUD completo de tareas asociadas a proyectos y responsables
- **Usuarios**: Gestion de usuarios (solo administrador)
- **Perfil**: Informacion del usuario autenticado

### Reportes PDF

Desde la pagina de detalle de cada proyecto, puedes descargar un reporte PDF que incluye:

- Informacion del proyecto (nombre, cliente, estado, fechas)
- Lista de tareas con responsable, prioridad, estado
- Fecha de inicio y fecha de finalizacion de cada tarea
- Fecha y hora de generacion del reporte

### Roles

**Administrador:**
- Acceso completo a todos los modulos
- Puede gestionar usuarios
- Puede eliminar registros

**Usuario Normal:**
- Puede ver dashboard, clientes, proyectos, tareas
- Puede crear y editar registros
- No puede acceder a la gestion de usuarios

## Estructura del Proyecto

```
app/
  api/           # Route Handlers (backend)
    auth/        # Autenticacion (login, register, me, logout)
    clientes/    # CRUD clientes
    proyectos/   # CRUD proyectos + reportes PDF
    tareas/      # CRUD tareas
    usuarios/    # Gestion usuarios (admin)
    dashboard/   # Resumen estadistico
  dashboard/     # Panel principal
  clientes/      # CRUD clientes
  proyectos/     # CRUD proyectos
  tareas/        # CRUD tareas
  usuarios/      # Gestion usuarios (admin)
  perfil/        # Perfil de usuario
  login/         # Inicio de sesion
  register/      # Registro
components/
  ui/            # Componentes reutilizables (Button, Input, Card, etc.)
  layout/        # Layout y navegacion (AppShell, AppSidebar)
lib/
  prisma.ts      # Cliente Prisma
  auth-server.ts # Helpers de autenticacion (server)
  jwt.ts         # Manejo de JWT
  validations/   # Esquemas Zod
  fetch-auth.ts  # Helper para fetch con autenticacion
prisma/
  schema.prisma  # Modelo de datos
  seed.ts        # Usuario admin inicial
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
- GET /api/proyectos/[id]/reporte (descarga PDF)

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

## App Movil (Capacitor + Android)

La app movil usa **estrategia Remote URL**: carga la aplicacion directamente desde Vercel.

### Requisitos
- Android Studio
- Java JDK 17+
- Android SDK API 34+

### Configuracion
1. Despliega primero en Vercel (ver abajo)
2. Actualiza `capacitor.config.ts` con tu URL:
   ```ts
   server: {
     url: 'https://tu-app.vercel.app',
     cleartext: true,
   }
   ```
3. Sincroniza: `bun run cap:sync`

### Compilar APK
- **Automatico**: doble clic en `scripts/build-apk.bat`
- **Manual**: `bun run cap:open:android` > Build > Build APK(s)

El APK se genera en `android/app/build/outputs/apk/debug/app-debug.apk`

## Despliegue en Produccion

### Opcion Rapida: Script Guiado
Ejecuta `scripts/deploy.bat` y sigue las instrucciones paso a paso.

### Metodo Manual

#### 1. Railway (Base de Datos)
1. Crear proyecto en Railway
2. Crear servicio PostgreSQL y copiar `DATABASE_URL`
3. Ejecutar migraciones y seed:
   ```bash
   DATABASE_URL="..." bunx prisma migrate deploy
   DATABASE_URL="..." bunx prisma db seed
   ```

#### 2. Vercel (Frontend con Migraciones Automaticas)
1. Importar repositorio en [vercel.com](https://vercel.com)
2. Agregar variables de entorno:
   - `DATABASE_URL` (URL de Railway)
   - `JWT_SECRET`
   - `NODE_ENV=production`
3. El build esta configurado en `vercel.json` para ejecutar **automaticamente**:
   ```bash
   bunx prisma migrate deploy && bun run build
   ```
   Cada deploy aplica las migraciones pendientes antes de compilar.
4. Deploy automatico con cada push a GitHub

> **Nota:** El seed de datos iniciales (`bunx prisma db seed`) se ejecuta una sola vez manualmente despues del primer deploy.

## Autor

Proyecto Integrador Full-Stack Empresarial - TechSolutions S.A.
