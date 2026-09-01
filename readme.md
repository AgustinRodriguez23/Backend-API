## Carga de archivos (Módulo 7)

### Herramientas
- **Multer** — manejo de `multipart/form-data`, configuración centralizada en `src/config/multer.js` (storage, tipos permitidos, tamaño máximo), separada de los routers.

### Estructura de carpetas

uploads/
users/ ← documentos de usuario (DNI, licencia, comprobante de domicilio)
delivery-receipts/ ← comprobantes de entrega

Los archivos subidos **no se versionan** (`uploads/*` está en `.gitignore`); en la base solo se guardan sus metadatos (nombre original, nombre generado, ruta, tipo, tamaño, fecha de carga y, para documentos de usuario, el tipo de documento).

### Endpoints

| Método | Ruta | Campo de archivo | Campos adicionales |
|--------|------|-------------------|----------------------|
| `POST` | `/api/users/:id/documents` | `document` | `document_type` (`id_card`, `driver_license`, `proof_of_address`, `other`) |
| `POST` | `/api/deliveries/:id/receipts` | `receipt` | — |

**Restricciones:** tipos aceptados `application/pdf`, `image/jpeg`, `image/png` — tamaño máximo 5MB.

**Errores específicos:** `FILE_REQUIRED` (400), `INVALID_FILE_TYPE` (400), `FILE_TOO_LARGE` (400), `INVALID_DOCUMENT_TYPE` (400), además de los `USER_NOT_FOUND` / `DELIVERY_NOT_FOUND` (404) ya existentes cuando la entidad no existe.

Documentados en Swagger (`/api/docs`) como `multipart/form-data`, con tests funcionales en `test/routes/uploads.routes.test.js`.