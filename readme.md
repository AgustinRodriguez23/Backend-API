## Manejo de errores

### Estructura de respuesta

Todos los errores devueltos por la API (de negocio o inesperados) tienen el mismo formato JSON:

```json
{
  "status": "error",
  "error": "USER_NOT_FOUND",
  "message": "User not found"
}
```

| Campo     | Descripción                                                                 |
|-----------|------------------------------------------------------------------------------|
| `status`  | Siempre `"error"`.                                                          |
| `error`   | Código interno del error (ver `ERROR_CODES` en `errors/error-codes.js`).    |
| `message` | Mensaje legible, ya sea el default del código o uno custom.                 |

El status code HTTP varía según el error (400, 404, 409, 500, etc.), definido junto a cada código en `error-codes.js`.

### Códigos de error disponibles

| Código                   | Status | Cuándo ocurre                                      |
|---------------------------|--------|-----------------------------------------------------|
| `USER_NOT_FOUND`          | 404    | El usuario solicitado no existe.                    |
| `PRODUCT_NOT_FOUND`       | 404    | El producto solicitado no existe.                   |
| `INVALID_ID`              | 400    | El `id` no tiene un formato válido de Mongo.         |
| `DUPLICATE_KEY`           | 409    | Ya existe un registro con ese valor único (email).  |
| `VALIDATION_ERROR`        | 400    | Falla una validación de campos (propia o de Mongoose). |
| `INVALID_MOCK_QUANTITY`   | 400    | La cantidad de mocks pedida es inválida o excede el límite. |
| `ROUTE_NOT_FOUND`         | 404    | La ruta solicitada no existe.                       |
| `INTERNAL_SERVER_ERROR`   | 500    | Cualquier error no contemplado.                     |

### Cómo probar casos inválidos

Cada endpoint delega el manejo de errores en el `errorHandler` centralizado, así que probar un caso inválido siempre sigue el mismo patrón: hacer el request y verificar `status` + `error` en la respuesta.

**Usuarios / Productos**
```bash
# ID inexistente -> 404 USER_NOT_FOUND / PRODUCT_NOT_FOUND
curl http://localhost:3000/api/users/64f0000000000000000000ff

# ID con formato inválido -> 400 INVALID_ID
curl http://localhost:3000/api/users/abc123

# Crear usuario sin campos requeridos -> 400 VALIDATION_ERROR
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"email": "test@test.com"}'

# Crear usuario con email duplicado -> 409 DUPLICATE_KEY
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"first_name":"Ana","last_name":"Perez","email":"existente@test.com","password":"123456"}'
```

**Módulo de mocks**
```bash
# Cantidad negativa o cero -> 400 INVALID_MOCK_QUANTITY
curl "http://localhost:3000/api/mocks/mocking-users?count=0"

# Cantidad por encima del límite (>= 1000) -> 400 INVALID_MOCK_QUANTITY
curl "http://localhost:3000/api/mocks/mocking-users?count=5000"

# Cantidad no numérica -> 400 INVALID_MOCK_QUANTITY
curl "http://localhost:3000/api/mocks/mocking-orders?count=abc"

# Generación de productos mock guardando en DB
curl -X POST http://localhost:3000/api/mocks/generate-products \
  -H "Content-Type: application/json" \
  -d '{"count": 10, "saveToDatabase": true}'
```

**Ruta inexistente**
```bash
# -> 404 ROUTE_NOT_FOUND
curl http://localhost:3000/api/ruta-que-no-existe
```