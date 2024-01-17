// Función para obtener los datos de una página y hacer clic en el botón "Siguiente"
function obtenerDatosYAvanzar(tabla, botonSiguiente, datos) {
    // Obtener los datos de la página actual
    var datosPagina = tabla.rows().data().toArray();

    // Agregar los datos al array
    Array.prototype.push.apply(datos, datosPagina);

    // Hacer clic en el botón "Siguiente"
    $(botonSiguiente).click();

    // Devolver una promesa que se resolverá cuando se complete la transición de la página
    return new Promise(resolve => {
        // Escuchar el evento draw.dt, que se dispara después de cambiar la página
        tabla.one('draw.dt', function () {
            // Resolver la promesa
            resolve();
        });
    });
}

// Función principal para recopilar todos los datos
async function recopilarDatos() {
    // Inicializar DataTable
    var miTabla = $('#datos_wltp').DataTable({
        "paging": false, // Desactivar la paginación por defecto
        // Otras opciones según tu configuración
    });

    // Array para almacenar todos los datos como objetos
    var informacionTabla = [];

    // Función recursiva para obtener datos y avanzar a la siguiente página
    async function obtenerYAvanzarRecursivo() {
        // Esperar a que se completen los datos y la transición de página
        await obtenerDatosYAvanzar(miTabla, '#datos_wltp_next a', informacionTabla);

        // Verificar si hay más páginas y el botón "Siguiente" no tiene la clase "disabled"
        if (
            miTabla.page.info().pages > miTabla.page.info().page &&
            !$('#datos_wltp_next').hasClass('disabled')
        ) {
            // Si hay más páginas y el botón "Siguiente" no está deshabilitado, llamar recursivamente
            await obtenerYAvanzarRecursivo();
        } else {
            // Si no hay más páginas o el botón "Siguiente" está deshabilitado, crear y descargar el archivo JSON
            descargarArchivoJSON(informacionTabla);
        }
    }

    function obtenerContenidoElemento(html, selector, esAtributo) {
        // Crear un elemento temporal para procesar el HTML
        var tempElement = document.createElement('div');
        tempElement.innerHTML = html;

        // Seleccionar el elemento especificado por el selector
        var elemento = tempElement.querySelector(selector);

        // Verificar si se encontró el elemento
        if (elemento) {
            // Si se especifica obtener un atributo, retornar el valor del atributo
            if (esAtributo) {
                return elemento.getAttribute('title') || '';
            } else {
                // Si no se especifica obtener un atributo, retornar el texto del elemento
                return elemento.innerText || '';
            }
        } else {
            // Si no se encuentra el elemento, retornar una cadena vacía
            return '';
        }
    }

    // Función para crear y descargar un archivo JSON
    function descargarArchivoJSON(datos) {
        // Mapear cada fila a un objeto con propiedades en inglés
        var datosMapeados = datos.map(function (fila) {
            return {
                vehicle: obtenerContenidoElemento(fila[0], 'a', false), // Obtener el texto del tag 'a'
                classification: obtenerContenidoElemento(fila[1], 'img', true).replace('Clasificación: ', ''), // Obtener el atributo 'title' del tag 'img'
                consumptionMin: fila[2],
                consumptionMax: fila[3],
                emissionsMin: fila[4],
                emissionsMax: fila[5],
                id: fila[6]
            };
        });

        var contenido = JSON.stringify(datosMapeados, null, 2);
        var blob = new Blob([contenido], { type: 'application/json' });
        var url = URL.createObjectURL(blob);

        // Crear un enlace para descargar el archivo
        var a = document.createElement('a');
        a.href = url;
        a.download = 'informacionTabla.json';
        document.body.appendChild(a);

        // Hacer clic en el enlace para iniciar la descarga
        a.click();

        // Eliminar el enlace después de la descarga
        document.body.removeChild(a);
    }

    // Iniciar el proceso
    await obtenerYAvanzarRecursivo();
}

// Llamar a la función principal
recopilarDatos();
