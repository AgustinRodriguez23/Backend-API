## Testing

### Herramientas
- **Mocha** — framework para organizar y ejecutar los tests.
- **Chai** — aserciones (`expect`).
- **Supertest** — peticiones HTTP contra la app de Express sin necesidad de levantar un servidor real.
- **@faker-js/faker** (vía `MockService`) — generación de datos de prueba controlados y repetibles.

### Cómo ejecutar los tests
1. Asegurate de tener MongoDB corriendo localmente (`mongod`).
2. Copiá `.env.example` a `.env.test` y completá las variables (ver detalle abajo).
3. Corré:
```bash
   npm test
```

Los tests corren contra una base de datos separada (`shipnow_test`), nunca contra la base de desarrollo. Al finalizar la corrida completa, se limpian automáticamente todas las colecciones usadas.

### Base de datos de testing
**Sí, es requerida.** Los tests son funcionales (no usan mocks de base de datos), por lo que necesitan una instancia de MongoDB accesible. Se recomienda una base local separada de la de desarrollo para no afectar datos reales.

### Variables de entorno necesarias (`.env.test`)
| Variable       | Descripción                                  | Ejemplo                                          |
|----------------|-----------------------------------------------|---------------------------------------------------|
| `PORT`         | Puerto (no se usa realmente en los tests, pero es requerido por la validación de config) | `4000` |
| `NODE_ENV`     | Debe ser `test` para que se cargue este archivo | `test` |
| `MONGODB_URI`  | Conexión a la base de datos de testing        | `mongodb://127.0.0.1:27017/shipnow_test`          |

### Módulos cubiertos
| Módulo    | Casos exitosos | Casos de error |
|-----------|-----------------|------------------|
| Users     | ✅ listar, crear | ✅ datos incompletos, email duplicado |
| Products  | ✅ CRUD completo (vía service) | — |
| Orders    | ✅ crear, listar, obtener por id, actualizar estado, eliminar | ✅ datos incompletos, id inexistente, id inválido, producto inexistente, estado inválido |
| Mocks     | ✅ generación de usuarios, productos, pedidos y entregas mockeados | ✅ cantidad inválida |
| Logger    | ✅ endpoint de prueba de logs | — |
| Swagger   | ✅ UI accesible | — |