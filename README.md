<!--
  Purpose: Project documentation for the hoteles repository.
  Author: ChatGPT
-->

# Hoteles

Estructura básica para el proyecto Hoteles.

## Configuración

Para iniciar, duplica el archivo de ejemplo y renómbralo:

```bash
cp config.example.json config.json
```

Luego reemplaza los valores `<REPLACE_ME>` y `<REPLACE_ME_URL>` por la información real del sitio.

## Nuevos campos

- **site.languages**: define los idiomas disponibles del sitio como un arreglo, por ejemplo `["es", "en"]`. Puedes agregar o quitar códigos de idioma según lo necesites.
- **policies**: lista de políticas del sitio (términos, privacidad, etc.). Cada elemento requiere un `label` por idioma y un `url`.
- **social**: enlaces a redes sociales. Usa `platform` para identificar la red y `url` para la dirección.

Duplica las entradas necesarias y reemplaza los valores `<REPLACE_ME>` y `<REPLACE_ME_URL>` con la información correspondiente.

## Traducciones

Los textos de la interfaz se cargan desde archivos JSON ubicados en la carpeta `i18n`. Cada archivo debe nombrarse con el código de idioma, por ejemplo `i18n/fr.json`, y seguir la estructura de los archivos existentes (`es.json`, `en.json`).

Para agregar un nuevo idioma:

1. Crea el archivo `i18n/<codigo>.json` con todas las claves necesarias.
2. Añade el código del idioma al arreglo `site.languages` en `config.json`.
3. Si deseas que sea el idioma predeterminado, actualiza `site.defaultLang`.

Si falta alguna clave en un idioma, el sitio usará automáticamente el valor del idioma por defecto.

## Modo de alto contraste

El archivo `main.js` verifica el contraste de los colores definidos y, si alguna
combinación no cumple con el nivel AA de las WCAG (4.5:1), añade la clase
global `high-contrast` al elemento `<html>` para sustituir las variables CSS por
una paleta accesible.

### Activación manual

```html
<html class="high-contrast">
```

O desde la consola de DevTools:

```javascript
document.documentElement.classList.add('high-contrast');
```

### Pruebas con DevTools

Abre las herramientas de desarrollador, selecciona el elemento `<html>` y
agrega o elimina la clase `high-contrast` para observar los cambios en las
variables CSS y comprobar el contraste.

## Widget de reserva

La sección `#booking` en `index.html` contiene un `<div>` vacío con `id="booster-root"`
marcado con `data-widget="direct-booking-placeholder"`. Un script externo debe
montar el widget de reserva dentro de este elemento, por ejemplo:

```html
<script src="https://example.com/direct-booking.js"></script>
<script>
  window.DirectBooking.mount('#booster-root');
</script>
```

Este snippet busca el contenedor y reemplaza su contenido con el widget real de
reserva.
