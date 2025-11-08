# igloolab-products-back

Backend creado con NestJS y TypeScript para gestionar usuarios y productos conectados a Supabase (PostgreSQL).

## Requisitos
- Node.js >= 18
- Cuenta y proyecto en [Supabase](https://supabase.com)

## Configuración
1. Instala dependencias:
   ```bash
   npm install
   ```
2. Crea un archivo `.env` en la raíz con las variables:
   ```
   PORT=3000
   SUPABASE_URL=https://YOUR_SUPABASE_PROJECT.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   JWT_SECRET=super-secret-jwt-key
   JWT_EXPIRES_IN=1h
   ```
3. Define las tablas en Supabase/Postgres:
   - `users`: columnas recomendadas `id bigserial primary key`, `email varchar unique not null`, `password varchar not null` (guardar hash), `name varchar`, `lastname varchar`, `created_at timestamptz default now()`.
   - `products`: columnas recomendadas `id serial primary key`, `name varchar(255) not null`, `description text not null`, `price decimal(10,2) not null`.

## Ejecución
- Desarrollo con recarga:
  ```bash
  npm run start:dev
  ```
- Producción:
  ```bash
  npm run build
  npm run start
  ```

## Endpoints Principales
- `POST /auth/login`: Autenticación JWT.
- `POST /users`: Creación de usuarios con contraseña encriptada.
- `GET /products`: Lista de productos (requiere JWT).
- `POST /products`: Crea producto asociado al usuario autenticado.
- `DELETE /products/:id`: Elimina producto por ID.
