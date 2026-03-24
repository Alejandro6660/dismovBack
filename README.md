<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# 🚀 Guía para levantar el proyecto (NestJS + Docker)

Sigue estos pasos para ejecutar el proyecto en tu entorno local.

---

## 📦 Requisitos previos

Asegúrate de tener instalado:

- [Node.js](https://nodejs.org/es)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Git](https://git-scm.com/)
- [$ npm i -g @nestjs/cli](https://docs.nestjs.com/first-steps)

Verifica instalaciones:

```bash
node -v
docker -v
docker compose version
```

---

## 📥 Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/tu-repositorio.git
```

Entrar a la carpeta:

```bash
cd tu-repositorio
```

---

## ⚙️ Variables de entorno

1. Crear archivo `.env` en la raíz
2. Basarte en `.env.example` (si existe)

Ejemplo:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=mi_db
```

---

## 🐳 Levantar base de datos con Docker

Ejecuta:

```bash
docker compose up -d
```

Esto levantará los contenedores definidos (por ejemplo: PostgreSQL, MySQL, etc.).

Para verificar:

```bash
docker ps
```

Para detenerlos:

```bash
docker compose down
```

---

## 📦 Instalar dependencias

```bash
npm install
```

---

## ▶️ Ejecutar el proyecto

Modo desarrollo:

```bash
nest start dev
```

Modo producción:

```bash
npm run build
npm run start:prod
```

---

## 🌐 Acceder a la aplicación

Abrir en el navegador:

```text
http://localhost:3000
```

---

## 🗄️ Migraciones (si aplica)

Ejecutar migraciones:

```bash
npm run migration:run
```

Crear migración:

```bash
npm run migration:generate -- nombre-migracion
```

---

## 🛠️ Comandos útiles

- Levantar contenedores:

  ```bash
  docker compose up -d
  ```

- Ver logs:

  ```bash
  docker compose logs -f
  ```

- Reiniciar contenedores:

  ```bash
  docker compose restart
  ```

---

## ❗ Problemas comunes

- 🔴 Error de conexión a la base de datos
  👉 Verifica que Docker esté corriendo y los contenedores activos

- 🔴 Puerto ocupado
  👉 Cambia el puerto en `.env` o en `docker-compose.yml`

- 🔴 Dependencias rotas
  👉 Ejecuta:

  ```bash
  npm install
  ```

- 🔴 Base de datos no inicializa
  👉 Reintenta:

  ```bash
  docker compose down
  docker compose up -d
  ```

---

✅ ¡Listo! Ya puedes levantar el proyecto NestJS con base de datos en Docker.
