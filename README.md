# TaskPocket Web

Aplicacion web desktop de gestion de tareas con estetica Gothic-Pixel (Retro Desktop / Pixel Bento). Consume el mismo backend que la version movil (Expo/React Native).

---

## Instalacion

### Desde ZIP

1. Descomprime el archivo
2. Abre una terminal en la carpeta del proyecto
3. Crea el archivo `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
4. Edita `.env.local` con tus credenciales reales
5. Instala dependencias y ejecuta:
   ```bash
   npm install
   npm run dev
   ```

### Desde Git

```bash
git clone https://github.com/Kei300/TaskPocket-web.git
cd TaskPocket-web
cp .env.example .env.local
# editar .env.local con credenciales reales
npm install
npm run dev
```

---

## Variables de Entorno

Edita `.env.local` con estos valores:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu-proyecto
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu-proyecto.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
NEXT_PUBLIC_API_URL=https://tu-backend.com
```

---

## Usuarios de Prueba

| Email             | Contrasena   |
| ----------------- | ------------ |
| ana333@gmail.com  | Contr@53n4.  |

---

## Comandos

| Comando           | Descripcion                     |
| ----------------- | ------------------------------- |
| `npm run dev`     | Inicia servidor de desarrollo   |
| `npm run build`   | Compila para produccion         |
| `npm start`       | Inicia el servidor de produccion|
| `npm run lint`    | Ejecuta ESLint                  |

---

## Stack

| Capa         | Tecnologia                          |
| ------------ | ----------------------------------- |
| Framework    | Next.js 16 (App Router)             |
| UI / Estilos | Tailwind CSS v4                     |
| Lenguaje     | TypeScript 5                        |
| Auth         | Firebase Authentication             |
| HTTP         | Axios (instance + interceptors)     |
| Estado       | React Query (TanStack Query)        |
| Fuentes      | Pixelify Sans · VT323               |

---

## Estructura

```
src/
├── app/
│   ├── page.tsx            # Login (ruta /)
│   ├── register/
│   ├── home/               # Inicio — bento grid, tareas del dia, listas
│   ├── list/[id]/          # Detalle de lista — tareas + comentarios
│   ├── tasks/              # CRUD de tareas, listas y categorias
│   ├── search/             # Busqueda global
│   ├── profile/            # Perfil, stats, rangos, cerrar sesion
│   ├── pomodoro/           # Temporizador Pomodoro
│   ├── layout.tsx
│   └── globals.css
├── src/
│   ├── components/common/atoms/     # BentoCard, PixelInput, RetroButton, SectionHeader
│   ├── components/common/molecules/ # AppHeader, TaskRow, CreateTaskModal, EditTaskModal
│   ├── components/common/organisms/ # RetroModal
│   ├── services/                    # api.ts (axios), auth-storage.ts, services por entidad
│   ├── hooks/                       # use-auth.ts
│   ├── utils/                       # todo.ts (funciones helper)
│   └── types/                       # Todo, List, Category, User, etc.
```

---

## Rutas

| Ruta           | Pantalla       | Protegida |
| -------------- | -------------- | --------- |
| `/`            | Login          | Guest     |
| `/register`    | Registro       | Guest     |
| `/home`        | Inicio         | Auth      |
| `/tasks`       | Tareas         | Auth      |
| `/list/[id]`   | Detalle lista  | Auth      |
| `/search`      | Busqueda       | Auth      |
| `/profile`     | Perfil         | Auth      |
| `/pomodoro`    | Pomodoro       | Auth      |

---

## Funcionamiento

- **Auth**: Firebase Email/Password. El token JWT se guarda en localStorage (`@taskpocket/token`) y se adjunta via interceptor de Axios. Si el backend responde 401, se limpia la sesion y redirige a login.
- **Estado**: React Query para datos del servidor (todos, lists, categories). Mutaciones con invalidacion automatica de queries.
- **Componentes**: Jerarquia atoms/molecules/organisms. Modales reutilizables (RetroModal) para errores, confirmaciones y formularios.
- **Busqueda**: Filtrado local sobre datos cacheados por React Query. Muestra coincidencias en listas y tareas.

---

## Deploy

- Frontend: [https://task-pocket-web.vercel.app](https://task-pocket-web.vercel.app)
- Backend: Cloud Run / Render / Railway. Debe estar accesible publicamente.

---

## Paleta de Colores

| Token          | Hex       | Uso                           |
| -------------- | --------- | ----------------------------- |
| iceWhite       | `#F8FAFF` | Fondo general                 |
| pureWhite      | `#FFFFFF` | Tarjetas                      |
| charcoal       | `#111827` | Texto principal               |
| electricBlue   | `#3D5CFF` | Botones primarios             |
| coralPink      | `#FF708A` | Alertas / eliminar            |
| mintGreen      | `#94FFD8` | Completado / exito            |
| slateGray      | `#6B7280` | Texto secundario              |
| lightBorder    | `#E5E7EB` | Bordes                        |
