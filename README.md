# Sistema de Adopciones - Tarea 1

## Descripción

Aplicación web estática para gestionar el proceso de adopción de perros y gatos. Permite a los usuarios publicar avisos de adopción, ver listados de animales disponibles y consultar estadísticas del sistema.

## Estructura del Proyecto

La estructura del proyecto mantiene los archivos `html` a nivel raíz, y los distintos tipos de archivos (`js`, `css` y multimedia) en distintas carpetas para mantener el orden.

```
├── index.html
├── newpost.html
├── listings.html
├── post.html
├── statistics.html
├── style/
│   └── style.css
├── scripts/
│   ├── navigation.js
│   ├── newpost-form-handler.js
│   ├── listings-handler.js
│   └── post-handler.js
└── images/
    ├── photos/
    └── statistics/
```

## Notas de Implementación

- Uso de elementos `main`, `header`, `nav`, `section` y `fieldset` vez de solo `div` planos, según estándar HTML5.
- Se asignaron clases a todos los elementos importantes para estilizarlos con CSS.
- Las funcionalidades compartidas mediante JS por distintos archivos html se implementaron en un archivo distinto para reutilizar código: `navigation.js`.
- Las funcionalidades específicas de cada página se implementan en un archivo distinto, para evitar peticiones innecesarias.
- Para el formulario, se validan todos los campos de acuerdo con los criterios especificados en el enunciado indicándole al usuario el mensaje de error y resaltando (en rojo) el campo con errores.
- Los elementos ocultos (botones, inputs, modales, etc.) se implementan mediante el atributo `hidden` en vez de `display: none`, así pude implementar toda la funcionalidad del sitio con solo HTML y JS, para dejar el CSS para el final.
- La información de regiones y comunas de chile se carga dinámicamente desde un JSON externo.
- Las imágenes de los gráficos se agrandan al hacerles _hover_, para poder leerlas más claramente.
