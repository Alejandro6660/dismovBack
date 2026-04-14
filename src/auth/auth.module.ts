import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthManager } from './auth.manager';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default-secret-change-in-production',
      signOptions: {
        expiresIn: parseInt(process.env.JWT_EXPIRATION ?? '900'),
      }, // 15 minutes
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthManager, JwtStrategy, JwtRefreshStrategy],
  exports: [AuthService, AuthManager],
})
export class AuthModule {}
