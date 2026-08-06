# Backend III - API
 
## PRE-ENTREGA 2 

# Cómo probar los endpoints de mocking
 
Tiene cuatro endpoints para generar datos de prueba (usuarios, productos, órdenes y entregas) usando `faker`. El router está montado en `index.js`, ruta `/api/mocks`
 
## Usuarios mock
 
`GET /mocking-users?count=10` genera usuarios ficticios sin guardarlos en la base de datos. El parámetro `count` es opcional (default 10) y tiene que ser un número entre 1 y 999; si mandás 0, un número negativo, mayor o igual a 1000, o algo que no sea un número, el endpoint responde `400`. Cada usuario generado trae `first_name`, `last_name`, `email`, `password` y un `role` elegido al azar entre los definidos en `USER_ROLES`.
 
Para probarlo en terminal:
```bash
curl "http://localhost:3000/api/mocks/mocking-users?count=5"
```
Testear también los casos límite: sin `count`, con `count=0`, y con `count=1000` para confirmar que la validación funciona como se espera.
 
## Productos mock
 
`POST /generate-products` genera productos ficticios y, si se lo pedís, los guarda en la base de datos. El body va en JSON con `count` (cantidad a generar) y opcionalmente `saveToDatabase` (booleano). Si `saveToDatabase` es `true`, el endpoint inserta los productos en la colección real usando `ProductModel.insertMany`.
 
```bash
# Solo generar, sin guardar
curl -X POST "http://localhost:3000/api/mocks/generate-products" \
  -H "Content-Type: application/json" \
  -d '{ "count": 5 }'
 
# Generar y guardar en la BD
curl -X POST "http://localhost:3000/api/mocks/generate-products" \
  -H "Content-Type: application/json" \
  -d '{ "count": 5, "saveToDatabase": true }'
```
 
Cada producto trae `title`, `description`, `price`, `category`, `stock` (0–100) e `images`. A diferencia de los otros endpoints, este **no valida `count`** (no chequea que sea un número positivo ni que esté dentro de un rango), así que es un buen caso para probar con valores raros (`count` faltante, negativo, texto) y ver si realmente devuelve `500` en esos casos.
 
## Órdenes mock
 
`GET /mocking-orders?count=10` genera órdenes ficticias. Internamente el endpoint primero crea 20 usuarios mock (para tener de dónde sacar el email del comprador) y después arma las órdenes a partir de esos usuarios. La validación de `count` es la misma que en usuarios: número entre 1 y 999, si no `400`.
 
```bash
curl "http://localhost:3000/api/mocks/mocking-orders?count=5"
```
 
Cada orden trae `id`, `user_email`, una lista de `products` (nombres random, no ligados a productos reales), `status`, `priority`, `total` y `created_at`. Un detalle a tener en cuenta al probar: el `user_email` se asigna solo entre los 20 usuarios generados que tengan rol `USER_ROLES.USER`. Como los roles se asignan al azar, hay chance de que ninguno de los 20 caiga con ese rol, y en ese caso el endpoint puede devolver `500` en vez de `200`. Conviene repetir la request varias veces para ver si ese caso aparece.
 
## Entregas mock
 
`GET /mocking-deliveries?count=10` es el endpoint más "encadenado": genera 20 usuarios, después genera órdenes con esos usuarios, y por último genera las entregas a partir de esas órdenes. El `count` acá define cuántas órdenes se generan como base, no cuántas entregas vas a recibir — las entregas van a ser menos, porque se descartan las órdenes en estado `PENDING`.
 
```bash
curl "http://localhost:3000/api/mocks/mocking-deliveries?count=10"
```
 
Cada entrega trae `id`, `order_id`, `courier_email` (o `null` si ninguno de los 20 usuarios tiene rol `COURIER` — este caso sí está contemplado y no rompe), `status`, `address` y `estimated_delivery`.
 
## Algo a tener en cuenta al probar en general
 
Para probar todo junto, el flujo más completo sería: generar usuarios, después productos (con y sin `saveToDatabase`), después órdenes, y por último entregas.
