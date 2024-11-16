// CarrerasRepository.js
const pool = require('../config/databaseController');  // Asegúrate de que la ruta sea correcta

// Obtener todas las carreras
const ObtenerTodasLascarreras = async () => {
    try {
        const result = await pool.query('SELECT * FROM carreras');
        return result;
    } catch (error) {
        console.error('Error al obtener todas las carreras:', error);
        throw error;
    }
};

// Obtener carrera por el ID
const ObtenerCarreraPorId = async (idcarrera) => {
    try {
        const result = await pool.query('SELECT * FROM carreras WHERE idcarrera = ?', [idcarrera]);
        return result[0];  // Devuelve el primer resultado si existe
    } catch (error) {
        console.error('Error al obtener la carrera por ID:', error);
        throw error;
    }
};

// Insertar una carrera (antes era agregarCarreras)
const insertarCarrera = async (carrera) => {
    const { idcarrera, carrera: nombreCarrera } = carrera; // Cambié el nombre del campo carrera
    try {
        const result = await pool.query('INSERT INTO carreras (idcarrera, carrera) VALUES (?, ?)', [idcarrera, nombreCarrera]);
        return result.insertId;  // Devuelve el ID de la carrera insertada
    } catch (error) {
        console.error('Error al insertar la carrera:', error);
        throw error;
    }
};

// Actualizar una carrera
const actualizarCarreras = async (idcarrera, carrera) => {
    try {
        const result = await pool.query('UPDATE carreras SET carrera = ? WHERE idcarrera = ?', [carrera, idcarrera]);
        return result.affectedRows > 0;  // Devuelve true si alguna fila fue actualizada
    } catch (error) {
        console.error('Error al actualizar la carrera:', error);
        throw error;
    }
};

// Eliminar una carrera
const eliminarCarrera = async (idcarrera) => {
    try {
        const result = await pool.query('DELETE FROM carreras WHERE idcarrera = ?', [idcarrera]);
        return result.affectedRows > 0;  // Devuelve true si alguna fila fue eliminada
    } catch (error) {
        console.error('Error al eliminar la carrera:', error);
        throw error;
    }
};

module.exports = { 
    ObtenerTodasLascarreras, 
    ObtenerCarreraPorId, 
    insertarCarrera, 
    actualizarCarreras, 
    eliminarCarrera 
};
