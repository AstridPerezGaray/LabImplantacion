const pool = require('../config/databaseController');

module.exports = {
// Consulta para obtener todos las carreras
obtenerTodasLasCarreras: async() => {
  console.log('Hizo la consulta');
    try {
        const result = await pool.query('SELECT * FROM carreras');
        return result;
    } catch (error) {
        console.error('Ocurrio un problema al consultar la lista de carreras: ', error);
    }
},
           

 // Insertar carrera
 insertarCarrera: async (nuevaCarrera) => {
  try {
      const result = await pool.query('INSERT INTO carreras SET ?', nuevaCarrera);
      return result.affectedRows > 0; // Verifica si se insertó correctamente
  } catch (error) {
      console.error('Ocurrió un problema al insertar carrera ', error);
      return false; // Devuelve false en caso de error
  }
},

 // Actualiar carrera
 actualizarCarrera: async(idcarrera, datosModificados) => {
  try{
    const result = await pool.query('UPDATE carreras SET ? WHERE idcarrera = ?', [datosModificados,idcarrera]);
    return result.affectedRows > 0;
  }catch(error){
    console.error('Error al actualizar el registro', error);
  }
},



 // Obtener carrera por ID
 obtenerCarreraPorid: async (idcarrera) =>{
  try {
      const[carrera] = await pool.query('SELECT * FROM carreras  WHERE idcarrera = ?',[idcarrera]);
      return carrera;
  } catch (error) {
     console.log('Error para obtener el registro');
  }
 },

// Eliminar carrera
eliminarCarrera: async(idcarrera) => {
    try{
      const result = await pool.query('DELETE FROM carreras WHERE idcarrera = ?', [idcarrera]);
      return result.affectedRows > 0;
    }catch(error){
      console.error('Erro al eliminar carrera', error);
    }
  }

}