const pool = require('../config/databaseController');

module.exports = {

    //Consulta para obtener todos los profesores
    obtenerTodosLosProfesores: async() => {
        try {
            const result = await pool.query ('SELECT * FROM profesores');
            return result;
        } catch (error) {
            console.error('Ocurrio un problema al obtener los estudiantes');
        }
    },

    //Insertar un profesor

    insertarProfesor: async(nuevoProfesor) => {
        try {
            const result = await pool.query ('INSERT INTO profesores SET ?', nuevoProfesor);
            return result.insertId;

        } catch (error) {
            console.error('Ocurrio un error al insertar los datos ',error)
        }
    },
    //Actualizar profesor

    actualizarProfesor: async(idprofesor,datosModificados) =>{ 
        try {
            const result = await pool.query ('UPDATE profesores SET ? WHERE idprofesor = ?',[datosModificados,idprofesor]);
            return result.affectedRows > 0;

        } catch (error) {
            console.error('Ocurrio un problema al actualizar los datos',error)
        }
    },
    // Actualizar un profesor por ID
    obtenerProfesorPorid: async (idprofesor) => {
        try {
            const result = await pool.query ('SELECT * FROM profesores WHERE idprofesor = ?', [idprofesor]);
            if(result.length > 0){
                return result[0];
            }else{
                return null;
            }
        } catch (error) {
            console.error('Error al actualizar el registro');
        }
    },

    // Eliminar un profesor 
    eliminarProfesor: async (idprofesor) => {
        try {
            const result = await pool.query('DELETE FROM profesores WHERE idprofesor = ?', [idprofesor]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error al eliminar el registro', error);
        }
    }
}