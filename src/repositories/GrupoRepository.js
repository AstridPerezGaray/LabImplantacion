const pool = require('../config/databaseController');

module.exports = {
    // Consulta para obtener todos los grupos, incluyendo nombres de materia y profesor
    obtenerTodosLosGrupos: async () => {
        console.log('Hizo la consulta');
        try {
            const result = await pool.query(`
                SELECT a.idgrupo, a.num_grupo, a.anio, a.ciclo, 
                       b.materia AS materia, c.nombre AS profesor
                FROM grupos a
                JOIN materias b ON a.idmateria = b.idmateria
                JOIN profesores c ON a.idprofesor = c.idprofesor;
              `);
              
            return result;
        } catch (error) {
            console.error('Ocurrio un problema al consultar la lista de grupos: ', error);
            throw error;
        }
    },

    // Insertar grupo
    insertarGrupo: async (nuevogrupo) => {
        try {
            const result = await pool.query('INSERT INTO grupos SET ?', nuevogrupo);
            return result.insertId;
        } catch (error) {
            console.error('Ocurrio un error al insertar el registro ', error);
            throw error;
        }
    },

    // Actualizar grupo
    actualizarGrupo: async (idgrupo, datosModificados) => {
        try {
            const result = await pool.query('UPDATE grupos SET ? WHERE idgrupo = ?', [datosModificados, idgrupo]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error al actualizar el registro', error);
            throw error;
        }
    },

    // Obtener grupo por ID
    obtenerGrupoPorid: async (idgrupo) => {
        try {
            const [grupo] = await pool.query('SELECT * FROM grupos WHERE idgrupo = ?', [idgrupo]);
            return grupo;
        } catch (error) {
            console.log('Error para obtener el registro');
            throw error;
        }
    },

    // Eliminar grupo
    eliminarGrupo: async (idgrupo) => {
        try {
            const result = await pool.query('DELETE FROM grupos WHERE idgrupo = ?', [idgrupo]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error al eliminar grupo', error);
            throw error;
        }
    },

    // Verificar si un estudiante ya está asignado a un grupo
    verificarEstudianteEnGrupo: async (idGrupo, idEstudiante) => {
        try {
            console.log(`Verificando asignación: idGrupo = ${idGrupo}, idEstudiante = ${idEstudiante}`);
            const [rows] = await pool.query(`
                SELECT COUNT(*) AS count
                FROM grupo_estudiantes
                WHERE idgrupo = ? AND idestudiante = ?
            `, [idGrupo, idEstudiante]);

            if (rows.length > 0 && rows[0].count > 0) {
                console.log("Estudiante ya asignado.");
                return true;  // El estudiante ya está asignado al grupo
            } else {
                console.log("Estudiante no asignado.");
                return false;  // El estudiante no está asignado al grupo
            }
        } catch (error) {
            console.error("Error al verificar estudiante en el grupo: ", error);
            return false;  // Si ocurre un error, retornamos false para evitar la asignación por seguridad
        }
    },

    // Asignar grupo a un estudiante
    asignarGrupo: async (asignacion) => {
        try {
            const result = await pool.query("INSERT INTO grupo_estudiantes SET ?", asignacion);
            console.log('Se asignó el grupo, resultado: ', result);
            return result;
        } catch (error) {
            console.log('Ocurrió un problema al asignar el grupo', error);
            throw error;
        }
    }
};