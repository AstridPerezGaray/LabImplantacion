const pool = require('../config/databaseController'); // Asegúrate de que la ruta sea correcta

module.exports = {
    // Consulta para obtener todos los estudiantes
    obtenerTodosLosEstudiantes: async () => {
        try {
            const result = await pool.query('SELECT * FROM estudiantes');
            return result;
        } catch (error) {
            console.error('Ocurrió un problema al consultar la lista de estudiantes: ', error);
        }
    },

    // Obtener estudiante por ID
    obtenerEstudiantePorId: async (idestudiante) => {
        try {
            const result = await pool.query('SELECT * FROM estudiantes WHERE idestudiante = ?', [idestudiante]);
            return result.length > 0 ? result[0] : null; // Devuelve el estudiante si existe, de lo contrario null
        } catch (error) {
            console.error('Ocurrió un problema al consultar el estudiante por ID: ', error);
            throw error; // Propaga el error para ser manejado en el controlador
        }
    },

    // Obtener todas las carreras
    ObtenerCarreras: async () => {
        try {
            const rows = await pool.query('SELECT * FROM carreras');
            return rows; // Asegúrate de devolver las filas del resultado
        } catch (error) {
            console.error('Ocurrió un problema al consultar la lista de carreras: ', error);
            throw error; // Propaga el error para manejarlo en el controlador si es necesario
        }
    },

    // Agregar un estudiante
    agregarEstudiante: async (estudiante) => {
        const { idestudiante, nombre, apellido, email, usuario, idcarrera } = estudiante;
        try {
            console.log('Datos para insertar:', { idestudiante, nombre, apellido, email, usuario, idcarrera });

            const result = await pool.query(
                'INSERT INTO estudiantes (idestudiante, nombre, apellido, email, usuario, idcarrera) VALUES (?, ?, ?, ?, ?, ?)',
                [idestudiante, nombre, apellido, email, usuario, idcarrera]
            );

            console.log('Resultado de la inserción:', result);
            return result.affectedRows > 0; // Retorna true si la inserción fue exitosa
        } catch (error) {
            console.error('Error durante la inserción en la base de datos:', error);
            throw error;
        }
    },

    // Actualizar un estudiante
    actualizarEstudiante: async (idestudiante, estudiante) => {
        try {
            const result = await pool.query(
                'UPDATE estudiantes SET nombre = ?, apellido = ?, email = ?, idcarrera = ?, usuario = ? WHERE idestudiante = ?',
                [estudiante.nombre, estudiante.apellido, estudiante.email, estudiante.idcarrera, estudiante.usuario, idestudiante]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error al actualizar el estudiante:', error);
            throw error;
        }
    },

    // Eliminar un estudiante
    eliminarEstudiante: async (idestudiante) => {
        try {
            const result = await pool.query('DELETE FROM estudiantes WHERE idestudiante = ?', [idestudiante]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error al eliminar el registro', error);
        }
    }
};
