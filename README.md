# TechSolutions S.A. — Sistema Empresarial Full-Stack

Sistema web empresarial completo desarrollado con Next.js, React, TypeScript y PostgreSQL para la gestion integral de clientes, proyectos, tareas y usuarios. Incluye dashboard analitico, reportes PDF y aplicacion movil Android via Capacitor.

---

## Descripcion del Proyecto

TechSolutions S.A. es una aplicacion empresarial full-stack diseñada para la gestion de operaciones corporativas. Permite administrar clientes, proyectos, tareas asignadas y usuarios del sistema con control de roles (Administrador y Usuario). La interfaz es completamente responsive y esta optimizada tanto para escritorio como para dispositivos moviles.

El proyecto fue desarrollado como parte de un proyecto integrador universitario, aplicando buenas practicas de desarrollo, arquitectura modular, autenticacion segura y despliegue continuo.

---

## Caracteristicas Principales

- **Dashboard personalizado**: Vista de resumen con estadisticas diferenciadas por rol (administrador vs usuario normal)
- **Gestion de clientes**: CRUD completo de clientes empresariales con estado activo/inactivo
- **Gestion de proyectos**: Proyectos asociados a clientes, con barra de progreso visual y estado en tiempo real
- **Gestion de tareas**: Tareas asignadas a proyectos y responsables, con prioridad y fecha limite
- **Control de roles**: Administrador gestiona todo; usuarios normales solo interactuan con sus proyectos y tareas asignadas
- **Reportes PDF**: Generacion de reportes de proyecto con jsPDF y jspdf-autotable
- **Historial de tareas**: Timeline de fechas de creacion, edicion y cambios de estado
- **Buscador global**: Busqueda en tiempo real en clientes, proyectos, tareas y usuarios
- **App movil Android**: Compilada con Capacitor, carga la aplicacion desde Vercel (Remote URL)
- **Diseño moderno**: Interfaz profesional con TailwindCSS, animaciones de entrada, cards con bordes de color por modulo y totalmente responsive
- **Seed de datos**: 10 usuarios demo, 10 clientes, 10 proyectos y 50 tareas precargadas

---

## Tecnologias Utilizadas

| Categoria | Tecnologia |
|-----------|------------|
| Framework | Next.js 16 (App Router) |
| Frontend | React 19, TypeScript, TailwindCSS 4 |
| Backend | Next.js API Routes (Route Handlers) |
| ORM | Prisma 6 |
| Base de datos | PostgreSQL (local / Railway) |
| Runtime | Bun |
| Autenticacion | JWT + localStorage |
| Validacion | Zod |
| Reportes | jsPDF + jspdf-autotable |
| App movil | Capacitor 8 + Android |
| Despliegue | Vercel (frontend) + Railway (PostgreSQL) |

---

## Arquitectura del Sistema

```
Usuario
  |
  |---> Navegador Web (PC / Tablet / Celular)
  |       └── Next.js App (Vercel)
  |              ├── API Routes (backend interno)
  |              ├── PostgreSQL (Railway)
  |              └── jsPDF (reportes)
  |
  |---> App Android (APK)
          └── Capacitor WebView
                 └── Carga desde Vercel URL
```

---

## Requisitos Previos

- Bun instalado (https://bun.sh)
- PostgreSQL corriendo (local via extension VS Code o Railway)
- Git

---

## Instalacion Local (Rapido)

Ejecuta el script automatizado:

```bash
bun run setup
```

O desde Windows con doble clic:
```
scripts/setup-local.bat
```

Este script verifica PostgreSQL, genera el cliente Prisma, aplica migraciones y ejecuta el seed con datos demo.

---

## Instalacion Local (Manual)

1. Clonar el repositorio e instalar dependencias:
```bash
bun install
```

2. Copiar variables de entorno:
```bash
cp .env.example .env
```

3. Configurar `DATABASE_URL` en `.env` con tus credenciales PostgreSQL

4. Generar cliente Prisma:
```bash
bunx prisma generate
```

5. Ejecutar migraciones:
```bash
bunx prisma migrate dev
```

6. Insertar datos demo:
```bash
bunx prisma db seed
```

7. Iniciar servidor de desarrollo:
```bash
bun run dev
```

La aplicacion estara disponible en `http://localhost:3000`

---

## Variables de Entorno

Ver archivo `.env.example`:

```
DATABASE_URL=postgresql://usuario:password@host:puerto/basedatos?schema=public
JWT_SECRET=tu-secreto-jwt-super-seguro
NODE_ENV=development
NEXT_PUBLIC_APP_URL=https://tu-app.vercel.app
```

---

## Credenciales de Acceso (Demo)

Despues de ejecutar `bunx prisma db seed`, se crean los siguientes usuarios:

| Rol | Correo | Contraseña |
|-----|--------|------------|
| Administrador | admin@techsolutions.com | admin123 |
| Usuario 1 | carlos.mendez@techsolutions.com | password123 |
| Usuario 2 | ana.garcia@techsolutions.com | password123 |
| Usuario 3 | luis.rodriguez@techsolutions.com | password123 |
| Usuario 4 | maria.lopez@techsolutions.com | password123 |
| Usuario 5 | juan.perez@techsolutions.com | password123 |
| Usuario 6 | sofia.torres@techsolutions.com | password123 |
| Usuario 7 | diego.ramirez@techsolutions.com | password123 |
| Usuario 8 | valentina.flores@techsolutions.com | password123 |
| Usuario 9 | andres.morales@techsolutions.com | password123 |
| Usuario 10 | camila.diaz@techsolutions.com | password123 |

---

## Scripts Disponibles

| Comando | Descripcion |
|---------|-------------|
| `bun run dev` | Servidor de desarrollo |
| `bun run build` | Compilar para produccion |
| `bun run start` | Iniciar en modo produccion |
| `bun run setup` | Setup local automatizado |
| `bun run deploy` | Guia paso a paso para produccion |
| `bun run build:apk` | Compilar APK Android |
| `bun run diagnostico` | Diagnostico del sistema |
| `bun run cap:sync` | Sincronizar Capacitor |
| `bun run cap:open:android` | Abrir Android Studio |
| `bunx prisma studio` | Prisma Studio (interfaz grafica DB) |
| `bunx prisma migrate dev` | Crear nueva migracion |
| `bunx prisma migrate deploy` | Aplicar migraciones en produccion |
| `bunx prisma db seed` | Insertar datos demo |

---

## Estructura del Proyecto

```
Proyecto_Empresarial/
|-- app/                          # Next.js App Router
|   |-- api/                      # Backend (Route Handlers)
|   |   |-- auth/                 # Login, register, logout, me
|   |   |-- clientes/             # CRUD clientes
|   |   |-- proyectos/            # CRUD proyectos + reportes PDF
|   |   |-- tareas/               # CRUD tareas
|   |   |-- usuarios/             # Gestion usuarios
|   |   |-- dashboard/            # Resumen estadistico
|   |-- clientes/                 # Paginas frontend clientes
|   |-- proyectos/                # Paginas frontend proyectos
|   |-- tareas/                   # Paginas frontend tareas
|   |-- usuarios/                 # Paginas frontend usuarios
|   |-- dashboard/                # Panel principal
|   |-- perfil/                   # Perfil de usuario
|   |-- login/                    # Inicio de sesion
|   |-- register/                 # Registro
|   |-- globals.css               # Estilos globales y animaciones
|-- components/
|   |-- ui/                       # Componentes reutilizables (Button, Card, Input, Badge, Alert)
|   |-- layout/                   # AppShell, AppSidebar, AuthProvider
|-- lib/                          # Utilidades
|   |-- prisma.ts                 # Cliente Prisma singleton
|   |-- auth-server.ts            # Helpers de autenticacion servidor
|   |-- jwt.ts                    # Manejo de tokens JWT
|   |-- validations/              # Esquemas de validacion Zod
|-- prisma/
|   |-- schema.prisma             # Modelo de datos (User, Client, Project, Task)
|   |-- seed.ts                   # Datos demo
|-- scripts/                      # Scripts automatizados
|   |-- setup.ts                  # Setup local
|   |-- deploy.ts                 # Guia de despliegue
|   |-- build-apk.ts              # Compilar APK
|   |-- diagnostico.ts            # Diagnostico del sistema
|-- android/                      # Proyecto Android (Capacitor)
|-- capacitor.config.ts           # Configuracion de Capacitor
|-- vercel.json                   # Configuracion de build en Vercel
|-- next.config.ts                # Configuracion de Next.js
|-- package.json
|-- .env.example
|-- README.md
|-- INIT.md                       # Documentacion completa del proyecto
|-- CREDENCIALES.md               # Credenciales de usuarios demo
|-- GUIA_VERCEL.md                # Guia paso a paso para Vercel
```

---

## Endpoints API

### Autenticacion
- `POST /api/auth/register` — Registro de usuarios
- `POST /api/auth/login` — Inicio de sesion
- `POST /api/auth/logout` — Cerrar sesion
- `GET /api/auth/me` — Obtener usuario actual

### Clientes
- `GET /api/clientes` — Listar clientes
- `POST /api/clientes` — Crear cliente
- `GET /api/clientes/[id]` — Ver cliente
- `PUT /api/clientes/[id]` — Actualizar cliente
- `DELETE /api/clientes/[id]` — Eliminar cliente

### Proyectos
- `GET /api/proyectos` — Listar proyectos (con progreso calculado)
- `POST /api/proyectos` — Crear proyecto
- `GET /api/proyectos/[id]` — Ver proyecto
- `PUT /api/proyectos/[id]` — Actualizar proyecto
- `DELETE /api/proyectos/[id]` — Eliminar proyecto
- `GET /api/proyectos/[id]/reporte` — Descargar reporte PDF

### Tareas
- `GET /api/tareas` — Listar tareas (filtradas por rol)
- `POST /api/tareas` — Crear tarea
- `GET /api/tareas/[id]` — Ver tarea
- `PUT /api/tareas/[id]` — Actualizar tarea
- `DELETE /api/tareas/[id]` — Eliminar tarea

### Usuarios
- `GET /api/usuarios` — Listar usuarios
- `GET /api/usuarios/[id]` — Ver usuario
- `PUT /api/usuarios/[id]` — Actualizar usuario
- `DELETE /api/usuarios/[id]` — Eliminar usuario

### Dashboard
- `GET /api/dashboard/resumen` — Estadisticas generales/personales

---

## App Movil Android

La aplicacion movil se construyo con **Capacitor** usando la estrategia **Remote URL**, lo que significa que la app carga la interfaz web directamente desde Vercel. Esto garantiza que siempre se use la version mas reciente sin necesidad de actualizar el APK.

### Requisitos para compilar
- Android Studio 2025.3+
- Java JDK 26 (o 17+)
- Android SDK

### Pasos para compilar

1. Asegurar que `capacitor.config.ts` tenga la URL de Vercel:
```ts
server: {
  url: 'https://proyecto-empresarial.vercel.app/',
  cleartext: true,
}
```

2. Sincronizar Capacitor:
```bash
bun run cap:sync
```

3. Abrir Android Studio:
```bash
bun run cap:open:android
```

4. En Android Studio: `Build > Build Bundle(s) / APK(s) > Build APK(s)`

El APK generado se encuentra en:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

---

## Despliegue en Produccion

### Base de Datos (Railway)
1. Crear proyecto en Railway (https://railway.app)
2. Agregar servicio PostgreSQL
3. Copiar la `DATABASE_URL`
4. Ejecutar migraciones y seed manualmente

### Frontend (Vercel)
1. Importar repositorio en Vercel (https://vercel.com)
2. Agregar variables de entorno:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `NODE_ENV=production`
3. El archivo `vercel.json` esta configurado para ejecutar migraciones automaticas antes de cada build:
```bash
bunx prisma migrate deploy && bun run build
```
4. Cada push a `main` despliega automaticamente

> Nota: El seed (`bunx prisma db seed`) se ejecuta una sola vez manualmente despues del primer deploy.

---

## Estado del Proyecto

- Desarrollo: Completo
- Pruebas: Realizadas en navegador y dispositivo Android
- Despliegue web: Activo en Vercel
- App movil: APK compilado y funcionando
- Documentacion: README.md, INIT.md, GUIA_VERCEL.md, CREDENCIALES.md

---

## Autor

Proyecto Integrador Full-Stack Empresarial  
**TechSolutions S.A.**  
Desarrollado con Next.js, React, TypeScript, Prisma y PostgreSQL.
