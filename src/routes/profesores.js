const express = require('express');
const router = express.Router();
const queries = require('../repositories/ProfesoresRepository'); // Repositorio de profesores

// Endpoint para mostrar todos los profesores
router.get('/', async (request, response) => {
    try {
        const profesores = await queries.obtenerTodosLosProfesores();
        response.render('profesores/listado', { profesores }); // Renderiza la vista con la lista de profesores
    } catch (error) {
        console.error('Error obteniendo profesores:', error);
        request.flash('error', 'Error al obtener la lista de profesores');
        response.redirect('/profesores');
    }
});

// Endpoint para mostrar el formulario para agregar un profesor
router.get('/agregar', (request, response) => {
    response.render('profesores/agregar'); // Renderiza la vista para agregar un profesor
});

// Endpoint para agregar un nuevo profesor
router.post('/agregar', async (request, response) => {
    const { nombre, apellido, fecha_nacimiento, profesion, genero, email } = request.body;

    // Validar campos obligatorios
    if (!nombre || !apellido || !fecha_nacimiento || !profesion || !genero || !email) {
        request.flash('error', 'Todos los campos son obligatorios');
        return response.redirect('/profesores/agregar');
    }

    try {
        const result = await queries.agregarProfesor({ nombre, apellido, fecha_nacimiento, profesion, genero, email });

        if (result) {
            request.flash('success', 'Profesor agregado con éxito');
            response.redirect('/profesores');
        } else {
            request.flash('error', 'No se pudo agregar el profesor');
            response.redirect('/profesores/agregar');
        }
    } catch (error) {
        console.error('Error al agregar profesor:', error);
        request.flash('error', 'Hubo un error al agregar el profesor');
        response.redirect('/profesores/agregar');
    }
});

// Endpoint para mostrar el formulario de edición
router.get('/editar/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const profesor = await queries.obtenerProfesorPorId(id);
        if (!profesor) {
            return res.status(404).send('Profesor no encontrado');
        }
        res.render('profesores/editar', { profesor });
    } catch (error) {
        console.error('Error obteniendo el profesor:', error);
        res.status(500).send('Error al cargar la página de edición');
    }
});

// Endpoint para actualizar un profesor (Ruta POST para modificación)
router.post('/modificar/:id', async (req, res) => {
    const { id } = req.params;  // ID del profesor
    const { nombre, apellido, fecha_nacimiento, profesion, genero, email } = req.body;

    try {
        const result = await queries.actualizarProfesor(id, { nombre, apellido, fecha_nacimiento, profesion, genero, email });

        if (result) {
            req.flash('success', 'Profesor actualizado con éxito');  // Cambié 'request' por 'req'
            res.redirect('/profesores');
        } else {
            req.flash('error', 'No se pudo actualizar el profesor');  // Cambié 'request' por 'req'
            res.redirect('/profesores/editar/' + id);
        }
    } catch (error) {
        console.error('Error al actualizar el profesor:', error);
        req.flash('error', 'Hubo un error al actualizar el profesor');  // Cambié 'request' por 'req'
        res.redirect('/profesores/editar/' + id);
    }
});


// Endpoint para eliminar un profesor
router.get('/eliminar/:id', async (request, response) => {
    const { id } = request.params; // ID del profesor
    try {
        const result = await queries.eliminarProfesor(id);

        if (result) {
            request.flash('success', 'Profesor eliminado correctamente');
        } else {
            request.flash('error', 'No se pudo eliminar el profesor');
        }

        response.redirect('/profesores');
    } catch (error) {
        console.error('Error al eliminar el profesor:', error);
        request.flash('error', 'Hubo un error al eliminar el profesor');
        response.redirect('/profesores');
    }
});

module.exports = router;
