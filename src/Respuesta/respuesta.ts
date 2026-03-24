export class Respuesta {
  private mensaje: string;
  private codigo: string;

  constructor(mensaje: string, codigo: string) {
    this.mensaje = mensaje;
    this.codigo = codigo;
  }

  public getMensaje(): string {
    return this.mensaje;
  }

  public setMensaje(mensaje: string): void {
    this.mensaje = mensaje;
  }

  public getCodigo(): string {
    return this.codigo;
  }

  public setCodigo(codigo: string): void {
    this.codigo = codigo;
  }
}
