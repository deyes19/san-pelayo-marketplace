const formulario =
    document.getElementById('formEspacio');

const tabla =
    document.getElementById('tablaEspacios');

const mensaje =
    document.getElementById('mensaje');

const btnGuardar =
    document.getElementById('btnGuardar');

const btnCancelar =
    document.getElementById('btnCancelar');


// Variable para saber si estamos editando
let espacioEditandoId = null;



// ==========================================
// READ
// Mostrar espacios registrados
// ==========================================

async function cargarEspacios() {

    try {

        const respuesta =
            await fetch('/espacios');

        const espacios =
            await respuesta.json();


        tabla.innerHTML = '';


        espacios.forEach(espacio => {

            const fila =
                document.createElement('tr');


            fila.innerHTML = `

                <td>${espacio.id}</td>

                <td>${espacio.nombre}</td>

                <td>${espacio.tipo}</td>

                <td>${espacio.capacidad}</td>

                <td>${espacio.estado}</td>

                <td>

                    <button
                        class="btn-editar"
                        onclick="editarEspacio(${espacio.id})"
                    >
                        Editar
                    </button>


                    <button
                        class="btn-eliminar"
                        onclick="eliminarEspacio(${espacio.id})"
                    >
                        Eliminar
                    </button>

                </td>
            `;


            tabla.appendChild(fila);

        });


    } catch (error) {

        console.error(error);

        mensaje.textContent =
            'Error al cargar los espacios';

    }

}



// ==========================================
// CREATE / UPDATE
// Formulario
// ==========================================

formulario.addEventListener(
    'submit',
    async (evento) => {

        evento.preventDefault();


        const nombre =
            document.getElementById('nombre').value;

        const tipo =
            document.getElementById('tipo').value;

        const capacidad =
            document.getElementById('capacidad').value;

        const estado =
            document.getElementById('estado').value;


        const datosEspacio = {

            nombre,

            tipo,

            capacidad: Number(capacidad),

            estado

        };


        try {

            let respuesta;


            // ==================================
            // Si NO estamos editando → CREATE
            // ==================================

            if (espacioEditandoId === null) {

                respuesta =
                    await fetch(
                        '/espacios',
                        {

                            method: 'POST',

                            headers: {
                                'Content-Type':
                                    'application/json'
                            },

                            body:
                                JSON.stringify(
                                    datosEspacio
                                )

                        }
                    );

            }


            // ==================================
            // Si estamos editando → UPDATE
            // ==================================

            else {

                respuesta =
                    await fetch(
                        `/espacios/${espacioEditandoId}`,
                        {

                            method: 'PUT',

                            headers: {
                                'Content-Type':
                                    'application/json'
                            },

                            body:
                                JSON.stringify(
                                    datosEspacio
                                )

                        }
                    );

            }


            const resultado =
                await respuesta.json();


            if (!respuesta.ok) {

                mensaje.textContent =
                    'Ocurrió un error';

                return;

            }


            // Mensaje dependiendo de la operación

            if (espacioEditandoId === null) {

                mensaje.textContent =
                    'Espacio creado correctamente';

            }

            else {

                mensaje.textContent =
                    'Espacio actualizado correctamente';

            }


            limpiarFormulario();


            // Volvemos a consultar PostgreSQL
            cargarEspacios();


        } catch (error) {

            console.error(error);

            mensaje.textContent =
                'Error al guardar el espacio';

        }

    }
);



// ==========================================
// EDITAR
// Cargar información en el formulario
// ==========================================

async function editarEspacio(id) {

    try {

        const respuesta =
            await fetch('/espacios');

        const espacios =
            await respuesta.json();


        const espacio =
            espacios.find(
                espacio => espacio.id === id
            );


        if (!espacio) {

            mensaje.textContent =
                'Espacio no encontrado';

            return;

        }


        // Colocamos los datos en el formulario

        document.getElementById('nombre').value =
            espacio.nombre;

        document.getElementById('tipo').value =
            espacio.tipo;

        document.getElementById('capacidad').value =
            espacio.capacidad;

        document.getElementById('estado').value =
            espacio.estado;


        // Guardamos el ID

        espacioEditandoId = id;


        // Cambiamos el formulario a modo edición

        btnGuardar.textContent =
            'Actualizar espacio';

        btnCancelar.style.display =
            'block';


        mensaje.textContent =
            `Editando espacio ID ${id}`;


        // Subimos hacia el formulario

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });


    } catch (error) {

        console.error(error);

        mensaje.textContent =
            'Error al cargar el espacio';

    }

}



// ==========================================
// DELETE
// Eliminar un espacio
// ==========================================

async function eliminarEspacio(id) {

    const confirmar =
        confirm(
            '¿Seguro que deseas eliminar este espacio?'
        );


    if (!confirmar) {

        return;

    }


    try {

        const respuesta =
            await fetch(
                `/espacios/${id}`,
                {
                    method: 'DELETE'
                }
            );


        const resultado =
            await respuesta.json();


        if (!respuesta.ok) {

            mensaje.textContent =
                'No se pudo eliminar';

            return;

        }


        mensaje.textContent =
            'Espacio eliminado correctamente';


        // Actualizamos la tabla

        cargarEspacios();


    } catch (error) {

        console.error(error);

        mensaje.textContent =
            'Error al eliminar el espacio';

    }

}



// ==========================================
// CANCELAR EDICIÓN
// ==========================================

btnCancelar.addEventListener(
    'click',
    () => {

        limpiarFormulario();

        mensaje.textContent =
            'Edición cancelada';

    }
);



// ==========================================
// LIMPIAR FORMULARIO
// ==========================================

function limpiarFormulario() {

    formulario.reset();

    espacioEditandoId = null;

    btnGuardar.textContent =
        'Guardar espacio';

    btnCancelar.style.display =
        'none';

}



// ==========================================
// Cargar datos al abrir la página
// ==========================================

cargarEspacios();