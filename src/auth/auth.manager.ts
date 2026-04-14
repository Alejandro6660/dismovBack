import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { TokenPayloadDto } from './dto/token-payload.dto';
import * as bcrypt from 'bcryptjs';

/**
 * Auth Manager
 * Centraliza utilidades para trabajar con tokens desde servicios o componentes
 * sin necesidad de acceder al request directamente
 */
@Injectable()
export class AuthManager {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  /**
   * Decodifica un token JWT sin validar firma
   * Útil para extraer información del token sin error si está expirado
   * @param token Token JWT
   */
  decodeToken(token: string): TokenPayloadDto | null {
    try {
      return this.jwtService.decode(token) as TokenPayloadDto;
    } catch (error) {
      return null;
    }
  }

  /**
   * Verifica y extrae el payload de un token válido
   * Lanza excepción si el token es inválido o está expirado
   * @param token Token JWT
   */
  getValidatedTokenPayload(token: string): TokenPayloadDto {
    try {
      return this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      }) as TokenPayloadDto;
    } catch (error) {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }

  /**
   * Obtiene el usuario asociado a un token válido
   * @param token Token JWT
   */
  async getUserFromValidatedToken(token: string) {
    const payload = this.getValidatedTokenPayload(token);
    const user = await this.usersService.findById(payload.sub);

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    return user;
  }

  /**
   * Verifica la firma de un token sin decodificar
   * Retorna true si la firma es válida, false otherwise
   * @param token Token JWT
   */
  isTokenSignatureValid(token: string): boolean {
    try {
      this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Verifica si un token está expirado
   * Retorna true si está expirado, false si es válido
   * @param token Token JWT
   */
  isTokenExpired(token: string): boolean {
    try {
      this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      return false; // Token válido, no está expirado
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        return true;
      }
      // Otro error (firma inválida, etc)
      return false;
    }
  }

  /**
   * Extrae el ID del usuario desde un token (sin validar)
   * Útil para logs o rastreo
   * @param token Token JWT
   */
  getUserIdFromToken(token: string): number | null {
    const payload = this.decodeToken(token);
    return payload?.sub || null;
  }

  /**
   * Extrae el email del usuario desde un token (sin validar)
   * @param token Token JWT
   */
  getEmailFromToken(token: string): string | null {
    const payload = this.decodeToken(token);
    return payload?.email || null;
  }

  /**
   * Valida un refresh token contra el hash almacenado en BD
   * @param token Token de refresco
   * @param userId ID del usuario
   */
  async validateRefreshToken(token: string, userId: number): Promise<boolean> {
    try {
      // Validar firma del token
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      // Obtener usuario de BD
      const user = await this.usersService.findById(userId);

      if (!user || !user.RefreshTokenHash) {
        return false;
      }

      // Comparar token con hash almacenado
      return await bcrypt.compare(token, user.RefreshTokenHash);
    } catch {
      return false;
    }
  }
}
