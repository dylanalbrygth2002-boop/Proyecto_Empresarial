# Guia Paso a Paso: Desplegar en Vercel (Para Principiantes)

> Esta guia asume que nunca has usado Vercel. La haremos juntos paso a paso.

---

## PASO 0: Subir tu codigo a GitHub (IMPORTANTE)

Vercel lee tu codigo desde GitHub. Si no has subido los ultimos cambios, Vercel no vera los scripts ni la configuracion nueva.

### Opcion A: Dejame hacerlo por ti
Di "sí" y hare el commit y push automaticamente.

### Opcion B: Hacerlo manual
Abre tu terminal en la raiz del proyecto y ejecuta:

```bash
git add .
git commit -m "Preparado para Vercel: scripts, Capacitor, migraciones auto"
git push origin main
```

> Si usas otra rama (como `master`), cambia `main` por tu rama.

---

## PASO 1: Crear cuenta en Vercel

1. Abre tu navegador y ve a: **https://vercel.com**
2. Haz clic en el boton **"Sign Up"** (o "Get Started")
3. Selecciona **"Continue with GitHub"** (lo mas facil)
4. Autoriza a Vercel para acceder a tus repositorios de GitHub
5. Completa tu perfil (nombre, etc.)

> Tu cuenta de Vercel quedara vinculada a GitHub. Es gratis para proyectos personales.

---

## PASO 2: Importar tu proyecto

1. En el dashboard de Vercel, haz clic en **"Add New Project"**
   (o el boton grande que dice "Import Git Repository")

2. Veras una lista de tus repositorios de GitHub.
   Busca: **Proyecto_Empresarial**

3. Haz clic en el boton **"Import"** al lado de tu repositorio.

> Si no aparece, haz clic en "Configure GitHub App" y dale acceso a todos tus repos.

---

## PASO 3: Configurar el proyecto

Veras una pagina llamada **"Configure Project"**. Aqui configuramos todo:

### 3.1 Framework Preset (debe estar asi automaticamente)
- **Framework Preset:** Next.js
- Si no aparece, buscalo en el dropdown y seleccionalo.

### 3.2 Root Directory
- Deja en **"./"** (raiz del proyecto)
- No cambies esto.

### 3.3 Build and Output Settings (IMPORTANTE)
Vercel deberia detectar todo automaticamente gracias al archivo `vercel.json`, pero verifica:

- **Build Command:** `bunx prisma migrate deploy && bun run build`
- **Output Directory:** Dejalo en blanco (Next.js lo maneja solo)
- **Install Command:** `bun install`

> Si algun campo esta vacio o diferente, corrige manualmente.

### 3.4 Environment Variables (MUY IMPORTANTE)

Haz clic en **"Environment Variables"** para expandir esa seccion.

Debes agregar **3 variables** una por una:

#### Variable 1: DATABASE_URL
- **Name:** `DATABASE_URL`
- **Value:** `postgresql://postgres:Dai12345@127.0.0.1:5432/sistema_empresarial?schema=public`
  > NOTA: Esta es tu URL local. Para produccion, usa la URL de Railway (la cambiaremos despues).

#### Variable 2: JWT_SECRET
- **Name:** `JWT_SECRET`
- **Value:** `dev-secret-key-cambia-esto-en-produccion`
  > Puedes cambiarlo por algo mas seguro si quieres.

#### Variable 3: NODE_ENV
- **Name:** `NODE_ENV`
- **Value:** `production`

Despues de agregar cada una, haz clic en **"Add"**.

> Veras que dice "Production", "Preview" y "Development". Deja las 3 marcadas.

---

## PASO 4: Desplegar (Deploy)

1. Haz clic en el boton grande **"Deploy"**
2. Vercel empezara a:
   - Instalar dependencias (`bun install`)
   - Aplicar migraciones (`prisma migrate deploy`)
   - Compilar Next.js (`next build`)

3. Espera 1-2 minutos. Veras una barra de progreso.

---

## PASO 5: Ver el resultado

Cuando termine, veras una pantalla de celebracion con:

```
Congratulations!
Your project has been deployed.
```

Haz clic en el boton **"Continue to Dashboard"**.

Arriba veras una URL como:
```
https://proyecto-empresarial-XXXX.vercel.app
```

Haz clic en esa URL. Deberias ver tu aplicacion funcionando.

> Probablemente fallara si usaste la URL local de PostgreSQL. Es normal. Lo arreglamos en el Paso 6.

---

## PASO 6: Conectar Railway (Base de datos en la nube)

Tu app necesita una base de datos que este siempre online. Tu PostgreSQL local solo funciona en tu computadora.

### 6.1 Crear base de datos en Railway

1. Ve a **https://railway.app**
2. Crea una cuenta (puedes usar "Login with GitHub")
3. En el dashboard, haz clic en **"New Project"**
4. Selecciona **"Provision PostgreSQL"**
5. Espera unos segundos a que se cree

### 6.2 Obtener la URL de conexion

1. Dentro del proyecto de Railway, haz clic en el servicio **PostgreSQL**
2. Ve a la pestana **"Connect"**
3. Copia la URL que dice **"PostgreSQL Connection URL"**
   Se ve algo asi:
   ```
   postgresql://postgres:abcd1234@containers.railway.app:5432/railway
   ```

### 6.3 Actualizar Vercel con la URL de Railway

1. Vuelve a Vercel (https://vercel.com)
2. Selecciona tu proyecto
3. Ve a la pestana **"Settings"** (arriba)
4. En el menu izquierdo, haz clic en **"Environment Variables"**
5. Busca `DATABASE_URL` y haz clic en el lapiz (editar)
6. Borra el valor viejo (el local) y pega la URL de Railway
7. Guarda con **"Save"**

### 6.4 Redeploy (Volver a desplegar)

1. Ve a la pestana **"Deployments"** (arriba)
2. Haz clic en los **3 puntos** (...) del deploy mas reciente
3. Selecciona **"Redeploy"**
4. Espera 1-2 minutos

---

## PASO 7: Verificar que todo funciona

1. Abre la URL de Vercel
2. Prueba iniciar sesion con:
   - **Email:** admin@techsolutions.com
   - **Password:** admin123

Si puedes ver el Dashboard, **todo funciona perfectamente**.

---

## PASO 8: Configurar la app movil (Capacitor)

Ahora que tienes una URL real en Vercel, actualizamos la app movil.

### 8.1 Obtener tu URL de Vercel

Tu URL esta en el dashboard de Vercel, algo asi:
```
https://proyecto-empresarial-abc123.vercel.app
```

### 8.2 Actualizar capacitor.config.ts

1. Abre el archivo `capacitor.config.ts` en tu proyecto
2. Cambia esta linea:
   ```ts
   url: process.env.NEXT_PUBLIC_APP_URL || undefined,
   ```
   Por tu URL real:
   ```ts
   url: 'https://proyecto-empresarial-abc123.vercel.app',
   ```

3. Guarda el archivo

### 8.3 Sincronizar Capacitor

En tu terminal:
```bash
bun run cap:sync
```

### 8.4 Compilar el APK

```bash
bun run build:apk
```

O abre Android Studio:
```bash
bun run cap:open:android
```

---

## Solucion de problemas comunes

### "Build Failed" en Vercel

1. Ve a la pestana **"Deployments"** en Vercel
2. Haz clic en el deploy que fallo
3. Lee el mensaje de error (scroll hacia abajo)
4. Errores comunes:
   - **"DATABASE_URL not found"** → No agregaste la variable de entorno
   - **"Prisma Client not found"** → Ejecuta `bunx prisma generate` local y sube el cambio
   - **"Cannot connect to database"** → La URL de Railway es incorrecta

### "No puedo iniciar sesion"

1. Verifica que el seed se ejecuto en Railway:
   ```bash
   DATABASE_URL="tu-url-de-railway" bunx prisma db seed
   ```

2. Verifica que las variables de entorno estan correctas en Vercel

### "La pagina muestra error 404"

1. Espera 30 segundos y recarga
2. Si persiste, ve a Settings > General en Vercel
3. Asegurate que **Framework Preset** sea Next.js

---

## Comandos rapidos (Resumen)

```bash
# Subir cambios a GitHub
git add .
git commit -m "Mensaje"
git push origin main

# Ver logs de Vercel (si hay error)
# Ve a Vercel Dashboard > Deployments > Click en el deploy > Logs

# Ejecutar seed en Railway
cd D:\Universidad 2026\Practica\Proyecto_Empresarial
set DATABASE_URL=postgresql://...
bunx prisma db seed
```

---

## Proximos pasos

Una vez que todo funcione:

1. **Cada vez que hagas cambios**:
   ```bash
   git add .
   git commit -m "Descripcion del cambio"
   git push origin main
   ```
   Vercel se actualizara automaticamente.

2. **La app movil** se actualiza sola (porque carga desde la URL).
   Solo recompila el APK si agregas plugins nuevos.

---

**Fecha de guia:** 08/05/2026
**Proyecto:** TechSolutions S.A.
