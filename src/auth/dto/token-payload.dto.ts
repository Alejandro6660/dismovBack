export class TokenPayloadDto {
  sub: number; // userId
  email: string;
  nombreUsuario: string;
  roles: string[];
  iat?: number;
  exp?: number;
}
