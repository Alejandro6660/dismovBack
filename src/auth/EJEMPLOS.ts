/**
 * EJEMPLO DE USO: Autenticación y Autorización en Controladores
 *
 * Este archivo muestra cómo usar los decoradores y guards de autenticación
 * en tus controladores existentes.
 */

import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Param,
  Delete,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { CurrentToken } from 'src/auth/decorators/current-token.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('example')
export class ExampleController {
  /**
   * ✅ RUTA PÚBLICA - Sin autenticación
   */
  @Get('public')
  getPublicData() {
    return { message: 'Datos públicos accesibles sin token' };
  }

  /**
   * ✅ RUTA PROTEGIDA - Requiere JWT válido
   * Acceso: Cualquier usuario autenticado
   */
  @UseGuards(JwtAuthGuard)
  @Get('protected')
  getProtectedData(@CurrentUser() user: any) {
    return {
      message: 'Datos protegidos, solo para usuarios autenticados',
      user: {
        id: user.id,
        email: user.email,
        nombreUsuario: user.nombreUsuario,
        roles: user.roles,
      },
    };
  }

  /**
   * ✅ RUTA CON RBAC - Requiere rol específico
   * Acceso: Solo usuarios con rol 'admin'
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('admin-only')
  getAdminData(@CurrentUser() user: any) {
    return {
      message: 'Datos solo para administradores',
      admin: user.nombreUsuario,
    };
  }

  /**
   * ✅ RUTA CON MÚLTIPLES ROLES
   * Acceso: Usuarios con rol 'admin' O 'moderator'
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'moderator')
  @Get('moderator-level')
  getModeratorData(@CurrentUser() user: any) {
    return {
      message: 'Datos para administradores y moderadores',
      accessLevel: 'high',
      user: user.nombreUsuario,
    };
  }

  /**
   * ✅ ACCESO AL TOKEN COMPLETO
   * Útil si necesitas pasarlo a otra API o procesarlo
   */
  @UseGuards(JwtAuthGuard)
  @Get('token-info')
  getTokenInfo(@CurrentToken() token: string) {
    return {
      message: 'Tu token JWT',
      token: token, // El token sin "Bearer "
      note: 'Úsalo en el siguiente request con header: Authorization: Bearer <token>',
    };
  }

  /**
   * ✅ ACCESO AL REQUEST DIRECTO
   * Alternativa a usar @CurrentUser()
   */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMyProfile(@Request() req: any) {
    const user = req.user; // { id, email, nombreUsuario, roles }
    return {
      message: 'Tu perfil',
      profile: {
        id: user.id,
        email: user.email,
        nombreUsuario: user.nombreUsuario,
        roles: user.roles,
      },
    };
  }

  /**
   * ✅ DELETE CON AUTORIZACIÓN
   * Solo admin puede eliminar usuarios
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete('users/:id')
  deleteUser(@Param('id') id: number, @CurrentUser() admin: any) {
    return {
      message: `Usuario ${id} eliminado por ${admin.nombreUsuario}`,
      deletedBy: admin.id,
    };
  }

  /**
   * ✅ POST PROTEGIDO - Crear recurso
   * Solo usuarios autenticados pueden crear
   */
  @UseGuards(JwtAuthGuard)
  @Post('my-resource')
  createResource(@CurrentUser() user: any) {
    return {
      message: 'Recurso creado exitosamente',
      createdBy: user.nombreUsuario,
      createdAt: new Date(),
      resource: {
        id: 1,
        name: 'Mi Recurso',
        owner: user.id,
      },
    };
  }
}

/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * CÓMO USAR EN TUS CONTROLADORES EXISTENTES
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * 1. IMPORTA LOS GUARDS Y DECORADORES:
 *    import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
 *    import { RolesGuard } from 'src/auth/guards/roles.guard';
 *    import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
 *    import { Roles } from 'src/auth/decorators/roles.decorator';
 *
 * 2. AGREGA @UseGuards() A LAS RUTAS QUE QUIERAS PROTEGER:
 *    @UseGuards(JwtAuthGuard)
 *    @Get(':id')
 *    findOne(@Param('id') id: string) { ... }
 *
 * 3. USA @CurrentUser() PARA ACCEDER AL USUARIO AUTENTICADO:
 *    @UseGuards(JwtAuthGuard)
 *    @Get('profile')
 *    getProfile(@CurrentUser() user: any) {
 *      console.log(user); // { id, email, nombreUsuario, roles }
 *    }
 *
 * 4. PROTEGE POR ROLES CON @Roles() Y RolesGuard:
 *    @UseGuards(JwtAuthGuard, RolesGuard)
 *    @Roles('admin')
 *    @Delete(':id')
 *    deleteItem(@Param('id') id: string) { ... }
 *
 * 5. EN TU MÓDULO, ASEGÚRATE DE IMPORTAR AuthModule:
 *    @Module({
 *      imports: [TypeOrmModule.forFeature([...]), AuthModule],
 *      controllers: [MiController],
 *      providers: [MiService],
 *    })
 *    export class MiModule {}
 *
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * FLUJO DE AUTENTICACIÓN
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * 1. Usuario hace POST /auth/signup o POST /auth/login
 *    └─> Recibe: accessToken, refreshToken, user
 *
 * 2. Cliente guarda los tokens (localStorage/sessionStorage)
 *
 * 3. Cliente incluye accessToken en requests:
 *    Header: Authorization: Bearer <accessToken>
 *
 * 4. JwtAuthGuard valida el token, extrae payload y lo pone en req.user
 *
 * 5. El controlador accede al usuario con @CurrentUser()
 *
 * 6. Cuando accessToken expira (15 min):
 *    POST /auth/refresh + { refreshToken }
 *    └─> Recibe: nuevo accessToken
 *
 * 7. Para logout:
 *    POST /auth/logout + accessToken
 *    └─> Invalida el refreshToken en BD
 *
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * COMANDOS CURL PARA PRUEBAS
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * # 1. Signup
 * curl -X POST http://localhost:3000/auth/signup \
 *   -H "Content-Type: application/json" \
 *   -d '{
 *     "Nombre": "Juan",
 *     "Apellido": "Pérez",
 *     "NombreUsuario": "jperez",
 *     "Email": "juan@example.com",
 *     "Password": "SecurePass123",
 *     "Telefono": "+1234567890"
 *   }'
 *
 * # 2. Login
 * curl -X POST http://localhost:3000/auth/login \
 *   -H "Content-Type: application/json" \
 *   -d '{
 *     "Email": "juan@example.com",
 *     "Password": "SecurePass123"
 *   }'
 *
 * # 3. Acceder a ruta protegida (reemplaza TOKEN con el accessToken)
 * curl -X GET http://localhost:3000/example/protected \
 *   -H "Authorization: Bearer TOKEN"
 *
 * # 4. Refrescar token (reemplaza REFRESH_TOKEN)
 * curl -X POST http://localhost:3000/auth/refresh \
 *   -H "Content-Type: application/json" \
 *   -d '{ "refreshToken": "REFRESH_TOKEN" }'
 *
 * # 5. Logout
 * curl -X POST http://localhost:3000/auth/logout \
 *   -H "Authorization: Bearer TOKEN"
 *
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */
