const express = require('express');
const router = express.Router();
const queries = require('../repositories/EstudianteRepository');
const carrerasQuery = require('../repositories/CarrerasRepository');
const { isLoggedIn } = require('../lib/auth');

// Endpoint para mostrar todos los estudiantes
router.get('/', isLoggedIn, async (request, response) => {
    const estudiantes = await queries.obtenerTodosLosEstudiantes();
    response.render('estudiantes/listado', { estudiantes });
});

// Endpoint para mostrar el formulario de agregar un nuevo estudiante
router.get('/agregar', isLoggedIn, async (request, response) => {
    const lstCarreras = await carrerasQuery.obtenerTodasLasCarreras();
    response.render('estudiantes/agregar', { lstCarreras });
});

// Endpoint para agregar un estudiante
router.post('/agregar', isLoggedIn, async (request, response) => {
    const { nombre, apellido, email, usuario, idcarrera } = request.body;

    if (!nombre || !apellido || !email || !idcarrera || !usuario) {
        request.flash('error', 'Todos los campos son obligatorios');
        return response.redirect('/estudiantes/agregar');
    }

    const nuevoEstudiante = { nombre, apellido, email, usuario, idcarrera };
    const resultado = await queries.agregarEstudiante(nuevoEstudiante);

    if (resultado) {
        request.flash('success', 'Registro insertado con éxito');
    } else {
        request.flash('error', 'Ocurrió un problema al guardar el registro');
    }
    response.redirect('/estudiantes');
});

// Endpoint para mostrar el formulario de modificación
router.get('/editar/:idestudiante', isLoggedIn, async (request, response) => {
    const { idestudiante } = request.params;
    const estudiante = await queries.obtenerEstudiantePorId(idestudiante);

    if (estudiante) {
        const lstCarreras = await carrerasQuery.obtenerTodasLasCarreras();
        response.render('estudiantes/editar', { lstCarreras, estudiante });
    } else {
        response.redirect('/estudiantes');
    }
});

// Endpoint para modificar un estudiante
// Endpoint para modificar el estudiante
router.post('/editar/:id', isLoggedIn, async (request, response) => {
    const { id } = request.params;
    const { idestudiante, nombre, apellido, email, idcarrera, usuario } = request.body;
    const datosModificados = { nombre, apellido, email, idcarrera, usuario };

    const resultado = await queries.actualizarEstudiante(idestudiante, datosModificados);

    if (resultado) {
        request.flash('success', 'Registro actualizado con éxito');
    } else {
        request.flash('error', 'Ocurrió un problema al actualizar el registro');
    }

    response.redirect('/estudiantes');
});


// Endpoint para eliminar un estudiante
router.get('/eliminar/:idestudiante', isLoggedIn, async (request, response) => {
    const { idestudiante } = request.params;
    const resultado = await queries.eliminarEstudiante(idestudiante);
    if (resultado > 0) {
        request.flash('success', 'Registro eliminado con éxito');
    } else {
        request.flash('error', 'Ocurrió un problema al eliminar el registro');
    }
    response.redirect('/estudiantes');
});

module.exports = router;
