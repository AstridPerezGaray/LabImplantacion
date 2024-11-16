const express = require('express');
const router = express.Router();
const queries = require('../repositories/CarrerasRepository');

// Endpoint para mostrar todas las carreras
router.get('/', async (request, response) => {
    try {
        const carreras = await queries.ObtenerTodasLascarreras();
        response.render('carreras/listado', { carreras });
    } catch (error) {
        console.error('Error al obtener las carreras:', error);
        response.status(500).send('Error al obtener las carreras');
    }
});

// Endpoint para mostrar el formulario para agregar una nueva carrera
router.get('/agregar', async (request, response) => {
    try {
        response.render('carreras/agregar');
    } catch (error) {
        console.error('Error al cargar el formulario de agregar carrera:', error);
        response.status(500).send('Error al cargar el formulario');
    }
});

// Endpoint para agregar una nueva carrera
// En carreras.js
router.post('/agregar', async (req, res) => {
    const { idcarrera, carrera } = req.body;

    try {
        // Verificar si ya existe el idcarrera en la base de datos
        const existingCarrera = await queries.ObtenerCarreraPorId(idcarrera);
        
        if (existingCarrera) {
            // Si ya existe, mostrar un error o un mensaje al usuario
            req.flash('error', `La carrera con ID ${idcarrera} ya existe.`);
            return res.redirect('/carreras/agregar');
        }

        // Si no existe, proceder con la inserción
        const nuevaCarrera = { idcarrera, carrera };
        await queries.insertarCarrera(nuevaCarrera);
        req.flash('success', 'Carrera agregada con éxito');
        res.redirect('/carreras');
    } catch (error) {
        console.error('Error al agregar la carrera:', error);
        req.flash('error', 'Hubo un error al agregar la carrera');
        res.redirect('/carreras/agregar');
    }
});



// Endpoint para mostrar el formulario de edición de una carrera
router.get('/editar/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const carrera = await queries.ObtenerCarreraPorId(id);
        if (!carrera) {
            return res.status(404).send('Carrera no encontrada');
        }
        res.render('carreras/editar', { carrera });
    } catch (error) {
        console.error('Error al obtener la carrera para editar:', error);
        res.status(500).send('Error al cargar la página de edición');
    }
});

// Endpoint para actualizar una carrera
router.post('/editar/:id', async (req, res) => {
    const { id } = req.params;
    const { carrera } = req.body;  // El nuevo nombre de la carrera

    try {
        const result = await queries.actualizarCarreras(id, carrera);
        if (result) {
            console.log('Carrera actualizada con éxito');
            res.redirect('/carreras');  // Redirige a la lista de carreras
        } else {
            res.render('carreras/editar', { error: 'No se pudo actualizar la carrera' });
        }
    } catch (error) {
        console.error('Error al actualizar la carrera:', error);
        res.render('carreras/editar', { error: 'Hubo un error al actualizar la carrera' });
    }
});

// Endpoint para eliminar una carrera
router.get('/eliminar/:idcarrera', async (request, response) => {
    const { idcarrera } = request.params;

    try {
        const resultado = await queries.eliminarCarrera(idcarrera);
        if (resultado) {
            request.flash('success', 'Carrera eliminada correctamente');
        } else {
            request.flash('error', 'Error al eliminar la carrera');
        }
        response.redirect('/carreras');
    } catch (error) {
        console.error('Error al eliminar la carrera:', error);
        request.flash('error', 'Error al eliminar la carrera');
        response.redirect('/carreras');
    }
});

module.exports = router;
