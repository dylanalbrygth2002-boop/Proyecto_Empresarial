# Plan De Implementación - Sistema Web Empresarial Full-Stack TechSolutions S.A.

## 1. Resumen Ejecutivo Del Sistema

El proyecto consiste en desarrollar una aplicación web empresarial full-stack para **TechSolutions S.A.**, una empresa ficticia dedicada a servicios tecnológicos y consultoría empresarial.

La empresa actualmente gestiona clientes, proyectos, tareas y usuarios mediante hojas de cálculo y correos electrónicos. Esto genera duplicidad de datos, errores de información, falta de trazabilidad y baja eficiencia operativa.

La solución propuesta es una aplicación web centralizada que permita:

- Gestionar usuarios con autenticación y roles.
- Gestionar clientes empresariales.
- Gestionar proyectos asociados a clientes.
- Gestionar tareas asociadas a proyectos y responsables.
- Visualizar indicadores operativos mediante un dashboard empresarial.

El sistema debe construirse como una aplicación **Next.js full-stack con App Router**, usando un único repositorio de GitHub. El frontend y el backend estarán integrados dentro del mismo proyecto. El backend se implementará mediante **Route Handlers en `app/api`**, sin servidores externos como Express, NestJS, Django o FastAPI.

La base de datos será **PostgreSQL en Railway**, conectada mediante **Prisma ORM**. El proyecto usará **Bun** como gestor de paquetes y entorno para ejecutar comandos.

El resultado final esperado es un sistema funcional, desplegado públicamente en Railway, documentado y preparado para evaluación universitaria.

## 2. Alcance Funcional

El sistema debe incluir como mínimo los siguientes módulos funcionales.

### 2.1 Gestión De Usuarios

Debe permitir:

- Registro de usuarios.
- Inicio de sesión.
- Cierre de sesión.
- Consulta del usuario autenticado.
- Roles `ADMIN` y `USER`.
- Protección de rutas privadas.
- Control de acceso según rol.
- Gestión administrativa de usuarios.

El rol `ADMIN` podrá:

- Acceder al dashboard.
- Gestionar clientes.
- Gestionar proyectos.
- Gestionar tareas.
- Ver usuarios registrados.
- Editar datos básicos de usuarios.
- Cambiar roles si se decide incluir esta opción.
- Eliminar usuarios, con restricciones.

El rol `USER` podrá:

- Acceder al dashboard.
- Consultar y gestionar información operativa según el alcance definido.
- Ver su perfil.
- No acceder a la administración de usuarios.

Reglas importantes:

- Nunca devolver `passwordHash` en respuestas JSON.
- No permitir que un administrador se elimine a sí mismo.
- El primer administrador debe crearse mediante seed, Prisma Studio o script controlado.

### 2.2 Gestión De Clientes

Debe permitir CRUD completo:

- Crear clientes.
- Listar clientes.
- Ver detalle de cliente.
- Editar clientes.
- Eliminar clientes.

Datos mínimos del cliente:

- ID.
- Nombre.
- Correo.
- Teléfono.
- Empresa.
- Estado.
- Fecha de creación.
- Fecha de actualización.

Estados sugeridos:

- `ACTIVE` para cliente activo.
- `INACTIVE` para cliente inactivo.

Reglas recomendadas:

- Validar formato de correo.
- No eliminar clientes que tengan proyectos asociados.
- Mostrar mensajes claros cuando no se pueda eliminar un cliente.

### 2.3 Gestión De Proyectos

Debe permitir CRUD completo:

- Crear proyectos.
- Listar proyectos.
- Ver detalle de proyecto.
- Editar proyectos.
- Eliminar proyectos.
- Asociar cada proyecto a un cliente.

Datos mínimos del proyecto:

- ID.
- Nombre del proyecto.
- Descripción.
- Fecha de inicio.
- Fecha de fin.
- Estado del proyecto.
- Cliente asociado.
- Fecha de creación.
- Fecha de actualización.

Estados sugeridos:

- `PLANNED` para planificado.
- `IN_PROGRESS` para en progreso.
- `PAUSED` para pausado.
- `FINISHED` para finalizado.
- `CANCELLED` para cancelado.

Reglas recomendadas:

- Todo proyecto debe pertenecer a un cliente existente.
- La fecha de fin no debe ser anterior a la fecha de inicio.
- No eliminar proyectos que tengan tareas asociadas.

### 2.4 Gestión De Tareas

Debe permitir CRUD completo:

- Crear tareas.
- Listar tareas.
- Ver detalle de tarea.
- Editar tareas.
- Eliminar tareas.
- Asignar tareas a proyectos.
- Definir responsable.
- Definir prioridad.
- Definir estado.
- Dar seguimiento al avance.

Datos mínimos de la tarea:

- ID.
- Título.
- Descripción.
- Proyecto asociado.
- Responsable.
- Prioridad.
- Estado.
- Fecha límite.
- Fecha de creación.
- Fecha de actualización.

Prioridades sugeridas:

- `LOW` para baja.
- `MEDIUM` para media.
- `HIGH` para alta.
- `CRITICAL` para crítica.

Estados sugeridos:

- `PENDING` para pendiente.
- `IN_PROGRESS` para en progreso.
- `IN_REVIEW` para en revisión.
- `COMPLETED` para completada.
- `CANCELLED` para cancelada.

Reglas recomendadas:

- Toda tarea debe estar asociada a un proyecto existente.
- Toda tarea debe tener un responsable existente.
- El usuario responsable no debe exponer datos sensibles.

### 2.5 Dashboard Empresarial

Debe mostrar indicadores visuales como:

- Total de clientes.
- Total de proyectos.
- Proyectos activos.
- Proyectos finalizados.
- Tareas pendientes.
- Tareas completadas.
- Usuarios registrados.
- Últimos proyectos creados.
- Últimas tareas registradas.

El dashboard debe ser visualmente claro, moderno, responsivo y adecuado para un entorno empresarial universitario.

## 3. Arquitectura General Propuesta

La arquitectura debe ser **full-stack monolítica con Next.js**.

Flujo general:

```txt
Navegador del usuario
↓
Next.js App Router
↓
Páginas React y componentes reutilizables
↓
Route Handlers en app/api
↓
Lógica de autenticación, validación y negocio
↓
Prisma ORM
↓
PostgreSQL en Railway
```

Capas recomendadas:

- **Capa de presentación:** páginas dentro de `app/` y componentes dentro de `components/`.
- **Capa de API:** Route Handlers dentro de `app/api`.
- **Capa de lógica compartida:** helpers en `lib/`.
- **Capa de validación:** esquemas Zod en `lib/validations/`.
- **Capa de acceso a datos:** Prisma Client centralizado en `lib/prisma.ts`.
- **Capa de persistencia:** PostgreSQL administrado por Railway.
- **Capa de seguridad:** JWT, cookies HTTP-only, middleware y validación por roles.

Decisiones arquitectónicas obligatorias:

- Usar un solo repositorio.
- Usar Next.js App Router.
- Usar backend interno con `app/api`.
- No crear backend separado.
- No usar Express, NestJS, Django ni FastAPI.
- No dividir el proyecto en frontend y backend independientes.

## 4. Stack Tecnológico Definitivo

### Framework Principal

- Next.js con App Router.

### Lenguaje

- TypeScript.

### Interfaz

- React.
- TailwindCSS.
- Componentes reutilizables.
- Diseño responsivo.

### Backend

- API REST usando Route Handlers de Next.js en `app/api`.

### Base De Datos

- PostgreSQL en Railway.

### ORM

- Prisma ORM.

### Autenticación

- JWT.
- Cookies HTTP-only.
- Hash de contraseñas con `bcryptjs` o `argon2`.

Recomendación práctica:

- Usar `bcryptjs` para simplificar instalación y compatibilidad en un proyecto universitario.

### Validación

- Zod para validar datos de entrada en frontend y backend.

### Gestor De Paquetes Y Runtime

- Bun obligatorio.

### Control De Versiones

- Git.
- GitHub.
- Un solo repositorio.

### Despliegue

- Railway para aplicación Next.js.
- Railway PostgreSQL para base de datos.

## 5. Estructura Recomendada Del Repositorio

Estructura sugerida:

```txt
techsolutions-app/
├─ app/
│  ├─ api/
│  │  ├─ auth/
│  │  │  ├─ register/
│  │  │  │  └─ route.ts
│  │  │  ├─ login/
│  │  │  │  └─ route.ts
│  │  │  ├─ logout/
│  │  │  │  └─ route.ts
│  │  │  └─ me/
│  │  │     └─ route.ts
│  │  ├─ clientes/
│  │  │  ├─ route.ts
│  │  │  └─ [id]/
│  │  │     └─ route.ts
│  │  ├─ proyectos/
│  │  │  ├─ route.ts
│  │  │  └─ [id]/
│  │  │     └─ route.ts
│  │  ├─ tareas/
│  │  │  ├─ route.ts
│  │  │  └─ [id]/
│  │  │     └─ route.ts
│  │  ├─ usuarios/
│  │  │  ├─ route.ts
│  │  │  └─ [id]/
│  │  │     └─ route.ts
│  │  └─ dashboard/
│  │     └─ resumen/
│  │        └─ route.ts
│  ├─ dashboard/
│  │  └─ page.tsx
│  ├─ clientes/
│  │  ├─ page.tsx
│  │  ├─ nuevo/
│  │  │  └─ page.tsx
│  │  └─ [id]/
│  │     ├─ page.tsx
│  │     └─ editar/
│  │        └─ page.tsx
│  ├─ proyectos/
│  │  ├─ page.tsx
│  │  ├─ nuevo/
│  │  │  └─ page.tsx
│  │  └─ [id]/
│  │     ├─ page.tsx
│  │     └─ editar/
│  │        └─ page.tsx
│  ├─ tareas/
│  │  ├─ page.tsx
│  │  ├─ nueva/
│  │  │  └─ page.tsx
│  │  └─ [id]/
│  │     ├─ page.tsx
│  │     └─ editar/
│  │        └─ page.tsx
│  ├─ usuarios/
│  │  └─ page.tsx
│  ├─ perfil/
│  │  └─ page.tsx
│  ├─ login/
│  │  └─ page.tsx
│  ├─ register/
│  │  └─ page.tsx
│  ├─ layout.tsx
│  ├─ page.tsx
│  └─ globals.css
├─ components/
│  ├─ layout/
│  │  ├─ AppSidebar.tsx
│  │  ├─ AppHeader.tsx
│  │  └─ ProtectedLayout.tsx
│  ├─ ui/
│  │  ├─ Button.tsx
│  │  ├─ Input.tsx
│  │  ├─ Select.tsx
│  │  ├─ Card.tsx
│  │  ├─ Table.tsx
│  │  ├─ Badge.tsx
│  │  ├─ Alert.tsx
│  │  └─ ConfirmDialog.tsx
│  ├─ forms/
│  │  ├─ ClientForm.tsx
│  │  ├─ ProjectForm.tsx
│  │  └─ TaskForm.tsx
│  └─ dashboard/
│     ├─ StatCard.tsx
│     └─ RecentList.tsx
├─ lib/
│  ├─ prisma.ts
│  ├─ auth.ts
│  ├─ jwt.ts
│  ├─ validations/
│  │  ├─ auth.ts
│  │  ├─ client.ts
│  │  ├─ project.ts
│  │  ├─ task.ts
│  │  └─ user.ts
│  ├─ api-response.ts
│  └─ utils.ts
├─ prisma/
│  ├─ schema.prisma
│  └─ seed.ts
├─ public/
├─ middleware.ts
├─ .env
├─ .env.example
├─ .gitignore
├─ package.json
├─ README.md
└─ tsconfig.json
```

Nota importante:

- `.env` debe existir solo localmente y no debe subirse a GitHub.
- `.env.example` sí debe subirse y debe contener nombres de variables sin valores sensibles.

## 6. Modelo De Base De Datos Propuesto

No se debe programar todavía el schema completo, pero el modelo de Prisma debe contemplar las siguientes entidades.

### 6.1 User

Representa los usuarios que acceden al sistema.

Campos recomendados:

- `id`: UUID o CUID como clave primaria.
- `name`: string obligatorio.
- `email`: string obligatorio y único.
- `passwordHash`: string obligatorio.
- `role`: enum `ADMIN` o `USER`.
- `createdAt`: fecha automática de creación.
- `updatedAt`: fecha automática de actualización.
- `tasks`: relación uno a muchos con `Task`.

Restricciones:

- `email` debe ser único.
- `passwordHash` nunca debe devolverse al frontend.
- Debe existir al menos un usuario administrador para pruebas.

Índices recomendados:

- Índice único en `email`.
- Índice en `role` si se filtran usuarios por rol.

### 6.2 Client

Representa clientes empresariales o personas atendidas por TechSolutions S.A.

Campos recomendados:

- `id`: UUID o CUID como clave primaria.
- `name`: string obligatorio.
- `email`: string obligatorio o nullable según decisión final.
- `phone`: string opcional.
- `company`: string obligatorio.
- `status`: enum `ACTIVE` o `INACTIVE`.
- `createdAt`: fecha automática.
- `updatedAt`: fecha automática.
- `projects`: relación uno a muchos con `Project`.

Restricciones:

- Validar formato de correo.
- Impedir eliminación si tiene proyectos asociados.
- Mantener trazabilidad básica.

Índices recomendados:

- Índice en `status`.
- Índice en `company`.
- Índice en `createdAt`.

### 6.3 Project

Representa proyectos asociados a clientes.

Campos recomendados:

- `id`: UUID o CUID como clave primaria.
- `name`: string obligatorio.
- `description`: texto opcional u obligatorio según formulario.
- `startDate`: fecha obligatoria.
- `endDate`: fecha opcional.
- `status`: enum de estado de proyecto.
- `clientId`: clave foránea hacia `Client`.
- `client`: relación muchos a uno con `Client`.
- `tasks`: relación uno a muchos con `Task`.
- `createdAt`: fecha automática.
- `updatedAt`: fecha automática.

Restricciones:

- `clientId` obligatorio.
- `endDate` no debe ser anterior a `startDate`.
- Impedir eliminación si tiene tareas asociadas.

Índices recomendados:

- Índice en `clientId`.
- Índice en `status`.
- Índice en `createdAt`.

### 6.4 Task

Representa tareas asociadas a proyectos y responsables.

Campos recomendados:

- `id`: UUID o CUID como clave primaria.
- `title`: string obligatorio.
- `description`: texto opcional.
- `projectId`: clave foránea hacia `Project`.
- `project`: relación muchos a uno con `Project`.
- `responsibleId`: clave foránea hacia `User`.
- `responsible`: relación muchos a uno con `User`.
- `priority`: enum de prioridad.
- `status`: enum de estado de tarea.
- `dueDate`: fecha opcional u obligatoria.
- `createdAt`: fecha automática.
- `updatedAt`: fecha automática.

Restricciones:

- `projectId` obligatorio.
- `responsibleId` obligatorio.
- Validar que el proyecto exista.
- Validar que el usuario responsable exista.
- No devolver datos sensibles del responsable.

Índices recomendados:

- Índice en `projectId`.
- Índice en `responsibleId`.
- Índice en `status`.
- Índice en `priority`.
- Índice en `dueDate`.

### 6.5 Enumeraciones Necesarias

Enums conceptuales recomendados:

```txt
UserRole:
- ADMIN
- USER

ClientStatus:
- ACTIVE
- INACTIVE

ProjectStatus:
- PLANNED
- IN_PROGRESS
- PAUSED
- FINISHED
- CANCELLED

TaskPriority:
- LOW
- MEDIUM
- HIGH
- CRITICAL

TaskStatus:
- PENDING
- IN_PROGRESS
- IN_REVIEW
- COMPLETED
- CANCELLED
```

### 6.6 Reglas De Eliminación Y Conservación

Para mantener trazabilidad y evitar pérdidas accidentales:

- No eliminar clientes con proyectos asociados.
- No eliminar proyectos con tareas asociadas.
- Permitir eliminar tareas directamente.
- No permitir que un administrador elimine su propio usuario.
- Validar si un usuario tiene tareas asignadas antes de eliminarlo.
- Como mejora futura, considerar borrado lógico con `deletedAt`, pero no es obligatorio para el alcance universitario.

## 7. Rutas Frontend

### 7.1 Rutas Públicas

```txt
/
/login
/register
```

### 7.2 Rutas Privadas

```txt
/dashboard
/clientes
/clientes/nuevo
/clientes/[id]
/clientes/[id]/editar
/proyectos
/proyectos/nuevo
/proyectos/[id]
/proyectos/[id]/editar
/tareas
/tareas/nueva
/tareas/[id]
/tareas/[id]/editar
/usuarios
/perfil
```

### 7.3 Comportamiento Esperado Por Ruta

`/`

- Página de bienvenida.
- Debe mostrar acceso a login y registro.
- Si el usuario ya tiene sesión, puede redirigir a `/dashboard`.

`/login`

- Formulario de correo y contraseña.
- Mensajes de error para credenciales inválidas.
- Redirección a `/dashboard` si el login es correcto.

`/register`

- Formulario de registro.
- Crea usuarios con rol `USER` por defecto.
- Redirige a `/login` después del registro exitoso.

`/dashboard`

- Panel principal con indicadores reales.
- Tarjetas estadísticas.
- Últimos proyectos y últimas tareas.

`/clientes`

- Tabla de clientes.
- Botón para crear cliente.
- Acciones de ver, editar y eliminar.

`/clientes/nuevo`

- Formulario para crear cliente.

`/clientes/[id]`

- Detalle del cliente.
- Puede mostrar proyectos asociados.

`/clientes/[id]/editar`

- Formulario precargado para editar cliente.

`/proyectos`

- Tabla de proyectos.
- Mostrar cliente asociado.
- Acciones de ver, editar y eliminar.

`/proyectos/nuevo`

- Formulario para crear proyecto.
- Debe incluir selector de cliente.

`/proyectos/[id]`

- Detalle del proyecto.
- Mostrar cliente asociado.
- Mostrar tareas asociadas si aplica.

`/proyectos/[id]/editar`

- Formulario precargado para editar proyecto.

`/tareas`

- Tabla de tareas.
- Mostrar proyecto, responsable, estado y prioridad.

`/tareas/nueva`

- Formulario para crear tarea.
- Debe incluir selector de proyecto y responsable.

`/tareas/[id]`

- Detalle de tarea.

`/tareas/[id]/editar`

- Formulario precargado para editar tarea.

`/usuarios`

- Solo para administradores.
- Tabla de usuarios registrados.
- Acciones administrativas.

`/perfil`

- Información del usuario autenticado.

## 8. Endpoints Backend

Todas las respuestas deben ser JSON y tener estructura consistente.

Respuesta de éxito recomendada:

```json
{
  "success": true,
  "data": {}
}
```

Respuesta de error recomendada:

```json
{
  "success": false,
  "message": "Mensaje claro del error",
  "errors": {}
}
```

### 8.1 Autenticación

```txt
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET /api/auth/me
```

`POST /api/auth/register`

- Recibe nombre, correo y contraseña.
- Valida datos con Zod.
- Verifica correo único.
- Hashea contraseña.
- Crea usuario con rol `USER`.
- Devuelve usuario sin contraseña.

`POST /api/auth/login`

- Recibe correo y contraseña.
- Valida credenciales.
- Genera JWT.
- Guarda JWT en cookie HTTP-only.
- Devuelve usuario autenticado sin contraseña.

`POST /api/auth/logout`

- Elimina cookie de sesión.
- Devuelve confirmación.

`GET /api/auth/me`

- Lee cookie.
- Verifica JWT.
- Devuelve usuario autenticado.

### 8.2 Clientes

```txt
GET /api/clientes
POST /api/clientes
GET /api/clientes/[id]
PUT /api/clientes/[id]
DELETE /api/clientes/[id]
```

`GET /api/clientes`

- Requiere autenticación.
- Lista clientes ordenados por fecha de creación descendente.
- Puede incluir paginación básica.

`POST /api/clientes`

- Requiere autenticación.
- Valida datos.
- Crea cliente.

`GET /api/clientes/[id]`

- Requiere autenticación.
- Devuelve cliente por ID.
- Puede incluir proyectos asociados.

`PUT /api/clientes/[id]`

- Requiere autenticación.
- Valida datos.
- Actualiza cliente.

`DELETE /api/clientes/[id]`

- Requiere autenticación.
- Recomendado solo para `ADMIN`.
- Valida que no tenga proyectos asociados.

### 8.3 Proyectos

```txt
GET /api/proyectos
POST /api/proyectos
GET /api/proyectos/[id]
PUT /api/proyectos/[id]
DELETE /api/proyectos/[id]
```

`GET /api/proyectos`

- Lista proyectos.
- Incluye cliente asociado.
- Ordena por fecha de creación descendente.

`POST /api/proyectos`

- Crea proyecto.
- Valida cliente existente.
- Valida fechas.

`GET /api/proyectos/[id]`

- Devuelve detalle de proyecto.
- Incluye cliente y tareas relacionadas.

`PUT /api/proyectos/[id]`

- Actualiza proyecto.
- Valida fechas y cliente.

`DELETE /api/proyectos/[id]`

- Elimina solo si no tiene tareas asociadas.

### 8.4 Tareas

```txt
GET /api/tareas
POST /api/tareas
GET /api/tareas/[id]
PUT /api/tareas/[id]
DELETE /api/tareas/[id]
```

`GET /api/tareas`

- Lista tareas.
- Incluye proyecto y responsable.
- Puede filtrar por estado, prioridad o responsable.

`POST /api/tareas`

- Crea tarea.
- Valida proyecto existente.
- Valida responsable existente.
- Valida prioridad y estado.

`GET /api/tareas/[id]`

- Devuelve detalle de tarea.
- Incluye proyecto y responsable.

`PUT /api/tareas/[id]`

- Actualiza tarea.

`DELETE /api/tareas/[id]`

- Elimina tarea.

### 8.5 Usuarios

```txt
GET /api/usuarios
GET /api/usuarios/[id]
PUT /api/usuarios/[id]
DELETE /api/usuarios/[id]
```

Todos estos endpoints requieren rol `ADMIN`.

`GET /api/usuarios`

- Lista usuarios.
- Nunca devuelve `passwordHash`.

`GET /api/usuarios/[id]`

- Devuelve usuario por ID.
- No expone contraseña.

`PUT /api/usuarios/[id]`

- Edita nombre, correo o rol.
- Si se permite cambio de contraseña, debe manejarse con validación especial.

`DELETE /api/usuarios/[id]`

- Elimina usuario.
- No permite eliminarse a sí mismo.
- Valida si tiene tareas asignadas.

### 8.6 Dashboard

```txt
GET /api/dashboard/resumen
```

Debe devolver:

```json
{
  "totalClientes": 0,
  "totalProyectos": 0,
  "proyectosActivos": 0,
  "proyectosFinalizados": 0,
  "tareasPendientes": 0,
  "tareasCompletadas": 0,
  "usuariosRegistrados": 0,
  "ultimosProyectos": [],
  "ultimasTareas": []
}
```

## 9. Flujo De Autenticación Y Autorización

### 9.1 Registro

Flujo:

1. Usuario entra a `/register`.
2. Completa nombre, correo y contraseña.
3. Frontend valida campos básicos.
4. Frontend envía `POST /api/auth/register`.
5. Backend valida con Zod.
6. Backend verifica que el correo no exista.
7. Backend hashea la contraseña.
8. Backend crea usuario con rol `USER`.
9. Backend devuelve respuesta exitosa.
10. Frontend redirige a `/login`.

### 9.2 Login

Flujo:

1. Usuario entra a `/login`.
2. Ingresa correo y contraseña.
3. Frontend envía `POST /api/auth/login`.
4. Backend busca usuario por correo.
5. Backend compara contraseña con hash.
6. Si es válido, genera JWT.
7. Backend guarda JWT en cookie HTTP-only.
8. Frontend redirige a `/dashboard`.

### 9.3 Contenido Del JWT

El token debe contener solo información mínima:

- `userId`.
- `email`.
- `role`.

No debe incluir:

- Contraseña.
- Hash de contraseña.
- Datos sensibles.
- Información innecesaria.

### 9.4 Cookies Seguras

Cookie recomendada:

- `httpOnly: true`.
- `secure: true` en producción.
- `secure: false` en desarrollo local si se usa HTTP.
- `sameSite: "lax"`.
- `path: "/"`.
- `maxAge` de aproximadamente 7 días.

### 9.5 Middleware

Usar `middleware.ts` para:

- Proteger rutas privadas.
- Redirigir usuarios no autenticados a `/login`.
- Redirigir usuarios autenticados fuera de `/login` y `/register`, si se desea.
- Bloquear `/usuarios` para usuarios que no sean `ADMIN`.

Rutas privadas principales:

```txt
/dashboard
/clientes
/proyectos
/tareas
/usuarios
/perfil
```

### 9.6 Protección De Endpoints

Cada endpoint sensible debe verificar autenticación desde backend.

Regla clave:

- No confiar solo en el middleware de rutas.

Crear helpers en `lib/auth.ts` para:

- Obtener usuario desde cookie.
- Verificar JWT.
- Validar rol administrador.
- Devolver error `401` si no hay sesión.
- Devolver error `403` si no tiene permisos.

### 9.7 Cierre De Sesión

Flujo:

1. Usuario presiona cerrar sesión.
2. Frontend llama `POST /api/auth/logout`.
3. Backend elimina la cookie.
4. Frontend redirige a `/login`.

## 10. Diseño Visual Y Experiencia De Usuario

El diseño debe ser empresarial, moderno, claro, responsivo y adecuado para una presentación universitaria.

### 10.1 Identidad Visual

Paleta recomendada:

```txt
Fondo general: gray-100
Sidebar: slate-950
Texto principal: slate-900
Texto secundario: slate-500
Acción primaria: blue-600
Éxito: emerald-600
Advertencia: amber-500
Error: red-600
```

### 10.2 Layout Principal

Debe incluir:

- Sidebar fijo en escritorio.
- Menú superior o drawer en móvil.
- Header con nombre del sistema.
- Información del usuario autenticado.
- Botón de cierre de sesión.
- Área principal con espaciado uniforme.
- Tarjetas y paneles con bordes suaves.

### 10.3 Login Y Registro

Debe incluir:

- Formulario centrado.
- Tarjeta moderna.
- Nombre del sistema.
- Descripción breve.
- Campos claros.
- Mensajes de error visibles.
- Botones con estado de carga.

### 10.4 Dashboard

Debe incluir:

- Título principal.
- Subtítulo descriptivo.
- Grid de tarjetas estadísticas.
- Últimos proyectos creados.
- Últimas tareas registradas.
- Badges para estados.

### 10.5 Tablas

Debe incluir:

- Encabezados claros.
- Estados vacíos cuando no existan datos.
- Botones de acción: ver, editar, eliminar.
- Badges de estado y prioridad.
- Scroll horizontal en móvil si es necesario.

### 10.6 Formularios

Debe incluir:

- Labels claros.
- Inputs con estado de error.
- Selects para enums.
- Botones de guardar y cancelar.
- Estado de carga al enviar.
- Mensajes de éxito y error.

### 10.7 Confirmaciones

Para eliminación:

- Usar modal de confirmación si el tiempo lo permite.
- Si el tiempo es limitado, usar `window.confirm`.
- Mostrar mensaje claro si la eliminación no se puede realizar.

## 11. Plan De Implementación Por Fases

### Fase 1: Inicialización Del Proyecto

Objetivo:

- Crear el proyecto Next.js con TypeScript, TailwindCSS y Bun.

Resultado esperado:

- Proyecto base ejecutándose localmente.

### Fase 2: Configuración De Prisma Y PostgreSQL

Objetivo:

- Configurar Prisma.
- Conectar PostgreSQL en Railway.
- Definir modelo inicial.
- Ejecutar migraciones.

Resultado esperado:

- Base de datos funcional.
- Prisma Client generado.

### Fase 3: Autenticación Y Seguridad

Objetivo:

- Implementar registro, login, logout y sesión.
- Proteger rutas.
- Proteger endpoints.

Resultado esperado:

- Usuarios pueden autenticarse.
- Roles funcionan.
- Rutas privadas están protegidas.

### Fase 4: Layout Y Diseño Base

Objetivo:

- Crear estructura visual principal.
- Crear componentes reutilizables.

Resultado esperado:

- Base visual profesional y consistente.

### Fase 5: CRUD De Clientes

Objetivo:

- Implementar backend y frontend de clientes.

Resultado esperado:

- CRUD completo de clientes.

### Fase 6: CRUD De Proyectos

Objetivo:

- Implementar backend y frontend de proyectos.
- Asociar proyectos con clientes.

Resultado esperado:

- CRUD completo de proyectos.

### Fase 7: CRUD De Tareas

Objetivo:

- Implementar backend y frontend de tareas.
- Asociar tareas con proyectos y responsables.

Resultado esperado:

- CRUD completo de tareas.

### Fase 8: Gestión De Usuarios

Objetivo:

- Implementar vista administrativa de usuarios.

Resultado esperado:

- Administrador puede consultar y gestionar usuarios.

### Fase 9: Dashboard

Objetivo:

- Implementar endpoint de resumen.
- Crear indicadores visuales.

Resultado esperado:

- Dashboard con métricas reales.

### Fase 10: Validación, Pulido Y Pruebas

Objetivo:

- Validar flujos completos.
- Corregir errores.
- Mejorar experiencia de usuario.

Resultado esperado:

- Sistema estable y presentable.

### Fase 11: Despliegue En Railway

Objetivo:

- Configurar variables.
- Desplegar aplicación.
- Ejecutar migraciones.
- Obtener URL pública.

Resultado esperado:

- Sistema funcionando en producción.

### Fase 12: Documentación Final

Objetivo:

- Crear README técnico.
- Crear manual básico de usuario.
- Agregar credenciales de prueba.

Resultado esperado:

- Proyecto entregable y documentado.

## 12. Tareas Técnicas Detalladas Por Fase

### Fase 1: Inicialización

Tareas:

1. Crear proyecto con Next.js, TypeScript y TailwindCSS.
2. Confirmar que Bun instala dependencias correctamente.
3. Limpiar contenido inicial innecesario.
4. Crear estructura base de carpetas.
5. Configurar `.gitignore`.
6. Crear `.env.example`.
7. Ejecutar servidor local.

Criterio de aceptación:

- `bun dev` levanta la aplicación sin errores.
- La página inicial carga correctamente.

### Fase 2: Prisma Y PostgreSQL

Tareas:

1. Crear servicio PostgreSQL en Railway.
2. Copiar `DATABASE_URL`.
3. Configurar `.env` local.
4. Inicializar Prisma.
5. Diseñar modelos conceptuales.
6. Crear migración inicial.
7. Generar Prisma Client.
8. Crear `lib/prisma.ts`.
9. Crear seed opcional para usuario administrador.

Criterio de aceptación:

- Prisma conecta correctamente.
- Migraciones se ejecutan.
- Prisma Studio permite ver tablas.

### Fase 3: Autenticación

Tareas:

1. Instalar librerías de JWT, hash y validación.
2. Crear validaciones de registro y login.
3. Crear endpoint de registro.
4. Crear endpoint de login.
5. Crear endpoint de logout.
6. Crear endpoint `/api/auth/me`.
7. Crear helpers de autenticación.
8. Crear middleware.
9. Crear páginas `/login` y `/register`.
10. Crear manejo visual de errores.

Criterio de aceptación:

- Usuario puede registrarse.
- Usuario puede iniciar sesión.
- Cookie se guarda correctamente.
- Usuario no autenticado no entra a rutas privadas.
- Usuario normal no entra a `/usuarios`.

### Fase 4: Layout Y UI

Tareas:

1. Crear componentes base: botón, input, select, card, table, badge y alert.
2. Crear layout protegido.
3. Crear sidebar.
4. Crear header.
5. Crear navegación responsive.
6. Definir estilos globales.
7. Crear estados de carga y vacío reutilizables.

Criterio de aceptación:

- Las páginas privadas comparten navegación.
- El diseño se ve profesional en desktop y móvil.

### Fase 5: Clientes

Tareas backend:

1. Crear validación de cliente.
2. Crear `GET /api/clientes`.
3. Crear `POST /api/clientes`.
4. Crear `GET /api/clientes/[id]`.
5. Crear `PUT /api/clientes/[id]`.
6. Crear `DELETE /api/clientes/[id]`.
7. Validar relaciones antes de eliminar.

Tareas frontend:

1. Crear página de listado.
2. Crear formulario de creación.
3. Crear página de detalle.
4. Crear formulario de edición.
5. Agregar confirmación de eliminación.
6. Agregar mensajes de éxito y error.

Criterio de aceptación:

- CRUD completo funcional.
- Validaciones funcionan.
- Errores se muestran claramente.

### Fase 6: Proyectos

Tareas backend:

1. Crear validación de proyecto.
2. Crear endpoints REST.
3. Incluir cliente asociado en consultas.
4. Validar existencia de cliente.
5. Validar fechas.

Tareas frontend:

1. Crear listado de proyectos.
2. Crear formulario con selector de cliente.
3. Crear detalle con datos del cliente.
4. Crear edición.
5. Crear eliminación protegida.

Criterio de aceptación:

- Proyecto siempre queda asociado a cliente.
- No se puede crear proyecto con cliente inexistente.
- Fechas inválidas son rechazadas.

### Fase 7: Tareas

Tareas backend:

1. Crear validación de tarea.
2. Crear endpoints REST.
3. Incluir proyecto y responsable.
4. Validar existencia del proyecto.
5. Validar existencia del responsable.

Tareas frontend:

1. Crear listado de tareas.
2. Crear formulario con selector de proyecto.
3. Crear selector de responsable.
4. Crear detalle.
5. Crear edición.
6. Crear eliminación.

Criterio de aceptación:

- Tarea siempre queda asociada a proyecto y usuario.
- Estados y prioridades se muestran con badges.

### Fase 8: Usuarios

Tareas backend:

1. Crear endpoints protegidos por rol admin.
2. Listar usuarios sin contraseña.
3. Editar usuario.
4. Eliminar usuario con restricciones.

Tareas frontend:

1. Crear página `/usuarios`.
2. Mostrar tabla de usuarios.
3. Mostrar rol con badge.
4. Permitir acciones administrativas.
5. Bloquear visualmente acceso a usuarios normales.

Criterio de aceptación:

- Solo `ADMIN` accede a gestión de usuarios.
- Nunca se expone `passwordHash`.

### Fase 9: Dashboard

Tareas backend:

1. Crear endpoint `/api/dashboard/resumen`.
2. Contar clientes.
3. Contar proyectos.
4. Contar proyectos activos.
5. Contar proyectos finalizados.
6. Contar tareas pendientes.
7. Contar tareas completadas.
8. Contar usuarios.
9. Consultar últimos proyectos.
10. Consultar últimas tareas.

Tareas frontend:

1. Crear tarjetas estadísticas.
2. Crear secciones de últimos registros.
3. Usar badges de estado.
4. Mostrar loading.
5. Mostrar error si falla la carga.

Criterio de aceptación:

- Métricas son reales desde base de datos.
- Dashboard carga correctamente.

### Fase 10: Pulido

Tareas:

1. Revisar responsive.
2. Revisar errores visuales.
3. Revisar navegación.
4. Revisar roles.
5. Revisar validaciones.
6. Revisar consola del navegador.
7. Revisar build.
8. Corregir bugs.

Criterio de aceptación:

- `bun run build` funciona.
- Flujos principales funcionan de inicio a fin.

### Fase 11: Railway

Tareas:

1. Subir repositorio a GitHub.
2. Crear proyecto en Railway.
3. Conectar repositorio.
4. Crear servicio PostgreSQL.
5. Configurar variables de entorno.
6. Ejecutar migraciones de producción.
7. Verificar URL pública.
8. Probar login, dashboard y CRUDs en producción.

Criterio de aceptación:

- Sistema accesible desde URL pública.
- Base de datos en Railway funciona.
- Variables están configuradas correctamente.

### Fase 12: Documentación

Tareas:

1. Crear README técnico.
2. Crear manual de usuario.
3. Documentar comandos.
4. Documentar endpoints.
5. Documentar despliegue.
6. Agregar credenciales de prueba.
7. Agregar capturas o descripción de pantallas.

Criterio de aceptación:

- Otro estudiante puede instalar, ejecutar y entender el proyecto.

## 13. Comandos Principales Usando Bun

Crear proyecto:

```bash
bun create next-app techsolutions-app
```

Usar al iniciar el proyecto.

Entrar al proyecto:

```bash
cd techsolutions-app
```

Instalar dependencias:

```bash
bun install
```

Usar después de clonar el repositorio o modificar dependencias.

Ejecutar desarrollo:

```bash
bun dev
```

Usar durante desarrollo local.

Instalar Prisma:

```bash
bun add prisma @prisma/client
```

Inicializar Prisma:

```bash
bunx prisma init
```

Usar después de instalar Prisma.

Crear migración local:

```bash
bunx prisma migrate dev --name init
```

Usar después de definir modelos en Prisma.

Generar Prisma Client:

```bash
bunx prisma generate
```

Usar después de cambios en el schema.

Abrir Prisma Studio:

```bash
bunx prisma studio
```

Usar para revisar datos localmente.

Instalar librerías sugeridas:

```bash
bun add zod jsonwebtoken bcryptjs
```

Instalar tipos si hace falta:

```bash
bun add -d @types/jsonwebtoken @types/bcryptjs
```

Crear build:

```bash
bun run build
```

Usar antes del despliegue o entrega final.

Ejecutar producción local:

```bash
bun start
```

Usar después de compilar.

Ejecutar migraciones en producción:

```bash
bunx prisma migrate deploy
```

Usar en Railway o antes de levantar producción.

Ejecutar seed si se implementa:

```bash
bunx prisma db seed
```

Usar para crear datos iniciales, como administrador de prueba.

## 14. Estrategia De Validaciones Y Manejo De Errores

### 14.1 Validaciones Frontend

Validar antes de enviar:

- Campos obligatorios.
- Formato de correo.
- Longitud mínima de contraseña.
- Fechas coherentes.
- Selects obligatorios.
- Campos telefónicos si aplica.

Mostrar:

- Mensaje debajo del campo.
- Mensaje general si falla el servidor.
- Estado de carga al enviar.
- Botón deshabilitado mientras se envía.

### 14.2 Validaciones Backend

Validar siempre en API, aunque ya exista validación frontend.

Usar Zod para:

- Registro.
- Login.
- Cliente.
- Proyecto.
- Tarea.
- Usuario.

Códigos HTTP recomendados:

- `400 Bad Request` para datos inválidos.
- `401 Unauthorized` para usuario no autenticado.
- `403 Forbidden` para usuario sin permisos.
- `404 Not Found` para recurso inexistente.
- `409 Conflict` para conflicto, por ejemplo correo duplicado.
- `500 Internal Server Error` para error inesperado.

### 14.3 Manejo Profesional De Errores

No exponer al usuario:

- Stack traces.
- `DATABASE_URL`.
- Detalles internos de Prisma.
- Secretos JWT.
- Hashes de contraseña.

Registrar errores internamente durante desarrollo con `console.error`, pero devolver mensajes amigables al usuario.

## 15. Estrategia De Despliegue En Railway

### 15.1 Preparación

Pasos:

1. Crear cuenta en Railway.
2. Crear proyecto Railway.
3. Crear servicio PostgreSQL.
4. Copiar conexión `DATABASE_URL`.
5. Subir proyecto a GitHub.
6. Conectar repositorio en Railway.

### 15.2 Variables De Entorno

Configurar en Railway:

```txt
DATABASE_URL=postgresql://...
JWT_SECRET=valor_largo_y_seguro
NODE_ENV=production
```

Opcional:

```txt
NEXT_PUBLIC_APP_URL=https://url-publica.railway.app
```

Reglas:

- Nunca subir `.env` a GitHub.
- Sí subir `.env.example`.
- No documentar credenciales reales.

### 15.3 Build Y Start

Railway debe poder ejecutar:

```bash
bun install
bun run build
```

Start command recomendado:

```bash
bun start
```

Si Railway requiere configuración adicional, revisar logs y ajustar scripts en `package.json`.

### 15.4 Migraciones En Producción

Usar:

```bash
bunx prisma migrate deploy
```

Opciones:

- Ejecutarlo desde Railway Shell.
- Agregarlo a un comando controlado si el equipo entiende el flujo.
- Ejecutarlo manualmente para evitar fallos automáticos durante despliegue.

### 15.5 Verificación En Producción

Probar:

- Acceso a URL pública.
- Registro.
- Login.
- Dashboard.
- CRUD clientes.
- CRUD proyectos.
- CRUD tareas.
- Gestión usuarios con admin.
- Logout.

## 16. Estrategia De Pruebas Manuales

### 16.1 Autenticación

Casos:

- Registro con datos válidos.
- Registro con correo duplicado.
- Login correcto.
- Login con contraseña incorrecta.
- Acceso a dashboard sin sesión.
- Logout.
- Acceso a `/usuarios` como usuario normal.

### 16.2 Clientes

Casos:

- Crear cliente válido.
- Crear cliente con correo inválido.
- Listar clientes.
- Ver detalle.
- Editar cliente.
- Eliminar cliente sin proyectos.
- Intentar eliminar cliente con proyectos.

### 16.3 Proyectos

Casos:

- Crear proyecto con cliente válido.
- Crear proyecto sin cliente.
- Crear proyecto con fecha fin anterior a fecha inicio.
- Editar estado.
- Ver detalle.
- Intentar eliminar proyecto con tareas.

### 16.4 Tareas

Casos:

- Crear tarea con proyecto y responsable.
- Cambiar prioridad.
- Cambiar estado.
- Ver tarea.
- Editar tarea.
- Eliminar tarea.

### 16.5 Dashboard

Casos:

- Verificar que los conteos coincidan con datos reales.
- Crear tarea pendiente y comprobar contador.
- Marcar tarea completada y comprobar contador.
- Crear proyecto finalizado y comprobar contador.

### 16.6 Responsive

Probar en:

- Desktop.
- Tablet.
- Móvil.

Revisar:

- Sidebar.
- Tablas.
- Formularios.
- Botones.
- Dashboard.

## 17. Documentación Final Requerida

### 17.1 README.md Técnico

Debe incluir:

- Nombre del proyecto.
- Descripción general.
- Objetivo del sistema.
- Tecnologías usadas.
- Requisitos previos.
- Instalación local.
- Variables de entorno.
- Configuración de Prisma.
- Migraciones.
- Ejecución local.
- Comandos con Bun.
- Despliegue en Railway.
- Credenciales de prueba.
- Estructura de carpetas.
- Endpoints principales.
- Descripción de pantallas.
- Autor del proyecto.

Estructura sugerida:

```txt
# TechSolutions S.A. - Sistema Empresarial Full-Stack

## Descripción
## Tecnologías
## Requisitos Previos
## Instalación
## Variables De Entorno
## Base De Datos Y Prisma
## Comandos Disponibles
## Ejecución Local
## Despliegue En Railway
## Credenciales De Prueba
## Estructura Del Proyecto
## Endpoints Principales
## Pantallas Del Sistema
## Autor
```

### 17.2 Manual Básico De Usuario

Debe explicar:

- Cómo ingresar al sistema.
- Cómo registrarse.
- Cómo iniciar sesión.
- Cómo usar el dashboard.
- Cómo gestionar clientes.
- Cómo gestionar proyectos.
- Cómo gestionar tareas.
- Qué puede hacer el administrador.
- Qué puede hacer el usuario normal.
- Cómo interpretar mensajes comunes.
- Cómo cerrar sesión.

Formato recomendado:

```txt
Manual Básico De Usuario

1. Ingreso Al Sistema
2. Registro
3. Inicio De Sesión
4. Panel Principal
5. Gestión De Clientes
6. Gestión De Proyectos
7. Gestión De Tareas
8. Gestión De Usuarios
9. Perfil
10. Cierre De Sesión
11. Mensajes Comunes
```

## 18. Checklist Final De Cumplimiento

### 18.1 Arquitectura

- Proyecto usa Next.js App Router.
- Frontend y backend están en un solo repositorio.
- Backend usa `app/api`.
- No se usa Express ni backend separado.
- TypeScript activo.
- TailwindCSS configurado.

### 18.2 Funcionalidad

- Registro funcional.
- Login funcional.
- Logout funcional.
- Roles `ADMIN` y `USER`.
- Rutas privadas protegidas.
- Gestión completa de clientes.
- Gestión completa de proyectos.
- Gestión completa de tareas.
- Gestión de usuarios para administrador.
- Dashboard con datos reales.

### 18.3 Base De Datos

- PostgreSQL en Railway.
- Prisma configurado.
- Migraciones ejecutadas.
- Relaciones correctas.
- Enums definidos.
- `.env.example` incluido.
- `.env` ignorado por Git.

### 18.4 Seguridad

- Contraseñas hasheadas.
- JWT configurado.
- Cookie HTTP-only.
- Endpoints protegidos.
- Rutas protegidas.
- No se expone `passwordHash`.
- `JWT_SECRET` no está en GitHub.

### 18.5 UX/UI

- Login moderno.
- Sidebar o navegación clara.
- Dashboard profesional.
- Tablas limpias.
- Formularios ordenados.
- Mensajes de error y éxito.
- Responsive en móvil.
- Estados de carga.

### 18.6 Despliegue

- Repositorio en GitHub.
- Railway conectado.
- Variables configuradas.
- Migraciones en producción ejecutadas.
- URL pública funcional.

### 18.7 Documentación

- README completo.
- Manual básico de usuario.
- Endpoints documentados.
- Comandos con Bun documentados.
- Credenciales de prueba incluidas.
- Capturas o descripción de pantallas.

## 19. Riesgos Técnicos Y Cómo Evitarlos

### 19.1 Riesgo: Separar Frontend Y Backend

Cómo evitarlo:

- Mantener todo dentro de Next.js.
- Usar `app/api` para backend.
- No crear servidor Express.

### 19.2 Riesgo: Fallos De Autenticación En Producción

Cómo evitarlo:

- Configurar correctamente `JWT_SECRET`.
- Usar cookies HTTP-only.
- Usar `secure: true` solo en producción.
- Probar login después del despliegue.

### 19.3 Riesgo: Subir Secretos A GitHub

Cómo evitarlo:

- Incluir `.env` en `.gitignore`.
- Crear `.env.example`.
- No copiar credenciales reales en README.

### 19.4 Riesgo: Errores De Prisma En Railway

Cómo evitarlo:

- Verificar `DATABASE_URL`.
- Ejecutar `bunx prisma migrate deploy`.
- Ejecutar `bunx prisma generate`.
- Revisar logs de Railway.

### 19.5 Riesgo: Relaciones Mal Modeladas

Cómo evitarlo:

- Definir claramente que cliente tiene muchos proyectos.
- Definir claramente que proyecto pertenece a cliente.
- Definir claramente que proyecto tiene muchas tareas.
- Definir claramente que tarea pertenece a proyecto.
- Definir claramente que tarea pertenece a usuario responsable.

### 19.6 Riesgo: Eliminar Datos Relacionados Accidentalmente

Cómo evitarlo:

- Bloquear eliminación de clientes con proyectos.
- Bloquear eliminación de proyectos con tareas.
- Mostrar mensajes claros al usuario.

### 19.7 Riesgo: Dashboard Lento

Cómo evitarlo:

- Usar consultas agregadas de Prisma.
- No cargar datos innecesarios.
- Limitar últimos proyectos y tareas a 5 registros.

### 19.8 Riesgo: UI Básica O Poco Profesional

Cómo evitarlo:

- Crear componentes reutilizables.
- Usar tarjetas, badges, tablas y espaciado consistente.
- Probar en desktop y móvil.
- Evitar páginas sin estructura visual.

### 19.9 Riesgo: Falta De Datos Para Demostración

Cómo evitarlo:

- Crear seed con un administrador.
- Crear seed con un usuario normal.
- Crear seed con clientes de ejemplo.
- Crear seed con proyectos de ejemplo.
- Crear seed con tareas de ejemplo.

## 20. Recomendaciones Para El Agente Que Programará Después

1. Implementar primero la base técnica: Next.js, TailwindCSS, Prisma, PostgreSQL y estructura de carpetas.
2. No avanzar al CRUD antes de tener autenticación funcional.
3. Crear helpers reutilizables para Prisma, JWT, respuestas JSON, validación de sesión y validación de rol.
4. Mantener los Route Handlers simples y claros.
5. Validar todos los datos en backend con Zod.
6. Nunca devolver `passwordHash` en respuestas.
7. Usar nombres consistentes en rutas, modelos y componentes.
8. Implementar primero un CRUD completo y usarlo como patrón para los demás.
9. Priorizar funcionalidad estable sobre características extra.
10. No agregar microservicios, colas, websockets ni arquitectura innecesariamente compleja.
11. Usar commits pequeños y claros.
12. Antes de desplegar, ejecutar `bun install`, `bunx prisma generate` y `bun run build`.
13. Después del despliegue, probar todos los flujos desde la URL pública.
14. Documentar credenciales de prueba en README, pero nunca credenciales reales de base de datos.
15. Mantener el proyecto realista, funcional y bien presentado.

Commits sugeridos:

```txt
chore: initialize next app
feat: add prisma models
feat: implement authentication
feat: add clients crud
feat: add projects crud
feat: add tasks crud
feat: add dashboard summary
docs: add project documentation
```

Prioridad final:

- Primero funcionalidad completa.
- Segundo seguridad básica correcta.
- Tercero diseño profesional.
- Cuarto documentación clara.
- Quinto despliegue público estable.
