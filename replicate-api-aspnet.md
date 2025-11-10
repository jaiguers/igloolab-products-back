# Replicar la API RESTful con ASP.NET y C#

Este resumen muestra cómo implementar la misma lógica (usuarios, autenticación JWT y productos) en un proyecto ASP.NET Core minimal.

## 1. Crear el proyecto
```bash
dotnet new webapi -n ProductsApi
cd ProductsApi
```

## 2. Dependencias sugeridas
- `Microsoft.EntityFrameworkCore` + `Npgsql.EntityFrameworkCore.PostgreSQL` (acceso a Postgres).
- `Microsoft.AspNetCore.Authentication.JwtBearer` (autenticación JWT).
- `BCrypt.Net-Next` (hash de contraseñas).

Instala con:
```bash
dotnet add package Microsoft.EntityFrameworkCore
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
dotnet add package BCrypt.Net-Next
```

## 3. Modelos y DbContext
Define entidades `User` y `Product` (propiedades equivalentes a la base actual) y un `AppDbContext` que configure tablas `users` y `products`.

## 4. Servicios
- `UserService`: crea usuarios, valida duplicados y usa `BCrypt.Net.BCrypt.HashPassword`.
- `AuthService`: valida credenciales, genera JWT con `JwtSecurityTokenHandler`.
- `ProductsService`: CRUD sencillo para `products`.

## 5. Autenticación y JWT
Registra `JwtBearer` en `Program.cs`:
```csharp
builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer(options => {
        options.TokenValidationParameters = new TokenValidationParameters {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Secret"])
            )
        };
    });
```

Define sección `Jwt` en `appsettings.json` (`Secret`, `ExpiresInMinutes`).

## 6. Controladores / Endpoints
- `UsersController`: `POST /api/users` crea usuario.
- `AuthController`: `POST /api/auth/login` devuelve token.
- `ProductsController`: `GET/POST/DELETE /api/products` protegido con `[Authorize]`.

Configura `app.MapControllers();` y `app.UseAuthentication(); app.UseAuthorization();`.

## 7. Migraciones
Usa EF Core para gestionar el esquema:
```bash
dotnet ef migrations add InitialCreate
dotnet ef database update
```

## 8. Variables de entorno
Configura `appsettings.Development.json` con cadena de conexión Postgres y secretos JWT.

Con esto tendrás una API ASP.NET Core con estructura idéntica a la versión NestJS/Supabase, reutilizando conceptos de hashing, JWT y endpoints RESTful.

