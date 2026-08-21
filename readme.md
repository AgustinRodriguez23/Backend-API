## Documentación de la API (Swagger)

La documentación interactiva de la API se genera con `swagger-jsdoc` y se sirve con `swagger-ui-express`.

**Acceso:** con el servidor corriendo, entrá a:

http://localhost:<PORT>/api/docs


(por defecto `PORT=3000`, configurable en `.env`)

### Qué está documentado ?

| Tag | Endpoints | Notas |
|---|---|---|
| **Health** | `GET /health` | Estado del servicio. No incluye estado de conexión a la DB. |
| **Users** | `GET /api/users`, `GET /api/users/:id`, `POST /api/users`, `PATCH /api/users/:id`, `DELETE /api/users/:id` | CRUD completo de usuarios. |
| **Products** | `GET /api/products`, `GET /api/products/:id`, `POST /api/products`, `PATCH /api/products/:id`, `DELETE /api/products/:id` | CRUD completo de productos. |
| **Mocks** | `GET /api/mocks/mocking-users`, `POST /api/mocks/generate-products`, `GET /api/mocks/mocking-orders`, `GET /api/mocks/mocking-deliveries` | Generación de datos falsos para testing/seeding. Solo disponibles fuera de producción (`NODE_ENV !== 'production'`). |
| **Debug** | `GET /logger-test` | Herramienta interna de validación del logger, no es funcionalidad de negocio. |
