const pool = require('../config/databaseController'); // Conexión a la base de datos

// Función para obtener todas las materias
const obtenerTodasLasMaterias = async () => {
    try {
        const result = await pool.query('SELECT * FROM materias');
        return result;
    } catch (error) {
        console.error('Error al obtener las materias:', error);
        throw error;
    }
};

// Función para obtener una materia por ID
const obtenerMateriaPorId = async (idmateria) => {
    try {
        const result = await pool.query('SELECT * FROM materias WHERE idmateria = ?', [idmateria]);
        return result.length > 0 ? result[0] : null;
    } catch (error) {
        console.error('Error al obtener la materia por ID:', error);
        throw error;
    }
};

// Función para agregar una nueva materia
const agregarMateria = async (materia) => {
    const { materia: materiaNombre } = materia;
    try {
        const result = await pool.query('INSERT INTO materias (materia) VALUES (?)', [materiaNombre]);
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error al agregar la materia:', error);
        throw error;
    }
};

// Función para actualizar una materia
const actualizarMateria = async (idmateria, materia) => {
    const { materia: materiaNombre } = materia;
    try {
        const result = await pool.query('UPDATE materias SET materia = ? WHERE idmateria = ?', [materiaNombre, idmateria]);
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error al actualizar la materia:', error);
        throw error;
    }
};

// Función para eliminar una materia
const eliminarMateria = async (idmateria) => {
    try {
        const result = await pool.query('DELETE FROM materias WHERE idmateria = ?', [idmateria]);
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error al eliminar la materia:', error);
        throw error;
    }
};

module.exports = {
    obtenerTodasLasMaterias,
    obtenerMateriaPorId,
    agregarMateria,
    actualizarMateria,
    eliminarMateria
};