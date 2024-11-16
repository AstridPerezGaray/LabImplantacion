const pool = require('../config/databaseController'); // Conexión a la base de datos

module.exports = {
    // Obtener todos los profesores
    obtenerTodosLosProfesores: async () => {
        try {
            const result = await pool.query('SELECT * FROM profesores');
            return result; // Devuelve el resultado de la consulta
        } catch (error) {
            console.error('Ocurrió un problema al consultar la lista de profesores: ', error);
            throw error; // Propaga el error para manejarlo en el controlador
        }
    },

    // Obtener un profesor por ID
    obtenerProfesorPorId: async (idprofesor) => {
        try {
            const result = await pool.query('SELECT * FROM profesores WHERE idprofesor = ?', [idprofesor]);
            return result.length > 0 ? result[0] : null; // Devuelve el profesor si existe, de lo contrario null
        } catch (error) {
            console.error('Ocurrió un problema al consultar el profesor por ID: ', error);
            throw error; // Propaga el error
        }
    },

    // Agregar un profesor
    agregarProfesor: async (profesor) => {
        const { nombre, apellido, fecha_nacimiento, profesion, genero, email } = profesor;
        try {
            console.log('Datos para insertar:', { nombre, apellido, fecha_nacimiento, profesion, genero, email });

            const result = await pool.query(
                'INSERT INTO profesores (nombre, apellido, fecha_nacimiento, profesion, genero, email) VALUES (?, ?, ?, ?, ?, ?)',
                [nombre, apellido, fecha_nacimiento, profesion, genero, email]
            );

            console.log('Resultado de la inserción:', result);
            return result.affectedRows > 0; // Retorna true si la inserción fue exitosa
        } catch (error) {
            console.error('Error durante la inserción en la base de datos:', error);
            throw error;
        }
    },

    // Actualizar un profesor
    actualizarProfesor: async (idprofesor, profesor) => {
        const { nombre, apellido, fecha_nacimiento, profesion, genero, email } = profesor;
        try {
            const result = await pool.query(
                'UPDATE profesores SET nombre = ?, apellido = ?, fecha_nacimiento = ?, profesion = ?, genero = ?, email = ? WHERE idprofesor = ?',
                [nombre, apellido, fecha_nacimiento, profesion, genero, email, idprofesor]
            );
    
            return result.affectedRows > 0;  // Devuelve true si se actualizó alguna fila
        } catch (error) {
            console.error('Error al actualizar el profesor:', error);
            throw error; // Re-lanza el error
        }
    },

    // Eliminar un profesor
    eliminarProfesor: async (idprofesor) => {
        try {
            const result = await pool.query('DELETE FROM profesores WHERE idprofesor = ?', [idprofesor]);
            return result.affectedRows > 0; // Retorna true si la eliminación fue exitosa
        } catch (error) {
            console.error('Error al eliminar el profesor:', error);
            throw error;
        }
    }
};
