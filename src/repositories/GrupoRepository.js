const pool = require('../config/databaseController'); // Conexión a la base de datos

// Función para obtener todos los grupos
const obtenerTodosLosGrupos = async () => {
    try {
        const result = await pool.query('SELECT * FROM grupos');
        return result;
    } catch (error) {
        console.error('Error al obtener los grupos:', error);
        throw error;
    }
};

// Función para obtener un grupo por ID
const obtenerGrupoPorId = async (idgrupo) => {
    try {
        const result = await pool.query('SELECT * FROM grupos WHERE idgrupo = ?', [idgrupo]);
        return result.length > 0 ? result[0] : null;
    } catch (error) {
        console.error('Error al obtener el grupo por ID:', error);
        throw error;
    }
};

// Función para agregar un grupo
const agregarGrupo = async (grupo) => {
    const { idgrupo, nombregrupo } = grupo;
    try {
        const result = await pool.query('INSERT INTO grupos (idgrupo, nombregrupo) VALUES (?, ?)', [idgrupo, nombregrupo]);
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error al agregar el grupo:', error);
        throw error;
    }
};

// Función para eliminar un grupo
const eliminarGrupo = async (idgrupo) => {
    try {
        const result = await pool.query('DELETE FROM grupos WHERE idgrupo = ?', [idgrupo]);
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error al eliminar el grupo:', error);
        throw error;
    }
};

// Función para asignar un estudiante a un grupo
const asignarGrupo = async (asignacion) => {
    try {
        const result = await pool.query("INSERT INTO grupo_estudiantes SET ?", asignacion);
        console.log('Resultado de la asignación de grupo: ', result);
        return result;  // Devuelve el resultado de la inserción
    } catch (error) {
        console.log('Ocurrió un problema al asignar el grupo:', error);
        throw error;
    }
};

module.exports = {
    obtenerTodosLosGrupos,
    obtenerGrupoPorId,
    agregarGrupo,
    eliminarGrupo,
    asignarGrupo
};
