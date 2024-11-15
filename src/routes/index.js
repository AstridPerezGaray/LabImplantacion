const express = require('express');
const router = express.Router();
const EstudianteRepository = require('../repositories/EstudianteRepository'); // Repositorio de estudiantes

// Configuración de la ruta inicial de la aplicación
router.get('/', async (req, res) => {
    try {
        // Obtener estudiantes y carreras desde los repositorios
        const lstEstudiantes = await EstudianteRepository.obtenerTodosLosEstudiantes();

        console.log('Listado de estudiantes:', lstEstudiantes);

        // Renderizar la vista principal con los datos de estudiantes y carreras
        res.render('index', { estudiantes: lstEstudiantes, carreras: lstCarreras }); // Asegúrate de tener una vista llamada 'index.hbs'
    } catch (error) {
        console.error('Error al cargar datos:', error);
        res.status(500).send('Error al cargar los datos iniciales');
    }
});

module.exports = router;
