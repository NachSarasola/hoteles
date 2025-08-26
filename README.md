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
