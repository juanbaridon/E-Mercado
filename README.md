# Modo Oscuro
Al hacer click en el icono de la luna o del sol se guarda en localStorage la variable “mode” con el valor “light” o “dark”. La función changeMode() tiene en cuenta el valor de esta variable y le agrega a los elementos con fondo y texto blanco o negro, asignados por clases de bootstrap, nuevas clases con los colores correspondientes. También cambia el color de fondo del body y las imágenes utilizadas en el login y encabezado del index.

Al guardar en localStorage la variable “mode” el tema se mantiene cuando cambiamos de página y cuando la cerramos.

Para mantener el tema en los elementos mostrados a través de JavaScript (listado de categorías, productos, etc) se llama a una función con el mismo funcionamiento que changeMode(), pero que afecta a los elementos listados, dentro de la función encargada de listar la información del JSON.
