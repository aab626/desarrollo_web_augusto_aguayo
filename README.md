# Sistema de Adopciones - Tarea 2

## Descripción

Aplicación web dinámica utilizando _Flask_+_MySQL_ (Mediante _SQLAlchemy_) para gestionar el proceso de adopción de perros y gatos. Permite a los usuarios publicar avisos de adopción, ver listados de adopciones disponibles y consultar estadísticas del sistema (de momento estático).

## Estructura del Proyecto

Para preservar el orden en la aplicación, se mantiene separado en distintos directorios las distintas componentes del sistema, el directorio `database` almacena toda la información de los modelos, junto a las funciones necesarias para interactuar con la ORM. 

En el directorio `static` se encuentra todo el contenido estático del sitio, separado según sus roles (`css`, `js`, entre otros). Una nota importante es el subdirectorio `uploads`, que es donde se almacena el contenido subido por los usuarios al sitio.

Finalmente, `templates` almacena los archivos `.html.j2` (templates de _Jinja2_, con la extensión `.html.j2` para poder utilizar las funciones de _highlighting_ del editor) y `util` con varios datos y funciones utilizadas a lo largo de la plataforma.

```
├── database
├── static
│   ├── css
│   ├── favicons
│   ├── images
│   ├── js
│   ├── svg
│   └── uploads
├── templates
├── utils
└── app.py
```

## Notas de Implementación

### Tarea 1
 - Uso de elementos `main`, `header`, `nav`, `section` y `fieldset` vez de solo `div` planos, según estándar HTML5.
 - Se asignaron clases a todos los elementos importantes para estilizarlos con CSS.
 - Las funcionalidades compartidas mediante JS por distintos archivos html se implementaron en un archivo distinto para reutilizar código: `navigation.js`.
 - Las funcionalidades específicas de cada página se implementan en un archivo distinto, para evitar peticiones innecesarias.
 - Para el formulario, se validan todos los campos de acuerdo con los criterios especificados en el enunciado indicándole al usuario el mensaje de error y resaltando (en rojo) el campo con errores.
 - Los elementos ocultos (botones, inputs, modales, etc.) se implementan mediante el atributo `hidden` en vez de `display: none`, así pude implementar toda la funcionalidad del sitio con solo HTML y JS, para dejar el CSS para el final.
 - La información de regiones y comunas de chile se carga dinámicamente desde un JSON externo.
 - Las imágenes de los gráficos se agrandan al hacerles _hover_, para poder leerlas más claramente.

### Tarea 2
 - Corregidos los errores de validación HTML de Tarea 1.
 - Se implementan validaciones por el lado del usuario (`js`), tanto como en backend.
 - Al encontrar un error de validación por parte del backend, al retornar al formulario se rellenan los campos con la información proporcionada a excepción de las imágenes, por limitación del comportamiento de navegadores y seguridad.
 - Si bien los campos de _Sector_ y _Descripción_ en el formulario de nuevo aviso no son obligatorios, se introdujo un límite de 2048 caracteres en la descripción para evitar posts maliciosos.
 - Para varias queries por la ORM se utilizó la opción `joinedload`, para así incluir los datos de tablas relacionadas sin incurrir en errores por pérdida de sesión.
 - Se reemplazó la carga de datos de regiones desde el JSON externo por los datos de la base de datos.
 - Se incluyeron varios íconos `svg` para los distintos métodos de contacto, como para el favicon del sitio.
 - Como la página de estadísticas sigue siendo estática, sus gráficos se encuentran en `static/images/statistics`.

### Tarea 3
 - Para generar los gráficos se utilizó la libreria ['Chart.js'](https://www.chartjs.org/) mediante _CDN_.
 - Estos se cargan de forma asíncrona al resto de la página usando _fetch_.
 - Los comentarios en las páginas de los avisos se cargan también asincrónicamente usando _fetch_.
 - El comentario recién agregado se guarda en la _DB_, pero se muestra modificando el _DOM_.
 - Los comentarios tienen verificaciones _client-side_ y _server-side_, y muestran los errores de validación, al igual que para el ingreso de un nuevo aviso de adopción.

## Configuración y ejecución

Setup inicial, entorno virtual y dependencias:

```bash
git clone https://github.com/aab626/desarrollo_web_augusto_aguayo.git
cd ./desarrollo_web_augusto_aguayo
git checkout tarea-3
```

```bash
python -m venv ./venv
source ./venv/bin/activate
python -m pip install -r ./requirements.txt
```

Luego, se deben crear la base de datos y el usuario, mediante el siguiente script SQL:

```sql
-- Create database
CREATE DATABASE IF NOT EXISTS tarea2 DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;

-- Create user and assign permissions on tarea2 db
CREATE USER IF NOT EXISTS 'cc5002' @'localhost' IDENTIFIED BY 'programacionweb';
GRANT ALL ON tarea2.* TO cc5002 @localhost;
```

La creación de tablas se abstrae mediante el script `database/init_db.py`:

```bash
python -m database.init_db
```

Finalmente, se puede ejecutar la aplicación en modo depuración:

```bash
flask --debug run
```

Por defecto, la aplicación corre en [`http://127.0.0.1:5000`](http://127.0.0.1:5000).
