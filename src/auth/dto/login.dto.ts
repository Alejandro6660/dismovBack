import { IsString, IsEmail, IsOptional } from 'class-validator';

export class LoginDto {
  @IsOptional()
  @IsEmail()
  Email?: string;

  @IsOptional()
  @IsString()
  NombreUsuario?: string;

  @IsString()
  Password: string;
}
