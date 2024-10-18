const pool = require('../config/databaseController'); 
 
module.exports = { 
 
    // Consulta para obtener todos los estudiantes 
    obtenerTodosLosEstudiantes: async() => { 
        try { 
            const result = await pool.query('SELECT * FROM estudiantes'); 
            return result; 
        } catch (error) { 
            console.error('Ocurrio un problema al consultar la lista de estudiantes: ', error); 
        } 
    }, 
 
    // Eliminar un estudiante 
    eliminarEstudiante: async(idestudiante) => { 
        try{ 
          const result = await pool.query('DELETE FROM estudiantes WHERE idestudiante = ?', [idestudiante]); 
          return result.affectedRows > 0; 
        }catch(error){ 
          console.error('Erro al eliminar el registro', error); 
        } 
    },

    agregarEstudiante: async (estudiante) => {
        try {
            const result = await pool.query(
                'INSERT INTO estudiantes (nombre, apellido, email, idcarrera, usuario) VALUES (?, ?, ?, ?, ?)',
                [estudiante.nombre, estudiante.apellido, estudiante.email, estudiante.idcarrera, estudiante.usuario]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error al agregar el estudiante:', error);
            throw error;
        }
    },    

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
    
} 