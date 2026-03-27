Proyecto: Frontend para catálogo de Rick & Morty

Descripción
-----------
Este repositorio contiene un frontend minimal en HTML/CSS/JavaScript que consume un backend con endpoints inspirados en la API de Rick & Morty. Muestra un catálogo paginado de personajes y además incluye un minijuego rápido donde las imágenes de los personajes aparecen volando y el usuario debe hacerles click con un "láser" durante 60 segundos para obtener puntuación.

Características principales
-------------------------
- Catálogo paginado (10 elementos por página).
- Búsqueda por nombre o especie (las especies se muestran en español y se mapearán al backend).
- Minijuego integrado: 60 segundos contra reloj, puntuación por aciertos, récord guardado en `localStorage`.
- Diseño dark mode con estilos responsivos y cursor personalizado.

Estructura relevante
--------------------
- `public/` — Archivos estáticos del frontend (`index.html`, `styles.css`, `app.js`).
- `src/` — Código del backend (rutas, servicios, paginación). (Si existe en este workspace.)
- `config.js` — Inyecta `window.API_BASE` para que el frontend consuma el backend.

Ejecución local
---------------
1. Instalar dependencias (desde la raíz del proyecto):

```bash
npm install
```

2. Iniciar el servidor en modo desarrollo:

```bash
npm run dev
```

3. Abrir la interfaz en el navegador:

```
http://localhost:3000/static/index.html
```

Notas
-----
- El frontend requiere que `window.API_BASE` apunte al prefijo de la API (por ejemplo `http://localhost:3000/api/v1`).
- El minijuego guarda el récord en `localStorage` bajo la clave `rm-game-highscore`.
- El botón de apoyo (BuyMeACoffee) queda separado y no cambia el estilo de los demás botones.

Contacto
-------
Autor: @ab1melek
