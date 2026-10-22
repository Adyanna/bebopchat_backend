# Bebop Backend

Backend de **Bebop Communication Network**, una aplicación de mensajería que permite gestionar contactos, mantener conversaciones individuales y grupales, compartir archivos multimedia y realizar llamadas en tiempo real.

## Tecnologías

- Node.js y Express
- TypeScript
- PostgreSQL
- Prisma ORM
- Arquitectura hexagonal
- Socket.IO
- JWT para autenticación
- Zod para validación de datos
- Multer para la recepción de archivos multimedia
- WebRTC para llamadas de audio y vídeo
- Docker, Docker Compose.


## Arquitectura

El backend utiliza **arquitectura hexagonal** para separar la lógica de negocio de los detalles técnicos.

- **Dominio:** entidades, contratos de repositorio y casos de uso.
- **Infrastructura:** implementaciones de repositorios y acceso a PostgreSQL mediante Prisma.
- **UI:** controladores y rutas de la API.
- **App:** configuración e integración de los componentes de la aplicación.

### Flujo de una petición

1. El controlador recibe la petición y valida los datos de entrada.
2. El caso de uso ejecuta las reglas de negocio.
3. El repositorio realiza las operaciones necesarias mediante su implementación en infraestructura.
4. El controlador devuelve la respuesta al cliente.

Esta separación facilita el mantenimiento, las pruebas y la evolución de las funcionalidades.

## Funcionalidades

- **Sign up**: Creacion de una cuenta.
- **Sign in**: Autentica al usuario usando sus credenciales.
- **Creacion de perfil**: Permite la creacion de un perfil para un usuario con cuenta.
- **Contactos:** búsqueda de usuarios por teléfono, alta, consulta y eliminación.
- **Chats:** creación de conversaciones individuales y grupales, consulta de información y listado de chats.
- **Mensajes:** creación, consulta paginada, edición y eliminación.
- **Multimedia:** envío de imágenes, vídeos y notas de voz.
- **Administración de grupos:** edición de información y eliminación de participantes.
- **Tiempo real:** comunicación mediante Socket.IO y señalización para llamadas WebRTC.
- **Actividad:** seguimiento del último mensaje y la última actividad de las conversaciones.

## API REST

Los endpoints protegidos requieren autenticación. El backend obtiene la identidad del usuario autenticado mediante el middleware de autenticación; el cliente no debe enviar un identificador de usuario para hacerse pasar por otro.

### 1. Autenticacion e inicio de sesion:

POST /auth/signup

POST /auth/signin

Al iniciar sesion la API autentica al usuario usando sus credenciales. Si las credenciales son válidas, la API devuelve un token de autenticacion que debe ser incluido en las peticiones de los endpoints protegidos. 

### 1. Contactos y usuarios

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/users?phone=:phone` | Buscar un usuario por teléfono. |
| GET | `/users/me/contacts` | Obtener los contactos del usuario autenticado. |
| POST | `/users/me/contacts` | Añadir un contacto. |
| DELETE | `/users/me/contacts/:userContactId` | Eliminar la relación de contacto. |


### 2. Chats

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/users/me/chats` | Obtener los chats del usuario autenticado. |
| GET | `/chats/:id` | Obtener la información de un chat específico. |
| POST | `/chats` | Crear un chat individual o grupal. |
| PATCH | `/chats/:id` | Actualizar la información de un grupo. |


### 3. Mensajes

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/chats/:id/messages` | Obtener los mensajes de un chat. |
| POST | `/chats/:id/messages` | Crear un mensaje. |
| PATCH | `/chats/:id/messages/:messageId` | Editar un mensaje. |
| DELETE | `/chats/:id/messages/:messageId` | Eliminar un mensaje. |


### 4. Administración de grupos

#### Unicamente los administradores pueden administrar un grupo.

| Método | Endpoint | Descripción |
|---|---|---|
| PATCH | `/chats/:id` | Editar el nombre y la descripción del grupo. |
| POST | `/chats/:id/participants` | Añadir participantes al grupo |
| DELETE | `/chats/:id/participants/:userId` | Eliminar un integrante del grupo. |


## Base de datos

El esquema se define en `prisma/schema.prisma`. Prisma gestiona el acceso a PostgreSQL y las migraciones.

Consultar el estado de las migraciones:

```bash
npx prisma migrate status
```

Generar el cliente de Prisma:

```bash
npx prisma generate
```

## Instalación y ejecución

### Requisitos

- Node.js compatible con `package.json`.
- npm.
- PostgreSQL.
- Variables de entorno configuradas.

### Instalación

```bash
git clone <URL_DEL_REPOSITORIO>
cd bebopchat_backend
npm install
```

Aplica las migraciones pendientes en el entorno correspondiente:

```bash
npx prisma migrate deploy
npx prisma generate
```

Inicia el servidor utilizando el script de desarrollo definido en `package.json`.

```bash
npm run dev
```

## Variables de entorno


```env
DATABASE_URL=
PORT=
NODE_ENV=
JWT_SECRET=
```

## Desarrollo y validaciones

Para añadir una funcionalidad:

1. Define las reglas de negocio en un caso de uso.
2. Declara o reutiliza el contrato del repositorio.
3. Implementa la persistencia en infraestructura.
4. Expón la funcionalidad mediante rutas y controladores.
5. Valida los datos de entrada y los permisos.
6. Prueba los escenarios de éxito y error.

## Estado del proyecto

Bebop es una aplicación de mensajería que utiliza arquitectura hexagonal en el backend, PostgreSQL como base de datos relacional y tecnologías de comunicación en tiempo real para la mensajería y las llamadas.