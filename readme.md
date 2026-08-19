# Logging

## Herramienta utilizada

El logging se implementa con **[Winston](https://github.com/winstonjs/winston)**, complementado con **[winston-daily-rotate-file](https://github.com/winstonjs/winston-daily-rotate-file)** para la rotación automática de archivos de log.

La configuración vive en `src/config/logger.js`.

## Niveles de log

Se definen niveles personalizados (no los de Winston por defecto), de mayor a menor severidad:

| Nivel   | Prioridad | Color         | Uso previsto                                  |
|---------|-----------|---------------|------------------------------------------------|
| `fatal` | 0         | rojo (bold)   | Errores críticos que detienen la aplicación    |
| `error` | 1         | rojo          | Errores inesperados o no controlados           |
| `warn`  | 2         | amarillo      | Errores esperados/controlados (`CustomError`)  |
| `info`  | 3         | verde         | Eventos relevantes del flujo normal            |
| `http`  | 4         | magenta       | Logs de requests HTTP                          |
| `debug` | 5         | azul          | Información detallada para desarrollo          |

El nivel mínimo que se registra depende del entorno (ver sección de entornos más abajo).

## Cómo probar el logger

El proyecto expone un endpoint dedicado para probar todos los niveles de una sola vez:

```
GET /logger-test
```

Este endpoint (definido en `index.js`) dispara un log de cada nivel:

```js
logger.debug('Debug log')
logger.http('HTTP log')
logger.info('Info log')
logger.warn('Warning log')
logger.error('Error log')
logger.fatal('Fatal log')
```

Para probarlo:

```bash
curl http://localhost:<PUERTO>/logger-test
```

En consola deberías ver los 6 logs, cada uno con su color y nivel correspondiente (según los `customLevels.colors` definidos en `logger.js`), por ejemplo:

```
2026-08-18 15:32:01:123 [debug]: Debug log
2026-08-18 15:32:01:124 [http]: HTTP log
2026-08-18 15:32:01:125 [info]: Info log
2026-08-18 15:32:01:126 [warn]: Warning log
2026-08-18 15:32:01:127 [error]: Error log
2026-08-18 15:32:01:128 [fatal]: Fatal log
```

> En **producción** (`NODE_ENV=production`) este endpoint sigue respondiendo, pero en consola solo vas a ver los logs de nivel `info`, `warn`, `error` y `fatal` — los de `debug` y `http` quedan filtrados por el umbral de nivel (ver sección de entornos).

Además, como `error` y `fatal` son los niveles que también escriben a archivo, tras pegarle a `/logger-test` deberían aparecer entradas nuevas en `logs/error-YYYY-MM-DD.log` y `logs/fatal-YYYY-MM-DD.log`.

Para probar el comportamiento del `errorHandler` con errores reales (controlados vs. inesperados), se puede pegar a una ruta inexistente, que dispara `notFoundRoute` → `ROUTE_NOT_FOUND` (un `CustomError`, logueado con `logger.warn`):

```bash
curl http://localhost:<PUERTO>/una-ruta-que-no-existe
```

## Dónde se guardan los archivos de logs

Los logs se guardan en una carpeta `logs/` ubicada dos niveles arriba de `src/config/`, definida en `logger.js` como:

```js
const logDir = path.join(__dirname, '../../logs')
```

Dentro de esa carpeta se generan dos series de archivos, con rotación diaria (`DailyRotateFile`):

- `error-YYYY-MM-DD.log` → registra logs de nivel `error` (y más severos), se conservan **14 días**.
- `fatal-YYYY-MM-DD.log` → registra únicamente logs de nivel `fatal`, se conservan **28 días**.

Ambos archivos usan formato **JSON** (`winston.format.json()`), a diferencia de la consola que usa formato legible/coloreado.

## Qué se ignora en Git

En el `.gitignore` del proyecto debe incluirse:

```
logs/
*.log
```

Esto evita versionar los archivos de log generados en tiempo de ejecución (que además cambian todos los días por la rotación diaria).

## Comportamiento según el entorno

El nivel mínimo de log a registrar depende de `config.NODE_ENV`:

```js
level: config.NODE_ENV === 'production' ? 'info' : 'debug'
```

- **`production`** → solo se registran logs de nivel `info` o más severos (`info`, `warn`, `error`, `fatal`). Se omiten los `debug` y `http`, para no saturar los logs en producción.
- **Cualquier otro entorno** (`development`, `test`, etc.) → se registran **todos** los niveles, incluyendo `debug`, útil para depuración durante el desarrollo.

Este umbral aplica a todos los transports por igual, salvo los `DailyRotateFile`, que además tienen su propio filtro explícito (`level: 'error'` y `level: 'fatal'` respectivamente), independientemente del entorno.
