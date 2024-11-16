const express = require('express');
const router = express.Router();
const queries = require('../repositories/EstudianteRepository');
const crypto = require('crypto'); // Para generar el ID único

// Endpoint para mostrar todos los estudiantes
router.get('/', async (request, response) => {
    try {
        const estudiantes = await queries.obtenerTodosLosEstudiantes();
        response.render('estudiantes/listado', { estudiantes }); // Mostramos el listado de estudiantes
    } catch (error) {
        console.error('Error al obtener los estudiantes:', error);
        request.flash('error', 'Error al obtener los estudiantes');
        response.redirect('/estudiantes');
    }
});

// Endpoint para mostrar el formulario para agregar un estudiante
router.get('/agregar', async (request, response) => {
    try {
        const carreras = await queries.ObtenerCarreras(); // Obtener carreras disponibles
        response.render('estudiantes/agregar', { carreras });
    } catch (error) {
        console.error('Error obteniendo carreras:', error);
        request.flash('error', 'Error al obtener las carreras');
        response.redirect('/estudiantes');
    }
});

// Endpoint para agregar un nuevo estudiante
router.post('/agregar', async (request, response) => {
    const { nombre, apellido, email, usuario, idcarrera } = request.body;

    if (!nombre || !apellido || !email || !usuario || !idcarrera) {
        request.flash('error', 'Todos los campos son obligatorios');
        return response.redirect('/estudiantes/agregar');
    }

    try {
        const idestudiante = crypto.randomBytes(6).toString('hex');
        const result = await queries.agregarEstudiante({
            idestudiante,
            nombre,
            apellido,
            email,
            usuario,
            idcarrera
        });

        if (result) {
            request.flash('success', 'Estudiante agregado con éxito');
            response.redirect('/estudiantes');
        } else {
            request.flash('error', 'No se pudo agregar el estudiante');
            response.redirect('/estudiantes/agregar');
        }
    } catch (error) {
        request.flash('error', 'Hubo un error al agregar el estudiante');
        response.redirect('/estudiantes/agregar');
    }
});

// Endpoint para mostrar el formulario de edición de un estudiante
router.get('/editar/:id', async (req, res) => {
    const { id } = req.params; // Obtener el id del estudiante de la URL
    try {
        const estudiante = await queries.obtenerEstudiantePorId(id); // Obtener datos del estudiante
        const carreras = await queries.ObtenerCarreras();
        if (!estudiante) {
            return res.status(404).send('Estudiante no encontrado');
        }
        res.render('estudiantes/editar', { estudiante, carreras });
    } catch (error) {
        console.error('Error obteniendo el estudiante o las carreras:', error);
        res.status(500).send('Error al cargar la página de edición');
    }
});

// Endpoint para actualizar un estudiante
router.post('/editar/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, email, usuario, idcarrera } = req.body;
    
    try {
        const result = await queries.actualizarEstudiante(id, { nombre, apellido, email, usuario, idcarrera });
        if (result) {
            req.flash('success', 'Estudiante actualizado con éxito');
            res.redirect('/estudiantes');
        } else {
            req.flash('error', 'No se pudo actualizar el estudiante');
            res.redirect(`/estudiantes/editar/${id}`);
        }
    } catch (error) {
        req.flash('error', 'Hubo un error al actualizar el estudiante');
        res.redirect(`/estudiantes/editar/${id}`);
    }
});

// Endpoint que permite eliminar un estudiante
router.get('/eliminar/:idestudiante', async (request, response) => {
    const { idestudiante } = request.params;
    
    try {
        const result = await queries.eliminarEstudiante(idestudiante);
        if (result) {
            request.flash('success', 'Estudiante eliminado correctamente');
        } else {
            request.flash('error', 'Error al eliminar el estudiante');
        }
        response.redirect('/estudiantes');
    } catch (error) {
        console.error('Error al eliminar el estudiante:', error);
        request.flash('error', 'Hubo un error al eliminar el estudiante');
        response.redirect('/estudiantes');
    }
});

module.exports = router;
