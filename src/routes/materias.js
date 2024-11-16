const express = require('express');
const router = express.Router();
const queries = require('../repositories/MateriasRepository'); // Repositorio de materias

// Endpoint para mostrar todas las materias
router.get('/', async (req, res) => {
    try {
        const materias = await queries.obtenerTodasLasMaterias();
        res.render('materias/listado', { 
            materias, 
            success: req.flash('success'), // Mostrar mensaje de éxito
            error: req.flash('error')      // Mostrar mensaje de error
        });
    } catch (error) {
        console.error('Error obteniendo las materias:', error);
        req.flash('error', 'Error al cargar la lista de materias');
        res.redirect('/materias');
    }
});

// Endpoint para mostrar el formulario para agregar una nueva materia
router.get('/agregar', (req, res) => {
    res.render('materias/agregar', { 
        success: req.flash('success'), 
        error: req.flash('error') 
    });
});

// Endpoint para agregar una nueva materia
router.post('/agregar', async (req, res) => {
    const { materia } = req.body;

    if (!materia) {
        req.flash('error', 'El campo materia es obligatorio');
        return res.redirect('/materias/agregar');
    }

    try {
        const result = await queries.agregarMateria({ materia });

        if (result) {
            req.flash('success', 'Materia agregada con éxito');
            res.redirect('/materias');
        } else {
            req.flash('error', 'No se pudo agregar la materia');
            res.redirect('/materias/agregar');
        }
    } catch (error) {
        console.error('Error al agregar materia:', error);
        req.flash('error', 'Hubo un error al agregar la materia');
        res.redirect('/materias/agregar');
    }
});

// Endpoint para mostrar el formulario de edición de una materia
router.get('/editar/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const materia = await queries.obtenerMateriaPorId(id);
        if (!materia) {
            req.flash('error', 'Materia no encontrada');
            return res.redirect('/materias');
        }
        res.render('materias/editar', { 
            materia,
            success: req.flash('success'),
            error: req.flash('error')
        });
    } catch (error) {
        console.error('Error obteniendo la materia:', error);
        req.flash('error', 'Error al cargar la página de edición');
        res.redirect('/materias');
    }
});

// Endpoint para actualizar una materia
router.post('/editar/:id', async (req, res) => {
    const { id } = req.params;
    const { materia } = req.body;

    try {
        const result = await queries.actualizarMateria(id, { materia });

        if (result) {
            req.flash('success', 'Materia actualizada con éxito');
            res.redirect('/materias');
        } else {
            req.flash('error', 'No se pudo actualizar la materia');
            res.redirect(`/materias/editar/${id}`);
        }
    } catch (error) {
        console.error('Error al actualizar la materia:', error);
        req.flash('error', 'Hubo un error al actualizar la materia');
        res.redirect(`/materias/editar/${id}`);
    }
});

// Endpoint para eliminar una materia
router.get('/eliminar/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await queries.eliminarMateria(id);

        if (result) {
            req.flash('success', 'Materia eliminada con éxito');
        } else {
            req.flash('error', 'No se pudo eliminar la materia');
        }

        res.redirect('/materias');
    } catch (error) {
        console.error('Error al eliminar la materia:', error);
        req.flash('error', 'Hubo un error al eliminar la materia');
        res.redirect('/materias');
    }
});

module.exports = router;