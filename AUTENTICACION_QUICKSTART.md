# 🔐 Quick Start - Autenticación JWT

## Step 1: Configura las Variables de Entorno

Copia el archivo `.env.template` a `.env.development.local`:

```bash
cp .env.template .env.development.local
```

Actualiza los valores:

```env
# Base de datos
DB_PASSWORD=tu_password
DB_USER=postgres
DB_NAME=dismov
DB_HOST=localhost
DB_PORT=5432

# JWT
JWT_SECRET=tu-secret-key-muy-largo-minimo-32-caracteres-aleatorios
JWT_EXPIRATION=15m
JWT_REFRESH_SECRET=otro-secret-key-muy-largo-minimo-32-caracteres-aleatorios
JWT_REFRESH_EXPIRATION=7d
```

**Generador de secretos seguros:**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Step 2: Inicia la Aplicación

```bash
npm run start:dev
```

---

## Step 3: Prueba los Endpoints

### 📝 **Registrar usuario (Público)**

```bash
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "Nombre": "Juan",
    "Apellido": "Pérez",
    "NombreUsuario": "jperez",
    "Email": "juan@example.com",
    "Password": "SecurePass123",
    "Telefono": "+1234567890"
  }'
```

**Respuesta:**

```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": {
    "id": 1,
    "email": "juan@example.com",
    "nombreUsuario": "jperez",
    "nombre": "Juan",
    "apellido": "Pérez",
    "roles": ["user"]
  }
}
```

---

### 🔑 **Login (Público)**

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "Email": "juan@example.com",
    "Password": "SecurePass123"
  }'
```

O con username:

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "NombreUsuario": "jperez",
    "Password": "SecurePass123"
  }'
```

---

### 🛡️ **Acceder a Ruta Protegida**

Guarda el `accessToken` de la respuesta anterior y:

```bash
curl -X GET http://localhost:3000/example/protected \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Respuesta:**

```json
{
  "message": "Datos protegidos, solo para usuarios autenticados",
  "user": {
    "id": 1,
    "email": "juan@example.com",
    "nombreUsuario": "jperez",
    "roles": ["user"]
  }
}
```

---

### 🔄 **Refrescar Token**

Cuando el `accessToken` expire (15 minutos):

```bash
curl -X POST http://localhost:3000/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

**Respuesta:**

```json
{
  "accessToken": "eyJhbGc..."
}
```

---

### 🚪 **Logout**

```bash
curl -X POST http://localhost:3000/auth/logout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Respuesta:**

```json
{
  "message": "Logged out successfully"
}
```

Ahora el `refreshToken` está invalidado en la BD.

---

## Step 4: Protege tus Controladores

Abre cualquier controlador existente y:

### Antes:

```typescript
@Get(':id')
findOne(@Param('id') id: string) {
  return this.service.findOne(+id);
}
```

### Después:

```typescript
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)  // ← Agregado
@Get(':id')
findOne(
  @Param('id') id: string,
  @CurrentUser() user: any  // ← Agregado
) {
  console.log(`Usuario ${user.nombreUsuario} accedió a recurso ${id}`);
  return this.service.findOne(+id);
}
```

---

## Step 5: Autorización por Roles (RBAC)

Para operaciones administrativas:

```typescript
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)  // ← Ambos guards
@Roles('admin')  // ← Solo admins
@Delete(':id')
remove(@Param('id') id: string) {
  return this.service.remove(+id);
}
```

Si un usuario sin rol 'admin' intenta acceder:

```json
{
  "message": "No tienes los roles necesarios para acceder a este recurso",
  "statusCode": 403
}
```

---

## 🚨 Errores Comunes

### ❌ "Token is missing or invalid"

**Causa**: No incluiste el header `Authorization: Bearer <token>`
**Solución**: Verifica que el token esté en el header

### ❌ "Credenciales inválidas"

**Causa**: Email/usuario o contraseña incorrectos
**Solución**: Verifica que el usuario existe con POST /auth/login

### ❌ "El email o nombre de usuario ya está registrado"

**Causa**: Ya existe un usuario con ese email o username
**Solución**: Usa otro email o username en POST /auth/signup

### ❌ "Token inválido o expirado"

**Causa**: El accessToken expiró o la firma es inválida
**Solución**: Refresca con POST /auth/refresh + refreshToken

---

## 📚 Documentación Completa

Ver archivo: `src/auth/EJEMPLOS.ts`

---

## 🔗 Resumen de Endpoints

| Método | Ruta            | Protegida      | Descripción                                       |
| ------ | --------------- | -------------- | ------------------------------------------------- |
| POST   | `/auth/signup`  | ❌             | Registrar usuario                                 |
| POST   | `/auth/login`   | ❌             | Login                                             |
| POST   | `/auth/refresh` | ✅ JWT Refresh | Generar nuevo accessToken                         |
| POST   | `/auth/logout`  | ✅ JWT         | Logout e invalidar refresh token                  |
| GET    | `/users`        | ✅ JWT         | Listar usuarios (acceso público una vez logueado) |

---

## 🎯 Próximos Pasos

1. **Protege tus controladores existentes** con `@UseGuards(JwtAuthGuard)`
2. **Usa `@CurrentUser()`** para acceder al usuario autenticado
3. **Implementa RBAC** con `@Roles()` para rutas administrativas
4. **Genera secretos seguros** para producción (NO uses "default-secret")
5. **Configura CORS** si tu frontend está en otro dominio

---

## 💡 Tips

- Los **tokens tienen fecha de expiración** (accessToken 15min, refreshToken 7 días)
- El **refreshToken se hashea en BD**, nunca se guarda en plain text
- Al hacer **logout, el refreshToken se invalida** en la BD
- Los **roles vienen del usuario** desde la tabla `RolUser`
- Puedes **combinar guards**: `@UseGuards(JwtAuthGuard, RolesGuard)`

¡Listo! 🎉 Tu sistema de autenticación está funcionando.
