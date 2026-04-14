import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { TokenPayloadDto } from './dto/token-payload.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  // 🔹 Registro de nuevo usuario
  async signup(signupDto: SignupDto) {
    // Validar que no exista usuario con ese email o nombre de usuario
    const existingByEmail = await this.usersService.findByEmail(
      signupDto.Email,
    );
    const existingByUsername = await this.usersService.findByNombreUsuario(
      signupDto.NombreUsuario,
    );

    if (existingByEmail || existingByUsername) {
      throw new ConflictException(
        'El email o nombre de usuario ya está registrado',
      );
    }

    // Hashear contraseña
    const passwordHash = await this.usersService.hashPassword(
      signupDto.Password,
    );

    // Crear usuario
    const user = await this.usersService.userRepository.save({
      Nombre: signupDto.Nombre,
      Apellido: signupDto.Apellido,
      NombreUsuario: signupDto.NombreUsuario,
      Email: signupDto.Email,
      PasswordHash: passwordHash,
      Telefono: signupDto.Telefono,
      EstaActivo: true,
      FechaCreacion: new Date(),
    });

    // Generar tokens
    return this.generateTokens(user);
  }

  // 🔹 Login de usuario
  async login(loginDto: LoginDto) {
    const { Email, NombreUsuario, Password } = loginDto;

    // Buscar usuario por email o nombre de usuario
    let user;
    if (Email) {
      user = await this.usersService.findByEmail(Email);
    } else if (NombreUsuario) {
      user = await this.usersService.findByNombreUsuario(NombreUsuario);
    } else {
      throw new BadRequestException(
        'Debes proporcionar email o nombre de usuario',
      );
    }

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Validar contraseña
    const isPasswordValid = await this.usersService.comparePassword(
      Password,
      user.PasswordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Generar tokens
    return this.generateTokens(user);
  }

  // 🔹 Refrescar token
  async refreshToken(user: any) {
    const dbUser = await this.usersService.findById(user.id);

    if (!dbUser) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    // Generar nuevo access token
    const tokens = await this.generateTokens(dbUser);
    return { accessToken: tokens.accessToken };
  }

  // 🔹 Logout (invalidar refresh token)
  async logout(userId: number) {
    await this.usersService.userRepository.update(userId, {
      RefreshTokenHash: null as any,
    });

    return { message: 'Logged out successfully' };
  }

  // 🔹 Validar token JWT
  async validateAccessToken(token: string): Promise<TokenPayloadDto> {
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      return payload;
    } catch (error) {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }

  // 🔹 Validar refresh token
  async validateRefreshToken(token: string, userId: number): Promise<boolean> {
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const user = await this.usersService.findById(userId);

      if (!user || !user.RefreshTokenHash) {
        return false;
      }

      // Comparar el hash del refresh token almacenado con el token proporcionado
      return await bcrypt.compare(token, user.RefreshTokenHash);
    } catch (error) {
      return false;
    }
  }

  // 🔹 Decodificar token sin validar (útil para logs)
  decodeToken(token: string): TokenPayloadDto {
    return this.jwtService.decode(token) as TokenPayloadDto;
  }

  // 🔹 Generar access y refresh tokens
  private async generateTokens(user: any) {
    // Obtener roles del usuario
    const roles = user.RolUsuario
      ? [user.RolUsuario.Nombre || 'user']
      : ['user'];

    const payload: TokenPayloadDto = {
      sub: user.id,
      email: user.Email,
      nombreUsuario: user.NombreUsuario,
      roles,
    };

    // Generar access token (corta duración)
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '15m',
    });

    // Generar refresh token (larga duración)
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    // Hashear y guardar refresh token en BD
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    await this.usersService.userRepository.update(user.id, {
      RefreshTokenHash: refreshTokenHash,
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.Email,
        nombreUsuario: user.NombreUsuario,
        nombre: user.Nombre,
        apellido: user.Apellido,
        roles,
      },
    };
  }
}
