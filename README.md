# ShipNow API

API backend para la gestión de una operación de delivery: usuarios, productos, pedidos, entregas y comprobantes/documentos asociados. Desarrollada como proyecto integrador del curso de Backend, cubriendo arquitectura por capas, manejo de errores, testing funcional, carga de archivos, performance y despliegue con Docker.

## Tabla de contenidos

- [Tecnologías](#tecnologías)
- [Arquitectura](#arquitectura)
- [Variables de entorno](#variables-de-entorno)
- [Instalación](#instalación)
- [Ejecución local](#ejecución-local)
- [Testing](#testing)
- [Swagger](#swagger)
- [Docker](#docker)
- [Logs y uploads](#logs-y-uploads)
- [Endpoints principales](#endpoints-principales)

## Tecnologías

- **Node.js** + **Express** — servidor HTTP y enrutamiento
- **MongoDB** + **Mongoose** — base de datos y modelado de datos
- **Multer** — carga y validación de archivos (`multipart/form-data`)
- **Winston** + **winston-daily-rotate-file** — logging centralizado con rotación de archivos
- **Swagger** (`swagger-jsdoc` + `swagger-ui-express`) — documentación interactiva de la API
- **bcrypt** — hasheo de contraseñas
- **Mocha** + **Chai** + **Supertest** — testing funcional
- **@faker-js/faker** — generación de datos simulados (mocks)
- **Docker** — contenerización

## Arquitectura

El proyecto sigue una arquitectura por capas, sin excepciones en las rutas principales:

```
Router → Controller → Service → Repository → Model (Mongoose) → MongoDB
```

- **Routes**: solo definen los endpoints y qué controller/middleware les corresponde. No contienen lógica.
- **Controllers**: reciben el request, delegan al service correspondiente y arman la respuesta HTTP. No acceden a la base de datos directamente.
- **Services**: contienen la lógica de negocio (cálculo de totales, validaciones de dominio, reglas de estado). No conocen detalles de Express ni de Mongoose directamente.
- **Repositories**: concentran todo el acceso a MongoDB (queries, populate, proyecciones). Son el único lugar que usa los modelos de Mongoose directamente.
- **Models**: definen los schemas de Mongoose y sus validaciones.

```
src/
  app.js                  → configuración de Express (sin levantar servidor)
  server.js               → levanta la conexión a DB y el servidor HTTP
  config/                 → env, conexión a DB, logger, swagger, multer
  controllers/
  services/
  repositories/
  models/
  routes/
  middlewares/            → manejo de errores, upload de archivos
  errors/                 → CustomError y catálogo de códigos de error
  mocks/                  → generación de datos simulados
  utils/                  → constantes, paginación, utilidades de archivos
  docs/                   → specs de Swagger por recurso (.yaml)
test/
  routes/                 → tests funcionales por recurso
  helpers/                → aserciones compartidas
  fixtures/               → archivos usados en tests de carga
uploads/                  → archivos subidos por usuarios (no se versiona)
logs/                     → logs generados por Winston (no se versiona)
```

### Manejo de errores

Middleware global (`errorHandler`) que captura todos los errores y responde siempre con el mismo formato:

```json
{
  "status": "error",
  "error": "CODIGO_DEL_ERROR",
  "message": "Descripción legible"
}
```

Incluye errores de dominio (`USER_NOT_FOUND`, `ORDER_NOT_FOUND`, `INVALID_ORDER_STATUS`, `PRODUCT_NOT_FOUND`, `DELIVERY_NOT_FOUND`), de validación (`VALIDATION_ERROR`, `INVALID_ID`, `DUPLICATE_KEY`), de archivos (`FILE_REQUIRED`, `INVALID_FILE_TYPE`, `FILE_TOO_LARGE`, `INVALID_DOCUMENT_TYPE`) y de mocks (`INVALID_MOCK_QUANTITY`), además de un fallback genérico (`INTERNAL_SERVER_ERROR`) y de ruta no encontrada (`ROUTE_NOT_FOUND`).

### Mocks

El módulo `src/mocks` genera datos simulados (usuarios, productos, pedidos, entregas) usando `@faker-js/faker`, respetando la forma real de cada modelo y las constantes del proyecto (`USER_ROLES`, `ORDER_STATUS`, `ORDER_PRIORITY`, `DELIVERY_STATUS`). Solo está disponible en `development` y `test` (ver sección de endpoints internos).

## Variables de entorno

| Variable | Requerida | Descripción |
|---|:---:|---|
| `PORT` | Sí | Puerto en el que corre la API |
| `NODE_ENV` | Sí | `development`, `test` o `production` |
| `MONGODB_URI` | Sí | Cadena de conexión a MongoDB |
| `LOG_LEVEL` | No | Nivel de logs de Winston (`fatal`, `error`, `warn`, `info`, `http`, `debug`). Default: `debug` en desarrollo/test, `info` en producción |

La app valida las variables requeridas al iniciar (`config/env.config.js`) y **no arranca** si falta alguna, mostrando un mensaje de error claro indicando cuál falta.

Cada entorno usa su propio archivo, ninguno se sube al repo:

| Entorno | Archivo |
|---|---|
| Desarrollo | `.env` |
| Testing | `.env.test` |
| Producción | `.env.production` |

Guiate por `.env.example` para saber qué completar en cada uno.

## Instalación

```bash
git clone <URL_DEL_REPOSITORIO>
cd backend-api
npm install
cp .env.example .env
```

Completá `.env` con tus propios valores (por ejemplo, `MONGODB_URI=mongodb://127.0.0.1:27017/shipnow` si usás Mongo local).

## Ejecución local

Requiere una instancia de MongoDB accesible (local o Atlas).

```bash
npm run dev
```

Esto levanta el servidor con recarga automática ante cambios. Por defecto queda disponible en `http://localhost:<PORT>`.

Para correrlo en modo producción (sin `--watch`):

```bash
npm start
```

## Testing

```bash
npm test
```

Requisitos:
- MongoDB corriendo (local o accesible) y `.env.test` configurado con una base **separada** de la de desarrollo (ej. `shipnow_test`), para no afectar datos reales.
- El script ya se encarga de fijar `NODE_ENV=test` (vía `cross-env`) antes de cargar cualquier módulo, y de conectar/limpiar la base de test automáticamente al inicio y al final de la corrida (`test/setup.js`).

La suite cubre, con casos exitosos y de error:
- Users (CRUD completo + carga de documentos)
- Products (CRUD completo)
- Orders (crear, listar, obtener por ID, actualizar estado, eliminar)
- Deliveries (CRUD completo + carga de comprobantes)
- Mocks (generación de usuarios, productos, pedidos y entregas simulados, incluyendo cantidades inválidas)
- Health check
- Logger de prueba
- Swagger (UI accesible y coherencia entre el spec documentado y el comportamiento real)

Los tests usan datos generados con el módulo de mocks y se limpian a sí mismos (por test y con una limpieza global de respaldo al finalizar la corrida), sin depender de datos cargados manualmente.

## Swagger

Con la API corriendo, la documentación interactiva está disponible en:

```
http://localhost:<PORT>/api/docs
```

También se expone el spec en formato JSON crudo en `http://localhost:<PORT>/api/docs.json`.

Cubre usuarios, productos, pedidos, entregas, mocks, logger de prueba, health check y los dos endpoints de carga de archivos (documentos de usuario y comprobantes de entrega), incluyendo schemas de request/response y los códigos de error posibles de cada endpoint.

## Docker

### Construir la imagen

```bash
docker build -t shipnow-api .
```

### Ejecutar el contenedor

```bash
docker run -p 8080:8080 --env-file .env.production shipnow-api
```

La API queda disponible en `http://localhost:8080`.

**Importante sobre `MONGODB_URI` en `.env.production`:** si tu MongoDB corre en tu máquina local (no en otro contenedor), usá `host.docker.internal` en vez de `localhost`/`127.0.0.1`, porque dentro del contenedor esas direcciones apuntan al propio contenedor:

```
MONGODB_URI=mongodb://host.docker.internal:27017/shipnow
```

Una vez levantado, se puede probar como mínimo:
- `GET http://localhost:8080/health`
- `GET http://localhost:8080/api/docs`
- `GET http://localhost:8080/api/products`

### Detener el contenedor

```bash
docker ps            # obtener el CONTAINER ID
docker stop <ID>
```

## Logs y uploads

- **Logs**: se generan localmente en `logs/` con rotación diaria (Winston + `winston-daily-rotate-file`). Nunca se suben al repositorio. El nivel de detalle depende de `LOG_LEVEL`/`NODE_ENV` (más verboso en desarrollo, más acotado en producción).
- **Uploads**: los archivos cargados por los usuarios (documentos de identidad, comprobantes de entrega) se guardan en `uploads/`, organizados en subcarpetas por tipo (`uploads/users/`, `uploads/delivery-receipts/`). Tampoco se suben al repositorio. En la base de datos **solo se persisten los metadatos** del archivo (nombre original, nombre generado, ruta, tipo MIME, tamaño y fecha de carga) — nunca el archivo en sí.
- Tipos de archivo permitidos: PDF, JPG, PNG. Tamaño máximo: 5MB. Cualquier otro caso responde con el error correspondiente (`INVALID_FILE_TYPE`, `FILE_TOO_LARGE`, `FILE_REQUIRED`).

## Endpoints principales

Documentación completa e interactiva disponible en `/api/docs`. Resumen:

| Recurso | Rutas |
|---|---|
| Usuarios | `GET/POST /api/users` · `GET/PATCH/DELETE /api/users/:id` · `POST /api/users/:id/documents` |
| Productos | `GET/POST /api/products` · `GET/PATCH/DELETE /api/products/:id` |
| Pedidos | `GET/POST /api/orders` · `GET/PATCH/DELETE /api/orders/:id` |
| Entregas | `GET/POST /api/deliveries` · `GET/PATCH/DELETE /api/deliveries/:id` · `POST /api/deliveries/:id/receipts` |
| Mocks | `GET /api/mocks/mocking-users` · `POST /api/mocks/generate-products` · `GET /api/mocks/mocking-orders` · `GET /api/mocks/mocking-deliveries` |
| Utilidad | `GET /health` · `GET /logger-test` · `GET /api/docs` |

### Endpoints internos y entornos

| Endpoint | Development | Test | Production |
|---|:---:|:---:|:---:|
| `/api/mocks/*` | ✅ | ✅ | ❌ (404) |
| `/logger-test` | ✅ | ✅ | ❌ (404) |
| `/api/docs` (Swagger) | ✅ | ✅ | ✅ |

**Criterio aplicado:** los endpoints de generación de datos falsos (`mocks`) y de prueba de logging (`logger-test`) son herramientas de desarrollo sin sentido ni seguridad en un entorno real, por lo que se desactivan completamente en producción. Swagger se mantiene disponible en todos los entornos porque documenta la API pública y no expone información sensible ni permite acciones destructivas.
