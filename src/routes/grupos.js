const express = require('express');
const router = express.Router();
const queries = require('../repositories/GrupoRepository');
const estudiantesQuery = require('../repositories/EstudianteRepository');

// Endpoint para mostrar todos los grupos
router.get('/', async (request, response) => {
    try {
        const grupos = await queries.obtenerTodosLosGrupos();
        response.render('grupos/listado', { grupos });
    } catch (error) {
        console.error('Error al obtener los grupos:', error);
        response.status(500).send('Error al obtener los grupos');
    }
});

// Endpoint que permite mostrar la pantalla de asignación de grupo
router.get('/asignargrupo/:idgrupo', async (request, response) => {
    const { idgrupo } = request.params;
    try {
        const lstEstudiantes = await estudiantesQuery.obtenerTodosLosEstudiantes();
        response.render('grupos/asignargrupo', { lstEstudiantes, idgrupo });
    } catch (error) {
        console.error('Error al obtener los estudiantes:', error);
        response.status(500).send('Hubo un problema al obtener los estudiantes');
    }
});

// Endpoint para asignar estudiantes a un grupo
router.post('/asignargrupo', async (request, response) => {
    const data = request.body;
    let resultado = null;

    try {
        const result = processDataFromForm(data);

        // Asigna cada estudiante al grupo
        for (const tmp of result.grupo_estudiantes) {
            resultado = await queries.asignarGrupo(tmp); // Llamamos a la función para asignar el grupo
        }

        if (resultado) {
            request.flash('success', 'Asignación de grupo realizada con éxito');
        } else {
            request.flash('error', 'Ocurrió un problema al realizar la asignación');
        }

        response.redirect('/grupos');
    } catch (error) {
        console.error('Error al asignar grupo:', error);
        request.flash('error', 'Hubo un error al asignar el grupo');
        response.redirect('/grupos');
    }
});

// Endpoint para agregar un nuevo grupo
router.post('/agregar', async (request, response) => {
    const { idgrupo, nombregrupo } = request.body;
    const nuevoGrupo = { idgrupo, nombregrupo };

    try {
        const resultado = await queries.agregarGrupo(nuevoGrupo);

        if (resultado) {
            request.flash('success', 'Grupo agregado con éxito');
        } else {
            request.flash('error', 'Hubo un error al agregar el grupo');
        }

        response.redirect('/grupos');
    } catch (error) {
        console.error('Error al agregar el grupo:', error);
        request.flash('error', 'Hubo un error al agregar el grupo');
        response.redirect('/grupos/agregar');
    }
});

// Endpoint para eliminar un grupo
router.get('/eliminar/:idgrupo', async (request, response) => {
    const { idgrupo } = request.params;

    try {
        const resultado = await queries.eliminarGrupo(idgrupo);

        if (resultado) {
            request.flash('success', 'Grupo eliminado correctamente');
        } else {
            request.flash('error', 'Error al eliminar el grupo');
        }

        response.redirect('/grupos');
    } catch (error) {
        console.error('Error al eliminar el grupo:', error);
        request.flash('error', 'Hubo un error al eliminar el grupo');
        response.redirect('/grupos');
    }
});

module.exports = router;

// Función para procesar los datos del formulario
function processDataFromForm(data) {
    const result = { grupo_estudiantes: [] };

    for (const key in data) {
        if (key.startsWith('grupo_estudiantes[')) {
            const match = key.match(/\[(\d+)\]\[(\w+)\]/);
            if (match) {
                const index = parseInt(match[1]);
                const property = match[2];
                if (!result.grupo_estudiantes[index]) {
                    result.grupo_estudiantes[index] = {};
                }
                result.grupo_estudiantes[index][property] = data[key];
            }
        } else {
            result[key] = data[key];
        }
    }

    return result;
}
