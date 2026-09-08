## Producción y Docker

### Variables de entorno
| Variable | Requerida | Descripción |
|----------|:---:|---|
| `PORT` | Sí | Puerto en el que corre la API |
| `NODE_ENV` | Sí | `development`, `test` o `production` |
| `MONGODB_URI` | Sí | Cadena de conexión a MongoDB |
| `LOG_LEVEL` | No | Nivel de logs de Winston (`debug` en dev, `info` en prod por default) |

Cada entorno usa su propio archivo: `.env` (desarrollo), `.env.test` (testing), `.env.production` (producción). Ninguno se sube al repo — guiate por `.env.example` para saber qué completar.

### Correr la API localmente
```bash
npm install
npm run dev
```

### Correr los tests
```bash
npm test
```
Requiere MongoDB corriendo localmente y `.env.test` configurado (ver sección de Testing más arriba).

### Acceder a Swagger
Con la API corriendo: `http://localhost:<PORT>/api/docs`

### Construir la imagen de Docker
```bash
docker build -t shipnow-api .
```

### Ejecutar el contenedor
```bash
docker run -p 8080:8080 --env-file .env.production shipnow-api
```
La API queda disponible en `http://localhost:8080`. Si tu MongoDB corre en tu máquina local (no en un contenedor), usá `host.docker.internal` en vez de `localhost`/`127.0.0.1` dentro de `MONGODB_URI`.

### Archivos que no deben subirse al repo
`node_modules`, `.env`, `.env.test`, `.env.production`, `logs/`, `uploads/` (excepto `.gitkeep`), `coverage/` — todos cubiertos por `.gitignore` y `.dockerignore`.

### Logs y uploads
Los logs se generan localmente en `logs/` (rotación diaria vía Winston) y nunca se commitean. Los archivos subidos por los usuarios (documentos, comprobantes) se guardan en `uploads/`, tampoco se versionan — en base solo se persisten sus metadatos, nunca el archivo en sí.