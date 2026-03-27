Proyecto: Frontend para catálogo de Rick & Morty

Descripción
-----------
Este repositorio contiene un frontend minimal en HTML/CSS/JavaScript que consume un backend con endpoints inspirados en la API de Rick & Morty. Muestra un catálogo paginado de personajes y además incluye un minijuego rápido donde las imágenes de los personajes aparecen volando y el usuario debe hacerles click con un "láser" durante 60 segundos para obtener puntuación.

Decisiones técnicas
-------------------------
- Backend de referencia
- Frontend sencillisimo

Características principales
-------------------------
- Catálogo paginado (10 elementos por página).
- Búsqueda por nombre o especie (las especies se muestran en español y se mapearán al backend).
- Minijuego integrado: 60 segundos contra reloj, puntuación por aciertos, récord guardado en `localStorage`.
- Diseño dark mode con estilos responsivos y cursor personalizado.

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

Mejoras continuas
---------------
Modificar a para subirlo a vercel y poder probar con enlace publico.

Agregar un mejor fronend, más profesional.

Sesiones y ranking mulijugador.

Notas
-----
Variables de entorno en passbolt: prueba-utict-2026_AbimelekCastrezana

Agradecimientos
---------------
Gracias a mi gatito que me acompaño casi toda la noche.

Contacto
-------
Autor: @ab1melek
