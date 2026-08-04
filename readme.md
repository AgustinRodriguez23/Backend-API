# Backend III - API

1. Cloná el repositorio:
   ```bash
   git clone https://github.com/AgustinRodriguez23/Backend-API
   cd <nombre-del-proyecto>
   ```

2. Instalá las dependencias:
   ```bash
   npm install
   ```

3. Creá un archivo `.env` en la raíz del proyecto con las siguientes variables:
   ```env
   PORT=3000 | puerto que levanta el servidor
   MONGO_URI=mongodb://localhost:27017/<nombre-de-db>
   NODE_ENV=development|production
   ```

## Cómo correr el proyecto

**Modo desarrollo** 
```bash
npm run dev (con reinicio automático al realizar cambios si usas `node --watch`)
```

Por defecto, la API queda disponible en `http://localhost:3000`.

## Arquitectura del proyecto

El proyecto sigue una arquitectura en capas:

```
Route → Controller → Service → Repository → Model
```

- **Route**: define los endpoints HTTP y los conecta con el controller correspondiente.
- **Controller**: recibe el `req`/`res`, extrae y valida los datos de entrada, llama al service, y traduce el resultado (o el error) a una respuesta HTTP con el status code correcto.
- **Service**: contiene la lógica de negocio.
- **Repository**: encapsula el acceso a datos (consultas a Mongoose/MongoDB).
- **Model**: define el schema y las reglas propias de los datos (validaciones de Mongoose, hooks, etc.).

### ¿Por qué separar lógica entre Service y Repository?

La idea central es separar **qué hace la aplicación** (reglas de negocio) de **cómo se accede a los datos** (detalles de la base de datos):

- **El Repository solo sabe hablar con la base de datos.** No conoce reglas de negocio: recibe un filtro o un id, y devuelve documentos. Por ejemplo, `ProductRepository.find()` simplemente arma la query de Mongoose con paginación y proyección, sin decidir *qué* productos deberían verse.

- **El Service decide las reglas de negocio**, usando al Repository como una herramienta. Por ejemplo:
  - En `getAllProducts`, el Service decide que los productos con estado `OUT_OF_STOCK` no deberían listarse por defecto — esa es una regla de negocio, no un detalle de acceso a datos. El Repository solo ejecuta el filtro que el Service le pasa.
  - En `getProductById`, `updateProduct` y `deleteProduct`, el Service decide qué significa "no encontrado" (lanzar un error de dominio `"Product not found"`) y se lo comunica al Controller en un lenguaje que no depende de Mongoose ni de HTTP.