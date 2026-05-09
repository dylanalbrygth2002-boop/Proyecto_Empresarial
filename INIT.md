# TechSolutions S.A. - Sistema Empresarial Full-Stack

> **Documentacion de Inicializacion (INIT)**
> Proyecto desarrollado con Next.js 16, React 19, TypeScript, TailwindCSS v4, Prisma ORM y PostgreSQL.
> Fecha de documentacion: 08/05/2026

---

## Indice
1. [Vision General del Proyecto](#1-vision-general-del-proyecto)
2. [Stack Tecnologico](#2-stack-tecnologico)
3. [Arquitectura del Sistema](#3-arquitectura-del-sistema)
4. [Base de Datos](#4-base-de-datos)
5. [Modelos de Datos (Prisma Schema)](#5-modelos-de-datos-prisma-schema)
6. [APIs REST](#6-apis-rest)
7. [Frontend](#7-frontend)
8. [Autenticacion y Autorizacion](#8-autenticacion-y-autorizacion)
9. [Datos Demo (Seed)](#9-datos-demo-seed)
10. [Credenciales de Acceso](#10-credenciales-de-acceso)
11. [Guia de Instalacion](#11-guia-de-instalacion)
12. [Estructura de Carpetas](#12-estructura-de-carpetas)
13. [Funcionalidades por Modulo](#13-funcionalidades-por-modulo)

---

## 1. Vision General del Proyecto

**TechSolutions S.A.** es un sistema empresarial full-stack para la gestion de clientes, proyectos, tareas y usuarios. El sistema esta disenado con dos roles principales:

- **Administrador (ADMIN):** Acceso total al sistema. Gestiona clientes, proyectos, tareas, usuarios y visualiza todos los reportes.
- **Usuario Normal (USER):** Solo puede ver y gestionar los proyectos y tareas asignados a el. No puede eliminar ni crear clientes/proyectos, pero si puede crear tareas dentro de sus proyectos.

### Caracteristicas Principales
- Gestor de Clientes con validacion de correo unico
- Proyectos con porcentaje de avance y barra de progreso visual
- Tareas agrupadas por proyecto con historial completo
- Dashboard personalizado por rol
- Generacion de Reportes PDF por proyecto
- Busqueda en tiempo real en cada modulo
- Diseno responsive optimizado para movil (PWA lista)
- Autenticacion con localStorage + headers personalizados

---

## 2. Stack Tecnologico

| Capa | Tecnologia | Version |
|------|-----------|---------|
| **Runtime** | Bun | 1.2.17 |
| **Framework** | Next.js | 16.2.4 |
| **Framework UI** | React | 19.2.4 |
| **Lenguaje** | TypeScript | 5.x |
| **Estilos** | TailwindCSS | 4.x |
| **ORM** | Prisma | 6.19.3 |
| **Base de Datos** | PostgreSQL | 14+ |
| **Autenticacion** | bcryptjs + localStorage | 3.0.3 |
| **Generacion PDF** | jsPDF + jspdf-autotable | 4.2.1 / 5.0.7 |
| **Validacion** | Zod | 4.4.3 |
| **Build Tool** | Turbopack | (incluido en Next.js) |
| **Seed** | tsx | 4.21.0 |

### Dependencias Clave
```json
{
  "next": "16.2.4",
  "react": "19.2.4",
  "@prisma/client": "6",
  "prisma": "6",
  "tailwindcss": "4",
  "bcryptjs": "^3.0.3",
  "jspdf": "^4.2.1",
  "jspdf-autotable": "^5.0.7",
  "zod": "^4.4.3"
}
```

---

## 3. Arquitectura del Sistema

### Patron Arquitectonico
**Full-Stack Monolitico** con Next.js App Router:
- **Frontend:** Componentes React con Server/Client Components
- **Backend:** API Routes dentro de `app/api/`
- **Base de Datos:** PostgreSQL con Prisma ORM
- **Autenticacion:** Stateless usando localStorage + headers X-User-Id/X-User-Role

### Flujo de Datos
```
Usuario -> Navegador -> Next.js Frontend -> API Routes (app/api/*) -> Prisma -> PostgreSQL
     ^                                                    |
     |____________________________________________________|
                    JSON Response
```

### Seguridad por Capas
1. **Frontend:** Ocultar botones segun rol
2. **API:** Validar headers X-User-Role en cada endpoint
3. **Backend:** Rechazar operaciones no autorizadas (403)

---

## 4. Base de Datos

### Configuracion
| Parametro | Valor |
|-----------|-------|
| **Motor** | PostgreSQL |
| **Host** | 127.0.0.1 (localhost) |
| **Puerto** | 5432 |
| **Usuario** | postgres |
| **Contrasena** | Dai12345 |
| **Base de Datos** | sistema_empresarial |
| **URL de Conexion** | `postgresql://postgres:Dai12345@127.0.0.1:5432/sistema_empresarial?schema=public` |

### Conexion Local (Desarrollo)
La base de datos se ejecuta a traves de la **extension PostgreSQL de VS Code**, no requiere instalacion local de PostgreSQL.

---

## 5. Modelos de Datos (Prisma Schema)

### Enums
```prisma
enum UserRole { ADMIN, USER }
enum ClientStatus { ACTIVE, INACTIVE }
enum ProjectStatus { PLANNED, IN_PROGRESS, PAUSED, FINISHED, CANCELLED }
enum TaskPriority { LOW, MEDIUM, HIGH, CRITICAL }
enum TaskStatus { PENDING, IN_PROGRESS, IN_REVIEW, COMPLETED, CANCELLED }
```

### User (usuarios)
| Campo | Tipo | Descripcion |
|-------|------|-------------|
| id | String @id @default(cuid()) | Identificador unico |
| name | String | Nombre completo |
| email | String @unique | Correo unico |
| passwordHash | String | Contrasena encriptada |
| role | UserRole @default(USER) | ADMIN o USER |
| createdAt | DateTime | Fecha de creacion |
| updatedAt | DateTime | Fecha de actualizacion |
| tasks | Task[] | Relacion: tareas asignadas |

### Client (clientes)
| Campo | Tipo | Descripcion |
|-------|------|-------------|
| id | String @id @default(cuid()) | Identificador unico |
| name | String | Nombre del cliente |
| email | String @unique | Correo unico |
| phone | String? | Telefono opcional |
| company | String | Empresa |
| status | ClientStatus @default(ACTIVE) | ACTIVE o INACTIVE |
| projects | Project[] | Relacion: proyectos del cliente |

### Project (proyectos)
| Campo | Tipo | Descripcion |
|-------|------|-------------|
| id | String @id @default(cuid()) | Identificador unico |
| name | String | Nombre del proyecto |
| description | String? | Descripcion opcional |
| startDate | DateTime | Fecha de inicio |
| endDate | DateTime? | Fecha de fin opcional |
| status | ProjectStatus @default(PLANNED) | Estado del proyecto |
| clientId | String | FK al cliente |
| tasks | Task[] | Relacion: tareas del proyecto |

### Task (tareas)
| Campo | Tipo | Descripcion |
|-------|------|-------------|
| id | String @id @default(cuid()) | Identificador unico |
| title | String | Titulo de la tarea |
| description | String? | Descripcion opcional |
| projectId | String | FK al proyecto |
| responsibleId | String | FK al usuario responsable |
| priority | TaskPriority @default(MEDIUM) | LOW, MEDIUM, HIGH, CRITICAL |
| status | TaskStatus @default(PENDING) | Estado de la tarea |
| dueDate | DateTime? | Fecha limite opcional |
| createdAt | DateTime | Fecha de creacion |
| updatedAt | DateTime | Fecha de actualizacion |

### Relaciones
- **User 1:N Task** (un usuario tiene muchas tareas)
- **Client 1:N Project** (un cliente tiene muchos proyectos)
- **Project 1:N Task** (un proyecto tiene muchas tareas)
- **Project N:1 Client** (un proyecto pertenece a un cliente)
- **Task N:1 User** (una tarea tiene un responsable)
- **Task N:1 Project** (una tarea pertenece a un proyecto)

---

## 6. APIs REST

### Auth (`/api/auth`)
| Metodo | Endpoint | Descripcion | Proteccion |
|--------|----------|-------------|------------|
| POST | `/api/auth/login` | Iniciar sesion | Publica |
| POST | `/api/auth/register` | Registrar usuario | Publica |
| POST | `/api/auth/logout` | Cerrar sesion | Publica |
| GET | `/api/auth/me` | Obtener usuario actual | Requiere auth |

### Clientes (`/api/clientes`)
| Metodo | Endpoint | Descripcion | Rol Requerido |
|--------|----------|-------------|---------------|
| GET | `/api/clientes` | Listar clientes | Todos (filtrados por usuario) |
| POST | `/api/clientes` | Crear cliente | ADMIN |
| GET | `/api/clientes/:id` | Ver cliente | Todos |
| PUT | `/api/clientes/:id` | Editar cliente | ADMIN |
| DELETE | `/api/clientes/:id` | Eliminar cliente | ADMIN |

### Proyectos (`/api/proyectos`)
| Metodo | Endpoint | Descripcion | Rol Requerido |
|--------|----------|-------------|---------------|
| GET | `/api/proyectos` | Listar proyectos | Todos (admin ve todos, user solo sus proyectos) |
| POST | `/api/proyectos` | Crear proyecto | ADMIN |
| GET | `/api/proyectos/:id` | Ver proyecto | Todos (con porcentaje de avance) |
| PUT | `/api/proyectos/:id` | Editar proyecto | ADMIN |
| DELETE | `/api/proyectos/:id` | Eliminar proyecto | ADMIN |
| GET | `/api/proyectos/:id/reporte` | Generar PDF | Todos |

### Tareas (`/api/tareas`)
| Metodo | Endpoint | Descripcion | Rol Requerido |
|--------|----------|-------------|---------------|
| GET | `/api/tareas` | Listar tareas | Todos (filtradas por usuario) |
| POST | `/api/tareas` | Crear tarea | Todos (admin asigna, user a si mismo) |
| GET | `/api/tareas/:id` | Ver tarea | Todos |
| PUT | `/api/tareas/:id` | Editar tarea | Todos (admin todo, user solo suyas) |
| DELETE | `/api/tareas/:id` | Eliminar tarea | Todos (admin todo, user solo suyas) |

### Usuarios (`/api/usuarios`)
| Metodo | Endpoint | Descripcion | Rol Requerido |
|--------|----------|-------------|---------------|
| GET | `/api/usuarios` | Listar usuarios | ADMIN |
| GET | `/api/usuarios/:id` | Ver usuario | ADMIN |
| DELETE | `/api/usuarios/:id` | Eliminar usuario | ADMIN |

### Dashboard (`/api/dashboard`)
| Metodo | Endpoint | Descripcion | Rol Requerido |
|--------|----------|-------------|---------------|
| GET | `/api/dashboard/resumen` | Estadisticas | Todos (personalizado por rol) |

### Headers Requeridos
Todas las APIs protegidas requieren estos headers:
```
X-User-Id: <id_del_usuario>
X-User-Role: <ADMIN|USER>
```

---

## 7. Frontend

### Sistema de Diseno
- **Framework CSS:** TailwindCSS v4
- **Componentes UI:** Custom (Button, Input, Select, Card, Badge, Alert)
- **Layout:** Sidebar fijo (64px) + contenido principal
- **Responsive:** Mobile-first con breakpoints sm/md/lg

### Paginas Principales
| Ruta | Descripcion | Rol |
|------|-------------|-----|
| `/login` | Login con fondo animado | Publica |
| `/register` | Registro de usuarios | Publica |
| `/dashboard` | Dashboard con estadisticas | Todos |
| `/clientes` | Lista de clientes | Todos |
| `/clientes/nuevo` | Formulario crear cliente | ADMIN |
| `/clientes/:id` | Detalle del cliente | Todos |
| `/proyectos` | Lista de proyectos (con avance) | Todos |
| `/proyectos/nuevo` | Formulario crear proyecto | ADMIN |
| `/proyectos/:id` | Detalle del proyecto | Todos |
| `/tareas` | Tareas agrupadas por proyecto | Todos |
| `/tareas/nueva` | Formulario crear tarea | Todos |
| `/tareas/:id/historial` | Historial de tarea con fechas | Todos |
| `/usuarios` | Lista de usuarios + modal tareas | ADMIN |
| `/perfil` | Peril del usuario | Todos |

### Diseño Responsive
- **Sidebar:** Se convierte en menu hamburguesa en movil
- **Tablas:** Se transforman en cards en pantallas pequenas
- **Inputs:** Tamano `text-base` para evitar zoom en iOS
- **Botones:** `w-full` en movil, `w-auto` en desktop
- **Cards de proyecto:** Grid 1 col (movil) / 2 col (tablet) / 3 col (desktop)

---

## 8. Autenticacion y Autorizacion

### Metodo de Autenticacion
**Autenticacion Stateless con localStorage:**
1. Usuario hace login -> API devuelve user.id y user.role
2. Frontend guarda en localStorage:
   - `userId`
   - `userRole`
3. Cada request a `/api/*` incluye headers:
   - `X-User-Id`
   - `X-User-Role`
4. Las APIs validan estos headers para autorizar acciones

### Matriz de Permisos
| Funcion | Admin | Usuario |
|---------|-------|---------|
| Crear clientes | Si | No |
| Editar clientes | Si | No |
| Eliminar clientes | Si | No |
| Crear proyectos | Si | No |
| Editar proyectos | Si | No |
| Eliminar proyectos | Si | No |
| Crear tareas | Si (asigna a otros) | Si (solo a si mismo) |
| Editar tareas | Si | Si (solo suyas) |
| Eliminar tareas | Si | Si (solo suyas) |
| Ver usuarios | Si | No |
| Eliminar usuarios | Si | No |
| Generar reportes PDF | Si | Si |

---

## 9. Datos Demo (Seed)

### Generacion Automatica
El archivo `prisma/seed.ts` genera automaticamente:

| Entidad | Cantidad |
|---------|----------|
| **Administrador** | 1 |
| **Usuarios** | 10 |
| **Clientes** | 10 |
| **Proyectos** | 10 |
| **Tareas** | 50 (5 por usuario) |

### Distribucion de Tareas
Cada usuario tiene **5 tareas** distribuidas en **proyectos diferentes**. Los estados estan distribuidos aleatoriamente para mostrar variedad en los porcentajes de avance.

### Ejecutar Seed
```bash
bunx prisma db seed
```

---

## 10. Credenciales de Acceso

### Administrador
| Campo | Valor |
|-------|-------|
| **Correo** | `admin@techsolutions.com` |
| **Contrasena** | `admin123` |
| **Rol** | ADMIN |

### Usuarios (10)
> **Contrasena para TODOS los usuarios:** `password123`

| # | Nombre | Correo |
|---|--------|--------|
| 1 | Dylan Caal | `dylan.caalsantos2@gmail.com` |
| 2 | Jose Martinez | `jose.martinez@techsolutions.com` |
| 3 | Miguel Angel | `miguel.angel@techsolutions.com` |
| 4 | Fernando Lopez | `fernando.lopez@techsolutions.com` |
| 5 | Laura Sanchez | `laura.sanchez@techsolutions.com` |
| 6 | Roberto Gomez | `roberto.gomez@techsolutions.com` |
| 7 | Daniela Ruiz | `daniela.ruiz@techsolutions.com` |
| 8 | Alejandro Torres | `alejandro.torres@techsolutions.com` |
| 9 | Carmen Vasquez | `carmen.vasquez@techsolutions.com` |
| 10 | Santiago Morales | `santiago.morales@techsolutions.com` |

> Las credenciales tambien se guardan en el archivo `CREDENCIALES.md`

---

## 11. Guia de Instalacion

### Requisitos Previos
- Bun 1.2+
- PostgreSQL (via extension VS Code o instalacion local)
- Node.js (compatible con Bun)

### Pasos

```bash
# 1. Clonar e instalar dependencias
bun install

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de PostgreSQL

# 3. Generar cliente Prisma
bunx prisma generate

# 4. Crear base de datos y ejecutar migraciones
bunx prisma migrate dev

# 5. Poblar con datos demo
bunx prisma db seed

# 6. Iniciar servidor de desarrollo
bun run dev

# 7. Compilar para produccion
bun run build
```

### Scripts Disponibles
```bash
bun run dev       # Servidor de desarrollo
bun run build     # Compilar para produccion
bun run start     # Iniciar servidor de produccion
bun run seed      # Ejecutar seed manualmente
bunx prisma migrate dev    # Crear migracion
bunx prisma db seed        # Ejecutar seed
bunx prisma generate       # Generar cliente Prisma
```

---

## 12. Estructura de Carpetas

```
TechSolutions/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── auth/
│   │   │   ├── login/route.ts
│   │   │   ├── logout/route.ts
│   │   │   ├── me/route.ts
│   │   │   └── register/route.ts
│   │   ├── clientes/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   ├── dashboard/
│   │   │   └── resumen/route.ts
│   │   ├── proyectos/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       ├── route.ts
│   │   │       └── reporte/route.ts
│   │   ├── tareas/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   └── usuarios/
│   │       ├── route.ts
│   │       └── [id]/route.ts
│   ├── clientes/
│   │   ├── page.tsx
│   │   ├── nuevo/page.tsx
│   │   └── [id]/
│   │       ├── page.tsx
│   │       └── editar/page.tsx
│   ├── dashboard/
│   │   └── page.tsx
│   ├── login/
│   │   └── page.tsx
│   ├── perfil/
│   │   └── page.tsx
│   ├── proyectos/
│   │   ├── page.tsx
│   │   ├── nuevo/page.tsx
│   │   └── [id]/
│   │       ├── page.tsx
│   │       └── editar/page.tsx
│   ├── register/
│   │   └── page.tsx
│   ├── tareas/
│   │   ├── page.tsx
│   │   ├── nueva/page.tsx
│   │   └── [id]/
│   │       ├── historial/page.tsx
│   │       └── editar/page.tsx
│   ├── usuarios/
│   │   └── page.tsx
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── layout/
│   │   ├── AppShell.tsx          # Layout principal con auth
│   │   └── AppSidebar.tsx        # Sidebar responsive
│   └── ui/
│       ├── Alert.tsx
│       ├── Badge.tsx
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Input.tsx
│       └── Select.tsx
├── lib/
│   ├── api-response.ts           # Helpers para respuestas API
│   ├── prisma.ts                 # Instancia de Prisma Client
│   └── validations/
│       ├── auth.ts
│       └── client.ts
├── prisma/
│   ├── schema.prisma             # Schema de la base de datos
│   ├── seed.ts                   # Datos demo
│   └── migrations/
├── public/
├── .env.example
├── .env
├── package.json
├── next.config.ts
├── postcss.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── CREDENCIALES.md
```

---

## 13. Funcionalidades por Modulo

### Clientes
- Listar, buscar, crear, editar, eliminar
- Validacion de correo unico
- Proteccion contra eliminacion si tiene proyectos
- Vista responsive: tabla (desktop) / cards (movil)

### Proyectos
- Listar con barra de progreso visual (% completado)
- Color de progreso segun porcentaje (rojo/amber/azul/verde)
- Filtrado por usuario (admin ve todo, user ve solo sus proyectos)
- Generacion de reporte PDF con jsPDF + autotable
- Detalle con estadisticas de tareas

### Tareas
- Agrupadas visualmente por proyecto
- Historial completo con timeline de fechas (creacion, limite, actualizacion)
- Estados: Pendiente, En progreso, En revision, Completada, Cancelada
- Prioridades: Baja, Media, Alta, Critica
- Boton "Visualizar historial" en cada tarea

### Usuarios (Admin)
- Lista con busqueda
- Modal emergente para ver tareas asignadas de cada usuario
- Eliminar usuarios

### Dashboard
- Estadisticas personalizadas segun rol
- Admin: 7 metricas (clientes, proyectos, tareas, usuarios)
- User: 5 metricas (mis tareas, pendientes, en progreso, etc.)
- Ultimos 4 proyectos y tareas

---

## Despliegue a Produccion

### 1. Base de datos en Railway

1. Crea una cuenta en [railway.app](https://railway.app)
2. Crea un nuevo proyecto y agrega un servicio **PostgreSQL**
3. Ve a la pestana **Connect** y copia la `DATABASE_URL`
4. Ejecuta las migraciones desde tu maquina local (con la URL de Railway):
   ```bash
   DATABASE_URL="postgresql://..." bunx prisma migrate deploy
   DATABASE_URL="postgresql://..." bunx prisma db seed
   ```

### 2. Frontend en Vercel

1. Crea una cuenta en [vercel.com](https://vercel.com)
2. Importa tu repositorio de GitHub/GitLab
3. En **Settings > Environment Variables**, agrega:
   - `DATABASE_URL` = URL de Railway
   - `JWT_SECRET` = Mismo valor que usas localmente
   - `NODE_ENV` = `production`
4. El framework preset debe detectar **Next.js** automaticamente
5. El comando de build es: `bun run build`
6. El directorio de salida se detecta automaticamente
7. Guarda y despliega (`Deploy`)

### 3. URL de produccion

Una vez desplegado, Vercel te dara una URL como:
```
https://techsolutions-app.vercel.app
```

Copia esta URL para configurar la app movil.

---

## App Movil con Capacitor

### Estrategia: Remote URL

La app movil esta configurada para cargar directamente desde Vercel usando `server.url`. Esto significa:
- No necesitas exportar estaticamente Next.js (imposible con API routes)
- La app siempre usa la ultima version sin actualizar la tienda
- Requiere conexion a internet

### Requisitos previos

- Android Studio instalado
- Java JDK 17 o superior
- Android SDK con API level 34+

### Configuracion inicial

1. Actualiza la URL de Vercel en `capacitor.config.ts`:
   ```ts
   server: {
     url: 'https://TU-APP.vercel.app',
     cleartext: true,
   }
   ```

2. Sincroniza los cambios con Android:
   ```bash
   bun run cap:sync
   ```

### Compilar APK (modo debug)

1. Abre Android Studio:
   ```bash
   bun run cap:open:android
   ```

2. En Android Studio, selecciona **Build > Build Bundle(s) / APK(s) > Build APK(s)**
3. El APK se genera en: `android/app/build/outputs/apk/debug/app-debug.apk`

### Compilar APK firmado (produccion)

1. En Android Studio: **Build > Generate Signed Bundle / APK...**
2. Selecciona **APK**
3. Crea o selecciona tu keystore
4. Selecciona `release` como build variant
5. El APK firmado se genera en: `android/app/build/outputs/apk/release/`

### Actualizar la app

Como usa Remote URL, solo necesitas:
1. Desplegar la nueva version a Vercel (`git push`)
2. La app movil se actualiza automaticamente al reiniciar

Solo necesitas recompilar el APK nativo si:
- Cambias la configuracion de Capacitor (plugins nativos, permisos, etc.)
- Agregas nuevos plugins de Capacitor
- Cambias el `appId` o `appName`

---

## Notas Finales

- El sistema usa `localStorage` para autenticacion. En produccion considerar cookies HTTP-only.
- Los reportes PDF se generan en el cliente usando jsPDF.
- Para soporte offline parcial, considerar implementar Service Workers en el futuro.

---

**Desarrollado para:** TechSolutions S.A.
**Tipo:** Proyecto Universitario / Practica Profesional
**Estado:** Completo, funcional y listo para produccion
