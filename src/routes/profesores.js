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
        response.status(500).send('Error al cargar la lista de profesores');
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
        return response.render('profesores/agregar', { error: 'Todos los campos son obligatorios' });
    }

    try {
        const result = await queries.agregarProfesor({ nombre, apellido, fecha_nacimiento, profesion, genero, email });

        if (result) {
            console.log('Profesor agregado con éxito');
            response.redirect('/profesores');
        } else {
            response.render('profesores/agregar', { error: 'No se pudo agregar el profesor' });
        }
    } catch (error) {
        console.error('Error al agregar profesor:', error);
        response.render('profesores/agregar', { error: 'Hubo un error al agregar el profesor' });
    }
});

// Endpoint para mostrar el formulario de edición
// Endpoint para mostrar el formulario de edición del profesor
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
            console.log('Profesor actualizado con éxito');
            res.redirect('/profesores');  // Redirige al listado de profesores
        } else {
            res.render('profesores/editar', { error: 'No se pudo actualizar el profesor' });
        }
    } catch (error) {
        console.error('Error al actualizar el profesor:', error);
        res.render('profesores/editar', { error: 'Hubo un error al actualizar el profesor' });
    }
});


// Endpoint para actualizar un profesor
router.post('/editar/:id', async (req, res) => {
    const { id } = req.params; // ID del profesor
    const { nombre, apellido, fecha_nacimiento, profesion, genero, email } = req.body;

    try {
        const result = await queries.actualizarProfesor(id, { nombre, apellido, fecha_nacimiento, profesion, genero, email });

        if (result) {
            console.log('Profesor actualizado con éxito');
            res.redirect('/profesores');
        } else {
            res.render('profesores/editar', { error: 'No se pudo actualizar el profesor' });
        }
    } catch (error) {
        console.error('Error al actualizar el profesor:', error);
        res.render('profesores/editar', { error: 'Hubo un error al actualizar el profesor' });
    }
});

// Endpoint para eliminar un profesor
router.get('/eliminar/:id', async (request, response) => {
    const { id } = request.params; // ID del profesor
    try {
        const result = await queries.eliminarProfesor(id);

        if (result) {
            console.log('Profesor eliminado con éxito');
        }

        response.redirect('/profesores');
    } catch (error) {
        console.error('Error al eliminar el profesor:', error);
        response.status(500).send('Hubo un error al eliminar el profesor');
    }
});

module.exports = router;
